import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/TopNavbar.css";

function TopNavbar({ toggleSidebar }) {
  const navigate = useNavigate();

  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <h1 onClick={() => navigate("/")}>ShareMyRide</h1>
      </div>

      <div className="navbar-center">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/services">Services</a>
        <a href="/contact">Contact</a>
      </div>

      <div className="navbar-right">
        <button className="primary-btn" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="secondary-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
      </div>
    </nav>
  );
}

export default TopNavbar;
