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
import { motion } from "framer-motion";

// Motion components
const MotionBox = motion(Box);
const MotionButton = motion(Button);

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
    <MotionBox
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Heading mb={4}>Complete Rider Profile</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
            transition="all 0.2s ease-in-out"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Phone</FormLabel>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9F7AEA" }}
            transition="all 0.2s ease-in-out"
          />
        </FormControl>
        <MotionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          colorScheme="purple"
          onClick={handleSubmit}
          width="100%"
        >
          Save & Continue
        </MotionButton>
      </VStack>
    </MotionBox>
  );
};

export default RiderDetails;
