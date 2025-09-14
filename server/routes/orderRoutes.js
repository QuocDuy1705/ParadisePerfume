import express from "express";
import Order from "../models/Order.js";
import { getRevenue } from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";
import {
  getAllOrders,
  updateOrderStatus, // import từ controller
} from "../controllers/orderController.js";

const router = express.Router();

// Admin - lấy tất cả orders
router.get("/", verifyToken, isAdmin, getAllOrders);

// Admin - update trạng thái order
// @route   PUT /api/orders/:id
// @access  Private/Admin
router.put("/:id", verifyToken, isAdmin, updateOrderStatus);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get("/myorders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "name price"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Doanh thu theo tháng
router.get("/revenue", verifyToken, isAdmin, getRevenue);

export default router;
