import React, { useState, useEffect } from "react";
import { createRideRequest } from "../api/rideRequestsService";
import { getCurrentLocation, fetchLocationSuggestions } from "../api/nominatim";
import { auth } from "../firebase/firebaseConfig";
import { FaMapMarkerAlt, FaSearch, FaSpinner } from "react-icons/fa";

const TestCreateRide = () => {
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  // ✅ Detect current location on load
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setLoading(true);
        setLocationError("");
        const location = await getCurrentLocation();
        setCurrentLocation(location.display_name);
      } catch (error) {
        console.error("Error detecting location:", error);
        setLocationError("❌ Failed to detect current location.");
      } finally {
        setLoading(false);
      }
    };
    detectLocation();
  }, []);

  // ✅ Handle destination input change and fetch suggestions
  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value.length > 2) {
      try {
        const results = await fetchLocationSuggestions(value);
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Handle ride creation
  const handleCreateRide = async () => {
    try {
      const riderId = auth.currentUser?.uid;
      if (!riderId) return alert("Please log in as a rider!");

      if (!destination) return alert("Please select a destination!");

      const rideData = {
        riderId,
        from: currentLocation,
        destination,
        status: "pending",
        createdAt: new Date(),
      };

      await createRideRequest(rideData);
      alert("✅ Ride request created!");
      setDestination("");
      setSuggestions([]);
    } catch (error) {
      console.error("Error creating ride:", error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // ✅ Handle destination selection from suggestions
  const handleSelectSuggestion = (suggestion) => {
    setDestination(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <div className="container mt-5 p-4 bg-white shadow-lg rounded" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center text-primary">Create a Ride Request</h2>

      {/* ✅ Current Location */}
      <div className="mb-3">
        <label className="form-label fw-bold">From</label>
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaMapMarkerAlt className="text-danger" />
          </span>
          <input
            type="text"
            className="form-control"
            value={currentLocation}
            readOnly
            placeholder={loading ? "Detecting location..." : "Current location"}
            style={{
              backgroundColor: "#f8f9fa",
              color: loading ? "#888" : "#000",
              cursor: "not-allowed",
            }}
          />
          {loading && (
            <span className="input-group-text">
              <FaSpinner className="spinner" />
            </span>
          )}
        </div>
        {locationError && (
          <small className="text-danger">
            {locationError}
          </small>
        )}
      </div>

      {/* ✅ Destination with Suggestions */}
      <div className="mb-3 position-relative">
        <label className="form-label fw-bold">To</label>
        <div className="input-group">
          <span className="input-group-text bg-light">
            <FaSearch className="text-primary" />
          </span>
          <input
            type="text"
            className="form-control"
            value={destination}
            onChange={handleDestinationChange}
            placeholder="Enter destination"
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="list-group position-absolute w-100 mt-1 shadow" style={{ zIndex: 10 }}>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.place_id}
                className="list-group-item list-group-item-action"
                onClick={() => handleSelectSuggestion(suggestion)}
                style={{ cursor: "pointer" }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ Submit Button */}
         <div className="d-grid">
           <button
              className="btn btn-primary"
              onClick={handleCreateRide}
              disabled={loading || !destination}
              style={{
                    backgroundColor: "#f7c08a",
                    color: "#fff", // Change text color to white
                    fontWeight: "bold", // Bold text
                    transition: "background-color 0.3s ease",
                    border: "none",
                }}
  >
         {loading ? (
            <>
             <FaSpinner className="spinner me-2" />
             Detecting Location...
            </>
            ) : (
           "➕ Create Ride"
           )}
         </button>
      </div>

    </div>
  );
};

export default TestCreateRide;
