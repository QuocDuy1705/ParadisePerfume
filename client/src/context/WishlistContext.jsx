import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { showSuccess, showError, showWarning } from "../utils/toast";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

const API_URL = "http://localhost:5000/api/wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoading(true);
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      if (error.response?.status !== 401) {
        // Không show error nếu chưa login
        setWishlist({ products: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning("Vui lòng đăng nhập để thêm vào yêu thích");
        return false;
      }

      const response = await axios.post(
        `${API_URL}/add`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlist(response.data.wishlist);
      showSuccess("Đã thêm vào danh sách yêu thích!");
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error.response?.status === 400) {
        showWarning(error.response.data.message);
      } else {
        showError("Không thể thêm vào danh sách yêu thích");
      }
      return false;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await axios.delete(`${API_URL}/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist(response.data.wishlist);
      showSuccess("Đã xóa khỏi danh sách yêu thích");
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      showError("Không thể xóa khỏi danh sách yêu thích");
      return false;
    }
  };

  // Toggle wishlist (add if not in list, remove if already in list)
  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlist.products.some(
      (p) => p._id === productId || p === productId
    );

    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.products.some((p) => (p._id || p) === productId);
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      await axios.delete(`${API_URL}/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWishlist({ products: [] });
      showSuccess("Đã xóa tất cả sản phẩm yêu thích");
      return true;
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      showError("Không thể xóa danh sách yêu thích");
      return false;
    }
  };

  // Fetch wishlist on mount if logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchWishlist();
    }
  }, []);

  const value = {
    wishlist,
    loading,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
