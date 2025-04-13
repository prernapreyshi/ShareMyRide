import React, { useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";

import HeroImage from "../assets/homeTheme.svg";
import FooterSection from "./FooterSection";
import ServicesSection from "../Components/ServicesSection";
import ShowMyRidePage from "../Components/ShowMyRidePage";
import About from "./About";

const Home = () => {
  const showRideRef = useRef(null);

  const scrollToRideSection = () => {
    showRideRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box bg="gray.50">
      {/* ✅ Hero Section */}
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 6, md: 10 }}
        py={20}
        direction={{ base: "column", md: "row" }}
      >
        <Box maxW="lg" textAlign={{ base: "center", md: "left" }}>
          <Heading size="2xl" mb={4}>
            Make Awesome Travel Easy & Affordable
          </Heading>
          <Text fontSize="lg" mb={6}>
            Share rides to move from local hosts across the country.
          </Text>
          <Button colorScheme="teal" size="lg" onClick={scrollToRideSection}>
            Get Started
          </Button>
        </Box>
        <Image
          src={HeroImage}
          alt="Travel Illustration"
          maxW="500px"
          mt={{ base: 10, md: 0 }}
        />
      </Flex>

      {/* ✅ Show My Ride Section */}
      <Box ref={showRideRef}>
        <ShowMyRidePage />
      </Box>

      {/* ✅ Services Section */}
      <Box id="services" py={20} px={{ base: 6, md: 10 }}>
        <ServicesSection />
      </Box>

      {/* ✅ About Us Section */}
      <Box id="about" py={20} px={{ base: 6, md: 10 }}>
        <About />
      </Box>

      {/* ✅ Footer as Contact Section */}
      <Box id="contact">
        <FooterSection />
      </Box>
    </Box>
  );
};

export default Home;
