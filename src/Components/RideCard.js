// src/Components/RideCard.js
import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const RideCard = ({ ride }) => {
  const navigate = useNavigate();
  const cardBg = useColorModeValue("white", "gray.700");

  const { pickupLocation, dropoffLocation, date, time, status, pickupCoords, dropoffCoords } = ride;

  const hasValidCoords =
    pickupCoords?.lat &&
    pickupCoords?.lon &&
    dropoffCoords?.lat &&
    dropoffCoords?.lon;

  const mapUrl = hasValidCoords
    ? `https://maps.locationiq.com/v3/staticmap?key=pk.02a082d9834c35563c931be2cf773633&center=${pickupCoords.lat},${pickupCoords.lon}&zoom=13&size=600x300&markers=icon:large-red-cutout|${pickupCoords.lat},${pickupCoords.lon}|icon:large-blue-cutout|${dropoffCoords.lat},${dropoffCoords.lon}&path=color:0x6600ff|weight:3|${pickupCoords.lat},${pickupCoords.lon}|${dropoffCoords.lat},${dropoffCoords.lon}`
    : null;

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg={cardBg}
      mb={4}
    >
      <Heading fontSize="xl" mb={2}>
        {pickupLocation} → {dropoffLocation}
      </Heading>

      <VStack align="start" spacing={1} mb={4}>
        <Text>Date: {date}</Text>
        <Text>Time: {time}</Text>
        <Text>Status: {status}</Text>
      </VStack>

      {mapUrl ? (
        <Image
          src={mapUrl}
          alt="Ride map preview"
          borderRadius="md"
          mb={4}
        />
      ) : (
        <Text fontSize="sm" color="gray.500" mb={4}>
          Map preview not available.
        </Text>
      )}

      <Flex justify="flex-end">
        <Button
          colorScheme="brand"
          onClick={() => navigate(`/ride-details/${ride.id}`)}
        >
          View Details
        </Button>
      </Flex>
    </Box>
  );
};

export default RideCard;
