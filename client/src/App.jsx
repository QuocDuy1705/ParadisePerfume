import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatButton from "./components/ChatButton";
import { useCart } from "./context/CartContext";
import { SocketProvider } from "./context/SocketContext";
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
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

// Info pages from Footer
const ContactPage = lazy(() => import("./pages/ContactPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ReturnsPage = lazy(() => import("./pages/ReturnsPage"));
const WarrantyPage = lazy(() => import("./pages/WarrantyPage"));
const StoresPage = lazy(() => import("./pages/StoresPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const SustainabilityPage = lazy(() => import("./pages/SustainabilityPage"));
const HowToOrderPage = lazy(() => import("./pages/HowToOrderPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));

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

// Layout wrapper component
const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
};

const App = () => {
  const { isCartOpen } = useCart();

  return (
    <Router>
      <SocketProvider>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
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

              {/* Info Pages */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/warranty" element={<WarrantyPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/how-to-order" element={<HowToOrderPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
          </Suspense>
        </Layout>

        {/* CartSidebar controlled by context */}
        {isCartOpen && <CartSidebar />}

        {/* Chat Button */}
        <ChatButton />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </SocketProvider>
    </Router>
  );
};

export default App;
