import { useNavigate } from "react-router-dom";
import "../css/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1>SmartShelfX Inventory System</h1>
        <p className="subtitle">
          Manage, forecast, and restock your products intelligently with AI-driven insights.
        </p>

        <div className="button-group">
          <button className="btn-primary" onClick={() => navigate("/add")}>
            ➕ Add Product
          </button>
          <button className="btn-secondary" onClick={() => navigate("/get")}>
            📋 View Products
          </button>
          <button className="btn-warning" onClick={() => navigate("/update")}>
            ✏️ Update Product
          </button>
          <button className="btn-danger" onClick={() => navigate("/delete")}>
            🗑️ Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
