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

// Change password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Get user with password field
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Check if user has password (not Google login)
    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Tài khoản Google không thể đổi mật khẩu" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

router.get("/", verifyToken, isAdmin, getUsers);

export default router;
