import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // khởi tạo cart rỗng dạng object có items
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lấy giỏ hàng từ server
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCart({ items: [] }); // chưa login thì giỏ rỗng
        return;
      }

      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      const res = await axios.post(
        `${API_URL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
    }
  };

  // Cập nhật số lượng
  const updateCartItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_URL}/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi update giỏ hàng:", err);
    }
  };

  // Xoá sản phẩm
  const removeFromCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/cart/remove`, {
        data: { productId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cart || { items: [] });
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
    }
  };

  // Xóa giỏ hàng sau khi checkout
  const clearCart = () => {
    setCart({ items: [] });
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
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
