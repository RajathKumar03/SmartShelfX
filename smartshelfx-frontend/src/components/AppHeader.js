import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/AppHeader.css";

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default AppHeader;
