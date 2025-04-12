// src/components/Navbar.js
import React from "react";
import {
  Box,
  Flex,
  HStack,
  Button,
  Text,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg={useColorModeValue("white", "gray.900")} px={6} py={4} shadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Left side with logo and nav links */}
        <HStack spacing={10}>
          <Text fontWeight="bold" fontSize="xl" color="brand.400">
            ShareMyRide
          </Text>
          <HStack spacing={6} fontWeight="medium">
            <ChakraLink href="#services" _hover={{ textDecoration: "underline" }}>
              Services
            </ChakraLink>
            <ChakraLink href="#about" _hover={{ textDecoration: "underline" }}>
              About Us
            </ChakraLink>
            <ChakraLink href="#contact" _hover={{ textDecoration: "underline" }}>
              Contact Us
            </ChakraLink>
          </HStack>
        </HStack>

        {/* Right side with login and get started */}
        <HStack spacing={4}>
          <Link to="/login">
            <Button colorScheme="brand">Login</Button>
          </Link>
          <Link to="/select-role">
            <Button colorScheme="brand">Get Started</Button>
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
