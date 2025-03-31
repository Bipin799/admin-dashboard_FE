
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";


const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedData, setEditedData] = useState({ title: "", description: "", price: "" });
  const navigate = useNavigate();
  
 //const PRODUCT_API_URL = process.env.REACT_APP_PRODUCT_API_URL;

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const username = storedUser?.email || "Customer";

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    toast.error("Product deleted successfully!");
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditedData({ title: product.title, description: product.description, price: product.price });
  };

  const handleUpdateProduct = () => {
    setProducts(
      products.map((product) =>
        product.id === editingProduct.id ? { ...product, ...editedData } : product
      )
    );
    toast.success("Product updated successfully!");
    setEditingProduct(null);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container">
          <a className="navbar-brand" href="#banner">Dashboard</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => document.getElementById("banner").scrollIntoView({ behavior: "smooth" })}>Banner</button></li>
              <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>Products</button></li>
              <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>About Us</button></li>
              <li className="nav-item"><button className="btn btn-link nav-link" onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>Contact Us</button></li>
              <li className="nav-item"><button className="btn btn-danger" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Banner Section */}
      <div id="banner" className="banner-section text-center p-5 bg-dark text-white mt-5">
        <h2>Welcome, {username}!</h2>
        <p>Your one-stop shop for the best products.</p>
      </div>

      {/* Products Section */}
      <div id="products" className="container mt-5">
        <h3 className="text-center mb-4">Product Listing</h3>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-4">
              <div className="card mb-4 shadow-sm">
                <img src={product.thumbnail} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text"><strong>Price: </strong>${product.price}</p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/product/${product.id}`} className="btn btn-primary">View Details</Link>
                    <button className="btn btn-warning" onClick={() => handleEditClick(product)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <div className="modal fade show d-block" style={{ background: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button className="btn-close" onClick={() => setEditingProduct(null)}></button>
              </div>
              <div className="modal-body">
                <label>Title:</label>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editedData.title}
                  onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                />
                <label>Description:</label>
                <textarea
                  className="form-control mb-2"
                  value={editedData.description}
                  onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                ></textarea>
                <label>Price:</label>
                <input
                  type="number"
                  className="form-control mb-2"
                  value={editedData.price}
                  onChange={(e) => setEditedData({ ...editedData, price: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleUpdateProduct}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Us Section */}
      <div id="about" className="about-section p-5 bg-light">
        <h3 className="text-center mb-4">About Us</h3>
        <p className="text-center">
          We are a passionate eCommerce company committed to providing high-quality products for our customers. Our mission is to offer the best shopping experience with reliable customer service and a wide selection of products.
        </p>
      </div>

      {/* Contact Us Section */}
      <div id="contact" className="contact-section p-5 bg-info text-white">
        <h3 className="text-center mb-4">Contact Us</h3>
        <p className="text-center">Have any questions? Reach out to us via email or through our support portal.</p>
        <div className="text-center">
          <p>Email: support@ecommerce.com</p>
          <p>Phone: 1-800-123-4567</p>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer text-center p-3 bg-secondary text-white">
        <p>&copy; 2025 eCommerce Inc. All rights reserved.</p>
      </footer>

      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
    </div>
  );
};
export default CustomerDashboard;