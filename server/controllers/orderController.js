import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import {
  sendOrderConfirmation,
  sendOrderStatusEmail,
} from "../utils/sendMail.js";

// Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate(
      "userId",
      "firstName lastName email"
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách đơn hàng" });
  }
};

// Checkout từ giỏ hàng
export const checkout = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user.id,
      items: cart.items.map((i) => ({
        productId: i.productId._id,
        quantity: i.quantity,
      })),
      total,
      status: "paid", // giả lập thanh toán thành công
    });

    await Cart.deleteOne({ userId: req.user.id });

    res.json({ message: "Thanh toán thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi checkout" });
  }
};

// Tạo đơn hàng (nếu muốn API riêng thay vì checkout)
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentMethod } = req.body;
    const order = new Order({ userId, items, totalAmount, paymentMethod });
    await order.save();

    // Populate product details for email
    await order.populate("items.productId");

    const user = await User.findById(userId);
    if (user) {
      console.log("🔔 Attempting to send order confirmation to:", user.email);
      try {
        await sendOrderConfirmation(user.email, order, {
          firstName: user.firstName,
          lastName: user.lastName,
        });
        console.log("✅ Order confirmation email sent successfully");
      } catch (emailError) {
        console.error(
          "❌ Failed to send order confirmation email:",
          emailError
        );
        console.error("Error details:", {
          message: emailError.message,
          code: emailError.code,
        });
        // Don't fail order creation if email fails
      }
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" });
  }
};

// Lấy danh sách đơn hàng của 1 user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("items.productId");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy đơn hàng user" });
  }
};

// Cập nhật đơn hàng (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    const oldStatus = order.status;
    order.status = status || order.status;
    await order.save();

    // Send status update email if status changed
    if (oldStatus !== status) {
      const user = await User.findById(order.userId);
      if (user) {
        console.log(
          "🔔 Attempting to send status update email to:",
          user.email
        );
        try {
          await sendOrderStatusEmail(user.email, order, {
            firstName: user.firstName,
            lastName: user.lastName,
          });
          console.log("✅ Status update email sent successfully");
        } catch (emailError) {
          console.error("❌ Failed to send status update email:", emailError);
          console.error("Error details:", {
            message: emailError.message,
            code: emailError.code,
          });
        }
      }
    }

    res.json({ message: "Cập nhật đơn hàng thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi cập nhật đơn hàng" });
  }
};

// Doanh thu theo tháng (group by month)
export const getRevenue = async (req, res) => {
  try {
    const revenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi tính doanh thu" });
  }
};
