import React from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";


const SelectRole = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bg = useColorModeValue("gray.50", "gray.800");

  const handleRoleSelection = async (role) => {
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in before selecting a role.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const existing = await getDoc(userRef);

      if (existing.exists()) {
        const userData = existing.data();
        if (userData.role) {
          toast({
            title: "Role already selected",
            description: `You are already registered as a ${userData.role}.`,
            status: "info",
            duration: 3000,
            isClosable: true,
          });

          navigate(userData.role === "driver" ? "/driver-dashboard" : "/rider-dashboard");
          return;
        }

        // Update role if it hasn't been set
        await updateDoc(userRef, {
          role,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Edge case: doc doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          role,
          createdAt: serverTimestamp(),
        });
      }

      toast({
        title: "Role selected!",
        description: `You are now registered as a ${role}.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(role === "rider" ? "/rider-details" : "/driver-details");
    } catch (error) {
      toast({
        title: "Error saving role",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={bg}
      px={6}
    >
      <Box textAlign="center" p={10} borderRadius="xl" bg="white" boxShadow="lg">
        <Heading mb={4}>Choose Your Role</Heading>
        <Text fontSize="lg" mb={8}>
          Select whether you want to ride or drive
        </Text>
        <Stack direction={{ base: "column", md: "row" }} spacing={6} justify="center">
          <Button
            colorScheme="teal"
            size="lg"
            onClick={() => handleRoleSelection("rider")}
          >
            I'm a Rider
          </Button>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => handleRoleSelection("driver")}
          >
            I'm a Driver
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default SelectRole;
