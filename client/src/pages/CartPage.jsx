import React from "react";
import { useCart } from "../context/CartContext";

const CartPage = () => {
  const { cart, loading, addToCart } = useCart();

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (!cart || cart.items.length === 0) return <p>Giỏ hàng trống</p>;

  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      {cart.items.map((item) => (
        <div key={item.product._id} className="cart-page-item">
          <img
            src={item.product.image}
            alt={item.product.name}
            style={{ width: "80px", height: "80px" }}
          />
          <div>
            <h3>{item.product.name}</h3>
            <p>{item.product.price.toLocaleString()}₫</p>
            <div className="cart-item-controls">
              <button
                onClick={() => addToCart(item.product._id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => addToCart(item.product._id, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="cart-total">
        <h2>
          Tổng tiền:{" "}
          {cart.items
            .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            .toLocaleString()}
          ₫
        </h2>
        <button className="checkout-btn">Thanh toán</button>
      </div>
    </div>
  );
};

export default CartPage;
