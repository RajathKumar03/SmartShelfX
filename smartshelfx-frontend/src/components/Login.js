import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STORE_MANAGER", // default role
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await AuthAPI.post("/login", form); // use AuthAPI
      localStorage.setItem("user", JSON.stringify(res.data)); // store user info

      setMessage("Login successful!");
      setForm({ email: "", password: "", role: "STORE_MANAGER" });

      // Navigate based on role
      if (res.data.role === "ADMIN") navigate("/landing"); // admin
      else if (res.data.role === "STORE_MANAGER") navigate("/landing"); // store manager
      else navigate("/"); // fallback user

    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setMessage("Role mismatch! Please select the correct role.");
      } else if (err.response && err.response.data) {
        setMessage(err.response.data);
      } else {
        setMessage("Invalid credentials!");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="STORE_MANAGER">Store Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit">Login</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Login;
