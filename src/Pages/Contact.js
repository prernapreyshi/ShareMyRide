import React, { useState } from "react";
import { db } from "../firebase/firebaseConfig"; // Firestore instance
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Email & Mobile Validation
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile); // Indian mobile format

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validation
    if (!isValidEmail(formData.email)) {
      setErrorMessage("❌ Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (!isValidMobile(formData.mobile)) {
      setErrorMessage("❌ Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "contactQueries"), {
        ...formData,
        timestamp: serverTimestamp(),
      });

      setSuccessMessage("✅ Your query has been submitted successfully!");
      setFormData({ name: "", email: "", mobile: "", role: "", comment: "" });

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("❌ Failed to submit query. Please try again.");
      console.error("Error saving contact form data:", error);
    }

    setLoading(false);
  };

  return (
    <div className="container-fluid contact-page-container">
      <div className="contact-container">
        <div className="card shadow-lg p-4 border-0">
          <h2 className="text-center fw-bold">📍 You Can Find Us Here</h2>
          <p className="text-center text-muted">Find help for your queries here:</p>

          {/* Success & Error Messages */}
          {successMessage && (
            <div className="alert alert-success text-center">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger text-center">{errorMessage}</div>
          )}

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label fw-bold">Name *</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                className="form-control"
                placeholder="Enter your 10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">You are a *</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">- Select -</option>
                <option value="Rider">Rider</option>
                <option value="Driver">Driver</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Comment *</label>
              <textarea
                name="comment"
                className="form-control"
                placeholder="Enter your message"
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className={`btn btn-primary btn-lg ${loading ? "disabled" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  "📨 Submit"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
