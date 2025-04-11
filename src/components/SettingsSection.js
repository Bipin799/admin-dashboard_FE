// // components/SettingsSection.js
// import React, { useState, useEffect } from 'react';
// import { 
//   Grid, 
//   Card, 
//   CardContent, 
//   Typography, 
//   TextField, 
//   Button,
//   Switch,
//   FormControlLabel,
//   Divider,
//   CircularProgress,
//   Box,
//   Alert
// } from '@mui/material';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const SettingsSection = () => {
//   const [settings, setSettings] = useState({
//     appName: '',
//     maintenanceMode: false,
//     emailNotifications: true,
//     darkMode: false,
//     loading: true,
//     saving: false,
//     error: null
//   });

//   useEffect(() => {
//     const fetchSettings = async () => {
//       try {
//         const response = await axios.get('/api/settings');
//         setSettings({
//           ...response.data,
//           loading: false,
//           error: null
//         });
//       } catch (error) {
//         console.error('Settings fetch error:', error);
//         setSettings(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Failed to load settings'
//         }));
//         toast.error('Failed to load settings');
//       }
//     };

//     fetchSettings();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSettings(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setSettings(prev => ({ ...prev, saving: true }));
      
//       await axios.put('/api/settings', {
//         appName: settings.appName,
//         maintenanceMode: settings.maintenanceMode,
//         emailNotifications: settings.emailNotifications,
//         darkMode: settings.darkMode
//       });

//       toast.success('Settings saved successfully!');
//       setSettings(prev => ({ ...prev, saving: false }));
//     } catch (error) {
//       console.error('Settings save error:', error);
//       toast.error('Failed to save settings');
//       setSettings(prev => ({ ...prev, saving: false }));
//     }
//   };

//   if (settings.loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (settings.error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <Alert severity="error">{settings.error}</Alert>
//       </Box>
//     );
//   }

//   return (
//     <div className="settings-section">
//       <Typography variant="h4" gutterBottom>
//         System Settings
//       </Typography>

//       <form onSubmit={handleSubmit}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={6}>
//             <Card elevation={3}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   General Settings
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />

//                 <TextField
//                   fullWidth
//                   label="Application Name"
//                   name="appName"
//                   value={settings.appName}
//                   onChange={handleChange}
//                   margin="normal"
//                   variant="outlined"
//                 />

//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={settings.maintenanceMode}
//                       onChange={handleChange}
//                       name="maintenanceMode"
//                       color="primary"
//                     />
//                   }
//                   label="Maintenance Mode"
//                 />

//                 <Typography variant="body2" color="textSecondary" mt={1}>
//                   When enabled, the application will be unavailable to regular users.
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Card elevation={3}>
//               <CardContent>
//                 <Typography variant="h6" gutterBottom>
//                   Notification Settings
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />

//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={settings.emailNotifications}
//                       onChange={handleChange}
//                       name="emailNotifications"
//                       color="primary"
//                     />
//                   }
//                   label="Email Notifications"
//                 />

//                 <Typography variant="body2" color="textSecondary" mt={1} mb={3}>
//                   Receive email alerts for important system events.
//                 </Typography>

//                 <Typography variant="h6" gutterBottom>
//                   Appearance
//                 </Typography>
//                 <Divider sx={{ mb: 3 }} />

//                 <FormControlLabel
//                   control={
//                     <Switch
//                       checked={settings.darkMode}
//                       onChange={handleChange}
//                       name="darkMode"
//                       color="primary"
//                     />
//                   }
//                   label="Dark Mode"
//                 />
//               </CardContent>
//             </Card>
//           </Grid>

//           <Grid item xs={12}>
//             <Box display="flex" justifyContent="flex-end">
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 size="large"
//                 disabled={settings.saving}
//               >
//                 {settings.saving ? (
//                   <>
//                     <CircularProgress size={24} color="inherit" />
//                     <Box ml={1}>Saving...</Box>
//                   </>
//                 ) : 'Save Settings'}
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </form>

//       <Box mt={4}>
//         <Card elevation={3}>
//           <CardContent>
//             <Typography variant="h6" gutterBottom>
//               Danger Zone
//             </Typography>
//             <Divider sx={{ mb: 3 }} />

//             <Button
//               variant="outlined"
//               color="error"
//               onClick={() => toast.warning('This feature is not implemented yet')}
//             >
//               Clear All Data
//             </Button>

//             <Typography variant="body2" color="textSecondary" mt={1}>
//               This will permanently delete all data in the system. Use with extreme caution.
//             </Typography>
//           </CardContent>
//         </Card>
//       </Box>
//     </div>
//   );
// };

// export default SettingsSection;




// setting_section.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
} from "@mui/material";

const SettingSection = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // Save settings to local storage or backend
    console.log("Settings saved", { email, password, darkMode });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Enable Dark Mode"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SettingSection;
