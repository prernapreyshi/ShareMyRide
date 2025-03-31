import React, { useEffect, useState } from "react";
import { fetchRideRequests } from "../api/fetchRideRequests"; // ✅ Ensure correct path
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const RideRequests = ({ showAssignButton, onAssign, onReject, filterByStatus, filterByRiderId }) => {
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRideRequests = async () => {
      setLoading(true);
      try {
        const data = await fetchRideRequests(filterByStatus, filterByRiderId);
        console.log("📌 Ride Requests Data:", data);
        setRideRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("🔥 Error fetching ride requests:", error.message);
        setRideRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadRideRequests();
  }, [filterByStatus, filterByRiderId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Ride Requests</h2>
      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : rideRequests.length === 0 ? (
        <p className="text-center text-muted">No ride requests available.</p>
      ) : (
        <div className="row">
          {rideRequests.map((request) => (
            <div key={request.id} className="col-md-6 mb-3">
              <div className="card shadow-sm border-0 rounded">
                <div className="card-body">
                  <h5 className="card-title mb-2">
                    Destination: <span className="fw-bold">{request.destination}</span>
                  </h5>
                  <p className="card-text mb-1">
                    🚦 Status:
                    <span className={`badge ${request.status === "pending" ? "bg-warning" : request.status === "assigned" ? "bg-success" : "bg-danger"}`}>
                      {request.status}
                    </span>
                  </p>
                  <p className="card-text mb-3">
                    👨‍✈️ Driver: {request.driverId ? <span className="text-success">{request.driverId}</span> : <span className="text-danger">Not Assigned</span>}
                  </p>

                  {showAssignButton && request.status === "pending" && (
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-outline-success" onClick={() => onAssign(request.id)}>
                        ✅ Accept <FaCheckCircle className="ms-1" />
                      </button>
                      {onReject && (
                        <button className="btn btn-outline-danger" onClick={() => onReject(request.id)}>
                          ❌ Reject <FaTimesCircle className="ms-1" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RideRequests;
