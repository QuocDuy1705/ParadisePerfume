import React, { createContext, useContext, useState, useEffect } from "react";
import { showSuccess, showError } from "../utils/toast";
import api from "../utils/api";

const CartContext = createContext();

// Helper functions cho localStorage
const getLocalCart = () => {
  try {
    const localCart = localStorage.getItem("guestCart");
    return localCart ? JSON.parse(localCart) : { items: [] };
  } catch (error) {
    return { items: [] };
  }
};

const saveLocalCart = (cart) => {
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lấy giỏ hàng (từ server nếu đã login, localStorage nếu guest)
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        // Guest: lấy từ localStorage
        const localCart = getLocalCart();
        setCart(localCart);
        return;
      }

      // User đã login: lấy từ server
      const res = await api.get("/cart");
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi fetch giỏ hàng:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // Thêm sản phẩm vào giỏ
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Guest: thêm vào localStorage
        const localCart = getLocalCart();

        // Kiểm tra sản phẩm đã có chưa
        const existingItemIndex = localCart.items.findIndex(
          (item) => item.product._id === productId
        );

        if (existingItemIndex > -1) {
          // Tăng số lượng
          localCart.items[existingItemIndex].quantity += quantity;
        } else {
          // Fetch thông tin sản phẩm
          const productRes = await api.get(`/products/${productId}`);
          const product = productRes.data;

          // Thêm mới
          localCart.items.push({
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              slug: product.slug,
            },
            quantity: quantity,
          });
        }

        saveLocalCart(localCart);
        setCart(localCart);
        setIsCartOpen(true);
        showSuccess("Đã thêm vào giỏ hàng");
        return true;
      }

      // User đã login: thêm vào server
      const res = await api.post("/cart/add", { productId, quantity });
      setCart(res.data.cart || { items: [] });
      setIsCartOpen(true);
      showSuccess("Đã thêm vào giỏ hàng");
      return true;
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      showError("Không thể thêm vào giỏ hàng");
      return false;
    }
  };

  // Cập nhật số lượng
  const updateCartItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Guest: cập nhật localStorage
        const localCart = getLocalCart();
        const itemIndex = localCart.items.findIndex(
          (item) => item.product._id === productId
        );

        if (itemIndex > -1) {
          if (quantity <= 0) {
            localCart.items.splice(itemIndex, 1);
          } else {
            localCart.items[itemIndex].quantity = quantity;
          }
          saveLocalCart(localCart);
          setCart(localCart);
        }
        return;
      }

      // User đã login
      const res = await api.put("/cart/update", { productId, quantity });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi update giỏ hàng:", err);
    }
  };

  // Xoá sản phẩm
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        // Guest: xóa từ localStorage
        const localCart = getLocalCart();
        localCart.items = localCart.items.filter(
          (item) => item.product._id !== productId
        );
        saveLocalCart(localCart);
        setCart(localCart);
        return;
      }

      // User đã login
      const res = await api.delete("/cart/remove", {
        data: { productId },
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  // Xóa giỏ hàng sau khi checkout
  const clearCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("guestCart");
    }
    setCart({ items: [] });
  };

  // Sync guest cart to server khi user login
  const syncGuestCartToServer = async () => {
    try {
      const localCart = getLocalCart();
      if (localCart.items.length > 0) {
        // Thêm từng item vào server
        for (const item of localCart.items) {
          await api.post("/cart/add", {
            productId: item.product._id,
            quantity: item.quantity,
          });
        }

        // Xóa guest cart
        localStorage.removeItem("guestCart");

        // Fetch cart mới từ server
        await fetchCart();
      }
    } catch (err) {
      console.error("Lỗi khi sync cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        syncGuestCartToServer,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
