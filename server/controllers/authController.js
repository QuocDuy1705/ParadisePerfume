import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../utils/sendMail.js";

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

// @desc   Forgot Password - Send reset link
// @route  POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Check if user logged in with Google
    if (user.authProvider === "google") {
      return res.status(400).json({
        message:
          "Tài khoản này đăng nhập bằng Google. Vui lòng sử dụng Google để đăng nhập.",
      });
    }

    // Tạo reset token (6 chữ số)
    const resetToken = crypto.randomInt(100000, 999999).toString();

    // Hash token trước khi lưu vào DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Lưu token và thời gian hết hạn (15 phút)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Gửi email
    console.log("🔔 Sending password reset email to:", email);
    await sendPasswordResetEmail(email, {
      firstName: user.firstName,
      lastName: user.lastName,
      resetToken: resetToken, // Send unhashed token to user
      resetUrl: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/reset-password?token=${resetToken}&email=${email}`,
    });

    res.json({
      message:
        "Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư.",
      email: email,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Lỗi khi gửi email khôi phục mật khẩu" });
  }
};

// @desc   Reset Password with token
// @route  POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Validate input
    if (!email || !token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    // Hash token để so sánh
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Mã xác thực không hợp lệ hoặc đã hết hạn",
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật password và xóa reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Lỗi khi đặt lại mật khẩu" });
  }
};

// @desc   Google OAuth Login
// @route  POST /api/auth/google
export const googleLogin = async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, profilePicture } = req.body;

    // Validate input
    if (!googleId || !email) {
      return res.status(400).json({ message: "Google authentication failed" });
    }

    // Tìm user theo googleId hoặc email
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // User đã tồn tại
      // Nếu đã có email nhưng chưa liên kết Google, cập nhật googleId
      if (!user.googleId && user.email === email) {
        user.googleId = googleId;
        user.authProvider = "google";
        if (profilePicture) user.profilePicture = profilePicture;
        await user.save();
      }
    } else {
      // Tạo user mới từ Google
      user = await User.create({
        googleId,
        email,
        firstName: firstName || "User",
        lastName: lastName || "",
        profilePicture,
        authProvider: "google",
        password: crypto.randomBytes(32).toString("hex"), // Random password
      });

      // Send welcome email
      console.log("🔔 Sending welcome email to Google user:", user.email);
      sendWelcomeEmail(user.email, {
        firstName: user.firstName,
        lastName: user.lastName,
      }).catch((err) => console.error("❌ Failed to send welcome email:", err));
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
        profilePicture: user.profilePicture,
        country: user.country,
        isAdmin: user.isAdmin,
        authProvider: user.authProvider,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Lỗi khi đăng nhập bằng Google" });
  }
};
