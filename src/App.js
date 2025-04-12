import React from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import theme from "./styles/theme";
import { UserProvider } from "./context/UserContext";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SelectRole from "./pages/SelectRole";
import DriverDashboard from "./pages/DriverDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import SearchResults from "./pages/SearchResults";
import BookingConfirmation from "./pages/BookingConfirmation";
import RiderDetails from "./pages/RiderDetails";
import DriverDetails from "./pages/DriverDetails";
import BookingHistory from "./pages/BookingHistory";
import EditProfile from "./pages/EditProfile";
import RideDetails from "./pages/RideDetails";
import RideRequestForm from "./pages/RideRequestForm";
import AvailableRideRequests from "./pages/AvailableRideRequests";
import ContactForm from './Components/ContactForm';

// Components
import Navbar from "./Components/Navbar";
import ShowMyRidePage from "./Components/ShowMyRidePage";

function AppLayout() {
  const location = useLocation();
  const showNavbar = location.pathname === "/"; // ✅ only on homepage

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/show-my-ride" element={<ShowMyRidePage />} />

        {/* Rider Routes */}
        <Route path="/rider-dashboard" element={<RiderDashboard />} />
        <Route path="/rider-details" element={<RiderDetails />} />
        <Route path="/request-ride" element={<RideRequestForm />} />

        {/* Driver Routes */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/driver-details" element={<DriverDetails />} />
        <Route path="/available-rides" element={<AvailableRideRequests />} />

        {/* Common Routes */}
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ride-details/:rideId" element={<RideDetails />} />
        <Route path="/booking-confirmation/:rideId" element={<BookingConfirmation />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/contact" element={<ContactForm />} />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <Text fontSize="2xl" textAlign="center" mt={20} color="gray.500">
              404 - Page Not Found
            </Text>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <UserProvider>
          <AppLayout />
        </UserProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
