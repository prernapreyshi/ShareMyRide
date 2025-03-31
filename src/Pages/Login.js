import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { addRider } from "../firebase/firestoreUtils";
import "../styles/Login.css";
import { useUser } from "../context/UserContext"; // 👈 Import context

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { loginUser } = useUser(); // 👈 Access loginUser function from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Email & Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      alert("⚠️ Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ Login Successful:", user);

      // 👇 Update Context
      loginUser({
        name: user.displayName || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
      });

      alert("✅ Login Successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Login Error:", error);
      alert(`❌ ${error.message}`);
    }

    setLoading(false);
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Store in Firestore
      const userData = {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        aadharNumber: "",
        role: "rider",
        createdAt: new Date(),
      };

      await addRider(userData);

      // 👇 Update Context
      loginUser({
        name: user.displayName || "",
        email: user.email,
        phoneNumber: user.phoneNumber || "",
      });

      console.log("✅ Google Login Successful:", user);
      alert("✅ Google Sign-In Successful!");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Google Sign-In Error:", error);
      alert(`❌ ${error.message}`);
    }
    setGoogleLoading(false);
  };

  return (
    <div className="login-container">
      <h2 className="login-title"> Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          placeholder="📧 Enter Email"
          required
        />
        <input
          type="password"
          name="password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          placeholder="🔒 Enter Password"
          required
        />
        <button
          type="submit"
          className="login-btn"
          disabled={loading}
          style={{
            backgroundColor: loading ? "#5a6268" : "#007bff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            backgroundColor: googleLoading ? "#5a6268" : "#ea4335",
            cursor: googleLoading ? "not-allowed" : "pointer",
          }}
        >
          {googleLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Signing in...
            </>
          ) : (
            "Sign in with Google"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;
