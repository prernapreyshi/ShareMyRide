import React from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

const ShowMyRidePage = () => {
  return (
    <Box
      bg={useColorModeValue("gray.50")}
      minH="100vh"
      py={20}
      px={{ base: 6, md: 20 }}
    >
      <Heading textAlign="center" mb={10} color="gray.800">
        Show My Ride
      </Heading>

      <Box
        maxW="3xl"
        mx="auto"
        bg="white"
        p={{ base: 8, md: 12 }}
        borderRadius="xl"
        boxShadow="2xl"
      >
        <Stack spacing={8}>
          <Input
            placeholder="From"
            size="lg"
            bg="gray.50"
            _focus={{ borderColor: "teal.500" }}
          />
          <Input
            placeholder="To"
            size="lg"
            bg="gray.50"
            _focus={{ borderColor: "teal.500" }}
          />
          <Input
            type="date"
            size="lg"
            bg="gray.50"
            _focus={{ borderColor: "teal.500" }}
          />
          <Button
            colorScheme="teal"
            size="lg"
            px={10}
            fontWeight="bold"
            alignSelf="flex-start"
          >
            Search
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ShowMyRidePage;
