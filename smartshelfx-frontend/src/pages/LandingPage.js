import { useNavigate } from "react-router-dom";
import { PlusCircle, ClipboardList, Pencil, Trash2 } from "lucide-react";
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
            <PlusCircle size={20} style={{ marginRight: "8px" }} />
            Add Product
          </button>

          <button className="btn-secondary" onClick={() => navigate("/get")}>
            <ClipboardList size={20} style={{ marginRight: "8px" }} />
            View Products
          </button>

          <button className="btn-warning" onClick={() => navigate("/update")}>
            <Pencil size={20} style={{ marginRight: "8px" }} />
            Update Product
          </button>

          <button className="btn-danger" onClick={() => navigate("/delete")}>
            <Trash2 size={20} style={{ marginRight: "8px" }} />
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
