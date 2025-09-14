// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // để lấy id từ URL
import axios from "axios";
import "../assets/styles/product-page.css";

export default function ProductPage() {
  const { id } = useParams(); // ví dụ /products/123
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setPerfume(res.data);
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [API_URL, id]);

  if (loading) return <p>Đang tải...</p>;
  if (!perfume) return <p>Không tìm thấy sản phẩm</p>;

  return (
    <div className="product-container">
      <img className="product-img" src={perfume.image} alt={perfume.name} />

      <div className="product-info">
        <h2>{perfume.name}</h2>
        <p className="product-price">{perfume.price.toLocaleString()}₫</p>

        <button className="product-btn">Thêm vào giỏ hàng</button>

        {perfume.notes && (
          <div className="product-notes">
            {perfume.notes.top && (
              <div>
                <strong>Top Notes:</strong> {perfume.notes.top}
              </div>
            )}
            {perfume.notes.middle && (
              <div>
                <strong>Middle Notes:</strong> {perfume.notes.middle}
              </div>
            )}
            {perfume.notes.base && (
              <div>
                <strong>Base Notes:</strong> {perfume.notes.base}
              </div>
            )}
          </div>
        )}

        {perfume.description && (
          <p className="product-description">{perfume.description}</p>
        )}
      </div>
    </div>
  );
}
