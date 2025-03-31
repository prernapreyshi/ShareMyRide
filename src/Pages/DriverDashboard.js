import React from "react";
import { assignDriver, rejectRide } from "../api/rideRequestsService";
import { auth } from "../firebase/firebaseConfig";
import RideRequests from "../Components/RideRequests";

const DriverDashboard = () => {
  const handleAccept = async (requestId) => {
    try {
      const driverId = auth.currentUser?.uid;
      if (!driverId) return alert("Please log in as a driver!");
      await assignDriver(requestId, driverId);
      alert("✅ Ride Accepted!");
    } catch (error) {
      console.error("Error accepting ride:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRide(requestId);
      alert("❌ Ride Rejected!");
    } catch (error) {
      console.error("Error rejecting ride:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-primary text-white text-center py-3 rounded-top">
          <h2 className="mb-0">🚖 Available Ride Requests</h2>
        </div>
        <div className="card-body">
          {/* ✅ Ride Requests */}
          <RideRequests
            showAssignButton={true}
            onAssign={handleAccept}
            onReject={handleReject}
            filterByStatus="pending"
          />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
