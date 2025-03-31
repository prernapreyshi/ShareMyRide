import React, { useState } from "react";
import { FaUser, FaCar, FaLock, FaBell, FaPalette } from "react-icons/fa";
import "../styles/SettingsPage.css"; // Create this for custom styles

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [rideUpdates, setRideUpdates] = useState(false);
  const [promotional, setPromotional] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSave = (section) => {
    setSaveMessage(`${section} Saved Successfully!`);
    setTimeout(() => setSaveMessage(""), 2000);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">Account Settings</h2>

      {saveMessage && (
        <div className="alert alert-success text-center">{saveMessage}</div>
      )}

      {/* Profile Header */}
      <div className="d-flex align-items-center flex-column mb-4">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="rounded-circle mb-2 shadow-sm"
        />
        <h5 className="fw-semibold">{name || "Your Name"}</h5>
        <p className="text-muted">{email || "your.email@example.com"}</p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-3 justify-content-center custom-tab" id="settingsTab">
        <li className="nav-item">
          <button className="nav-link active" data-bs-toggle="pill" data-bs-target="#profile">
            <FaUser className="me-2" /> Profile
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="pill" data-bs-target="#vehicle">
            <FaCar className="me-2" /> Vehicle
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="pill" data-bs-target="#security">
            <FaLock className="me-2" /> Security
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="pill" data-bs-target="#notifications">
            <FaBell className="me-2" /> Notifications
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="pill" data-bs-target="#appearance">
            <FaPalette className="me-2" /> Appearance
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Profile */}
        <div className="tab-pane fade show active" id="profile">
          <div className="card p-4 shadow-sm mb-4 animate-fade">
            <h5 className="mb-3">Profile Information</h5>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => handleSave("Profile")}
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* Vehicle */}
        <div className="tab-pane fade" id="vehicle">
          <div className="card p-4 shadow-sm mb-4 animate-fade">
            <h5 className="mb-3">Vehicle Information</h5>
            <div className="mb-3">
              <label className="form-label">Vehicle Model</label>
              <input
                type="text"
                className="form-control"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Honda City"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">License Plate</label>
              <input
                type="text"
                className="form-control"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                placeholder="e.g. MH12AB1234"
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => handleSave("Vehicle Info")}
            >
              Save Vehicle Info
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="tab-pane fade" id="security">
          <div className="card p-4 shadow-sm mb-4 animate-fade">
            <h5 className="mb-3">Privacy & Security</h5>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={showHistory}
                onChange={() => setShowHistory(!showHistory)}
              />
              <label className="form-check-label">Show Ride History</label>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => handleSave("Privacy")}
            >
              Update Privacy
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="tab-pane fade" id="notifications">
          <div className="card p-4 shadow-sm mb-4 animate-fade">
            <h5 className="mb-3">Notifications</h5>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rideUpdates}
                onChange={() => setRideUpdates(!rideUpdates)}
              />
              <label className="form-check-label">Ride Updates</label>
            </div>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={promotional}
                onChange={() => setPromotional(!promotional)}
              />
              <label className="form-check-label">Promotional Offers</label>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => handleSave("Notification Preferences")}
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Appearance */}
        <div className="tab-pane fade" id="appearance">
          <div className="card p-4 shadow-sm mb-4 animate-fade">
            <h5 className="mb-3">Appearance</h5>
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <label className="form-check-label">Enable Dark Mode</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
