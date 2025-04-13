import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  VStack,
  List,
  ListItem,
} from "@chakra-ui/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";

const LOCATIONIQ_API_KEY = "pk.02a082d9834c35563c931be2cf773633";

// Motion-enhanced components
const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionList = motion(List);

const LocationInput = ({ label, value, setValue, onSelect }) => {
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = async (e) => {
    const input = e.target.value;
    setValue(input);

    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get("https://api.locationiq.com/v1/autocomplete", {
        params: {
          key: LOCATIONIQ_API_KEY,
          q: input,
          format: "json",
          limit: 5,
        },
      });
      setSuggestions(res.data);
    } catch (error) {
      console.error("Autocomplete error:", error);
    }
  };

  const handleSelect = (place) => {
    setValue(place.display_name);
    onSelect({ name: place.display_name, lat: place.lat, lon: place.lon });
    setSuggestions([]);
  };

  return (
    <FormControl isRequired>
      <FormLabel>{label}</FormLabel>
      <Box position="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          autoComplete="off"
          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
        />
        {suggestions.length > 0 && (
          <MotionList
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            bg="white"
            border="1px solid #ccc"
            position="absolute"
            width="100%"
            zIndex="10"
            mt={1}
            borderRadius="md"
            shadow="md"
            maxH="200px"
            overflowY="auto"
          >
            {suggestions.map((place) => (
              <ListItem
                key={place.place_id}
                p={2}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleSelect(place)}
              >
                {place.display_name}
              </ListItem>
            ))}
          </MotionList>
        )}
      </Box>
    </FormControl>
  );
};

const RideRequestForm = () => {
  const { user } = useUser();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Not logged in",
        description: "You need to be logged in to request a ride.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!pickupCoords || !dropoffCoords) {
      toast({
        title: "Location missing",
        description: "Please select a location from the suggestions.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      await addDoc(collection(db, "rideRequests"), {
        pickupLocation,
        dropoffLocation,
        pickupCoords,
        dropoffCoords,
        date,
        time,
        status: "pending",
        riderId: user.uid,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Ride requested!",
        status: "success",
        duration: 3000,
      });

      // Clear form
      setPickupLocation("");
      setDropoffLocation("");
      setPickupCoords(null);
      setDropoffCoords(null);
      setDate("");
      setTime("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to request ride.",
        status: "error",
        duration: 3000,
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
      borderRadius="md"
      boxShadow="lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Heading mb={6} textAlign="center">
        Request a Ride
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <LocationInput
            label="Pickup Location"
            value={pickupLocation}
            setValue={setPickupLocation}
            onSelect={setPickupCoords}
          />
          <LocationInput
            label="Dropoff Location"
            value={dropoffLocation}
            setValue={setDropoffLocation}
            onSelect={setDropoffCoords}
          />
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Time</FormLabel>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormControl>

          <MotionButton
            type="submit"
            colorScheme="blue"
            width="full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Request
          </MotionButton>
        </VStack>
      </form>
    </MotionBox>
  );
};

export default RideRequestForm;
