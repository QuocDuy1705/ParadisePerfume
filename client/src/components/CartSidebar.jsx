import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../assets/styles/cartSidebar.css";

const CartSidebar = () => {
  const { cart, loading, updateCartItem, removeFromCart, isCartOpen, setIsCartOpen } =
    useCart();
  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    // Chuyển hướng đến trang thanh toán
    navigate("/checkout"); // Điều hướng tới "/checkout"
  };

  return (
    <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h2>Giỏ hàng</h2>
        <button className="close-btn" onClick={() => setIsCartOpen(false)}>
          ✕
        </button>
      </div>

      <div className="cart-body">
        {loading ? (
          <p>Đang tải...</p>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <p>Giỏ hàng trống</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="cart-item-img"
              />
              <div className="cart-item-info">
                <h4>{item.product.name}</h4>
                <p>{item.product.price.toLocaleString()}₫</p>
                <div className="cart-item-controls">
                  <button
                    onClick={() =>
                      updateCartItem(item.product._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateCartItem(item.product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product._id)} // Xóa sản phẩm
                    className="remove-btn"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart && cart.items && cart.items.length > 0 && (
        <div className="cart-footer">
          <p>
            Tổng tiền:{" "}
            <strong>
              {cart.items
                .reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                )
                .toLocaleString()}
              ₫
            </strong>
          </p>
          <button className="checkout-btn" onClick={handleCheckout}>
            Thanh toán
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
