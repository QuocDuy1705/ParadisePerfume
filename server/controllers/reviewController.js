import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = "newest" } = req.query;

    console.log("📖 Fetching reviews for product:", productId);

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "highest":
        sortOption = { rating: -1 };
        break;
      case "lowest":
        sortOption = { rating: 1 };
        break;
      case "helpful":
        sortOption = { helpful: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ product: productId })
      .populate("user", "firstName lastName")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId });

    console.log(`📊 Found ${reviews.length} reviews out of ${total} total`);

    // Calculate rating statistics
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          fiveStars: {
            $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] },
          },
          fourStars: {
            $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] },
          },
          threeStars: {
            $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] },
          },
          twoStars: {
            $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] },
          },
          oneStar: {
            $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
      stats: stats[0] || {
        averageRating: 0,
        totalReviews: 0,
        fiveStars: 0,
        fourStars: 0,
        threeStars: 0,
        twoStars: 0,
        oneStar: 0,
      },
    });
  } catch (error) {
    console.error("Error getting product reviews:", error);
    res.status(500).json({ message: "Lỗi khi lấy đánh giá sản phẩm" });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Validate input
    if (!productId || !rating || !title || !comment) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Đánh giá phải từ 1 đến 5 sao" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }

    // Check if user has purchased this product (optional)
    const hasPurchased = await Order.findOne({
      user: req.user.id,
      "items.productId": productId,
      status: { $in: ["Delivered", "Completed"] },
    });

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      title,
      comment,
      verified: !!hasPurchased,
    });

    console.log("✅ Review created:", review);

    // Populate user info
    await review.populate("user", "firstName lastName");

    // Update product average rating
    await updateProductRating(productId);

    console.log("✅ Review saved successfully with ID:", review._id);

    res.status(201).json({
      message: "Đánh giá thành công!",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Lỗi khi tạo đánh giá" });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chỉnh sửa đánh giá này" });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();
    await review.populate("user", "firstName lastName");

    // Update product average rating
    await updateProductRating(review.product);

    res.json({
      message: "Cập nhật đánh giá thành công!",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật đánh giá" });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa đánh giá này" });
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product average rating
    await updateProductRating(productId);

    res.json({ message: "Xóa đánh giá thành công!" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Lỗi khi xóa đánh giá" });
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Đánh giá không tồn tại" });
    }

    review.helpful += 1;
    await review.save();

    res.json({
      message: "Cảm ơn phản hồi của bạn!",
      helpful: review.helpful,
    });
  } catch (error) {
    console.error("Error marking helpful:", error);
    res.status(500).json({ message: "Lỗi khi đánh dấu hữu ích" });
  }
};

// Helper function to update product average rating
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const product = await Product.findById(productId);
    if (product) {
      product.rating = stats[0]?.averageRating || 0;
      product.numReviews = stats[0]?.totalReviews || 0;
      await product.save();
    }
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};
