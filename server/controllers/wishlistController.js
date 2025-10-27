import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate(
      "products"
    );

    if (!wishlist) {
      // Tạo wishlist mới nếu chưa có
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [],
      });
    }

    res.json(wishlist);
  } catch (error) {
    console.error("Error getting wishlist:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách yêu thích" });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Kiểm tra product tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      // Tạo wishlist mới
      wishlist = await Wishlist.create({
        user: req.user.id,
        products: [productId],
      });
    } else {
      // Kiểm tra sản phẩm đã có trong wishlist chưa
      if (wishlist.products.includes(productId)) {
        return res
          .status(400)
          .json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
      }

      wishlist.products.push(productId);
      await wishlist.save();
    }

    // Populate để trả về data đầy đủ
    await wishlist.populate("products");

    res.json({
      message: "Đã thêm vào danh sách yêu thích",
      wishlist,
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ message: "Lỗi khi thêm vào danh sách yêu thích" });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist không tồn tại" });
    }

    // Remove product từ array
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();
    await wishlist.populate("products");

    res.json({
      message: "Đã xóa khỏi danh sách yêu thích",
      wishlist,
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ message: "Lỗi khi xóa khỏi danh sách yêu thích" });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist không tồn tại" });
    }

    wishlist.products = [];
    await wishlist.save();

    res.json({
      message: "Đã xóa tất cả sản phẩm khỏi danh sách yêu thích",
      wishlist,
    });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ message: "Lỗi khi xóa danh sách yêu thích" });
  }
};
