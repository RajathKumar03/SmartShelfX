const axios = require("axios");
const FormData = require("form-data"); // Needed for multipart

async function testProductAPI() {
  try {
    const formData = new FormData();
    formData.append("name", "Test Product");
    formData.append("details", "Sample details");
    formData.append("price", 100);
    formData.append("quantity", 10);
    formData.append("reorderThreshold", 5);
    formData.append("userId", 1);

    const res = await axios.post("http://localhost:8080/api/products", formData, {
      headers: formData.getHeaders(),
    });

    console.log("✅ Product added successfully:", res.data);
  } catch (err) {
    console.error("❌ Error adding product:", err.message);
    if (err.response) console.error("Response:", err.response.data);
  }
}

testProductAPI();
