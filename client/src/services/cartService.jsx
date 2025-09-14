import axios from "axios";

const API_URL = "http://localhost:5000/api/cart"; // chỉnh lại theo backend của bạn

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (productId, quantity = 1, token) => {
  try {
    const res = await axios.post(
      `${API_URL}/add`,
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Add to cart error:", err);
    throw err.response?.data || err.message;
  }
};
