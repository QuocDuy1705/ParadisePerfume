import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Coupon from "../models/Coupon.js";

/**
 * Payment Controller - QR Code TP Bank & COD
 * Hệ thống thanh toán: QR Code ngân hàng TP Bank + COD
 */

// ==================== TP Bank QR Code Payment ====================

/**
 * Tạo đơn hàng với phương thức thanh toán QR Bank
 * @route POST /api/payment/create-bank-order
 */
export const createBankOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      note,
      shippingFee,
      items,
      totalPrice,
      couponCode,
      discount,
    } = req.body;

    console.log("🏦 Bank QR Payment request:", {
      userId: req.user.id,
      totalPrice,
      itemsCount: items?.length,
    });

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    // Validate totalPrice
    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không hợp lệ",
      });
    }

    const total = Math.round(totalPrice);

    // Generate unique order ID
    const orderNumber = `ORD${Date.now()}`;

    // Create order with bank_transfer status
    const newOrder = new Order({
      orderNumber,
      userId: req.user.id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: total,
      shippingAddress,
      paymentMethod: "bank_transfer",
      isPaid: false,
      status: "pending",
    });

    await newOrder.save();

    console.log("✅ Order created:", orderNumber);

    // Apply coupon if used
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usedBy.push({
            userId: req.user.id,
            usedAt: new Date(),
            orderAmount: totalPrice,
            discountAmount: discount || 0,
          });
          coupon.usedCount += 1;
          await coupon.save();
          console.log("✅ Coupon applied:", couponCode);
        }
      } catch (couponError) {
        console.error("❌ Error applying coupon:", couponError);
      }
    }

    // Generate QR Code data (VietQR format)
    const qrData = {
      accountNo: process.env.BANK_ACCOUNT_NUMBER || "0123456789",
      accountName: process.env.BANK_ACCOUNT_NAME || "PARADISE PERFUME",
      bankBin: process.env.BANK_BIN || "970423", // TP Bank BIN
      amount: total,
      description: `${orderNumber}`,
      template: "compact", // or "compact2", "qr_only", "print"
    };

    // Generate VietQR URL
    const qrCodeUrl = `https://img.vietqr.io/image/${qrData.bankBin}-${
      qrData.accountNo
    }-${qrData.template}.png?amount=${
      qrData.amount
    }&addInfo=${encodeURIComponent(
      qrData.description
    )}&accountName=${encodeURIComponent(qrData.accountName)}`;

    // Clear cart after order created
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: {
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
        qrCodeUrl,
        bankInfo: {
          bankName: "TP Bank",
          accountNumber: qrData.accountNo,
          accountName: qrData.accountName,
          amount: total,
          content: orderNumber,
        },
      },
    });
  } catch (error) {
    console.error("❌ Create bank order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi tạo đơn hàng",
      error: error.message,
    });
  }
};

/**
 * Xác nhận thanh toán (Admin sẽ check và confirm)
 * @route POST /api/payment/confirm-payment/:orderId
 */
export const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    // Update payment status
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "paid";
    await order.save();

    console.log("✅ Payment confirmed for order:", order.orderNumber);

    res.json({
      success: true,
      message: "Xác nhận thanh toán thành công",
      data: order,
    });
  } catch (error) {
    console.error("❌ Confirm payment error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi xác nhận thanh toán",
      error: error.message,
    });
  }
};

/**
 * Kiểm tra trạng thái thanh toán
 * @route GET /api/payment/check-status/:orderId
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        paymentStatus: order.isPaid ? "paid" : "pending",
        orderStatus: order.status,
        totalAmount: order.totalPrice,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Check payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi kiểm tra trạng thái",
      error: error.message,
    });
  }
};

// ==================== COD Payment ====================

/**
 * Tạo đơn hàng COD
 * @route POST /api/payment/create-cod-order
 */
export const createCODOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      note,
      shippingFee,
      items,
      totalPrice,
      couponCode,
      discount,
    } = req.body;

    console.log("💵 COD Payment request:", {
      userId: req.user.id,
      totalPrice,
      itemsCount: items?.length,
    });

    // Validate
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống",
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không hợp lệ",
      });
    }

    const total = Math.round(totalPrice);
    const orderNumber = `ORD${Date.now()}`;

    // Create COD order
    const newOrder = new Order({
      orderNumber,
      userId: req.user.id,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      totalPrice: total,
      shippingAddress,
      paymentMethod: "cod",
      isPaid: false,
      status: "pending",
    });

    await newOrder.save();

    console.log("✅ COD Order created:", orderNumber);

    // Apply coupon if used
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usedBy.push({
            userId: req.user.id,
            usedAt: new Date(),
            orderAmount: totalPrice,
            discountAmount: discount || 0,
          });
          coupon.usedCount += 1;
          await coupon.save();
          console.log("✅ Coupon applied:", couponCode);
        }
      } catch (couponError) {
        console.error("❌ Error applying coupon:", couponError);
        // Don't fail order if coupon update fails
      }
    }

    // Clear cart
    await Cart.findOneAndDelete({ user: req.user.id });

    res.json({
      success: true,
      message: "Đặt hàng thành công",
      data: {
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
      },
    });
  } catch (error) {
    console.error("❌ Create COD order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi tạo đơn hàng COD",
      error: error.message,
    });
  }
};
