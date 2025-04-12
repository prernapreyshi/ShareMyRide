// src/Pages/DriverDetails.js
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const DriverDetails = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleInfo, setVehicleInfo] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !phone || !vehicleInfo || !licensePlate) {
      toast({
        title: "Please fill out all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);

    try {
      await setDoc(doc(db, "drivers", user.uid), {
        name,
        phone,
        vehicleInfo,
        licensePlate,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Profile Saved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/driver-dashboard");
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={4}>Complete Driver Profile</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone</FormLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Vehicle Info</FormLabel>
          <Input
            value={vehicleInfo}
            onChange={(e) => setVehicleInfo(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>License Plate</FormLabel>
          <Input
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="brand"
          onClick={handleSubmit}
          isLoading={loading}
          loadingText="Saving..."
        >
          Save & Continue
        </Button>
      </VStack>
    </Box>
  );
};

export default DriverDetails;
