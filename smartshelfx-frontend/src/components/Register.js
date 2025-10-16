import React, { useState } from "react";
import API from "../api";
import "../css/Auth.css";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STORE_MANAGER",
    contactNumber: "",
    warehouseLocation: "",
    termsAccepted: false,
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!validateEmail(form.email)) {
      setMessage("Invalid email format!");
      return;
    }

    if (!validatePassword(form.password)) {
      setMessage(
        "Password must be minimum 8 characters, with uppercase, lowercase, number, and special character"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!form.termsAccepted) {
      setMessage("You must accept the Terms and Conditions!");
      return;
    }

    try {
      const res = await API.post("/register", form);
      setMessage("");
      setSuccess(true);
      setForm({
        fullName: "",
        companyName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STORE_MANAGER",
        contactNumber: "",
        warehouseLocation: "",
        termsAccepted: false,
      });
    } catch (err) {
      setMessage("Registration failed! " + (err.response?.data || ""));
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Official Email ID"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="ADMIN">Admin</option>
          <option value="STORE_MANAGER">Store Manager</option>
        </select>
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
          required
        />
        <input
          name="warehouseLocation"
          placeholder="Warehouse Location"
          value={form.warehouseLocation}
          onChange={handleChange}
          required
        />
        <div>
          <input
            type="checkbox"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange} required
          />{" "}
          I accept the Terms and Conditions
        </div>
        <button type="submit">Register</button>
      </form>

      {message && <p className="error">{message}</p>}
      {success && <p className="success">Registration Successful!</p>}
    </div>
  );
}

export default Register;
