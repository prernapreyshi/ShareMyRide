import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import RiderDashboard from './RiderDashboard';
import DriverDashboard from './DriverDashboard';
import RideRequests from "../Components/RideRequests"; // ✅ Ensure it's imported
import '../styles/Dashboard.css';

function Dashboard() {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("Logged-in user UID:", user.uid);

          // Check in "drivers" collection
          const driverDoc = await getDoc(doc(db, 'drivers', user.uid));
          if (driverDoc.exists()) {
            console.log("User found in 'drivers' collection:", driverDoc.data());
            setUserType('driver');
          } else {
            // Check in "riders" collection
            const riderDoc = await getDoc(doc(db, 'riders', user.uid));
            if (riderDoc.exists()) {
              console.log("User found in 'riders' collection:", riderDoc.data());
              setUserType('rider');
            } else {
              console.log("User document not found in Firestore!");
              setUserType('unknown');
            }
          }
        } else {
          console.log("No authenticated user found.");
          setUserType('unknown');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        setUserType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>

      {loading ? (
        <p className="text-center text-muted">Loading user data...</p>
      ) : userType === 'rider' ? (
        <RiderDashboard />
      ) : userType === 'driver' ? (
        <>
          <DriverDashboard />
          <RideRequests showAssignButton={true} /> {/* ✅ Show Ride Requests for drivers */}
        </>
      ) : (
        <p className="text-danger text-center">User data not found.</p>
      )}
    </div>
  );
}

export default Dashboard;
