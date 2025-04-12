import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { db, auth } from "../firebase/firebaseConfig";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const AvailableRideRequests = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const q = query(
      collection(db, "rideRequests"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const rides = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRideRequests(rides);
        setLoading(false);
      },
      (error) => {
        toast({
          title: "Error fetching rides",
          description: error.message,
          status: "error",
          duration: 4000,
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [toast]);

  const handleAccept = async (rideId) => {
    try {
      const driverId = auth.currentUser?.uid;
      if (!driverId) {
        toast({
          title: "Not authenticated",
          description: "Please log in to accept a ride.",
          status: "warning",
          duration: 3000,
        });
        return;
      }

      await updateDoc(doc(db, "rideRequests", rideId), {
        status: "accepted",
        driverId: driverId,
      });

      toast({
        title: "Ride accepted!",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Failed to accept ride",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="4xl" mx="auto" mt={10}>
      <Heading mb={6}>Available Ride Requests</Heading>
      <VStack spacing={4}>
        {rideRequests.length === 0 ? (
          <Text>No ride requests available.</Text>
        ) : (
          rideRequests.map((ride) => (
            <Box
              key={ride.id}
              p={4}
              w="100%"
              borderWidth={1}
              borderRadius="md"
              boxShadow="md"
            >
              <Text><strong>Pickup:</strong> {ride.pickupLocation}</Text>
              <Text><strong>Dropoff:</strong> {ride.dropoffLocation}</Text>
              <Text><strong>Date:</strong> {ride.date}</Text>
              <Text><strong>Time:</strong> {ride.time}</Text>
              <Button mt={3} colorScheme="green" onClick={() => handleAccept(ride.id)}>
                Accept Ride
              </Button>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default AvailableRideRequests;
