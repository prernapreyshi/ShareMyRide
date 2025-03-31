import React from "react";
import { FaUserCircle, FaEnvelope, FaCarSide, FaSignOutAlt } from "react-icons/fa";
import "../styles/ProfileSection.css";
import { useUser } from "../context/UserContext";

export default function ProfileSection() {
  const { user, logoutUser } = useUser();

  return (
    <div className="profile-card shadow-sm p-3 mb-3 bg-white rounded animate-fade">
      <div className="d-flex align-items-center mb-3">
        <FaUserCircle size={50} className="me-3 text-primary" />
        <div>
          <h6 className="mb-0 fw-bold">{user?.name || "Guest User"}</h6>
          <small className="text-muted">{user?.email || "No Email"}</small>
        </div>
      </div>

      {user?.phoneNumber && (
        <div className="profile-info mb-2">
          <FaEnvelope className="me-2 text-secondary" />
          <span>{user.phoneNumber}</span>
        </div>
      )}

      <div className="profile-info mb-2">
        <FaCarSide className="me-2 text-secondary" />
        <span>Honda City - MH12AB1234</span> {/* Optional: make dynamic later */}
      </div>

      <button className="btn btn-outline-primary w-100 mt-3" onClick={logoutUser}>
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </div>
  );
}
