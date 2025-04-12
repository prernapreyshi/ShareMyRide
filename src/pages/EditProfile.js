// src/Pages/EditProfile.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EditProfile = () => {
  const { user, role } = useUser(); // from context
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicleInfo: "",
    licensePlate: "",
  });

  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const ref = doc(db, role === "driver" ? "drivers" : "riders", auth.currentUser.uid);
      const docSnap = await getDoc(ref);
      if (docSnap.exists()) {
        setFormData({ ...formData, ...docSnap.data() });
      }
    } catch (err) {
      toast({
        title: "Error loading profile",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.currentUser && role) {
      fetchProfile();
    }
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, role === "driver" ? "drivers" : "riders", auth.currentUser.uid);
      await updateDoc(ref, formData);
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
      });
      navigate(role === "driver" ? "/driver-dashboard" : "/rider-dashboard");
    } catch (err) {
      toast({
        title: "Update failed",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxW="xl" mx="auto" mt={10} p={6} boxShadow="md" borderRadius="md">
      <Heading mb={6} textAlign="center">Edit Profile</Heading>
      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input name="name" value={formData.name} onChange={handleChange} />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Phone</FormLabel>
        <Input name="phone" value={formData.phone} onChange={handleChange} />
      </FormControl>

      {role === "driver" && (
        <>
          <FormControl mb={4}>
            <FormLabel>Vehicle Info</FormLabel>
            <Input name="vehicleInfo" value={formData.vehicleInfo} onChange={handleChange} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>License Plate</FormLabel>
            <Input name="licensePlate" value={formData.licensePlate} onChange={handleChange} />
          </FormControl>
        </>
      )}

      <Button colorScheme="brand" onClick={handleSave} width="full" mt={4}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditProfile;
