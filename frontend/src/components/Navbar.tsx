import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, Person as PersonIcon, ExitToApp as LogoutIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const { user, signOut, loading } = useAuth();

  const menuItems = [
    { label: 'Education', path: '/education' },
    { label: 'Privacy', path: '/privacy' },
  ];

  const handleMenuClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleUserMenuClose();
    navigate('/');
  };

  const handleDashboard = () => {
    handleUserMenuClose();
    navigate('/dashboard');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/')}
          >
            Disease Risk Prediction
          </Typography>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Authentication Buttons */}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <IconButton
                        onClick={handleUserMenuOpen}
                        sx={{ ml: 1 }}
                        color="inherit"
                      >
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                          <PersonIcon />
                        </Avatar>
                      </IconButton>
                      <Menu
                        anchorEl={userMenuAnchor}
                        open={Boolean(userMenuAnchor)}
                        onClose={handleUserMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={handleDashboard}>
                          <PersonIcon sx={{ mr: 1 }} />
                          Dashboard
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <LogoutIcon sx={{ mr: 1 }} />
                          Sign Out
                        </MenuItem>
                      </Menu>
                    </>
                  ) : (
                    <>
                      <Button
                        color="inherit"
                        onClick={() => navigate('/login')}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => navigate('/register')}
                        sx={{
                          minWidth: 'auto',
                          px: 2,
                          py: 1,
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          ml: 1,
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{ p: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleMenuClick(item.path)}
                sx={{
                  py: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                  },
                }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: 'medium',
                    textAlign: 'left',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          
          {/* Mobile Authentication Options */}
          {!loading && (
            <>
              <Divider sx={{ my: 2 }} />
              {user ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick('/dashboard')}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      <PersonIcon sx={{ mr: 2 }} />
                      <ListItemText 
                        primary="Dashboard"
                        primaryTypographyProps={{
                          fontWeight: 'medium',
                          textAlign: 'left',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'error.light',
                          color: 'white',
                        },
                      }}
                    >
                      <LogoutIcon sx={{ mr: 2 }} />
                      <ListItemText 
                        primary="Sign Out"
                        primaryTypographyProps={{
                          fontWeight: 'medium',
                          textAlign: 'left',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick('/login')}
                      sx={{
                        py: 2,
                        px: 3,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        },
                      }}
                    >
                      <PersonIcon sx={{ mr: 2 }} />
                      <ListItemText 
                        primary="Sign In"
                        primaryTypographyProps={{
                          fontWeight: 'medium',
                          textAlign: 'left',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleMenuClick('/register')}
                      sx={{
                        py: 2,
                        px: 3,
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'secondary.dark',
                        },
                      }}
                    >
                      <PersonIcon sx={{ mr: 2 }} />
                      <ListItemText 
                        primary="Sign Up"
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          textAlign: 'left',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </>
          )}
        </List>

        <Box sx={{ mt: 'auto', p: 3, backgroundColor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', lineHeight: 1.4 }}>
            Take control of your health with AI-powered risk assessment
          </Typography>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
