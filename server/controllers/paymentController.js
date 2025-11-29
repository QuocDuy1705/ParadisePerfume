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
        price: item.price,
        name: item.name,
        image: item.image,
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
        price: item.price,
        name: item.name,
        image: item.image,
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

// ==================== GUEST CHECKOUT ====================

/**
 * Tạo đơn hàng COD cho khách (không cần đăng nhập)
 * @route POST /api/payment/guest/create-cod-order
 */
export const createGuestCODOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      note,
      shippingFee,
      items,
      totalPrice,
      couponCode,
      discount,
      guestEmail,
    } = req.body;

    console.log("👤 Guest COD Payment request:", {
      guestEmail,
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

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Thông tin giao hàng không đầy đủ",
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không hợp lệ",
      });
    }

    const total = Math.round(totalPrice);
    const orderNumber = `GUEST${Date.now()}`;

    // Create guest COD order (userId = null for guest)
    const newOrder = new Order({
      orderNumber,
      userId: null, // Guest order
      guestEmail: guestEmail || shippingAddress.email,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      totalPrice: total,
      shippingAddress,
      paymentMethod: "cod",
      isPaid: false,
      status: "pending",
      note: note || "",
    });

    await newOrder.save();

    console.log("✅ Guest COD Order created:", orderNumber);

    // Apply coupon if used (optional for guest)
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usedBy.push({
            userId: null, // Guest
            usedAt: new Date(),
            orderAmount: totalPrice,
            discountAmount: discount || 0,
          });
          coupon.usedCount += 1;
          await coupon.save();
          console.log("✅ Coupon applied for guest:", couponCode);
        }
      } catch (couponError) {
        console.error("❌ Error applying coupon:", couponError);
      }
    }

    res.json({
      success: true,
      message: "Đặt hàng thành công",
      data: {
        orderId: newOrder._id,
        orderNumber: newOrder.orderNumber,
      },
    });
  } catch (error) {
    console.error("❌ Create guest COD order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi tạo đơn hàng",
      error: error.message,
    });
  }
};

/**
 * Tạo đơn hàng Bank Transfer cho khách (không cần đăng nhập)
 * @route POST /api/payment/guest/create-bank-order
 */
export const createGuestBankOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      note,
      shippingFee,
      items,
      totalPrice,
      couponCode,
      discount,
      guestEmail,
    } = req.body;

    console.log("👤 Guest Bank Payment request:", {
      guestEmail,
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

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Thông tin giao hàng không đầy đủ",
      });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tổng tiền không hợp lệ",
      });
    }

    const total = Math.round(totalPrice);
    const orderNumber = `GUEST${Date.now()}`;

    // Create guest bank order
    const newOrder = new Order({
      orderNumber,
      userId: null, // Guest order
      guestEmail: guestEmail || shippingAddress.email,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
      })),
      totalPrice: total,
      shippingAddress,
      paymentMethod: "bank_transfer",
      isPaid: false,
      status: "pending",
      note: note || "",
    });

    await newOrder.save();

    console.log("✅ Guest Bank Order created:", orderNumber);

    // Apply coupon if used
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          coupon.usedBy.push({
            userId: null, // Guest
            usedAt: new Date(),
            orderAmount: totalPrice,
            discountAmount: discount || 0,
          });
          coupon.usedCount += 1;
          await coupon.save();
          console.log("✅ Coupon applied for guest:", couponCode);
        }
      } catch (couponError) {
        console.error("❌ Error applying coupon:", couponError);
      }
    }

    // Generate QR Code
    const qrData = {
      accountNo: process.env.BANK_ACCOUNT_NUMBER || "0123456789",
      accountName: process.env.BANK_ACCOUNT_NAME || "PARADISE PERFUME",
      bankBin: process.env.BANK_BIN || "970423",
      amount: total,
      description: orderNumber,
      template: "compact",
    };

    const qrCodeUrl = `https://img.vietqr.io/image/${qrData.bankBin}-${
      qrData.accountNo
    }-${qrData.template}.png?amount=${
      qrData.amount
    }&addInfo=${encodeURIComponent(
      qrData.description
    )}&accountName=${encodeURIComponent(qrData.accountName)}`;

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
    console.error("❌ Create guest bank order error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi tạo đơn hàng",
      error: error.message,
    });
  }
};
