import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/services"); // Navigate to services page directly
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to ShareMyRide</h1>
        <p className="hero-subtitle">Your Trusted Carpooling Partner</p>

        {/* Get Started Button */}
        <button className="cta-btn" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;
