import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  Icon,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaLeaf, FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const About = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");

  const coreValues = [
    {
      icon: FaLock,
      title: "Safety First",
      description:
        "Ensuring a secure and trusted carpooling experience for everyone.",
      color: "brand.400",
    },
    {
      icon: FaLeaf,
      title: "Sustainability",
      description: "Promoting an eco-friendly and shared commuting culture.",
      color: "green.400",
    },
    {
      icon: FaCarSide,
      title: "Convenience",
      description: "Making travel more accessible and hassle-free.",
      color: "teal.400",
    },
  ];

  return (
    <Box bg={bgColor} px={{ base: 6, md: 10 }} py={10}>
      {/* Hero Section */}
      <Box textAlign="center" mb={10}>
        <Heading fontSize="4xl" mb={4}>
          About Us
        </Heading>
        <Text fontSize="lg" maxW="3xl" mx="auto" color="gray.600">
          Making daily commuting easier, affordable, and eco-friendly by
          connecting passengers with drivers heading in the same direction.
        </Text>
      </Box>

      {/* Mission Section */}
      <Box textAlign="center" mb={10}>
        <Heading fontSize="2xl" mb={2}>
          Our Mission
        </Heading>
        <Text fontSize="md" maxW="3xl" mx="auto" color="gray.600">
          To provide a cost-effective, sustainable, and safe ride-sharing
          experience for daily commuters.
        </Text>
      </Box>

      {/* Vision Section */}
      <Box textAlign="center" mb={10}>
        <Heading fontSize="2xl" mb={2}>
          Our Vision
        </Heading>
        <Text fontSize="md" maxW="3xl" mx="auto" color="gray.600">
          Creating a connected world where ride-sharing reduces traffic and
          carbon emissions while fostering community connections.
        </Text>
      </Box>

      {/* Core Values */}
      <Box textAlign="center" mb={16}>
        <Heading fontSize="2xl" mb={6}>
          Our Core Values
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          {coreValues.map((item, idx) => (
            <MotionBox
              key={idx}
              p={6}
              bg={cardBg}
              borderRadius="xl"
              shadow="md"
              whileHover={{ y: -5, boxShadow: "lg" }}
              transition={{ duration: 0.3 }}
            >
              <Icon as={item.icon} boxSize={10} color={item.color} mb={4} />
              <Heading fontSize="lg" mb={2}>
                {item.title}
              </Heading>
              <Text color="gray.600">{item.description}</Text>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Box>

      {/* Call to Action */}
      <VStack spacing={4} textAlign="center">
        <Heading fontSize="2xl">Ready to Start Your Ride?</Heading>
        <Text fontSize="md" color="gray.600">
          Join our growing community of eco-friendly commuters.
        </Text>
        <Button
          size="lg"
          colorScheme="brand"
          px={8}
          onClick={() => navigate("/select-role")}
        >
          Get Started
        </Button>
      </VStack>
    </Box>
  );
};

export default About;
