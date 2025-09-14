import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng theo user
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart) {
      return res.json({ cart: { user: req.user.id, items: [] } });
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm hoặc cập nhật sản phẩm trong giỏ
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // cập nhật số lượng
      cart.items[itemIndex].quantity = quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Cart updated successfully", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity must be >= 0" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      if (quantity === 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Cart updated successfully", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xoá sản phẩm khỏi giỏ
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    cart = await cart.populate("items.product");

    res.json({ message: "Removed item from cart successfully", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
