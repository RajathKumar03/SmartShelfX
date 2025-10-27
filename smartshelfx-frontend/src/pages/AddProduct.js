import React, { useState } from "react";
import axios from "axios";
import "../css/Inventory.css";
import "../css/AddProduct.css";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    details: "",
    price: "",
    quantity: "",
    reorderThreshold: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user.id) {
      setMessage("⚠️ User not found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("details", form.details);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("reorderThreshold", form.reorderThreshold);
    formData.append("userId", user.id);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/products",
          formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      if (response.status === 200 || response.status === 201) {
        setMessage("✅ Product added successfully!");
        setForm({
          name: "",
          details: "",
          price: "",
          quantity: "",
          reorderThreshold: "",
        });
        setImage(null);
        setPreview(null);
      } else {
        setMessage("⚠️ Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ Error adding product! Please try again.");
    }
  };

  return (
    <div className="add-product form-container">
      <h2>Add New Product</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-card">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="details"
          placeholder="Product Details"
          value={form.details}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="reorderThreshold"
          placeholder="Reorder Threshold"
          value={form.reorderThreshold}
          onChange={handleChange}
          required
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <div className="image-preview">
            <p>📷 Image Preview:</p>
            <img src={preview} alt="Preview" style={{ width: "150px", borderRadius: "8px" }} />
          </div>
        )}

        <button type="submit">Add Product</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AddProduct;
