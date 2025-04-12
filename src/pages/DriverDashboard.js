import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Button,
  Spinner,
  HStack,
  useToast,
  Image,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure
} from "@chakra-ui/react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import DashboardLayout from "../Components/DashboardLayout";
import sendNotification from "../api/sendNotification";

const LOCATIONIQ_API_KEY = "pk.02a082d9834c35563c931be2cf773633";

const DriverDashboard = () => {
  const [rideRequests, setRideRequests] = useState([]);
  const [acceptedRides, setAcceptedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [rejectRideId, setRejectRideId] = useState(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  // Fetch all ride requests on realtime snapshot
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rideRequests"), (snapshot) => {
      const allRides = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setRideRequests(allRides.filter((ride) => ride.status === "pending"));
      setAcceptedRides(
        allRides.filter(
          (ride) => ride.status === "accepted" && ride.driverId === auth.currentUser?.uid
        )
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch driver profile info
  useEffect(() => {
    const fetchUserInfo = async () => {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) setUserInfo(userDoc.data());
    };

    if (auth.currentUser) fetchUserInfo();
  }, []);

  const getStaticMapUrl = (pickupCoords, dropoffCoords) => {
    if (!pickupCoords || !dropoffCoords) return null;

    return `https://maps.locationiq.com/v3/staticmap?key=${LOCATIONIQ_API_KEY}&center=${pickupCoords.lat},${pickupCoords.lon}&zoom=13&size=600x300&markers=icon:large-red-cutout|${pickupCoords.lat},${pickupCoords.lon}|icon:large-blue-cutout|${dropoffCoords.lat},${dropoffCoords.lon}&path=color:0x6600ff|weight:3|${pickupCoords.lat},${pickupCoords.lon}|${dropoffCoords.lat},${dropoffCoords.lon}`;
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const rideRef = doc(db, "rideRequests", rideId);
      const rideSnap = await getDoc(rideRef);
      const ride = rideSnap.data();

      await updateDoc(rideRef, {
        status: "accepted",
        driverId: auth.currentUser.uid,
      });

      await sendNotification({
        userId: ride.riderId,
        title: "Ride Accepted",
        message: "Your ride has been accepted by a driver.",
        rideId,
        type: "ride",
      });

      toast({ title: "Ride Accepted", status: "success", duration: 3000 });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept ride.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const confirmRejectRide = (rideId) => {
    setRejectRideId(rideId);
    onOpen();
  };

  const handleRejectRide = async () => {
    try {
      const rideRef = doc(db, "rideRequests", rejectRideId);
      const rideSnap = await getDoc(rideRef);
      const ride = rideSnap.data();

      await updateDoc(rideRef, {
        status: "rejected",
        driverId: auth.currentUser.uid,
      });

      await sendNotification({
        userId: ride.riderId,
        title: "Ride Rejected",
        message: "Your ride request was rejected by the driver.",
        rideId: rejectRideId,
        type: "ride",
      });

      toast({ title: "Ride Rejected", status: "info", duration: 3000 });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject ride.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setRejectRideId(null);
      onClose();
    }
  };

  const handleCompleteRide = async (rideId) => {
    try {
      const rideRef = doc(db, "rideRequests", rideId);
      const rideSnap = await getDoc(rideRef);
      const ride = rideSnap.data();

      await updateDoc(rideRef, { status: "completed" });

      await sendNotification({
        userId: ride.riderId,
        title: "Ride Completed",
        message: "Your ride has been marked as completed.",
        rideId,
        type: "completed",
      });

      await sendNotification({
        userId: ride.driverId,
        title: "Ride Completed",
        message: "You have successfully completed the ride.",
        rideId,
        type: "completed",
      });

      toast({ title: "Ride marked as completed", status: "success", duration: 3000 });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark ride as completed.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const formatTimestamp = (timestamp) =>
    timestamp instanceof Timestamp
      ? timestamp.toDate().toLocaleString()
      : timestamp?.toString() ?? "N/A";

  return (
    <DashboardLayout userInfo={userInfo}>
      {loading ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <>
          <Heading mb={4} color="brand.400">
            Pending Ride Requests
          </Heading>
          <VStack spacing={4} align="stretch" mb={10}>
            {rideRequests.map((ride) => (
              <Box key={ride.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                <Text><strong>From:</strong> {ride.pickupLocation}</Text>
                <Text><strong>To:</strong> {ride.dropoffLocation}</Text>
                <Text><strong>Date:</strong> {formatTimestamp(ride.date)}</Text>
                <Text><strong>Time:</strong> {formatTimestamp(ride.time)}</Text>

                {ride.pickupCoords && ride.dropoffCoords && (
                  <Image
                    src={getStaticMapUrl(ride.pickupCoords, ride.dropoffCoords)}
                    alt="Map Preview"
                    mt={3}
                    borderRadius="md"
                  />
                )}

                <HStack mt={3}>
                  <Button colorScheme="green" onClick={() => handleAcceptRide(ride.id)}>
                    Accept
                  </Button>
                  <Button variant="outline" colorScheme="red" onClick={() => confirmRejectRide(ride.id)}>
                    Reject
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Heading mb={4} color="brand.400">
            Your Accepted Rides
          </Heading>
          <VStack spacing={4} align="stretch">
            {acceptedRides.map((ride) => (
              <Box key={ride.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
                <Text><strong>From:</strong> {ride.pickupLocation}</Text>
                <Text><strong>To:</strong> {ride.dropoffLocation}</Text>
                <Text><strong>Date:</strong> {formatTimestamp(ride.date)}</Text>
                <Text><strong>Time:</strong> {formatTimestamp(ride.time)}</Text>

                {ride.pickupCoords && ride.dropoffCoords && (
                  <Image
                    src={getStaticMapUrl(ride.pickupCoords, ride.dropoffCoords)}
                    alt="Map Preview"
                    mt={3}
                    borderRadius="md"
                  />
                )}

                <Button mt={3} colorScheme="purple" onClick={() => handleCompleteRide(ride.id)}>
                  Mark as Completed
                </Button>
              </Box>
            ))}
          </VStack>
        </>
      )}

      {/* Confirmation Dialog for Rejection */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Reject Ride
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to reject this ride request?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRejectRide} ml={3}>
                Reject
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DriverDashboard;
