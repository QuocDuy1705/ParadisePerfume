import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext"; // dùng lại hook
import "../assets/styles/productDetails.css";

const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const { fetchCart, setIsCartOpen } = useCart(); // hook giỏ hàng

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Lỗi fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // Thêm giỏ hàng
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // cập nhật giỏ hàng
      await fetchCart();

      // mở giỏ hàng sidebar
      setIsCartOpen(true);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      {/* Ảnh sản phẩm */}
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="type">{product.type}</p>
        <p className="ref">Ref: {product._id.slice(-6)}</p>

        <p className="price">${product.price}</p>

        <div className="sizes">
          <label>Choose size: </label>
          <select>
            <option>3.4 FL. OZ.</option>
            <option>5 FL. OZ.</option>
          </select>
        </div>

        {/* nút Add to Bag hoạt động */}
        <button className="add-to-bag-btn" onClick={handleAddToCart}>
          Add to Bag
        </button>

        <div className="extra-links">
          <a href="#">Questions & Answers</a>
          <a href="#">Product Reviews</a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
