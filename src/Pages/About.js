import React from "react"; 
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "../styles/About.css";

const About = () => {
  const navigate = useNavigate(); // Initialize navigate function

  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Us</h1> {/* Changed from 'About ShareMyRide' to 'About Us' */}
        <p>
          Making daily commuting easier, affordable, and eco-friendly by
          connecting passengers with drivers heading in the same direction.
        </p>
      </div>

      {/* Mission Section */}
    <div className="missile-section">
        <h2>🚀 Our Mission</h2>
        <p>
            To provide a cost-effective, sustainable, and safe ride-sharing
            experience for daily commuters.
        </p>
    </div>

       {/* Vision Section */}
       <div className="missile-section">
           <h2>🌍 Our Vision</h2>
           <p>
             Creating a connected world where ride-sharing reduces traffic and
             carbon emissions while fostering community connections.
           </p>
       </div>



      {/* Core Values */}
      <h2 className="values-title">🌟 Our Core Values</h2>
      <div className="values-list">
        <div className="value-item">
          <span className="value-icon">🔒</span>
          <h3>Safety First</h3>
          <p>Ensuring a secure and trusted carpooling experience for everyone.</p>
        </div>
        <div className="value-item">
          <span className="value-icon">💚</span>
          <h3>Sustainability</h3>
          <p>Promoting an eco-friendly and shared commuting culture.</p>
        </div>
        <div className="value-item">
          <span className="value-icon">🚗</span>
          <h3>Convenience</h3>
          <p>Making travel more accessible and hassle-free.</p>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="about-cta">
        <h2>Ready to Share Your Ride?</h2>
        <p>Join our community and start your journey with ShareMyRide.</p>
        <button className="cta-button" onClick={() => navigate("/")}>
          Get Started 🚀
        </button>
      </div>
    </div>
  );
};

export default About;
