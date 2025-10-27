import { useState } from "react";
import axios from "axios";
import "../css/Inventory.css";

function DeleteProduct() {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    if (!id) return alert("Please enter a Product ID!");
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      alert("🗑️ Product deleted successfully!");
      setId("");
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting product");
    }
  };

  return (
    <div className="form-container">
      <h2>Delete Product</h2>
      <div className="form-card">
        <input placeholder="Product ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
}

export default DeleteProduct;
