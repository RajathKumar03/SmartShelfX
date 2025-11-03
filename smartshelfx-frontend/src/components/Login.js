import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";
import { Mail, Lock, UserCircle, LogIn } from "lucide-react"; 
import Swal from "sweetalert2"; 
import "../css/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "STORE_MANAGER",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await AuthAPI.post("/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));

      Swal.fire({
        title: `Welcome`,
        text: "You have successfully logged in.",
        icon: "success",
        background: "#f8f9ff", 
        color: "#1f1f1f",
        confirmButtonColor: "#007bff",
        confirmButtonText: "Continue",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      setForm({ email: "", password: "", role: "STORE_MANAGER" });
      setMessage("Login successful!");

      if (res.data.role === "ADMIN") navigate("/admin-dashboard");
      else if (res.data.role === "STORE_MANAGER") navigate("/landing");
      else navigate("/user-dashboard");

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
      <h2>
        {/* <LogIn size={30} style={{ marginRight: "8px", verticalAlign: "middle" }} />  */}
        Login
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <Mail size={35} color="#30465eff" />
          <input
            name="email"
            placeholder="Email ID"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <Lock size={35} color="#30465eff" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <UserCircle size={35} color="#30465eff" />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="STORE_MANAGER">Store Manager</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="login-btn">
          <LogIn size={18} style={{ marginRight: "6px" }} /> Login
        </button>
      </form>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Login;
