import { db } from "../firebase/firebaseConfig"; // ✅ Ensure correct Firebase import
import { collection, getDocs, query, where } from "firebase/firestore";

export const fetchRideRequests = async (status = null, riderId = null) => {
  try {
    const rideRequestsRef = collection(db, "rideRequests");

    // ✅ Apply filters dynamically
    let rideQuery = rideRequestsRef;
    const queryConstraints = [];

    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    if (riderId) {
      queryConstraints.push(where("riderId", "==", riderId));
    }

    if (queryConstraints.length > 0) {
      rideQuery = query(rideRequestsRef, ...queryConstraints);
    }

    // ✅ Fetch ride requests from Firestore
    const querySnapshot = await getDocs(rideQuery);
    const rideRequests = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("📌 Fetched Ride Requests:", rideRequests);
    return rideRequests;
  } catch (error) {
    console.error("🔥 Error fetching ride requests:", error.message);
    return [];
  }
};
