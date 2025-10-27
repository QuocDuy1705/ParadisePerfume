import axios from "axios";
import crypto from "crypto";
import querystring from "querystring";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

// Helper function to sort object keys for VNPay
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

// Helper function to get client IP
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded
    ? forwarded.split(",")[0]
    : req.connection.remoteAddress || req.socket.remoteAddress;

  // Clean up IPv6 localhost
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    return "127.0.0.1";
  }

  // Remove IPv6 prefix if present
  return ip.replace("::ffff:", "");
}

// ==================== VNPay Payment ====================

export const createVNPayUrl = async (req, res) => {
  try {
    const { shippingAddress, note, shippingFee, items, totalPrice } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Validate totalPrice
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Tổng tiền không hợp lệ" });
    }

    const total = Math.round(totalPrice);

    const orderId = `VNP${req.user.id}${Date.now()}`;

    // VNPay config
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;

    if (!tmnCode || !secretKey || tmnCode === "YOUR_TMN_CODE") {
      console.error("⚠️  VNPay credentials not configured!");
      return res.status(500).json({
        message: "VNPay chưa được cấu hình. Vui lòng liên hệ admin.",
        note: "Bạn cần đăng ký tài khoản tại https://sandbox.vnpayment.vn/",
      });
    }

    const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl = `${process.env.SERVER_URL}/api/payment/vnpay-return`;

    const date = new Date();
    const createDate =
      date.getFullYear() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: "vn",
      vnp_CurrCode: "VND",
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: Math.round(total * 100), // Ensure integer
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: getClientIp(req),
      vnp_CreateDate: createDate,
    };

    console.log("VNPay request params:", {
      orderId,
      amount: total,
      amountInVND: Math.round(total * 100),
      ipAddr: getClientIp(req),
      returnUrl,
    });

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const payUrl =
      vnpUrl + "?" + querystring.stringify(vnp_Params, { encode: false });

    // Save pending order - use items from request
    const tempOrder = new Order({
      userId: req.user.id,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price || 0,
      })),
      totalPrice: total,
      shippingFee: shippingFee || 30000,
      shippingAddress,
      note,
      paymentMethod: "vnpay",
      paymentStatus: "pending",
      status: "pending",
      transactionId: orderId,
    });

    await tempOrder.save();

    res.json({ payUrl, orderId });
  } catch (error) {
    console.error("VNPay error:", error);
    res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán VNPay", error: error.message });
  }
};

export const vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNPAY_HASH_SECRET || "YOUR_HASH_SECRET";
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const { vnp_ResponseCode, vnp_TxnRef, vnp_TransactionNo } = vnp_Params;

    if (secureHash === signed) {
      if (vnp_ResponseCode === "00") {
        const order = await Order.findOne({ transactionId: vnp_TxnRef });

        if (order) {
          order.paymentStatus = "paid";
          order.status = "confirmed";
          order.transactionId = vnp_TransactionNo;
          await order.save();

          await Cart.findOneAndDelete({ userId: order.userId });

          return res.redirect(
            `${process.env.FRONTEND_URL}/vnpay-return?orderId=${order._id}&vnp_ResponseCode=00`
          );
        }
      } else {
        const order = await Order.findOne({ transactionId: vnp_TxnRef });
        if (order) {
          order.paymentStatus = "failed";
          order.status = "cancelled";
          await order.save();
        }
        return res.redirect(
          `${process.env.FRONTEND_URL}/vnpay-return?vnp_ResponseCode=${vnp_ResponseCode}`
        );
      }
    } else {
      return res.redirect(
        `${process.env.FRONTEND_URL}/checkout?payment=invalid`
      );
    }
  } catch (error) {
    console.error("VNPay return error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/checkout?payment=error`);
  }
};

// ==================== MoMo Payment ====================

export const createMoMoPayment = async (req, res) => {
  try {
    const { shippingAddress, note, shippingFee, items, totalPrice } = req.body;

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const total = totalPrice || 0;

    const orderId = `MOMO${req.user.id}${Date.now()}`;
    const requestId = orderId;

    const orderInfo = `Thanh toan don hang ${orderId}`;
    const returnUrl = `${process.env.SERVER_URL}/api/payment/momo-return`;
    const notifyUrl = `${process.env.SERVER_URL}/api/payment/momo-notify`;
    const partnerCode = process.env.MOMO_PARTNER_CODE || "MOMO";
    const accessKey = process.env.MOMO_ACCESS_KEY || "YOUR_ACCESS_KEY";
    const secretKey = process.env.MOMO_SECRET_KEY || "YOUR_SECRET_KEY";
    const requestType = "captureWallet";
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${total}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount: total,
      orderId,
      orderInfo,
      redirectUrl: returnUrl,
      ipnUrl: notifyUrl,
      requestType,
      extraData,
      lang: "vi",
      signature,
    };

    const tempOrder = new Order({
      userId: req.user.id,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price || 0,
      })),
      totalPrice: total,
      shippingFee: shippingFee || 30000,
      shippingAddress,
      note,
      paymentMethod: "momo",
      paymentStatus: "pending",
      status: "pending",
      transactionId: orderId,
    });

    await tempOrder.save();

    const momoEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    const response = await axios.post(momoEndpoint, requestBody, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.data && response.data.payUrl) {
      res.json({
        payUrl: response.data.payUrl,
        orderId,
        message: "Tạo thanh toán MoMo thành công",
      });
    } else {
      res.status(400).json({
        message: "Lỗi tạo thanh toán MoMo",
        error: response.data,
      });
    }
  } catch (error) {
    console.error("MoMo payment error:", error);
    res.status(500).json({
      message: "Lỗi tạo thanh toán MoMo",
      error: error.message,
    });
  }
};

export const momoNotify = async (req, res) => {
  try {
    const {
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature,
    } = req.body;

    console.log("MoMo IPN received:", req.body);

    const secretKey = process.env.MOMO_SECRET_KEY || "YOUR_SECRET_KEY";
    const accessKey = process.env.MOMO_ACCESS_KEY || "YOUR_ACCESS_KEY";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${process.env.MOMO_PARTNER_CODE}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    if (signature === expectedSignature) {
      const order = await Order.findOne({ transactionId: orderId });

      if (order) {
        if (resultCode === 0) {
          order.paymentStatus = "paid";
          order.status = "confirmed";
          order.transactionId = transId;
          await order.save();

          await Cart.findOneAndDelete({ userId: order.userId });
        } else {
          order.paymentStatus = "failed";
          order.status = "cancelled";
          await order.save();
        }
      }

      return res.status(200).json({ resultCode: 0, message: "Success" });
    } else {
      return res
        .status(400)
        .json({ resultCode: 97, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("MoMo IPN error:", error);
    return res.status(500).json({ resultCode: 99, message: "System error" });
  }
};

export const momoReturn = async (req, res) => {
  try {
    const { orderId, resultCode, message } = req.query;

    console.log("MoMo return:", req.query);

    if (resultCode === "0") {
      const order = await Order.findOne({ transactionId: orderId });

      if (order) {
        return res.redirect(
          `${process.env.FRONTEND_URL}/momo-return?orderId=${order._id}&resultCode=0`
        );
      }
      return res.redirect(
        `${process.env.FRONTEND_URL}/momo-return?resultCode=0`
      );
    } else {
      return res.redirect(
        `${
          process.env.FRONTEND_URL
        }/momo-return?resultCode=${resultCode}&message=${encodeURIComponent(
          message || ""
        )}`
      );
    }
  } catch (error) {
    console.error("MoMo return error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/checkout?payment=error`);
  }
};
