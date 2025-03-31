import React, { useState, useCallback } from "react";
import { fetchLocationSuggestions } from "../api/nominatim";
import { getAvailableDrivers } from "../firebase/firestoreUtils";
import "../styles/Services.css";

const Services = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [error, setError] = useState("");
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  // Debounce function to reduce API calls
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch location suggestions
  const fetchSuggestions = async (value, setSuggestions) => {
    if (value.length < 3) return setSuggestions([]);
    try {
      const results = await fetchLocationSuggestions(value);
      setSuggestions(results);
    } catch (err) {
      console.error("🔥 Error fetching location suggestions:", err);
      setSuggestions([]);
    }
  };

  // Debounced handlers for location inputs
  const handleFromChange = useCallback(debounce((value) => fetchSuggestions(value, setFromSuggestions), 300), []);
  const handleToChange = useCallback(debounce((value) => fetchSuggestions(value, setToSuggestions), 300), []);

  // Handle input changes
  const onFromInputChange = (e) => {
    setFromLocation(e.target.value);
    handleFromChange(e.target.value);
  };

  const onToInputChange = (e) => {
    setToLocation(e.target.value);
    handleToChange(e.target.value);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (setLocation, setSuggestions, suggestion) => {
    setLocation(suggestion.display_name);
    setSuggestions([]);
  };

  // Handle Search Click
  const handleSearch = async () => {
    if (!fromLocation || !toLocation) {
      setError("⚠️ Please enter both locations!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const availableRides = await getAvailableDrivers(fromLocation, toLocation);
      setRides(availableRides);
      if (availableRides.length === 0) {
        setError("❌ No rides available for the selected route.");
      }
    } catch (err) {
      console.error("🔥 Error fetching rides:", err);
      setError("⚠️ Failed to fetch rides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="services-container">
      <h2>Find Your Ride</h2>

      {error && <p className="alert alert-danger">{error}</p>}

      <div className="search-box">
        {/* FROM Location Input */}
        <div className="mb-3 position-relative">
          <input
            type="text"
            placeholder=" From (Enter Pickup Location)"
            value={fromLocation}
            onChange={onFromInputChange}
            className="form-control"
          />
          {fromSuggestions.length > 0 && (
            <ul className="suggestions list-group position-absolute">
              {fromSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(setFromLocation, setFromSuggestions, suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* TO Location Input */}
        <div className="mb-3 position-relative">
          <input
            type="text"
            placeholder=" To (Enter Destination)"
            value={toLocation}
            onChange={onToInputChange}
            className="form-control"
          />
          {toSuggestions.length > 0 && (
            <ul className="suggestions list-group position-absolute">
              {toSuggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSuggestionClick(setToLocation, setToSuggestions, suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={handleSearch}
          className={`btn btn-primary search-btn ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "🔍 Searching..." : "Search Ride"}
        </button>
      </div>

      {/* Display Rides */}
      {rides.length > 0 && (
        <div className="results mt-4">
          <h3>✅ Available Rides:</h3>
          <ul className="list-group">
            {rides.map((ride) => (
              <li key={ride.id} className="list-group-item">
                <strong>{ride.name}</strong> - {ride.location} - ₹{ride.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Services;
