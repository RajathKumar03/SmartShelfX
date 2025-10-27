import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Inventory.css";

function GetProducts() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/products/user/${userId}`)
      .then((res) => {
        console.log("✅ Products fetched:", res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        alert("❌ Error fetching products");
      });
  }, [userId]);

  if (!userId) return <p>User not logged in</p>;

  return (
    <div className="table-container">
      <h2>Product List 📦</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price (₹)</th>
            <th>Reorder Threshold</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.imageData ? (
                    <img
                      src={`http://localhost:8080/api/products/${p.id}/image`}
                      alt={p.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
                <td>{p.reorderThreshold}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GetProducts;
