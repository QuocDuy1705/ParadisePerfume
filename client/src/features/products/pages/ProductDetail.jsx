import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronRight, Home, Heart } from "lucide-react";
import axios from "axios";
import { useCart } from "../../../core/context/CartContext";
import { useWishlist } from "../../../core/context/WishlistContext";
import { showSuccess, showWarning, showError } from "../../../core/utils/toast";
import Rating from "../components/Rating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import ProductCard from "../components/ProductCard";
import "../../../assets/styles/productDetails.css";
import "../../../assets/styles/reviews.css";

const API_URL = "http://localhost:5000/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("3.4 FL. OZ.");
  const [quantity, setQuantity] = useState(1);
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const { fetchCart, setIsCartOpen } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Check if current product is in wishlist
  const inWishlist = product?._id ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/products/${id}`);
        setProduct(res.data);

        // Fetch related products (same category)
        if (res.data.category) {
          const relatedRes = await axios.get(
            `${API_URL}/products?category=${res.data.category}&limit=4`
          );
          setRelatedProducts(
            relatedRes.data.products.filter((p) => p._id !== id).slice(0, 4)
          );
        }
      } catch (error) {
        console.error("Lỗi fetch product:", error);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
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
      showSuccess(`Đã thêm ${quantity} ${product.name} vào giỏ hàng!`);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ:", err);
      showError("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showWarning("Vui lòng đăng nhập để sử dụng wishlist");
        navigate("/auth");
        return;
      }

      if (inWishlist) {
        await removeFromWishlist(product._id);
        showSuccess("Đã xóa khỏi danh sách yêu thích");
      } else {
        await addToWishlist(product._id);
        showSuccess("Đã thêm vào danh sách yêu thích");
      }
    } catch (err) {
      console.error("Lỗi wishlist:", err);
      showError("Không thể cập nhật wishlist. Vui lòng thử lại.");
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
      Men: "Nước hoa nam",
      Women: "Nước hoa nữ",
      Mini: "Bộ sưu tập mini",
      Giftset: "Hộp quà cao cấp",
    };
    return categories[category] || "Nước hoa";
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
      {/* Breadcrumb */}
      <div
        className="breadcrumb-container"
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 80px 30px" }}
      >
        <nav
          className="breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: "#666",
              textDecoration: "none",
            }}
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} />
          <Link
            to={`/${product.category.toLowerCase()}`}
            style={{ color: "#666", textDecoration: "none" }}
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#000" }}>{product.name}</span>
        </nav>
      </div>

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
                `Một hương thơm vượt thời gian, thể hiện tinh hoa của sự sang trọng và tinh tế. 
                Một tác phẩm hương liệu được sáng tạo cho những ai trân trọng nghệ thuật chế tác nước hoa.`}
            </p>
          </div>

          {/* Size Selection */}
          <div className="product-options">
            <label className="option-label">Chọn dung tích:</label>
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
            <label className="option-label">Số lượng:</label>
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
            Thêm vào giỏ hàng
          </button>

          {/* Add to Wishlist Button */}
          <button
            className={`add-to-wishlist-btn ${inWishlist ? "active" : ""}`}
            onClick={handleToggleWishlist}
          >
            <Heart
              size={20}
              fill={inWishlist ? "currentColor" : "none"}
              strokeWidth={2}
            />
            {inWishlist ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
          </button>

          {/* Product Features */}
          <div className="product-features">
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Chính hãng</strong>
                <p>Sản phẩm 100% chính hãng</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Miễn phí vận chuyển</strong>
                <p>Cho mọi đơn hàng</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✦</div>
              <div className="feature-text">
                <strong>Đóng gói sang trọng</strong>
                <p>Hộp quà tặng thanh lịch</p>
              </div>
            </div>
          </div>

          {/* Extra Links */}
          <div className="product-links">
            <button
              className="product-link"
              onClick={() => setActiveTab("faq")}
            >
              Câu hỏi & Trả lời
            </button>
            <button
              className="product-link"
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá khách hàng
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div
        className="product-tabs-container"
        style={{ maxWidth: "1400px", margin: "60px auto 0", padding: "0 80px" }}
      >
        <div
          className="tabs-header"
          style={{
            display: "flex",
            gap: "40px",
            borderBottom: "1px solid #e5e5e5",
            marginBottom: "40px",
          }}
        >
          <button
            className={`tab-button ${
              activeTab === "description" ? "active" : ""
            }`}
            onClick={() => setActiveTab("description")}
            style={{
              padding: "15px 0",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "description"
                  ? "2px solid #000"
                  : "2px solid transparent",
              cursor: "pointer",
              color: activeTab === "description" ? "#000" : "#666",
              fontWeight: activeTab === "description" ? "600" : "400",
              transition: "all 0.3s ease",
            }}
          >
            Mô tả
          </button>
          <button
            className={`tab-button ${
              activeTab === "composition" ? "active" : ""
            }`}
            onClick={() => setActiveTab("composition")}
            style={{
              padding: "15px 0",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "composition"
                  ? "2px solid #000"
                  : "2px solid transparent",
              cursor: "pointer",
              color: activeTab === "composition" ? "#000" : "#666",
              fontWeight: activeTab === "composition" ? "600" : "400",
              transition: "all 0.3s ease",
            }}
          >
            Thành phần
          </button>
          <button
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
            style={{
              padding: "15px 0",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              background: "none",
              border: "none",
              borderBottom:
                activeTab === "reviews"
                  ? "2px solid #000"
                  : "2px solid transparent",
              cursor: "pointer",
              color: activeTab === "reviews" ? "#000" : "#666",
              fontWeight: activeTab === "reviews" ? "600" : "400",
              transition: "all 0.3s ease",
            }}
          >
            Đánh giá ({product.numReviews || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="description-tab" style={{ padding: "20px 0" }}>
              <h3
                style={{
                  fontSize: "18px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                  fontWeight: "300",
                }}
              >
                VỀ SẢN PHẨM NÀY
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.8",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                {product.description ||
                  `Một hương thơm vượt thời gian, thể hiện tinh hoa của sự sang trọng và tinh tế. Một tác phẩm hương liệu được sáng tạo cho những ai trân trọng nghệ thuật chế tác nước hoa.`}
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li
                  style={{
                    fontSize: "14px",
                    lineHeight: "2",
                    color: "#666",
                    paddingLeft: "20px",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: 0 }}>•</span> Lưu
                  hương lâu dài từ 8 đến 12 giờ
                </li>
                <li
                  style={{
                    fontSize: "14px",
                    lineHeight: "2",
                    color: "#666",
                    paddingLeft: "20px",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: 0 }}>•</span> Tỏa
                  hương vừa phải đến mạnh mẽ
                </li>
                <li
                  style={{
                    fontSize: "14px",
                    lineHeight: "2",
                    color: "#666",
                    paddingLeft: "20px",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: 0 }}>•</span> Phù
                  hợp cho mọi mùa trong năm
                </li>
                <li
                  style={{
                    fontSize: "14px",
                    lineHeight: "2",
                    color: "#666",
                    paddingLeft: "20px",
                    position: "relative",
                  }}
                >
                  <span style={{ position: "absolute", left: 0 }}>•</span> Chai
                  lọ sang trọng và thanh lịch
                </li>
              </ul>
            </div>
          )}

          {activeTab === "composition" && (
            <div className="composition-tab" style={{ padding: "20px 0" }}>
              <h3
                style={{
                  fontSize: "18px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  marginBottom: "30px",
                  fontWeight: "300",
                }}
              >
                HƯƠNG LIỆU
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "30px",
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "15px",
                      color: "#000",
                    }}
                  >
                    HƯƠNG ĐẦU
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: "#666",
                    }}
                  >
                    Cam bergamot, Chanh, Bưởi
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "15px",
                      color: "#000",
                    }}
                  >
                    HƯƠNG GIỮA
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: "#666",
                    }}
                  >
                    Hoa nhài, Hoa hồng, Hoa iris
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "12px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "15px",
                      color: "#000",
                    }}
                  >
                    HƯƠNG CUỐI
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: "1.8",
                      color: "#666",
                    }}
                  >
                    Gỗ đàn hương, Xạ hương, Hổ phách
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews-tab">
              {product.rating > 0 && (
                <div
                  style={{
                    marginBottom: "30px",
                    paddingBottom: "30px",
                    borderBottom: "1px solid #e5e5e5",
                  }}
                >
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                    size={20}
                    showCount={true}
                  />
                </div>
              )}
              <ReviewForm
                productId={product._id}
                onReviewSubmitted={() => setRefreshReviews((prev) => prev + 1)}
              />
              <ReviewList
                productId={product._id}
                refreshTrigger={refreshReviews}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div
          className="related-products-section"
          style={{
            maxWidth: "1400px",
            margin: "80px auto 0",
            padding: "0 80px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "50px",
              fontWeight: "300",
              borderBottom: "1px solid #e5e5e5",
              paddingBottom: "30px",
            }}
          >
            BẠN CÓ THỂ THÍCH
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "40px",
            }}
          >
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
