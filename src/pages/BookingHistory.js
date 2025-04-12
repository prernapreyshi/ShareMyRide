import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../context/UserContext"; // ✅ Correct hook import

const BookingHistory = () => {
  const { user, role } = useUser(); // ✅ Using useUser() instead of useContext(UserContext)
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user || !role) return;

      try {
        let q;

        if (role === "rider") {
          q = query(
            collection(db, "rideRequests"),
            where("riderId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
        } else if (role === "driver") {
          q = query(
            collection(db, "rideRequests"),
            where("driverId", "==", user.uid),
            orderBy("createdAt", "desc")
          );
        }

        const querySnapshot = await getDocs(q);
        const fetchedRides = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRides(fetchedRides);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user, role]);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="5xl" mx="auto" mt={10} p={6}>
      <Heading mb={6} color="brand.400">
        🧾 {role === "rider" ? "Your Ride History" : "Rides You Drove"}
      </Heading>
      {rides.length === 0 ? (
        <Text>No rides found.</Text>
      ) : (
        <VStack spacing={5} align="stretch">
          {rides.map((ride) => (
            <Box
              key={ride.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              boxShadow="sm"
            >
              <Text><strong>From:</strong> {ride.pickupLocation}</Text>
              <Text><strong>To:</strong> {ride.dropoffLocation}</Text>
              <Text><strong>Date:</strong> {ride.date}</Text>
              <Text><strong>Time:</strong> {ride.time}</Text>
              <Badge mt={2} colorScheme={
                ride.status === "completed" ? "green" :
                ride.status === "accepted" ? "blue" : "gray"
              }>
                {ride.status.toUpperCase()}
              </Badge>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default BookingHistory;
