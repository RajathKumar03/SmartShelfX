import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Edit, Trash2, Image } from "lucide-react";
import { ShoppingCart, Info, DollarSign, Box, Repeat } from 'lucide-react';
import AppHeader from "../components/AppHeader";

import "../css/LandingPage.css";

function LandingPage() {
  const [form, setForm] = useState({
    name: "",
    details: "",
    price: "",
    quantity: "",
    reorderThreshold: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all products for logged-in user
  const fetchProducts = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/products/user/${user.id}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else setPreview(null);
  };

  // Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user.id) {
      setMessage("⚠️ User not found. Please log in again.");
      return;
    }

    try {
      if (editingId) {
        // ✅ UPDATE PRODUCT (send JSON)
        const updateData = {
          name: form.name,
          details: form.details,
          price: form.price,
          quantity: form.quantity,
          reorderThreshold: form.reorderThreshold,
          userId: user.id,
        };

        await axios.put(
          `http://localhost:8080/api/products/${editingId}`,
          updateData
        );

        // If user selected a new image, upload it separately
        if (image) {
          const imageData = new FormData();
          imageData.append("image", image);
          await axios.put(
            `http://localhost:8080/api/products/${editingId}/image`,
            imageData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        }

        setMessage("✅ Product updated successfully!");
      } else {
        // ✅ ADD PRODUCT (multipart/form-data)
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("details", form.details);
        formData.append("price", form.price);
        formData.append("quantity", form.quantity);
        formData.append("reorderThreshold", form.reorderThreshold);
        formData.append("userId", user.id);
        if (image) formData.append("image", image);

        await axios.post("http://localhost:8080/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage("✅ Product added successfully!");
      }

      setForm({
        name: "",
        details: "",
        price: "",
        quantity: "",
        reorderThreshold: "",
      });
      setImage(null);
      setPreview(null);
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("❌ Error adding/updating product! Please try again.");
    }
  };


  // Load product data into form
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      details: product.details,
      price: product.price,
      quantity: product.quantity,
      reorderThreshold: product.reorderThreshold,
    });
    setEditingId(product.id);
    setPreview(`http://localhost:8080/api/products/${product.id}/image`);
  };

  // Delete product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        setMessage("🗑️ Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("❌ Error deleting product:", err);
        setMessage("❌ Error deleting product!");
      }
    }
  };

  return (
    <div>
      <AppHeader />
      <div className="inventory-container">
        <h2 className="title"><ShoppingCart size={32} /> Product Inventory Dashboard</h2>

        {/* Add / Update Form */}
        <form onSubmit={handleSubmit} className="form-card" encType="multipart/form-data">
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
            placeholder="Price (₹)"
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

          <label className="file-upload">
            <Image size={16} style={{ marginRight: 6 }} />
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {preview && (
            <div className="preview">
              <img src={preview} alt="Preview" />
            </div>
          )}

          <button type="submit" className="submit-btn">
            <PlusCircle size={18} style={{ marginRight: 6 }} />
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        {/* Product List */}
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="product-card" key={p.id}>
                {p.imageData ? (
                  <img
                    src={`http://localhost:8080/api/products/${p.id}/image`}
                    alt={p.name}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                <h3>
                  {p.name}
                </h3>
                <p>
                  <Info size={16} /> {p.details}
                </p>
                <p>
                  <DollarSign size={16} /> ₹{p.price}
                </p>
                <p>
                  <Box size={16} /> Qty: {p.quantity}
                </p>
                <p>
                  <Repeat size={16} /> Reorder: {p.reorderThreshold}
                </p>
                <div className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(p)}>
                    <Edit size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-products">No products added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
