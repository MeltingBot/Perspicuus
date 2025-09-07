import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Button,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Security,
  Assessment,
  MenuBook,
  Analytics,
  GetApp,
  Refresh,
  Info,
  CloudUpload,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Enhanced responsive theme with proper breakpoints
const theme = createTheme({
  palette: {
    primary: {
      main: '#1e3c72',
    },
    secondary: {
      main: '#2a5298',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      // Responsive typography
      fontSize: 'clamp(1.5rem, 4vw, 2.125rem)',
    },
    h5: {
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    },
    h6: {
      fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          // Responsive padding
          padding: 'clamp(0.5rem, 2vw, 1.5rem)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          // Responsive button sizing
          minHeight: 'clamp(36px, 10vw, 42px)',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 'clamp(8px, 3vw, 24px)',
          paddingRight: 'clamp(8px, 3vw, 24px)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          // Mobile-friendly tab minimum height
          minHeight: 48,
        },
        flexContainer: {
          // Allow tab wrapping on very small screens
          '@media (max-width: 400px)': {
            flexWrap: 'wrap',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          padding: 'clamp(6px, 2vw, 12px)',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          // Responsive icon spacing
          '& .MuiTab-iconWrapper': {
            marginBottom: 'clamp(2px, 1vw, 6px)',
          },
        },
      },
    },
  },
});

// Mobile navigation drawer component
const MobileNavDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
  currentTab: number;
  onTabChange: (index: number) => void;
  hasResults: boolean;
}> = ({ open, onClose, currentTab, onTabChange, hasResults }) => {
  const navItems = [
    { label: 'Évaluation du risque', icon: <Assessment />, index: 0 },
    { label: 'Résultats', icon: <Analytics />, index: 1, disabled: !hasResults },
    { label: 'Base de connaissances', icon: <MenuBook />, index: 2 },
    { label: 'Mentions légales', icon: <Info />, index: 3 },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          padding: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">
          Navigation
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.index}
            selected={currentTab === item.index}
            disabled={item.disabled}
            onClick={() => {
              onTabChange(item.index);
              onClose();
            }}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export const ResponsiveApp: React.FC<{
  currentTab: number;
  onTabChange: (value: number) => void;
  assessmentResults: any;
  children: React.ReactNode;
}> = ({ currentTab, onTabChange, assessmentResults, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    onTabChange(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Responsive Header */}
        <AppBar position="static" elevation={2}>
          <Toolbar
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1, sm: 2 },
              py: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Security sx={{ mr: 2 }} />
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  flexGrow: 1, 
                  fontWeight: 600,
                  textAlign: { xs: 'left', sm: 'left' }
                }}
              >
                Perspicuus - LCBFT
              </Typography>
            </Box>
            
            {!isMobile && (
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.9,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: { sm: '200px', md: '300px', lg: 'none' }
                }}
              >
                Outil d'évaluation anonyme des risques de blanchiment
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <MobileNavDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          currentTab={currentTab}
          onTabChange={onTabChange}
          hasResults={!!assessmentResults}
        />

        {/* Desktop/Tablet Navigation Tabs */}
        {!isMobile && (
          <Paper elevation={1} sx={{ borderRadius: 0 }}>
            <Container maxWidth="xl">
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant={isTablet ? "scrollable" : "fullWidth"}
                scrollButtons={isTablet ? "auto" : false}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  '& .MuiTab-root': {
                    minWidth: { sm: 120, md: 160 },
                    padding: { sm: '6px 12px', md: '12px 16px' },
                  },
                }}
              >
                <Tab
                  label="Évaluation"
                  icon={<Assessment />}
                  iconPosition="start"
                />
                <Tab
                  label="Résultats"
                  icon={<Analytics />}
                  iconPosition="start"
                  disabled={!assessmentResults}
                />
                <Tab
                  label="Base de connaissances"
                  icon={<MenuBook />}
                  iconPosition="start"
                />
                <Tab
                  label="Mentions légales"
                  icon={<Info />}
                  iconPosition="start"
                />
              </Tabs>
            </Container>
          </Paper>
        )}

        {/* Responsive Content */}
        <Container 
          maxWidth="xl" 
          sx={{ 
            flex: 1,
            py: { xs: 2, sm: 3, md: 4 },
            px: { xs: 1, sm: 2, md: 3 }
          }}
        >
          {children}
        </Container>

        {/* Responsive Footer */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Perspicuus - Évaluation des Risques LCBFT
            </Typography>
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => onTabChange(3)}
              sx={{ 
                mt: 1, 
                opacity: 0.8, 
                fontSize: { xs: '0.7rem', sm: '0.75rem' }
              }}
            >
              Mentions légales & Confidentialité
            </Button>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};