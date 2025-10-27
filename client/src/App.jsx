import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { useCart } from "./context/CartContext";
import CartSidebar from "./components/CartSidebar";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CartPage = lazy(() => import("./pages/CartPage"));
const Orders = lazy(() => import("./pages/Order"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const MenPage = lazy(() => import("./pages/MenPage"));
const WomenPage = lazy(() => import("./pages/WomenPage"));
const MiniPage = lazy(() => import("./pages/MiniPage"));
const GiftsetPage = lazy(() => import("./pages/GiftsetPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const VNPayReturn = lazy(() => import("./pages/VNPayReturn"));
const MoMoReturn = lazy(() => import("./pages/MoMoReturn"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <div>Đang tải...</div>
  </div>
);

const App = () => {
  const { isCartOpen } = useCart();

  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResultsPage />} />
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
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/vnpay-return" element={<VNPayReturn />} />
          <Route path="/momo-return" element={<MoMoReturn />} />
        </Routes>
      </Suspense>
      <Footer />

      {/* CartSidebar controlled by context */}
      {isCartOpen && <CartSidebar />}
    </Router>
  );
};

export default App;
