import React, { useContext, useState } from "react";
import { FaUser, FaShoppingBag } from "react-icons/fa";
import { Search, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import SearchBar from "./SearchBar";

import "../assets/styles/header.css";

const Header = () => {
  const { user } = useContext(AuthContext);
  const { setIsCartOpen, cart } = useCart();
  const { wishlist } = useWishlist();
  const [showSearch, setShowSearch] = useState(false);

  // Calculate total items in cart
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Calculate wishlist items
  const wishlistCount = wishlist?.products?.length || 0;

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll animation
    });
  };

  return (
    <header className="header">
      <div className="top">
        <Link
          to="/"
          onClick={scrollToTop}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <h1 className="logo" style={{ cursor: "pointer" }}>
            PARADISE
          </h1>
        </Link>
        <div className="icons">
          <Search
            className="icon"
            onClick={() => setShowSearch(!showSearch)}
            style={{ cursor: "pointer" }}
          />

          {/* Wishlist Icon */}
          <Link
            to="/wishlist"
            onClick={scrollToTop}
            style={{ position: "relative", display: "inline-block" }}
          >
            <Heart className="icon" style={{ cursor: "pointer" }} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "#ff4757",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Nếu có user thì về /profile, chưa có thì về /auth */}
          <Link to={user ? "/profile" : "/auth"} onClick={scrollToTop}>
            <FaUser className="icon" />
          </Link>

          <div style={{ position: "relative", display: "inline-block" }}>
            <FaShoppingBag
              className="icon"
              onClick={() => setIsCartOpen(true)}
              style={{ cursor: "pointer" }}
            />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      {showSearch && (
        <div className="search-dropdown">
          <SearchBar />
        </div>
      )}

      <nav className="nav">
        <Link to="/" onClick={scrollToTop}>
          TRANG CHỦ
        </Link>
        <Link to="/men" onClick={scrollToTop}>
          NƯỚC HOA NAM
        </Link>
        <Link to="/women" onClick={scrollToTop}>
          NƯỚC HOA NỮ
        </Link>
        <Link to="/mini" onClick={scrollToTop}>
          NƯỚC HOA MINI
        </Link>
        <Link to="/giftset" onClick={scrollToTop}>
          GIFTSET
        </Link>
        <Link to="/about" onClick={scrollToTop}>
          ABOUT PARADISE
        </Link>
      </nav>
    </header>
  );
};

export default Header;
