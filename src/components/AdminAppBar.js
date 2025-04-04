// components/AdminAppBar.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton
} from "@mui/material";
import {
  Menu as MenuIcon,
  People as UsersIcon,
  Dashboard as DashboardIcon,
  //Products as ProductsIcon,
  Settings as SettingsIcon
} from "@mui/icons-material";
import InventoryIcon from '@mui/icons-material/Inventory';

const AdminAppBar = ({ username, onLogout, onSectionChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, section: 'dashboard' },
    { text: 'Users', icon: <UsersIcon />, section: 'users' },
    { text: 'Products', icon: <InventoryIcon />, section: 'products' },
    { text: 'Settings', icon: <SettingsIcon />, section: 'settings' },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1">
              Welcome, {username}
            </Typography>
            <Button 
              color="inherit" 
              onClick={onLogout}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ p: 2 }}>
            Menu
          </Typography>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => onSectionChange(item.section)}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminAppBar;