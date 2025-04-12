import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, googleProvider } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Attempting login with:", email, password);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role;

        if (!role) {
          navigate("/select-role");
        } else {
          navigate(role === "driver" ? "/driver-dashboard" : "/rider-dashboard");
        }
      } else {
        navigate("/select-role");
      }
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      toast({
        title: "Login Failed",
        description: getFriendlyError(err.code),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role;

        if (!role) {
          navigate("/select-role");
        } else {
          navigate(role === "driver" ? "/driver-dashboard" : "/rider-dashboard");
        }
      } else {
        navigate("/select-role");
      }
    } catch (err) {
      console.error("Google Sign-In error:", err.code, err.message);
      toast({
        title: "Google Sign-In Failed",
        description: getFriendlyError(err.code),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/invalid-credential":
        return "Incorrect credentials or unregistered account.";
      case "auth/popup-closed-by-user":
        return "Google sign-in was canceled.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={20}
      p={8}
      bg={useColorModeValue("white", "gray.700")}
      borderRadius="2xl"
      boxShadow="2xl"
    >
      <Heading mb={6} textAlign="center" color="brand.400">
        Sign In
      </Heading>

      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>

        <Button
          colorScheme="brand"
          width="full"
          onClick={handleLogin}
          isDisabled={!email || !password}
        >
          Sign In
        </Button>

        <Text fontSize="sm" textAlign="center" mt={2}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#ce63ff" }}>
            Sign Up
          </Link>
        </Text>

        <Text mt={4} fontSize="sm" color="gray.500">
          OR
        </Text>

        <Button
          width="full"
          onClick={handleGoogleLogin}
          bg="red.500"
          color="white"
          _hover={{ bg: "red.600" }}
        >
          Continue with Google
        </Button>
      </VStack>
    </Box>
  );
};

export default Login;
