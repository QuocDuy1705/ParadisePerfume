import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    title: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    }, // Optional if Google login
    country: { type: String },

    // Google OAuth
    googleId: { type: String, sparse: true, unique: true },
    profilePicture: { type: String },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },

    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    isAdmin: { type: Boolean, default: false },

    // Saved Coupons (for user to save vouchers)
    savedCoupons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon",
      },
    ],
  },
  { timestamps: true }
);

// Indexes
userSchema.index({ email: 1 }); // Login queries
userSchema.index({ isAdmin: 1 }); // Admin queries
userSchema.index({ createdAt: -1 }); // Recent users

export default mongoose.model("User", userSchema);
