import React, { useState, useEffect } from "react";
import { createRideRequest } from "../api/rideRequestsService";
import { auth } from "../firebase/firebaseConfig";

const CreateRide = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({ from: [], to: [] });

  // ✅ Reset fields when the component mounts
  useEffect(() => {
    setFrom("");
    setTo("");
    setSuggestions({ from: [], to: [] });
  }, []);

  // ✅ Fetch Location Suggestions (OpenStreetMap API)
  const fetchLocationSuggestions = async (input, type) => {
    if (input.length < 3) return; // ✅ Avoid unnecessary API calls
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${input}&countrycodes=IN`
      );
      const data = await response.json();
      setSuggestions((prev) => ({ ...prev, [type]: data }));
    } catch (error) {
      console.error("🔥 Error fetching location:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to) return alert("Please fill in both fields!");

    try {
      setLoading(true);
      const riderId = auth.currentUser?.uid;
      if (!riderId) throw new Error("You must be logged in as a rider");

      await createRideRequest(from, to, riderId);
      alert("✅ Ride request created successfully!");
      setFrom("");
      setTo("");
      setSuggestions({ from: [], to: [] });
    } catch (error) {
      console.error("❌ Error creating ride request:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0 p-4">
        <h2 className="mb-4 text-center">📝 Create Ride Request</h2>
        <form onSubmit={handleSubmit}>
          {/* ✅ FROM Location Input */}
          <div className="mb-3 position-relative">
            <label className="form-label">From:</label>
            <input
              type="text"
              className="form-control"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                fetchLocationSuggestions(e.target.value, "from");
              }}
              required
            />
            {/* ✅ Location Suggestions Dropdown */}
            {suggestions.from.length > 0 && (
              <ul className="list-group position-absolute bg-white z-1">
                {suggestions.from.map((place, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setFrom(place.display_name);
                      setSuggestions((prev) => ({ ...prev, from: [] }));
                    }}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ TO Location Input */}
          <div className="mb-3 position-relative">
            <label className="form-label">To:</label>
            <input
              type="text"
              className="form-control"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                fetchLocationSuggestions(e.target.value, "to");
              }}
              required
            />
            {/* ✅ Location Suggestions Dropdown */}
            {suggestions.to.length > 0 && (
              <ul className="list-group position-absolute bg-white z-1">
                {suggestions.to.map((place, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setTo(place.display_name);
                      setSuggestions((prev) => ({ ...prev, to: [] }));
                    }}
                  >
                    {place.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ✅ Submit Button */}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Create Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;
