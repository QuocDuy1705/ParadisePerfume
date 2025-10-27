import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { showSuccess } from "../utils/toast";
import "../assets/styles/wishlist.css";

const WishlistPage = () => {
  const { wishlist, loading, removeFromWishlist, clearWishlist } =
    useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    const success = await addToCart(product._id, 1);
    if (success) {
      showSuccess(`Đã thêm ${product.name} vào giỏ hàng!`);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleClearAll = async () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?")) {
      await clearWishlist();
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <div className="wishlist-title-section">
            <Heart size={32} className="wishlist-heart-icon" />
            <h1 className="wishlist-title">MES FAVORIS</h1>
          </div>
          <p className="wishlist-count">
            {wishlist.products.length}{" "}
            {wishlist.products.length === 1 ? "produit" : "produits"}
          </p>
          {wishlist.products.length > 0 && (
            <button className="clear-wishlist-btn" onClick={handleClearAll}>
              <Trash2 size={18} />
              TOUT SUPPRIMER
            </button>
          )}
        </div>

        {wishlist.products.length === 0 ? (
          <div className="wishlist-empty">
            <Heart size={64} className="empty-heart-icon" />
            <h2>VOTRE LISTE EST VIDE</h2>
            <p>Ajoutez vos parfums préférés pour les retrouver facilement</p>
            <button
              className="browse-products-btn"
              onClick={() => navigate("/")}
            >
              DÉCOUVRIR NOS PARFUMS
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.products.map((product) => (
              <div key={product._id} className="wishlist-card">
                <button
                  className="remove-from-wishlist-btn"
                  onClick={() => handleRemove(product._id)}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={20} fill="currentColor" />
                </button>

                <div
                  className="wishlist-product-image"
                  onClick={() => navigate(`/product/${product._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="wishlist-product-info">
                  <h3
                    className="wishlist-product-name"
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    {product.name}
                  </h3>
                  <p className="wishlist-product-category">
                    {product.category === "Men"
                      ? "Pour Homme"
                      : product.category === "Women"
                      ? "Pour Femme"
                      : product.category === "Mini"
                      ? "Miniature"
                      : "Coffret Cadeau"}
                  </p>
                  <p className="wishlist-product-price">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <button
                  className="wishlist-add-to-bag-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag size={18} />
                  AJOUTER AU PANIER
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
