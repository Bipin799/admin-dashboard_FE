import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from "react";
import Stack from '@mui/material/Stack';
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {ToastContainer, toast } from "react-toastify";
import axios from "axios";

const AddEditProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const result = await response.json();
      setProducts(result);
    } catch (error) {
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: null
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("category", formData.category);
  
    // Append image only if it's a File (new upload)
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }
  
    try {
      let response;
  
      if (currentProduct) {
        // For update — you must configure this in backend to accept FormData in PUT
        response = await fetch(`http://localhost:5000/api/products/${currentProduct.id}`, {
          method: "PUT", // or use POST for update too if PUT is not configured
          body: formDataToSend
        });
      } else {
        // Create product
        response = await fetch("http://localhost:5000/api/products", {
          method: "POST",
          body: formDataToSend
        });
      }  

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      fetchProducts(); // Refresh the list
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    //if (!window.confirm('Are you sure you want to delete this product?')) return;
    toast.success("product deleted successfully")
    setIsProcessing(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts(); // Refresh the list
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Products</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Product
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : (
          <>
            <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 4 }}>
              {products.map((product) => (
                <Card key={product.id}
                  sx={{
                    width: 300,
                    textAlign: 'center',
                    objectFit: "contain",
                    p: 1
                  }}>
                  <CardMedia
                    component="img"
                    height="160"
                    //image={product.image}
                    image={
                      product.image?.startsWith("http")
                        ? product.image
                        : `http://localhost:5000/uploads/${product.image}`
                    }
                    alt={product.title}
                    sx={{ objectFit: "contain", p: 1 }}
                  />
                  <CardContent>
                    <Typography variant="body1" fontWeight="bold">{product.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>Price: ₹{product.price}</Typography>
                    <Typography variant="body2" color="text.secondary">Category: {product.category}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
                      <IconButton color="primary" onClick={() => handleOpenDialog(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(product.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </Box>

      {/* Add/Edit Product Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Product Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="price"
              label="Price"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              name="category"
              label="Category"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.category}
              onChange={handleInputChange}
              required
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">Product Image</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.image && !(formData.image instanceof File) && (
                <Box sx={{ mt: 1 }}>
                  {/* <img 
                    src={formData.image} 
                    alt="Current product" 
                    style={{ maxWidth: '100px', maxHeight: '100px' }} 
                  /> */}
                  <img 
                    src={`http://localhost:5000/uploads/${formData.image}`} 
                    alt="Current product" 
                    style={{ maxWidth: '100px', maxHeight: '100px' }} 
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ToastContainer/>
    </React.Fragment>
  );
};

export default AddEditProduct;