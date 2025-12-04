import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// SHARED COMPONENTS
import Header from "./shared/components/Header";
import Footer from "./shared/components/Footer";
import ScrollToTop from "./shared/components/ScrollToTop";
import LoadingFallback from "./components/LoadingFallback";

// CORE
import { useCart } from "./core/context/CartContext";
import { SocketProvider } from "./core/context/SocketContext";

// FEATURES - Lazy load pages for better performance

// Auth
const AuthPage = lazy(() => import("./features/auth/AuthPage"));
const ForgotPasswordPage = lazy(() =>
  import("./features/auth/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("./features/auth/ResetPasswordPage")
);
const GoogleCallbackPage = lazy(() =>
  import("./features/auth/GoogleCallbackPage")
);

// Home
const Home = lazy(() => import("./features/home/Home"));

// Products
const ProductPage = lazy(() => import("./features/products/pages/ProductPage"));
const ProductDetail = lazy(() =>
  import("./features/products/pages/ProductDetail")
);
const CategoryPage = lazy(() =>
  import("./features/products/pages/CategoryPage")
);
const MenPage = lazy(() => import("./features/products/pages/MenPage"));
const WomenPage = lazy(() => import("./features/products/pages/WomenPage"));
const MiniPage = lazy(() => import("./features/products/pages/MiniPage"));
const GiftsetPage = lazy(() => import("./features/products/pages/GiftsetPage"));
const SearchResultsPage = lazy(() =>
  import("./features/products/pages/SearchResultsPage")
);
const WishlistPage = lazy(() =>
  import("./features/products/pages/WishlistPage")
);

// Cart
const CartPage = lazy(() => import("./features/cart/CartPage"));
const CartSidebar = lazy(() =>
  import("./features/cart/components/CartSidebar")
);

// Checkout
const CheckoutPage = lazy(() => import("./features/checkout/CheckoutPage"));
const PaymentPage = lazy(() => import("./features/checkout/PaymentPage"));

// Orders
const Orders = lazy(() => import("./features/orders/OrderPage"));
const OrderSuccess = lazy(() => import("./features/orders/OrderSuccess"));

// Profile
const ProfilePage = lazy(() => import("./features/profile/ProfilePage"));

// Voucher
const VoucherHuntPage = lazy(() =>
  import("./features/voucher/VoucherHuntPage")
);

// Admin
const AdminRoute = lazy(() => import("./features/admin/components/AdminRoute"));
const AdminDashboard = lazy(() =>
  import("./features/admin/pages/AdminDashboard")
);

// Blog
const BlogPage = lazy(() => import("./features/blog/pages/BlogPage"));
const BlogDetail = lazy(() => import("./features/blog/pages/BlogDetail"));
const BlogBrands = lazy(() => import("./features/blog/pages/BlogBrands"));
const BlogFragranceTypes = lazy(() =>
  import("./features/blog/pages/BlogFragranceTypes")
);
const BlogHowToChoose = lazy(() =>
  import("./features/blog/pages/BlogHowToChoose")
);
const BlogPerfumeCare = lazy(() =>
  import("./features/blog/pages/BlogPerfumeCare")
);
const BlogLuxuryBrands = lazy(() =>
  import("./features/blog/pages/BlogLuxuryBrands")
);

// AI
const AIRecommendation = lazy(() => import("./features/ai/AIRecommendation"));

// Chat
const ChatButton = lazy(() => import("./features/chat/ChatButton"));

// AI Chatbox
const AIChatbox = lazy(() => import("./components/AIChatbox"));

// Static Pages
const AboutPage = lazy(() => import("./features/static/AboutPage"));
const ContactPage = lazy(() => import("./features/static/ContactPage"));
const FAQPage = lazy(() => import("./features/static/FAQPage"));
const ShippingPage = lazy(() => import("./features/static/ShippingPage"));
const ReturnsPage = lazy(() => import("./features/static/ReturnsPage"));
const WarrantyPage = lazy(() => import("./features/static/WarrantyPage"));
const StoresPage = lazy(() => import("./features/static/StoresPage"));
const CareersPage = lazy(() => import("./features/static/CareersPage"));
const SustainabilityPage = lazy(() =>
  import("./features/static/SustainabilityPage")
);
const HowToOrderPage = lazy(() => import("./features/static/HowToOrderPage"));
const PrivacyPage = lazy(() => import("./features/static/PrivacyPage"));
const TermsPage = lazy(() => import("./features/static/TermsPage"));

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
          <Suspense fallback={<LoadingFallback />}>
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
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/men" element={<MenPage />} />
              <Route path="/women" element={<WomenPage />} />
              <Route path="/mini" element={<MiniPage />} />
              <Route path="/giftset" element={<GiftsetPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route
                path="/auth/google/callback"
                element={<GoogleCallbackPage />}
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/voucher-hunt" element={<VoucherHuntPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* AI Recommendation */}
              <Route path="/ai-recommend" element={<AIRecommendation />} />

              {/* Blog Pages */}
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/blog/brands" element={<BlogBrands />} />
              <Route
                path="/blog/fragrance-types"
                element={<BlogFragranceTypes />}
              />
              <Route path="/blog/how-to-choose" element={<BlogHowToChoose />} />
              <Route path="/blog/perfume-care" element={<BlogPerfumeCare />} />
              <Route
                path="/blog/luxury-brands"
                element={<BlogLuxuryBrands />}
              />

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

        {/* AI Chatbox */}
        <AIChatbox />

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
