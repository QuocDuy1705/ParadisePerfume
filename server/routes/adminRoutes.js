import express from "express";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// ===== PRODUCT CRUD =====

// Create product
router.post("/products", verifyToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all products
router.get("/products", verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update product
router.put("/products/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete product
router.delete("/products/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ===== ORDER MANAGEMENT =====

// Get all orders with user + product info
router.get("/orders", verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "firstName lastName email")
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update order status
router.put("/orders/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update fields
    if (req.body.status) order.status = req.body.status; // pending/shipped/delivered/cancelled
    if (typeof req.body.isDelivered !== "undefined") {
      order.isDelivered = req.body.isDelivered;
      if (req.body.isDelivered) order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    await updatedOrder.populate("userId", "firstName lastName email");
    await updatedOrder.populate("items.productId", "name price image");

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // ẩn password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Cập nhật quyền admin cho user
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = isAdmin;
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📌 Xóa user
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const usersCount = await User.countDocuments();

    res.json({
      products: productsCount,
      orders: ordersCount,
      users: usersCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 📊 Thống kê chi tiết với hỗ trợ bộ lọc thời gian
router.get("/analytics", verifyToken, isAdmin, async (req, res) => {
  try {
    const now = new Date();
    const { timeRange, startDate, endDate } = req.query;

    // Xác định khoảng thời gian
    let currentPeriodStart,
      currentPeriodEnd,
      previousPeriodStart,
      previousPeriodEnd;

    if (startDate && endDate) {
      // Custom range
      currentPeriodStart = new Date(startDate);
      currentPeriodEnd = new Date(endDate);
      const diff = currentPeriodEnd - currentPeriodStart;
      previousPeriodEnd = new Date(currentPeriodStart);
      previousPeriodStart = new Date(currentPeriodStart.getTime() - diff);
    } else {
      switch (timeRange) {
        case "week":
          currentPeriodEnd = new Date(now);
          currentPeriodStart = new Date(
            now.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          previousPeriodEnd = new Date(currentPeriodStart);
          previousPeriodStart = new Date(
            currentPeriodStart.getTime() - 7 * 24 * 60 * 60 * 1000
          );
          break;
        case "month":
          currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          currentPeriodEnd = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59
          );
          previousPeriodStart = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
          );
          previousPeriodEnd = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59
          );
          break;
        case "quarter":
          const currentQuarter = Math.floor(now.getMonth() / 3);
          currentPeriodStart = new Date(
            now.getFullYear(),
            currentQuarter * 3,
            1
          );
          currentPeriodEnd = new Date(
            now.getFullYear(),
            (currentQuarter + 1) * 3,
            0,
            23,
            59,
            59
          );
          previousPeriodStart = new Date(
            now.getFullYear(),
            (currentQuarter - 1) * 3,
            1
          );
          previousPeriodEnd = new Date(
            now.getFullYear(),
            currentQuarter * 3,
            0,
            23,
            59,
            59
          );
          break;
        case "year":
        default:
          currentPeriodStart = new Date(now.getFullYear(), 0, 1);
          currentPeriodEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
          previousPeriodStart = new Date(now.getFullYear() - 1, 0, 1);
          previousPeriodEnd = new Date(
            now.getFullYear() - 1,
            11,
            31,
            23,
            59,
            59
          );
      }
    }

    // 1. Thống kê doanh thu theo tháng (kỳ hiện tại)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentPeriodStart,
            $lte: currentPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Thống kê kỳ trước
    const previousMonthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousPeriodStart,
            $lte: previousPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    // 2. Thống kê khách hàng đăng ký theo tháng
    const monthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentPeriodStart,
            $lte: currentPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Thống kê kỳ trước
    const previousMonthlyUsers = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: previousPeriodStart,
            $lte: previousPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          users: { $sum: 1 },
        },
      },
    ]);

    // 3. Top sản phẩm bán chạy nhất (trong kỳ hiện tại)
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentPeriodStart,
            $lte: currentPeriodEnd,
          },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    // Populate thông tin sản phẩm
    const topProductsWithDetails = await Product.populate(topProducts, {
      path: "_id",
      select: "name image price",
    });

    // 4. Sản phẩm ít bán nhất (trong kỳ hiện tại)
    const worstProducts = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentPeriodStart,
            $lte: currentPeriodEnd,
          },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: 1 } },
      { $limit: 10 },
    ]);

    const worstProductsWithDetails = await Product.populate(worstProducts, {
      path: "_id",
      select: "name image price",
    });

    // 5. Tìm sản phẩm chưa bán được
    const soldProductIds = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.productId" } },
    ]);

    const soldIds = soldProductIds.map((p) => p._id);
    const unsoldProducts = await Product.find({
      _id: { $nin: soldIds },
    })
      .select("name image price stock")
      .limit(10);

    // 6. Tổng hợp thống kê kỳ hiện tại
    const currentPeriodStats = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: currentPeriodStart,
            $lte: currentPeriodEnd,
          },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
    ]);

    const currentPeriodUsersCount = await User.countDocuments({
      createdAt: {
        $gte: currentPeriodStart,
        $lte: currentPeriodEnd,
      },
    });

    // 7. Tính toán % thay đổi so với kỳ trước
    const currentRevenue = currentPeriodStats[0]?.revenue || 0;
    const currentOrders = currentPeriodStats[0]?.orders || 0;
    const currentUsers = currentPeriodUsersCount;

    const previousRevenue = previousMonthlyRevenue[0]?.revenue || 0;
    const previousOrders = previousMonthlyRevenue[0]?.orders || 0;
    const previousUsers = previousMonthlyUsers[0]?.users || 0;

    const revenueChange =
      previousRevenue > 0
        ? (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(1)
        : 0;
    const ordersChange =
      previousOrders > 0
        ? (((currentOrders - previousOrders) / previousOrders) * 100).toFixed(1)
        : 0;
    const usersChange =
      previousUsers > 0
        ? (((currentUsers - previousUsers) / previousUsers) * 100).toFixed(1)
        : 0;

    res.json({
      monthlyRevenue,
      monthlyUsers,
      topProducts: topProductsWithDetails,
      worstProducts: worstProductsWithDetails,
      unsoldProducts,
      currentPeriod: {
        revenue: currentRevenue,
        orders: currentOrders,
        newUsers: currentUsers,
        revenueChange: parseFloat(revenueChange),
        ordersChange: parseFloat(ordersChange),
        usersChange: parseFloat(usersChange),
      },
      previousPeriod: {
        revenue: previousRevenue,
        orders: previousOrders,
        users: previousUsers,
      },
      timeRange: {
        current: {
          start: currentPeriodStart,
          end: currentPeriodEnd,
        },
        previous: {
          start: previousPeriodStart,
          end: previousPeriodEnd,
        },
      },
    });
  } catch (err) {
    console.error("Error in /analytics:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
