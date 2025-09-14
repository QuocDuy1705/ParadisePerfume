import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useCart } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar"; // đảm bảo import từ components, không phải pages

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Orders from "./pages/Order";
import AdminDashboard from "./pages/AdminDashboard";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import ProductList from "./components/ProductList";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import MiniPage from "./pages/MiniPage";
import GiftsetPage from "./pages/GiftsetPage";
import AboutPage from "./pages/AboutPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetails from "./pages/ProductDetail";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";

const App = () => {
  const { isCartOpen } = useCart(); // lấy state mở giỏ hàng

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/mini" element={<MiniPage />} />
        <Route path="/giftset" element={<GiftsetPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer />

      {/* Luôn mount CartSidebar, show/hide theo state */}
      {isCartOpen && <CartSidebar />}
    </Router>
  );
};

export default App;
