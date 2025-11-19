import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        PARADISE
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {user ? (
          <>
            <Link to="/profile">
              <i className="fa fa-user"></i> {user.firstName || "Profile"}
            </Link>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">
            <i className="fa fa-user"></i> Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
