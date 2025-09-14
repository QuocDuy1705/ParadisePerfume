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

export default router;
