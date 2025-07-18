import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "./Header.css";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Header = () => {
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [cartDetails, setCartDetails] = useState([]);

  useEffect(() => {
    // Fetch cart details from backend
    const fetchCartDetails = async () => {
      if (!isLoggedIn) return;
      try {
        const response = await axios.get("http://localhost:3002/api/cart", {
          withCredentials: true,
        });
        let filteredCarts = response.data;
        if (user && user.id) {
          filteredCarts = response.data.filter((cart) => cart.userId === user.id);
        }
        setCartDetails(filteredCarts);
        setCartCount(filteredCarts.length);
      } catch (error) {
        console.error("Failed to fetch cart details:", error);
        setCartDetails([]);
        setCartCount(0);
      }
    };
    fetchCartDetails();
    // Listen for cart updates
    const handleCartUpdate = () => fetchCartDetails();
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("orderPlaced", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("orderPlaced", handleCartUpdate);
    };
  }, [user, isLoggedIn]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header fixed-header">
      <div className="header__left">
        <h1>CanTeenz</h1>
      </div>

      <nav className="header__nav">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          About
        </NavLink>
        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Orders
        </NavLink>
        <NavLink
          to="/complaint"
          className={({ isActive }) => (isActive ? "active-link" : "")}
        >
          Complaints
        </NavLink>
      </nav>

      <div className="header__right">
        {isLoggedIn && (
          <div className="cart-icon-header">
            <i className="fas fa-cart-plus cart-icon-header "></i>
            <span className="cart-count">({cartCount})</span>
            <div className="cart-dropdown">
              {cartDetails.length > 0 ? (
                cartDetails.map((cart, index) => (
                  <div key={cart.orderId} className="cart-item">
                    <h4>Cart {index + 1}</h4>
                    <p>Order ID: {cart.orderId}</p>
                    <p>Canteen: {cart.canteenName}</p>
                    <p>No. of Items: {cart.items.length}</p>
                    <p>Subtotal: Rs.{cart.subtotal}.00</p>
                    <div className="cart-btn-wrapper">
                      <Link
                        to="/cart"
                        className="view-cart-btn"
                        onClick={() =>
                          localStorage.setItem(
                            "cartDetails",
                            JSON.stringify(cartDetails)
                          )
                        }
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-cart">Your cart is empty.</p>
              )}
            </div>
          </div>
        )}
        {isLoggedIn ? (
          <div className="user-menu">
            <i className="fas fa-user user-icon fa-2x"></i>
            <span className="user-name">Hi, {user || "Guest"}</span>
            <div className="user-menu__dropdown">
              <span>Welcome {user || "Guest"}!</span>
              <hr></hr>
              <Link to="/profile">Profile</Link>
              <Link to="/myorder">My Orders</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btnNav">
              Login
            </Link>
            <Link to="/signup" className="btnNav">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
