import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Three-dot icon
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
   MenuItem, 
   ListItemText, 
   ListItemIcon,
   IconButton,
   Menu,
   Divider,
   Button,
   Card, 
   CardContent, 
   CardMedia,
   Radio,
   RadioGroup,
   FormControlLabel,
   TextField,
   FormControl,
   InputLabel,
   Select,
   Switch,
  } from '@mui/material'; // Correct imports

// Sidebar navigation configuration
const NAVIGATION = [
  { kind: 'header', title: 'Main items' },
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'orders', title: 'Orders', icon: <ShoppingCartIcon /> },
  { segment: 'settings', title: 'Settings', icon: <SettingsIcon /> },
  { segment: 'profile', title: 'Profile', icon: <AccountCircleIcon /> },
];

// Theme setup
const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536,
    },
  },
});

// Page content rendering based on active section (pathname)
function DemoPageContent({ pathname}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({});
  const [showPayment, setShowPayment] = useState(false); // Toggle Payment View
  const [paymentMethod, setPaymentMethod] = useState(""); // Selected Payment Mode
  const [isEditing, setIsEditing] = useState(false); // Toggle Edit Mode
  const [profile, setProfile] = useState({
    firstName: "John",
    middleName: "",
    lastName: "Doe",
    fatherName: "Robert Doe",
    phoneNumber: "9876543210",
    gender: "Male",
    homeAddress: "123, Main Street, City",
    officeAddress: "456, Business Park, City",
    pincode: "110001",
    email: "johndoe@example.com",
    dob: "1990-01-01",
  });
  const [settings, setSettings] = useState({
    username: "johndoe",
    email: "johndoe@example.com",
    password: "",
    notifications: {
      email: true,
      sms: false,
    },
    theme: "light",
    privacy: "public",
  });


  const handleToggle = (type) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] },
    }));
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  // Save Changes
  const handleSave = () => {
    setIsEditing(false);
    alert("data Updated Successfully!");
  };

  useEffect(() => {
    // Only fetch data for /dashboard route
    if (pathname === '/dashboard') {
      fetchProducts();
    }
  }, [pathname]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data from your local JSON Server API
      const response = await fetch('http://localhost:5000/api/products');
      const result = await response.json();
      setProducts(result); // Set the fetched data into state
    } catch (error) {
      setError('Error fetching products.');
    } finally {
      setLoading(false);
    }
  };
  
    // Increment product quantity
    const handleIncrement = (id,product) => {
      setCart((prev) => ({ ...prev, [id]: 
        {
          ...product,
          quantity: (prev[id]?.quantity || 0) + 1,
        },
      }));
    };

   // Remove product from cart
  const handleDecrement = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev; // If product not in cart, return as is
      const updatedQuantity = prev[id].quantity - 1;
      if (updatedQuantity <= 0) {
        const newCart = { ...prev };
        delete newCart[id]; // Remove item if quantity is zero
        return newCart;
      }
      return {
        ...prev,
        [id]: { ...prev[id], quantity: updatedQuantity },
      };
    });
  };
      // Calculate total price of items in the cart
  const totalPrice = Object.values(cart).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ); 
    // Handle Buy Now Click → Show Payment Options
    const handleBuyNow = () => {
      setShowPayment(true);
    };
  
    // Handle Payment Success → Reset Cart & Show Success Message
    const handlePayment = () => {
      //alert(`Payment successful via ${paymentMethod}`);
      toast.success(`Payment successful via ${paymentMethod}`);
      setCart({}); // Clear cart after payment
      setShowPayment(false); // Go back to order summary
    };


  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5">Dashboard content for {pathname}</Typography>

      {/* Content for /dashboard */}
      {pathname === '/dashboard' && (
        <Box sx={{ mt: 4 }}>
          {loading ? (
            <Typography variant="body1">Loading...</Typography>
          ) : error ? (
            <Typography variant="body1" color="error">{error}</Typography>
          ) : (
            <>
              {/* Display the product list */}
              <Stack direction="row" gap={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 4 }}>
                {products.map((product) => (
                  <Card key={product.id} 
                  sx={{ 
                    width:300,
                    textAlign: 'center',
                    objectFit: "contain",
                    p: 1 
                     }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={product.image}
                      alt={product.title}
                      sx={{ objectFit: "contain", p: 1 }}
                    />
                    <CardContent>
                      <Typography variant="body">{product.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 2 }}>Price: ₹{product.price}</Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        Rating: {product.rating.rate} ({product.rating.count} reviews)
                      </Typography> */}
                    </CardContent>

                     {/* Add to Cart Section */}
                     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 2 }}>
                      <IconButton color="primary" onClick={() => handleDecrement(product.id)} disabled={!cart[product.id]}>
                        <RemoveIcon />
                      </IconButton>
                      <Typography variant="body1">{cart[product.id]?.quantity || 0}</Typography>
                      <IconButton color="primary" onClick={() => handleIncrement(product.id,product)}>
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <Button variant="contained" color="primary" onClick={() => handleIncrement(product.id,product)}>
                      Add to Cart
                    </Button>

                  </Card>
                ))}
              </Stack>
            </>
          )}
        </Box>
      )}
    
   
      {pathname === '/orders' && ( 
       <Box sx={{ mt: 4, width: "80%", textAlign: "left", mx: "auto" }}>
       <Typography variant="h5" sx={{ mb: 2 }}>Your Orders</Typography>

       {showPayment ? (
         <Box sx={{ mt: 4, textAlign: "center", p: 3, bgcolor: "#f9f9f9", borderRadius: 2 }}>
           <Typography variant="h6" sx={{ mb: 2 }}>Select a Payment Method</Typography>
 
           <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
             <FormControlLabel value="Credit Card" control={<Radio />} label="Credit Card" />
             <FormControlLabel value="Debit Card" control={<Radio />} label="Debit Card" />
             <FormControlLabel value="UPI" control={<Radio />} label="UPI (Google Pay, PhonePe, Paytm)" />
             <FormControlLabel value="Net Banking" control={<Radio />} label="Net Banking" />
             <FormControlLabel value="Cash on Delivery" control={<Radio />} label="Cash on Delivery" />
           </RadioGroup>
 
        
           <Button variant="contained" color="primary" sx={{ mt: 3 }} disabled={!paymentMethod} onClick={handlePayment}>
             Proceed to Pay
           </Button>
 
    
           <Button variant="text" sx={{ mt: 2 }} onClick={() => setShowPayment(false)}>
             Cancel Payment
           </Button>
         </Box>
       ) : (
         <>
       
           {Object.keys(cart).length > 0 ? (
             <>
               {Object.values(cart).map((item) => (
                 <Box key={item.id} sx={{ display: "flex", alignItems: "center", p: 2, bgcolor: "#f1f1f1", borderRadius: 2, mb: 2 }}>
                   <CardMedia component="img" image={item.image} alt={item.title} sx={{ width: 80, height: 80, objectFit: "contain", mr: 2 }} />
                   <Box sx={{ flexGrow: 1 }}>
                     <Typography variant="h6">{item.title}</Typography>
                     <Typography variant="body2">Price: ₹{item.price} x {item.quantity}</Typography>
                   </Box>
                   <Typography variant="body1" sx={{ fontWeight: "bold" }}>₹{(item.price * item.quantity).toFixed(2)}</Typography>
                 </Box>
               ))}
 
               {/* Total Price and Buy Now Button */}
               <Box sx={{ mt: 3, textAlign: "center" }}>
                 <Typography variant="h6">Total Price: ₹{totalPrice.toFixed(2)}</Typography>
                 <Button variant="contained" color="success" sx={{ mt: 2 }} onClick={handleBuyNow}>
                   Buy Now
                 </Button>
               </Box>
             </>
           ) : (
             <Typography variant="body1" color="text.secondary">No items in the order.</Typography>
           )}
         </>
         
       )}
         <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
       </Box>
      )}


  {pathname === "/settings" && (
        <Box
          sx={{
            maxWidth: 600,
            mx: "auto",
            mt: 4,
            p: 3,
            bgcolor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3 }}>
            Settings
          </Typography>

          {/* Username */}
          <TextField
            label="Username"
            name="username"
            value={settings.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Email */}
          <TextField
            label="Email"
            name="email"
            value={settings.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Password */}
          <TextField
            label="New Password"
            name="password"
            type="password"
            value={settings.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Notifications */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Notification Preferences
          </Typography>
          <FormControlLabel
            control={<Switch checked={settings.notifications.email} onChange={() => handleToggle("email")} />}
            label="Receive Email Notifications"
          />
          <FormControlLabel
            control={<Switch checked={settings.notifications.sms} onChange={() => handleToggle("sms")} />}
            label="Receive SMS Notifications"
          />

          {/* Theme Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Theme</InputLabel>
            <Select name="theme" value={settings.theme} onChange={handleChange}>
              <MenuItem value="light">Light Mode</MenuItem>
              <MenuItem value="dark">Dark Mode</MenuItem>
            </Select>
          </FormControl>

          {/* Privacy Settings */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Privacy Settings</InputLabel>
            <Select name="privacy" value={settings.privacy} onChange={handleChange}>
              <MenuItem value="public">Public Profile</MenuItem>
              <MenuItem value="private">Private Profile</MenuItem>
            </Select>
          </FormControl>

          {/* Save Button */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Box>
        </Box>
      )}

{pathname === "/profile" && (
<Box
  sx={{
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
    gap: 2,
  }}
>
  <TextField label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Middle Name" name="middleName" value={profile.middleName} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Father's Name" name="fatherName" value={profile.fatherName} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Phone Number" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Email" name="email" value={profile.email} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Date of Birth" type="date" name="dob" value={profile.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} disabled={!isEditing} />
  <FormControl fullWidth disabled={!isEditing}>
    <InputLabel>Gender</InputLabel>
    <Select name="gender" value={profile.gender} onChange={handleChange}>
      <MenuItem value="Male">Male</MenuItem>
      <MenuItem value="Female">Female</MenuItem>
      <MenuItem value="Other">Other</MenuItem>
    </Select>
  </FormControl>
  <TextField label="Home Address" name="homeAddress" value={profile.homeAddress} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Office Address" name="officeAddress" value={profile.officeAddress} onChange={handleChange} fullWidth disabled={!isEditing} />
  <TextField label="Pincode" name="pincode" value={profile.pincode} onChange={handleChange} fullWidth disabled={!isEditing} />

  {/* Edit & Save Buttons */}
  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        {isEditing ? (
          <Button variant="contained" color="success" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Stack>

</Box>
)}
    </Box>
  );
}

DemoPageContent.propTypes = { pathname: PropTypes.string.isRequired };

// Logout functionality
const handleLogout = () => {
  // Remove all the authentication-related data from localStorage
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('role');
  localStorage.clear();

  // Show a success toast
  toast.success('Logged out successfully!');

  // Redirect to login page
  setTimeout(() => {
    window.location.href = '/login';
  }, 1500); // Delay to show toast before redirect
};


  function ClientDashboard() {
  // Get the logged-in user's email from localStorage
  const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
  const userEmail = storedUser ? storedUser.email : 'Guest';  // Default to 'Guest' if not logged in

  const [pathname, setPathname] = React.useState('/dashboard'); // Active section
  const [anchorEl, setAnchorEl] = React.useState(null); // For menu anchor

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu on click
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the menu
  };

  console.log("path",pathname);
  
 
  return (
    <AppProvider 
    branding={ {
      title : "client-dashboard"
    }}
      navigation={NAVIGATION}
      router={{
        pathname,
        searchParams: new URLSearchParams(),
        navigate: (path) => setPathname(path),
        // navigate:(path) => console.log("ptah",ptah)
      }}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: () => (
            <Stack direction="column" sx={{ position: 'absolute', bottom: 20, width: '100%' }}>
              <Divider />
              {/* Three-dot icon button to open menu */}
              <Stack direction="row" justifyContent="center" alignItems="center">
                <IconButton onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>Sign Out</Typography>
              </Stack>
              {/* Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {/* Display the email and Sign Out option */}
                <MenuItem disabled>
                  <ListItemText primary={`Logged in as: ${userEmail}`} />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Sign Out" /> 
                </MenuItem>
              </Menu>
            </Stack>
          ),
        }}
      >
        <DemoPageContent pathname={pathname} />
        <ToastContainer position="top-center" autoClose={2000} />
      </DashboardLayout>
    </AppProvider>
  );
}
export default ClientDashboard;
