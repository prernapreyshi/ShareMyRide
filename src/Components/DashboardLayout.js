import React from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Button,
  Avatar,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useUser } from "../context/UserContext"; // ✅ Correct hook
import { useNavigate } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  const { user, logoutUser } = useUser(); // ✅ Fixed hook usage
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <Flex height="100vh">
      {/* Side Nav */}
      <VStack
        bg={useColorModeValue("gray.100", "gray.800")}
        p={5}
        spacing={6}
        w="250px"
        align="stretch"
        boxShadow="md"
      >
        <HStack spacing={4}>
          <Avatar name={user?.displayName || "User"} />
          <Box>
            <Text fontWeight="bold">{user?.displayName || "User"}</Text>
            <Text fontSize="sm" color="gray.500">
              {user?.email}
            </Text>
          </Box>
        </HStack>

        <Button colorScheme="red" variant="solid" onClick={handleLogout}>
          Logout
        </Button>
      </VStack>

      {/* Main Content Area */}
      <Box flex="1" overflowY="auto">
        {/* Top Navbar */}
        <Flex
          as="header"
          bg="brand.400"
          color="white"
          p={4}
          justifyContent="space-between"
          alignItems="center"
          boxShadow="sm"
        >
          <Text fontSize="xl" fontWeight="bold">
            ShareMyRide Dashboard
          </Text>
        </Flex>

        {/* Main Page Content */}
        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
