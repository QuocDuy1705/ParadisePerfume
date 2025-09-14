import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getUsers } from "../controllers/authController.js"; //

import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const { title, firstName, lastName, email, password, country, isAdmin } =
      req.body;

    // Check email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      title,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
      isAdmin: isAdmin || false, // mặc định false
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Tạo JWT có cả isAdmin
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin, // trả về FE luôn
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route test bảo vệ (chỉ user login mới vào được)
router.get("/profile", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// Logout (chỉ cần client xoá token, nhưng để đồng bộ ta có thêm endpoint)
router.post("/logout", verifyToken, (req, res) => {
  res.json({ message: "Logout successful. Please clear token on client." });
});

router.get("/", verifyToken, isAdmin, getUsers);

export default router;
