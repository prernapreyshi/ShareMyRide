import axios from "axios";

// ✅ Fetch location suggestions based on user input
export const fetchLocationSuggestions = async (query) => {
  if (!query.trim()) return []; // Avoid empty API calls
  
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=5`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching location suggestions:", error);
    return []; // Return empty array instead of throwing an error
  }
};

// ✅ Get current location using reverse geolocation
export const getCurrentLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000, // ✅ Prevents app freeze (10 sec timeout)
      });
    });

    const { latitude, longitude } = position.coords;

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&countrycodes=in`
    );

    if (!response.data || !response.data.display_name) {
      throw new Error("Failed to fetch location");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching current location:", error);
    return { error: "Unable to fetch current location. Please enable GPS." }; // ✅ User-friendly error message
  }
};
