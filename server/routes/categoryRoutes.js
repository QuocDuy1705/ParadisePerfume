// routes/categoryRoutes.js
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Lấy tất cả category
router.get("/", async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// Lấy category theo tên
router.get("/:name", async (req, res) => {
  const category = await Category.findOne({ name: req.params.name });
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json(category);
});

// Thêm category mới (dùng Postman)
router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  await newCat.save();
  res.status(201).json(newCat);
});

// Update category theo id
router.put("/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
