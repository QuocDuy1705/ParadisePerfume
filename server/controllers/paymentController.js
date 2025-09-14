import { VNPay } from "vnpay";
import axios from "axios";
import crypto from "crypto";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

const vnpay = new VNPay({
  tmnCode: process.env.VNPAY_TMN_CODE,
  secureSecret: process.env.VNPAY_HASH_SECRET,
  vnpayHost: process.env.VNPAY_HOST,
  testMode: true,
});

export const createVNPayUrl = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId"
  );
  if (!cart?.items?.length)
    return res.status(400).json({ message: "Giỏ hàng trống" });
  const total = cart.items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  const payUrl = vnpay.genPayUrl({
    transactionRef: `ORDER_${req.user.id}_${Date.now()}`,
    orderInfo: `Thanh toan don hoa`,
    amount: total * 100, // VNPay yêu cầu nhân 100
    ipAddr: req.ip,
    returnUrl: `${process.env.FRONTEND_URL}/vnpay_return`,
  });

  res.json({ payUrl });
};

export const vnpayReturn = async (req, res) => {
  const { vnp_ResponseCode, vnp_TxnRef } = req.query;
  if (vnp_ResponseCode === "00") {
    // Thành công
    // Tạo đơn hàng, xóa cart như trong checkout trước
    // ...
    res.redirect(`${process.env.FRONTEND_URL}/thankyou`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/checkout?status=failed`);
  }
};

export const createMoMoPayment = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    "items.productId"
  );
  const total = cart.items.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );

  const requestId = `order_${req.user.id}_${Date.now()}`;
  const orderId = requestId;

  const rawSignature =
    `partnerCode=${process.env.MOMO_PARTNER_CODE}` +
    `&accessKey=${process.env.MOMO_ACCESS_KEY}` +
    `&requestId=${requestId}` +
    `&amount=${total}` +
    `&orderId=${orderId}` +
    `&orderInfo=Thanh%20toan%20don` +
    `&returnUrl=${process.env.FRONTEND_URL}/momo_return` +
    `&notifyUrl=${process.env.SERVER_URL}/api/payment/momo_notify`;

  const signature = crypto
    .createHmac("SHA256", process.env.MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest("hex");

  const body = {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    requestId,
    amount: total.toString(),
    orderId,
    orderInfo: "Thanh toan don",
    returnUrl: `${process.env.FRONTEND_URL}/momo_return`,
    notifyUrl: `${process.env.SERVER_URL}/api/payment/momo_notify`,
    requestType: "captureMoMoWallet",
    signature,
  };

  const response = await axios.post(process.env.MOMO_API, body);
  res.json({ payUrl: response.data.payUrl });
};

export const momoNotify = async (req, res) => {
  // xử lý notify MoMo gửi POST
  const { resultCode, orderId } = req.body;
  if (resultCode === 0) {
    // xác nhận thành công → tạo order
  }
  res.json({ resultCode: 0, message: "Confirm received" });
};

export const momoReturn = (req, res) => {
  const { resultCode } = req.query;
  const redirect = resultCode === "0" ? "/thankyou" : "/checkout?status=failed";
  res.redirect(`${process.env.FRONTEND_URL}${redirect}`);
};
