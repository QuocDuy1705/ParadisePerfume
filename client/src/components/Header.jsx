import React, { useState, useContext } from "react";
import { FaSearch, FaRegStar, FaUser, FaShoppingBag } from "react-icons/fa";
import { Link } from "react-router-dom";
import CartSidebar from "./CartSidebar";
import { AuthContext } from "../context/AuthContext";

import "../assets/styles/header.css";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="top">
        <h1 className="logo">PARADISE</h1>
        <div className="icons">
          <FaSearch className="icon" />
          <FaRegStar className="icon" />

          {/* Nếu có user thì về /profile, chưa có thì về /auth */}
          <Link to={user ? "/profile" : "/auth"}>
            <FaUser className="icon" />
          </Link>

          <FaShoppingBag className="icon" onClick={() => setIsCartOpen(true)} />
        </div>
      </div>

      <nav className="nav">
        <Link to="/">TRANG CHỦ</Link>
        <Link to="/men">NƯỚC HOA NAM</Link>
        <Link to="/women">NƯỚC HOA NỮ</Link>
        <Link to="/mini">NƯỚC HOA MINI</Link>
        <Link to="/giftset">GIFTSET</Link>
        <Link to="/about">ABOUT PARADISE</Link>
      </nav>

      {/* Sidebar giỏ hàng */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
