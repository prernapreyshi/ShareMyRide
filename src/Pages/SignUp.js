import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import { addDriver, addRider } from '../firebase/firestoreUtils';
import '../styles/Login.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    aadharNumber: '',
    role: 'rider',
    vehicleType: '',
    vehicleNumber: '',
    vehicleModel: '',
    capacity: '',
    pickupLocation: '',
    destination: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, phoneNumber, aadharNumber, role } = formData;

    // ✅ Validation
    if (!name || !email || !password || !phoneNumber || !aadharNumber) {
      alert('Please fill in all required fields.');
      return;
    }

    if (role === 'driver') {
      const { vehicleType, vehicleNumber, vehicleModel, capacity, pickupLocation, destination } = formData;
      if (!vehicleType || !vehicleNumber || !vehicleModel || !capacity || !pickupLocation || !destination) {
        alert('Please fill in all driver-specific fields.');
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userData = {
        uid,
        name,
        email,
        phoneNumber,
        aadharNumber,
        role,
        createdAt: new Date()
      };

      if (role === 'driver') {
        // ✅ Driver-specific data
        const driverData = {
          ...userData,
          vehicleType: formData.vehicleType,
          vehicleNumber: formData.vehicleNumber,
          vehicleModel: formData.vehicleModel,
          capacity: parseInt(formData.capacity),
          pickupLocation: formData.pickupLocation,
          destination: formData.destination
        };
        await addDriver(driverData);
      } else {
        await addRider(userData);
      }

      alert('✅ Sign up successful!');
      console.log('User registered:', userData);
    } catch (error) {
      console.error('Signup error:', error);
      alert(`❌ ${error.message}`);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // ✅ Store user info after Google sign-up
      const userData = {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        aadharNumber: '',
        role: 'rider',
        createdAt: new Date()
      };

      await addRider(userData);
      alert('✅ Google Sign-Up Successful!');
      console.log('Google user registered:', userData);
    } catch (error) {
      console.error('Google Signup error:', error);
      alert(`❌ ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="login-form">

        {/* Full Name */}
        <input
          type="text"
          name="name"
          className="input-field"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        {/* Phone Number */}
        <input
          type="tel"
          name="phoneNumber"
          className="input-field"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />

        {/* Aadhar Number */}
        <input
          type="text"
          name="aadharNumber"
          className="input-field"
          value={formData.aadharNumber}
          onChange={handleChange}
          placeholder="Aadhar Number"
          required
        />

        {/* Role Selection */}
        <select
          name="role"
          className="input-field"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
        </select>

        {/* Driver Fields */}
        {formData.role === 'driver' && (
          <>
            <input
              type="text"
              name="vehicleType"
              className="input-field"
              value={formData.vehicleType}
              onChange={handleChange}
              placeholder="Vehicle Type"
              required
            />
            <input
              type="text"
              name="vehicleNumber"
              className="input-field"
              value={formData.vehicleNumber}
              onChange={handleChange}
              placeholder="Vehicle Number"
              required
            />
            <input
              type="text"
              name="vehicleModel"
              className="input-field"
              value={formData.vehicleModel}
              onChange={handleChange}
              placeholder="Vehicle Model"
              required
            />
            <input
              type="number"
              name="capacity"
              className="input-field"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Capacity"
              required
            />
            <input
              type="text"
              name="pickupLocation"
              className="input-field"
              value={formData.pickupLocation}
              onChange={handleChange}
              placeholder="Pickup Location"
              required
            />
            <input
              type="text"
              name="destination"
              className="input-field"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Destination"
              required
            />
          </>
        )}

        {/* Submit Button */}
        <button type="submit" className="login-btn">
          Sign Up
        </button>

        {/* Google Signup */}
        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignup}
        >
          Sign up with Google
        </button>
      </form>
    </div>
  );
};

export default SignUp;
