import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteField,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// ✅ Create Ride Request
export const createRideRequest = async (from, to, riderId) => {
  try {
    await addDoc(collection(db, "rideRequests"), {
      from,
      to,
      destination: `${from} to ${to}`,
      riderId,
      status: "pending",
      createdAt: new Date(),
    });
    console.log("🚀 Ride request created successfully");
  } catch (error) {
    console.error("🔥 Error creating ride request:", error);
    throw new Error(error.message);
  }
};

// ✅ Fetch Ride Requests with Real-Time Updates using onSnapshot
export const fetchRideRequests = (status = "all", riderId = null, callback) => {
  try {
    let q = collection(db, "rideRequests");

    if (status !== "all") {
      q = query(q, where("status", "==", status));
    }

    if (riderId) {
      q = query(q, where("riderId", "==", riderId));
    }

    // ✅ Real-time updates using onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(requests);
    });

    // ✅ Return unsubscribe function to clean up the listener
    return unsubscribe;
  } catch (error) {
    console.error("🔥 Error fetching ride requests:", error);
    return () => {};
  }
};

// ✅ Assign Driver to Ride Request
export const assignDriver = async (requestId, driverId) => {
  try {
    await updateDoc(doc(db, "rideRequests", requestId), {
      driverId,
      status: "assigned",
    });
    console.log("✅ Driver assigned successfully");
  } catch (error) {
    console.error("🔥 Error assigning driver:", error);
    throw new Error("Failed to assign driver");
  }
};

// ✅ Reject Ride Request
export const rejectRide = async (requestId) => {
  try {
    await updateDoc(doc(db, "rideRequests", requestId), {
      status: "rejected",
    });
    console.log("❌ Ride rejected successfully");
  } catch (error) {
    console.error("🔥 Error rejecting ride:", error);
    throw new Error("Failed to reject ride");
  }
};

// ✅ Update Firestore Structure
export const updateFirestoreStructure = async () => {
  try {
    const q = collection(db, "rideRequests");
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      snapshot.docs.forEach(async (docSnapshot) => {
        const data = docSnapshot.data();

        if (!data.destination && data.from && data.to) {
          await updateDoc(doc(db, "rideRequests", docSnapshot.id), {
            destination: `${data.from.trim()} to ${data.to.trim()}`,
            from: deleteField(),
            to: deleteField(),
          });
        }
      });
    });

    console.log("✅ Firestore structure updated");
    return unsubscribe;
  } catch (error) {
    console.error("🔥 Error updating Firestore structure:", error);
    throw new Error("Failed to update Firestore structure");
  }
};
