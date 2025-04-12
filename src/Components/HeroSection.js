// src/components/HeroSection.js
import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";


const HeroSection = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      py={{ base: 16, md: 24 }}
      px={{ base: 6, md: 12 }}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        align="center"
        spacing={{ base: 12, md: 16 }}
      >
        {/* Left Text Section */}
        <Box flex="1" textAlign={{ base: "center", md: "left" }}>
          <Heading
            size="2xl"
            mb={4}
            color="brand.400"
            fontWeight="bold"
            lineHeight="1.2"
          >
            Share Your Ride, <br /> Share the Joy
          </Heading>
          <Text fontSize="xl" mb={6} color="gray.600">
            Find trusted rides or share yours — safe, easy, and affordable.
          </Text>
          <Button
            size="lg"
            bg="brand.400"
            color="white"
            _hover={{ bg: "brand.300" }}
          >
            Get Started
          </Button>
        </Box>

        {/* Right Image Section */}
        <Box flex="1">
          <Image
            src="./assets/carRide.svg"
            alt="Hero Illustration"
            objectFit="cover"
            maxH={{ base: "300px", md: "400px" }}
            mx="auto"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default HeroSection;
