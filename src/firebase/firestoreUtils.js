import { 
  doc, setDoc, collection, addDoc, getDocs, getDoc, query, where, updateDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ✅ Add Driver Data (with pickup and destination)
export const addDriver = async (driverData) => {
  if (!driverData.uid || !driverData.pickupLocation || !driverData.destination) {
    console.error("❌ Invalid driver data");
    return;
  }
  try {
    const driverRef = doc(db, "drivers", driverData.uid);
    await setDoc(driverRef, {
      ...driverData,
      available: true, // Default to available
      createdAt: serverTimestamp()
    });
    console.log("✅ Driver added successfully:", driverData);
  } catch (error) {
    console.error("❌ Error adding driver:", error.message);
  }
};

// ✅ Add Rider Data
export const addRider = async (riderData) => {
  if (!riderData.uid || !riderData.email) {
    console.error("❌ Invalid rider data");
    return;
  }
  try {
    const riderRef = doc(db, "riders", riderData.uid);
    await setDoc(riderRef, {
      ...riderData,
      createdAt: serverTimestamp()
    });
    console.log("✅ Rider added successfully:", riderData);
  } catch (error) {
    console.error("❌ Error adding rider:", error.message);
  }
};

// ✅ Add Ride Request
export const addRide = async (rideData) => {
  if (!rideData.fromLocation || !rideData.toLocation || !rideData.riderId) {
    console.error("❌ Missing ride data");
    return;
  }
  try {
    const rideRef = await addDoc(collection(db, "rides"), {
      ...rideData,
      status: "pending", // New ride starts as pending
      createdAt: serverTimestamp()
    });
    console.log("✅ Ride request added successfully:", rideRef.id);
  } catch (error) {
    console.error("❌ Error adding ride:", error.message);
  }
};

// ✅ Fetch Available Drivers based on location (with partial match)
export const getAvailableDrivers = async (fromLocation, toLocation) => {
  try {
    const driversRef = collection(db, "drivers");
    
    const q = query(
      driversRef,
      where("pickupLocation", "==", fromLocation),
      where("destination", "==", toLocation),
      where("available", "==", true) // Only available drivers
    );

    const querySnapshot = await getDocs(q);
    const availableDrivers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("✅ Available drivers:", availableDrivers);
    return availableDrivers;
  } catch (error) {
    console.error("❌ Error fetching available drivers:", error.message);
    return [];
  }
};

// ✅ Get Rider Details (for matching or future use)
export const getRiderDetails = async (uid) => {
  if (!uid) {
    console.error("❌ Invalid rider ID");
    return null;
  }
  try {
    const riderRef = doc(db, "riders", uid);
    const riderSnap = await getDoc(riderRef);
    if (riderSnap.exists()) {
      console.log("✅ Rider details:", riderSnap.data());
      return riderSnap.data();
    } else {
      console.log("❌ No rider found with ID:", uid);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching rider details:", error.message);
    return null;
  }
};

// ✅ Get Driver Details (for future matching)
export const getDriverDetails = async (uid) => {
  if (!uid) {
    console.error("❌ Invalid driver ID");
    return null;
  }
  try {
    const driverRef = doc(db, "drivers", uid);
    const driverSnap = await getDoc(driverRef);
    if (driverSnap.exists()) {
      console.log("✅ Driver details:", driverSnap.data());
      return driverSnap.data();
    } else {
      console.log("❌ No driver found with ID:", uid);
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching driver details:", error.message);
    return null;
  }
};

// ✅ Fetch All Rides (for admin or reporting)
export const getAllRides = async () => {
  try {
    const ridesRef = collection(db, "rides");
    const querySnapshot = await getDocs(ridesRef);
    const allRides = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("✅ All rides fetched:", allRides);
    return allRides;
  } catch (error) {
    console.error("❌ Error fetching rides:", error.message);
    return [];
  }
};

// ✅ Update Ride Status
export const updateRideStatus = async (rideId, status) => {
  if (!rideId || !status) {
    console.error("❌ Invalid ride update data");
    return;
  }
  try {
    const rideRef = doc(db, "rides", rideId);
    await updateDoc(rideRef, {
      status,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Ride status updated to "${status}"`);
  } catch (error) {
    console.error("❌ Error updating ride status:", error.message);
  }
};

// ✅ Toggle Driver Availability
export const toggleDriverAvailability = async (uid, available) => {
  if (!uid) {
    console.error("❌ Invalid driver ID");
    return;
  }
  try {
    const driverRef = doc(db, "drivers", uid);
    await updateDoc(driverRef, {
      available,
      updatedAt: serverTimestamp()
    });
    console.log(`✅ Driver availability set to "${available}"`);
  } catch (error) {
    console.error("❌ Error updating driver availability:", error.message);
  }
};
