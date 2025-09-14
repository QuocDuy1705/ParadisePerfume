import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/checkout.css";

const API_URL = "http://localhost:5000/api";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login before checkout!");
        return;
      }

      // Gọi API tạo order
      const res = await axios.post(
        `${API_URL}/orders`,
        {
          items: cart.items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            fullName: form.fullName,
            address: form.address,
            phone: form.phone,
          },
          paymentMethod: form.paymentMethod,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Order created:", res.data);

      // Xóa giỏ hàng sau khi đặt thành công
      clearCart();

      // Điều hướng sang trang thông báo đặt hàng thành công
      navigate("/order-success");
    } catch (err) {
      console.error("Checkout error:", err.response?.data || err.message);
      alert("Order failed!");
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">CHECKOUT</h1>

      <div className="checkout-container">
        {/* LEFT: FORM */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>SHIPPING INFORMATION</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <h2>PAYMENT METHOD</h2>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
          >
            <option value="cod">Cash on Delivery</option>
            <option value="vnpay">VNPay</option>
            <option value="momo">Momo</option>
          </select>

          <button type="submit" className="btn-checkout">
            PLACE ORDER
          </button>
        </form>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>ORDER SUMMARY</h2>
          {cart.items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul>
              {cart.items.map((item) => (
                <li key={item.product._id}>
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="checkout-total">
            <strong>Total:</strong> ${totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
