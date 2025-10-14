import React, { useState } from "react";
import API from "../api";
import "../css/Auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");


    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setMessage(res.data || "Registered successfully!");
      // clear form on success
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setMessage("Registration failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email ID"
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
        <button type="submit">Register</button>
      </form>
      <p className="msg">{message}</p>
    </div>
  );
}

export default Register;
