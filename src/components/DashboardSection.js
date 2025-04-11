// // components/DashboardSection.js
// import React, { useState, useEffect } from 'react';
// import { 
//   Grid, 
//   Card, 
//   CardContent, 
//   Typography, 
//   CircularProgress,
//   Box,
//   Divider
// } from '@mui/material';
// import {
//   People as UsersIcon,
//   ShoppingCart as ProductsIcon,
//   Settings as SettingsIcon,
//   BarChart as StatsIcon
// } from '@mui/icons-material';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const DashboardSection = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     activeProducts: 0,
//     recentActivities: [],
//     loading: true,
//     error: null
//   });

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         setStats(prev => ({ ...prev, loading: true, error: null }));
        
//         // In a real app, you might have a dedicated dashboard endpoint
//         const [usersRes, productsRes, activitiesRes] = await Promise.all([
//           axios.get('/api/users/count'),
//           axios.get('/api/products/active-count'),
//           axios.get('/api/activities/recent')
//         ]);

//         setStats({
//           totalUsers: usersRes.data.count,
//           activeProducts: productsRes.data.count,
//           recentActivities: activitiesRes.data.activities,
//           loading: false,
//           error: null
//         });
//       } catch (error) {
//         console.error('Dashboard data fetch error:', error);
//         setStats(prev => ({
//           ...prev,
//           loading: false,
//           error: 'Failed to load dashboard data'
//         }));
//         toast.error('Failed to load dashboard data');
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   if (stats.loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (stats.error) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <Typography color="error">{stats.error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <div className="dashboard-section">
//       <Typography variant="h4" gutterBottom>
//         Dashboard Overview
//       </Typography>
      
//       <Grid container spacing={3} mb={4}>
//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <UsersIcon color="primary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6" color="textSecondary">
//                     Total Users
//                   </Typography>
//                   <Typography variant="h4">
//                     {stats.totalUsers}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <ProductsIcon color="secondary" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6" color="textSecondary">
//                     Active Products
//                   </Typography>
//                   <Typography variant="h4">
//                     {stats.activeProducts}
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <StatsIcon color="success" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6" color="textSecondary">
//                     Daily Visits
//                   </Typography>
//                   <Typography variant="h4">
//                     1,024
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} sm={6} md={3}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box display="flex" alignItems="center">
//                 <SettingsIcon color="action" fontSize="large" />
//                 <Box ml={2}>
//                   <Typography variant="h6" color="textSecondary">
//                     Pending Tasks
//                   </Typography>
//                   <Typography variant="h4">
//                     5
//                   </Typography>
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       <Card elevation={3} sx={{ mb: 4 }}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             Recent Activities
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
          
//           {stats.recentActivities.length > 0 ? (
//             <Box>
//               {stats.recentActivities.map((activity, index) => (
//                 <Box key={index} mb={2}>
//                   <Typography variant="body1">
//                     <strong>{activity.user}</strong> {activity.action}
//                   </Typography>
//                   <Typography variant="caption" color="textSecondary">
//                     {new Date(activity.timestamp).toLocaleString()}
//                   </Typography>
//                 </Box>
//               ))}
//             </Box>
//           ) : (
//             <Typography variant="body1" color="textSecondary">
//               No recent activities
//             </Typography>
//           )}
//         </CardContent>
//       </Card>

//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card elevation={3}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 System Health
//               </Typography>
//               <Divider sx={{ mb: 2 }} />
//               {/* Placeholder for system health metrics */}
//               <Typography variant="body1">
//                 All systems operational
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
        
//         <Grid item xs={12} md={6}>
//           <Card elevation={3}>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Quick Actions
//               </Typography>
//               <Divider sx={{ mb: 2 }} />
//               {/* Placeholder for quick actions */}
//               <Typography variant="body1">
//                 Manage users, products, and settings
//               </Typography>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default DashboardSection;



// DashboardSection.js
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', users: 30, products: 20 },
  { name: 'Feb', users: 45, products: 35 },
  { name: 'Mar', users: 60, products: 50 },
  { name: 'Apr', users: 80, products: 70 },
  { name: 'may', users: 80, products: 70 },
  { name: 'jun', users: 80, products: 70 },
  { name: 'jul', users: 80, products: 70 },
  { name: 'aug', users: 80, products: 70 },
  { name: 'sept', users: 80, products: 70 },
  { name: 'oct', users: 80, products: 70 },
  { name: 'nov', users: 80, products: 70 },
  { name: 'dec', users: 80, products: 70 },
];

const DashboardSection = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">150</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Products</Typography>
            <Typography variant="h4">80</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Activity
            </Typography>
            <ResponsiveContainer width={1000} height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill="#8884d8" name="Users" />
                <Bar dataKey="products" fill="#82ca9d" name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardSection;