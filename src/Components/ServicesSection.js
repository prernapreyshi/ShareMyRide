import React from "react";
import { Box, Heading, Text, SimpleGrid, Image, VStack } from "@chakra-ui/react";

const services = [
  {
    name: "Car",
    image: require("../assets/carRide.svg").default,
    description: "Comfortable and affordable cars from local hosts.",
  },
  {
    name: "Bike ",
    image: require("../assets/motorBike.svg").default,
    description: "Quick and eco-friendly motorbike rides.",
  },
  {
    name: "City ",
    image: require("../assets/city.svg").default,
    description: "Share vehicles for city tours and pickups.",
  },
  {
    name: "Map Based Booking",
    image: require("../assets/phone.svg").default,
    description: "Easily book rides using location map detection.",
  },
  {
    name: "SMS Based Booking",
    image: require("../assets/SMS.svg").default,
    description: " SMS-based ride booking (Offline Mode)  .",
  },
  {
    name: " Emergency Button",
    image: require("../assets/womensafety.svg").default,
    description: " Allows a rider to press an in-app button in emergencies. .",
  },
  
];

const ServicesSection = () => {
  return (
    <Box py={20} px={{ base: 6, md: 20 }} bg="gray.50">
      <Heading textAlign="center" mb={10}>
        Our Services
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={10}>
        {services.map((service, index) => (
          <VStack
            key={index}
            bg="white"
            boxShadow="md"
            borderRadius="lg"
            p={6}
            spacing={4}
            textAlign="center"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            transition="all 0.3s"
          >
            <Image src={service.image} alt={service.name} boxSize="100px" />
            <Heading size="md">{service.name}</Heading>
            <Text fontSize="sm">{service.description}</Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ServicesSection;
 