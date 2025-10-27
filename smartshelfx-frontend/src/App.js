import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./pages/LandingPage";
import AddProduct from "./pages/AddProduct";
import GetProducts from "./pages/GetProducts";
import UpdateProduct from "./pages/UpdateProduct";
import DeleteProduct from "./pages/DeleteProduct";

// Navbar component
function AuthNavbar() {
  return (
    <nav className="nav">
      <Link to="/">Login</Link>
      <Link to="/register">Sign Up</Link>
    </nav>
  );
}

function AppWrapper() {
  const location = useLocation();
  const showNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {showNavbar && <AuthNavbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/get" element={<GetProducts />} />
        <Route path="/update" element={<UpdateProduct />} />
        <Route path="/delete" element={<DeleteProduct />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
