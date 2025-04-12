import React, { useState, useEffect } from "react";
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
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();

  // ✅ Setup reCAPTCHA (only in production)
  const setUpRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
        },
        auth
      );
      window.recaptchaVerifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    }
  };

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      return toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      let appVerifier;

      if (window.location.hostname === "localhost") {
        auth.settings.appVerificationDisabledForTesting = true;
        console.log("🧪 Test mode: Using mock reCAPTCHA");

        // ✅ Mock RecaptchaVerifier with required methods
        class MockRecaptchaVerifier {
          type = "recaptcha";
          verify() {
            return Promise.resolve("test-verification-code");
          }
          render() {
            return Promise.resolve(0);
          }
          clear() {}
          _reset() {}
        }

        appVerifier = new MockRecaptchaVerifier();
      } else {
        setUpRecaptcha();
        appVerifier = window.recaptchaVerifier;
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);

      toast({
        title: "OTP Sent",
        description: "Please check your phone.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("OTP sending error:", error);
      toast({
        title: "OTP Failed",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const verifyOtpAndSignup = async () => {
    if (!confirmationResult || !otp) {
      return toast({
        title: "OTP Missing",
        description: "Please enter the OTP.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    try {
      await confirmationResult.confirm(otp);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        phone,
        createdAt: new Date(),
        role: null,
      });

      toast({
        title: "Signup Successful",
        description: "Please choose your role next.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/select-role");
    } catch (err) {
      console.error("Signup error:", err);
      toast({
        title: "Verification Failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear?.();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

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
        Create Account
      </Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Mobile Number</FormLabel>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91XXXXXXXXXX"
          />
        </FormControl>

        {confirmationResult && (
          <FormControl isRequired>
            <FormLabel>Enter OTP</FormLabel>
            <Input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
          </FormControl>
        )}

        {!confirmationResult ? (
          <Button colorScheme="blue" width="full" onClick={sendOtp} isDisabled={!phone}>
            Send OTP
          </Button>
        ) : (
          <Button
            colorScheme="green"
            width="full"
            onClick={verifyOtpAndSignup}
            isDisabled={!otp || !email || !password}
          >
            Verify OTP & Sign Up
          </Button>
        )}

        <Text fontSize="sm" textAlign="center" mt={2}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#ce63ff" }}>
            Sign In
          </Link>
        </Text>
      </VStack>

      <div id="recaptcha-container"></div>
    </Box>
  );
};

export default Signup;
