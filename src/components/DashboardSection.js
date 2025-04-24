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