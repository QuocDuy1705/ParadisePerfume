import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "../assets/styles/productDetails.css";

const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("3.4 FL. OZ.");
  const [quantity, setQuantity] = useState(1);

  const { fetchCart, setIsCartOpen } = useCart();

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

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        navigate("/auth");
        return;
      }

      await axios.post(
        `${API_URL}/cart/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  // Format giá VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format category
  const formatCategory = (category) => {
    const categories = {
      Men: "Eau de Parfum Pour Homme",
      Women: "Eau de Parfum Pour Femme",
      Mini: "Miniature Collection",
      Giftset: "Coffret Prestige",
    };
    return categories[category] || "Eau de Toilette";
  };

  if (!product) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Product Image */}
        <div className="product-image-section">
          <div className="product-image-wrapper">
            <img src={product.image} alt={product.name} />
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-type">{formatCategory(product.category)}</p>
            <p className="product-ref">Ref: c{product._id.slice(-6)}</p>
          </div>

          <div className="product-price">
            <span className="price-amount">{formatPrice(product.price)}</span>
          </div>

          {/* Description */}
          <div className="product-description">
            <p>
              {product.description ||
                `Une fragrance intemporelle qui capture l'essence de l'élégance et du raffinement. 
                Une composition olfactive sophistiquée, créée pour ceux qui apprécient l'art de la parfumerie.`}
            </p>
          </div>

          {/* Size Selection */}
          <div className="product-options">
            <label className="option-label">Choisir la taille:</label>
            <select
              className="size-selector"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option>3.4 FL. OZ.</option>
              <option>5.0 FL. OZ.</option>
              <option>1.7 FL. OZ.</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="product-quantity">
            <label className="option-label">Quantité:</label>
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Bag Button */}
          <button className="add-to-bag-btn" onClick={handleAddToCart}>
            Ajouter au panier
          </button>

          {/* Product Features */}
          <div className="product-features">
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Authentique</strong>
                <p>Produit 100% authentique</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Livraison gratuite</strong>
                <p>Pour toute commande</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Emballage luxueux</strong>
                <p>Coffret cadeau élégant</p>
              </div>
            </div>
          </div>

          {/* Extra Links */}
          <div className="product-links">
            <button
              className="product-link"
              onClick={(e) => e.preventDefault()}
            >
              Questions & Réponses
            </button>
            <button
              className="product-link"
              onClick={(e) => e.preventDefault()}
            >
              Avis des clients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
