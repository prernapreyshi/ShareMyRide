// src/components/StaticMap.js
import React from "react";
import { Image, Box } from "@chakra-ui/react";

const StaticMap = ({ pickupCoords, dropoffCoords }) => {
  const apiKey = "pk.02a082d9834c35563c931be2cf773633"; // Replace with your actual API key

  if (!pickupCoords || !dropoffCoords) return null;

  const { lat: pickupLat, lon: pickupLon } = pickupCoords;
  const { lat: dropLat, lon: dropLon } = dropoffCoords;

  const mapUrl = `https://maps.locationiq.com/v3/staticmap?key=${apiKey}&size=600x300&zoom=12&format=png
    &markers=icon:large-red-cutout|${pickupLat},${pickupLon}
    &markers=icon:large-blue-cutout|${dropLat},${dropLon}
    &path=weight:3|color:0x9b59b6|${pickupLat},${pickupLon}|${dropLat},${dropLon}`.replace(/\s+/g, "");

  return (
    <Box mt={3}>
      <Image src={mapUrl} alt="Route map preview" borderRadius="md" />
    </Box>
  );
};

export default StaticMap;
