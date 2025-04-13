import React from "react";
import { ChakraProvider, Text } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import theme from "./styles/theme";
import { UserProvider, useUser } from "./context/UserContext";

// Components
import AppNavbar from "./Components/AppNavbar";
import HomeNavbar from "./Components/HomeNavbar";
import ShowMyRidePage from "./Components/ShowMyRidePage";
import DashboardLayout from "./Components/DashboardLayout";
import ContactForm from "./Components/ContactForm";

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

// 404 Fallback Component
const NotFound = () => (
  <Text fontSize="2xl" textAlign="center" mt={20} color="gray.500">
    404 - Page Not Found
  </Text>
);

function AppLayout() {
  const location = useLocation();
  const { user } = useUser();

  const path = location.pathname;
  const hideNavbarRoutes = ["/driver-dashboard", "/rider-dashboard"];
  const showHomeNavbar = path === "/" || path === "/home";
  const showNavbar = !hideNavbarRoutes.includes(path);

  const NavbarComponent = showHomeNavbar ? HomeNavbar : AppNavbar;

  return (
    <>
      {showNavbar && <NavbarComponent />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/show-my-ride" element={<ShowMyRidePage />} />

        {/* Rider Routes */}
        <Route
          path="/rider-dashboard"
          element={
            <DashboardLayout userInfo={user} userType="rider">
              <RiderDashboard />
            </DashboardLayout>
          }
        />
        <Route path="/rider-details" element={<RiderDetails />} />
        <Route path="/request-ride" element={<RideRequestForm />} />

        {/* Driver Routes */}
        <Route
          path="/driver-dashboard"
          element={
            <DashboardLayout userInfo={user} userType="driver">
              <DriverDashboard />
            </DashboardLayout>
          }
        />
        <Route path="/driver-details" element={<DriverDetails />} />
        <Route path="/available-rides" element={<AvailableRideRequests />} />

        {/* Shared Routes */}
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/ride-details/:rideId" element={<RideDetails />} />
        <Route path="/booking-confirmation/:rideId" element={<BookingConfirmation />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/contact" element={<ContactForm />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
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
