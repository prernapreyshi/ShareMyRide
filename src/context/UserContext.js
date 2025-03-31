import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Current User:", currentUser); // ✅ Debugging
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || "",
          email: currentUser.email,
          phoneNumber: currentUser.phoneNumber || "",
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  

  // ✅ Add the login function
  const loginUser = async (email, password) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setLoading(false);
    } catch (error) {
      console.error("Login Error:", error);
      setLoading(false);
      alert("❌ Login failed: " + error.message);
    }
  };

  // Logout function
  const logoutUser = async () => {
    try {
      await signOut(auth);
      setUser(null);
      alert("🚪 Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
      alert("❌ Logout failed.");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loginUser, logoutUser, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUser = () => useContext(UserContext);
