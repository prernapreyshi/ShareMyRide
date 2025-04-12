// src/components/RideSearchForm.js
import React from "react";
import {
  Box,
  Stack,
  Input,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const RideSearchForm = () => {
  return (
    <Box p={6} bg="white" shadow="base" rounded="md" maxW="lg" mx="auto" mt={10}>
      <form>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>From</FormLabel>
            <Input placeholder="Start location" />
          </FormControl>
          <FormControl>
            <FormLabel>To</FormLabel>
            <Input placeholder="Destination" />
          </FormControl>
          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input type="date" />
          </FormControl>
          <Button type="submit" colorScheme="brand" size="md">
            Search Ride
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RideSearchForm;
