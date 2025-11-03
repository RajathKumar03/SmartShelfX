import React, { useEffect, useState } from "react";
import { ProductAPI } from "../api";
import { PlusCircle, Edit, Trash2, RefreshCw } from "lucide-react";
import "./landing.css";

function Landing() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    details: "",
    quantity: "",
    price: "",
    reorderThreshold: "",
    imageBase64: "",
  });

  // fetch all products
  const fetchProducts = async () => {
    try {
      const res = await ProductAPI.get("/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // handle input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, imageBase64: reader.result }));
    reader.readAsDataURL(file);
  };

  // Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      details: form.details,
      quantity: Number(form.quantity),
      price: Number(form.price),
      reorderThreshold: form.reorderThreshold ? Number(form.reorderThreshold) : null,
      imageBase64: form.imageBase64 || null,
    };

    try {
      if (editingId) {
        await ProductAPI.put(`/${editingId}`, payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Product updated successfully ✏️");
      } else {
        await ProductAPI.post("/", payload, {
          headers: { "Content-Type": "application/json" },
        });
        alert("Product added successfully ✅");
      }

      setForm({
        name: "",
        details: "",
        quantity: "",
        price: "",
        reorderThreshold: "",
        imageBase64: "",
      });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Error saving product", err);
      alert("Error saving product!");
    }
  };

  // Edit button → loads product into form
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      details: product.details,
      quantity: product.quantity,
      price: product.price,
      reorderThreshold: product.reorderThreshold,
      imageBase64: product.imageData
        ? `data:image/*;base64,${btoa(
            String.fromCharCode(...new Uint8Array(product.imageData || []))
          )}`
        : "",
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await ProductAPI.delete(`/${id}`);
      alert("Product deleted successfully 🗑️");
      fetchProducts();
    } catch (err) {
      console.error("❌ Error deleting product", err);
      alert("Error deleting product!");
    }
  };

  return (
    <div className="landing-container">
      <h2>Product Management</h2>

      <form onSubmit={handleSubmit} className="form-card">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="details"
          placeholder="Product Details"
          value={form.details}
          onChange={handleChange}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="reorderThreshold"
          type="number"
          placeholder="Reorder Threshold"
          value={form.reorderThreshold}
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {form.imageBase64 && (
          <img
            src={form.imageBase64}
            alt="preview"
            style={{
              width: 100,
              height: 100,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}

        <button type="submit" className="btn-primary">
          {editingId ? (
            <>
              <Edit size={16} /> Update Product
            </>
          ) : (
            <>
              <PlusCircle size={16} /> Add Product
            </>
          )}
        </button>
      </form>

      <div className="product-list">
        <h3>All Products</h3>
        <button className="refresh-btn" onClick={fetchProducts}>
          <RefreshCw size={16} /> Refresh
        </button>

        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {p.imageData && (
                <img
                  src={`data:image/*;base64,${btoa(
                    String.fromCharCode(...new Uint8Array(p.imageData || []))
                  )}`}
                  alt={p.name}
                />
              )}
              <h4>{p.name}</h4>
              <p>{p.details}</p>
              <p>Qty: {p.quantity}</p>
              <p>Price: ₹{p.price}</p>

              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
