import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import TopNavbar from "./Components/TopNavbar";
import SideNavbar from "./Components/SideNavbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Services from "./Pages/Services";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import SettingsPage from "./Pages/SettingsPage"; 
import ProfileSection from "./Pages/ProfileSection";
import RiderDashboard from "./Pages/RiderDashboard";
import DriverDashboard from "./Pages/DriverDashboard";
import TestCreateRide from "./Components/TestCreateRide";
import CreateRide from "./Components/CreateRide";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/theme.css";
import "./styles/App.css";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Router>
      <MainLayout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Router>
  );
}

function MainLayout({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      document.body.classList.remove("sidebar-open");
    }, 300);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }, [sidebarOpen]);

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <TopNavbar toggleSidebar={toggleSidebar} />
      <SideNavbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Scrolling enabled */}
      <div className={`main-content ${sidebarOpen ? "shifted" : ""}`} style={{ height: "100vh", overflowY: "auto", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomeWithFooter />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfileSection />} />
          <Route path="/rider-dashboard" element={<RiderDashboard riderId="r1D7yIxSFAWeY2xHsAp5" />} />
          <Route path="/driver-dashboard" element={<DriverDashboard driverId="bBD6yIxSFAWeY2xHsAp2" />} />
          <Route path="/test-create-ride" element={<TestCreateRide />} />
          <Route path="/create-ride" element={<CreateRide />} />
        </Routes>
      </div>
    </div>
  );
}

// Wrap Home with Footer
function HomeWithFooter() {
  return (
    <>
      <Home />
      <Footer />
    </>
  );
}

export default App;
