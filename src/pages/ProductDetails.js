
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (!storedUser) {
        // ❌ Redirect to unauthorized page if user is not logged in
        navigate("/unauthorized");
        return;
    }

    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product details:", error));
  }, [id, storedUser, navigate]);

  if (!storedUser) return null; // Prevent rendering if user is not logged in

  if (!product) return <p className="text-center">Loading product details...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>⬅ Go Back</button>
      <div className="card p-4 shadow">
        <img src={product.thumbnail} className="card-img-top" alt={product.title} />
        <div className="card-body">
          <h3 className="card-title">{product.title}</h3>
          <p className="card-text">{product.description}</p>
          <p className="card-text"><strong>Price:</strong> ${product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
