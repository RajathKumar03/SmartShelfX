import axios from "axios";

// Product API
export const ProductAPI = axios.create({
  baseURL: "http://localhost:8080/api/products",
  withCredentials: true, 
});

// Auth API
export const AuthAPI = axios.create({
  baseURL: "http://localhost:8080/api/users",
  withCredentials: true,
});

export default AuthAPI;
