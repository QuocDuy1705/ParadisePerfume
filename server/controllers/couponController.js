import Coupon from "../models/Coupon.js";

// Get all coupons (Admin)
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách mã giảm giá" });
  }
};

// Get active coupons (Public - for display)
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findActiveCoupons();

    // Only return public info
    const publicCoupons = coupons.map((coupon) => ({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscountAmount: coupon.maxDiscountAmount,
      endDate: coupon.endDate,
    }));

    res.json(publicCoupons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy mã giảm giá" });
  }
};

// Validate and apply coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount, items } = req.body;
    const userId = req.user.id;

    // Find coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        valid: false,
        message: "Mã giảm giá không tồn tại",
      });
    }

    // Check if coupon is valid
    const validityCheck = coupon.isValid();
    if (!validityCheck.valid) {
      return res.status(400).json(validityCheck);
    }

    // Check if user can use this coupon
    const userCheck = coupon.canUserUse(userId);
    if (!userCheck.valid) {
      return res.status(400).json(userCheck);
    }

    // Calculate discount
    const discountResult = coupon.calculateDiscount(orderAmount, items);

    if (!discountResult.valid) {
      return res.status(400).json(discountResult);
    }

    res.json({
      valid: true,
      message: "Áp dụng mã giảm giá thành công",
      coupon: {
        _id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
      },
      discount: discountResult.discount,
      finalAmount: discountResult.finalAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi kiểm tra mã giảm giá" });
  }
};

// Apply coupon to order (called when order is created)
export const applyCoupon = async (req, res) => {
  try {
    const { couponId, userId, orderAmount, discountAmount } = req.body;

    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    // Add user to usedBy array
    coupon.usedBy.push({
      userId,
      usedAt: new Date(),
      orderAmount,
      discountAmount,
    });

    coupon.usedCount += 1;
    await coupon.save();

    res.json({ message: "Áp dụng mã giảm giá thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi áp dụng mã giảm giá" });
  }
};

// Create coupon (Admin only)
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      startDate,
      endDate,
      usageLimit,
      usagePerUser,
      applicableProducts,
      applicableCategories,
    } = req.body;

    // Check if code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        message: "Ngày kết thúc phải sau ngày bắt đầu",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxDiscountAmount: maxDiscountAmount || null,
      startDate,
      endDate,
      usageLimit: usageLimit || null,
      usagePerUser: usagePerUser || 1,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Tạo mã giảm giá thành công",
      coupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi tạo mã giảm giá" });
  }
};

// Update coupon (Admin only)
export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Don't allow changing code if already used
    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    if (coupon.usedCount > 0 && updateData.code !== coupon.code) {
      return res.status(400).json({
        message: "Không thể thay đổi mã đã được sử dụng",
      });
    }

    // Update coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Cập nhật mã giảm giá thành công",
      coupon: updatedCoupon,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật mã giảm giá" });
  }
};

// Delete/Deactivate coupon (Admin only)
export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    // If used, just deactivate instead of delete
    if (coupon.usedCount > 0) {
      coupon.isActive = false;
      await coupon.save();
      return res.json({
        message: "Đã vô hiệu hóa mã giảm giá (do đã được sử dụng)",
      });
    }

    // Delete if not used
    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Xóa mã giảm giá thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa mã giảm giá" });
  }
};

// Get coupon usage statistics (Admin)
export const getCouponStats = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await Coupon.findById(id).populate(
      "usedBy.userId",
      "firstName lastName email"
    );

    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    // Calculate statistics
    const totalDiscount = coupon.usedBy.reduce(
      (sum, usage) => sum + usage.discountAmount,
      0
    );
    const totalOrders = coupon.usedCount;
    const avgDiscount = totalOrders > 0 ? totalDiscount / totalOrders : 0;

    res.json({
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        usedCount: coupon.usedCount,
        usageLimit: coupon.usageLimit,
        remainingUses: coupon.usageLimit
          ? coupon.usageLimit - coupon.usedCount
          : "Unlimited",
      },
      statistics: {
        totalOrders,
        totalDiscount,
        avgDiscount: Math.round(avgDiscount),
      },
      recentUsage: coupon.usedBy.slice(-10).reverse(), // Last 10 usages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy thống kê mã giảm giá" });
  }
};
