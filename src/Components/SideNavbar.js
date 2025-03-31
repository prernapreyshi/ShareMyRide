import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import UserContext
import "../styles/SideNavbar.css";

function SideNavbar({ isOpen, toggleSidebar }) {
  const { user, logoutUser } = useUser(); // Get user & logout function

  const handleLogout = () => {
    logoutUser();
    toggleSidebar(); // Close sidebar on logout
  };

  return (
    <div className={`side-navbar ${isOpen ? "show-sidebar" : "hide-sidebar"}`}>
      {/* Close Button */}
      <button className="close-btn" onClick={toggleSidebar}>✖</button>

      {/* User Info */}
      <div className="user-info text-center text-white mb-4">
        {user ? (
          <>
            <h6>{user.name || "User"}</h6>
            <small>{user.email}</small>
          </>
        ) : (
          <>
            <h6>Guest</h6>
            <small>Please Login</small>
          </>
        )}
      </div>

      {/* Menu Items */}
      <ul>
        <li>
          <Link className="nav-link" to="/" onClick={toggleSidebar}>Home</Link>
        </li>
        <li>
          <Link className="nav-link" to="/dashboard" onClick={toggleSidebar}>Dashboard</Link>
        </li>
        <li>
          <Link className="nav-link" to="/profile" onClick={toggleSidebar}>Profile</Link>
        </li>
        <li>
          <Link className="nav-link" to="/settings" onClick={toggleSidebar}>Settings</Link>
        </li>
      </ul>

      {/* Logout Button (only if user is logged in) */}
      {user && (
        <button
          className="btn btn-outline-danger w-75 mx-auto d-block mt-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default SideNavbar;
