import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { fetchRideRequests } from "../api/fetchRideRequests";
import RideRequests from "../Components/RideRequests"; // ✅ Import RideRequests component

const RiderDashboard = () => {
  const riderId = auth.currentUser?.uid;
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      {/* Card Container for Cleaner Look */}
      <div className="card shadow border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">
              Your Ride Requests
            </h2>
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/create-ride")}
            >
              ➕ Create Ride
            </button>
          </div>

          {/* ✅ Display Ride Requests */}
          <RideRequests showAssignButton={false} filterByRiderId={riderId} />

          {/* Fallback Message */}
          {!riderId && (
            <div className="alert alert-warning mt-3 text-center" role="alert">
              Please log in to view your ride requests!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
