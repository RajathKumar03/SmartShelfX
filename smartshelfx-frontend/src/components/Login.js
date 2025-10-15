import React, { useState } from "react";
import API from "../api";
import "../css/Auth.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "USER", 
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await API.post("/login", form);

      localStorage.setItem("user", JSON.stringify(res.data));

      setMessage("Login successful!");
      setForm({ email: "", password: "", role: "USER" });

      // if (res.data.role === "ADMIN") navigate("/admin-dashboard");
      // else if (res.data.role === "STAFF") navigate("/staff-dashboard");
      // else navigate("/user-dashboard");

    } catch (err) {
      if (err.response && err.response.status === 403) {
        setMessage("Role mismatch! Please select the correct role.");
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

        <select name="role" onChange={handleChange} value={form.role}>
          <option value="USER">User</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>
      <p className="msg">{message}</p>
    </div>
  );
}

export default Login;
