// src/Pages/RiderDetails.js
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

const RiderDetails = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "riders", user.uid), {
        name,
        phone,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Profile Saved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/rider-dashboard");
    } catch (error) {
      toast({
        title: "Error saving profile",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Heading mb={4}>Complete Rider Profile</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Phone</FormLabel>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormControl>
        <Button colorScheme="brand" onClick={handleSubmit}>
          Save & Continue
        </Button>
      </VStack>
    </Box>
  );
};

export default RiderDetails;
