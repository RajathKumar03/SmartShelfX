import React, { useState } from "react";
import API from "../api";
import "../css/Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      setMessage(res.data);
      // you can later redirect to dashboard here
    } catch (err) {
      setMessage("Login failed!");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email ID" onChange={handleChange} required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p className="msg">{message}</p>
    </div>
  );
}

export default Login;
