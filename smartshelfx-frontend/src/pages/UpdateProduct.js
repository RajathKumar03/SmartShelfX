import { useState } from "react";
import { ProductAPI } from "../api";
import "../css/Inventory.css";

function UpdateProduct() {
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "",
    details: "",
    quantity: "",
    price: "",
    reorderThreshold: "",
    imageBase64: "", // will hold data URL
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // file -> base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageBase64: reader.result }));
    };
    reader.readAsDataURL(file); // result like "data:image/png;base64,iVBORw0..."
  };

  const handleLoad = async () => {
    if (!id) return alert("Enter product ID to load");
    try {
      const res = await ProductAPI.get(`/${id}`);
      const p = res.data;
      setForm({
        name: p.name || "",
        details: p.details || "",
        quantity: p.quantity || "",
        price: p.price || "",
        reorderThreshold: p.reorderThreshold || "",
        imageBase64: p.imageData ? `data:image/*;base64,${btoa(
          String.fromCharCode(...new Uint8Array(p.imageData || []))
        )}` : "", // NOTE: backend must send imageData as bytes — sometimes JSON won't include raw bytes; better to fetch image separately
      });
    } catch (err) {
      console.error(err);
      alert("Error loading product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return alert("Enter product ID to update");

    const payload = {
      name: form.name,
      details: form.details,
      quantity: Number(form.quantity),
      price: Number(form.price),
      reorderThreshold: form.reorderThreshold ? Number(form.reorderThreshold) : null,
      imageBase64: form.imageBase64 || null,
    };

    try {
      const res = await ProductAPI.put(`/${id}`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Updated:", res.data);
      alert("Product updated successfully ✏️");
    } catch (err) {
      console.error("❌ Error updating product", err);
      alert("Error updating product");
    }
  };

  return (
    <div className="form-container">
      <h2>Update Product</h2>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <input placeholder="Product ID" value={id} onChange={(e) => setId(e.target.value)} />
        <button onClick={handleLoad} style={{ marginLeft: 8 }}>Load</button>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
        <input name="details" placeholder="Product Details" value={form.details} onChange={handleChange} />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="reorderThreshold" type="number" placeholder="Reorder Threshold" value={form.reorderThreshold} onChange={handleChange} />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {form.imageBase64 && (
          <img src={form.imageBase64} alt="preview" style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />
        )}

        <button type="submit" className="btn-primary">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateProduct;
