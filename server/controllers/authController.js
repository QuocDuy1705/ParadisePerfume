import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../utils/sendMail.js";

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// Helper để tạo token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// @desc   Register user
// @route  POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    // Kiểm tra email trùng
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
    });

    // Tạo token
    const token = generateToken(user);

    // Send welcome email (async, don't wait)
    console.log("🔔 Attempting to send welcome email to:", user.email);
    sendWelcomeEmail(user.email, {
      firstName: user.firstName,
      lastName: user.lastName,
    })
      .then(() => {
        console.log("✅ Welcome email sent successfully to:", user.email);
      })
      .catch((emailError) => {
        console.error("❌ Failed to send welcome email:", emailError);
        console.error("Error details:", {
          message: emailError.message,
          code: emailError.code,
          command: emailError.command,
        });
        // Email failure should not block registration
      });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    // Handle duplicate email error
    if (err.code === 11000 || err.message.includes("duplicate key")) {
      return res.status(400).json({
        message: "Email đã được đăng ký. Vui lòng sử dụng email khác.",
      });
    }

    res.status(500).json({ message: err.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // So khớp mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Tạo token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        country: user.country,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // bỏ password cho an toàn
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
