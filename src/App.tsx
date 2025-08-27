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
  Button
} from '@mui/material';
import {
  Security,
  Assessment,
  MenuBook,
  Analytics,
  GetApp,
  Refresh,
  Info
} from '@mui/icons-material';
import { WizardEvaluationForm } from './components/WizardEvaluationForm';
import { SimpleResultsDisplay } from './components/SimpleResultsDisplay';
import { SimpleKnowledgeBase } from './components/SimpleKnowledgeBase';
import { LegalMentions } from './components/LegalMentions';
import { RiskAssessmentResult, RiskAssessmentRequest } from './types/lcbft';
import { PDFGenerator } from './services/pdfGenerator';

// Thème Material Design personnalisé
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
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [assessmentResults, setAssessmentResults] = useState<RiskAssessmentResult | null>(null);
  const [currentFormData, setCurrentFormData] = useState<RiskAssessmentRequest | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleResults = (results: RiskAssessmentResult, formData: RiskAssessmentRequest) => {
    setAssessmentResults(results);
    setCurrentFormData(formData);
    setCurrentTab(1); // Basculer vers l'onglet des résultats
  };

  const handleBackToEvaluation = () => {
    setCurrentTab(0); // Retour à l'évaluation sans réinitialiser les données
  };

  const generatePDFReport = () => {
    if (assessmentResults && currentFormData) {
      try {
        const pdfGenerator = new PDFGenerator();
        pdfGenerator.generateAssessmentReport(assessmentResults, currentFormData);
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Erreur lors de la génération du rapport PDF');
      }
    }
  };

  const startNewEvaluation = () => {
    setAssessmentResults(null);
    setCurrentFormData(null);
    setCurrentTab(0); // Retourner à l'onglet d'évaluation
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        {/* Header */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <Security sx={{ mr: 2 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Perspicuus - Évaluation LCBFT
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Outil d'évaluation anonyme des risques de blanchiment
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ borderRadius: 0 }}>
          <Container maxWidth="lg">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                label="Évaluation du risque"
                icon={<Assessment />}
                iconPosition="start"
              />
              <Tab
                label={assessmentResults ? "Résultats" : "Résultats"}
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

        {/* Content */}
        <Container maxWidth="lg">
          {/* Tab 0: Évaluation */}
          <TabPanel value={currentTab} index={0}>
            <WizardEvaluationForm onResults={handleResults} />
          </TabPanel>

          {/* Tab 1: Résultats */}
          <TabPanel value={currentTab} index={1}>
            {assessmentResults ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={startNewEvaluation}
                    sx={{ borderRadius: 2 }}
                  >
                    Nouvelle évaluation
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<GetApp />}
                    onClick={generatePDFReport}
                    sx={{ borderRadius: 2 }}
                  >
                    Télécharger le rapport PDF
                  </Button>
                </Box>
                <SimpleResultsDisplay results={assessmentResults} onBackToEvaluation={handleBackToEvaluation} />
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Assessment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="textSecondary">
                  Aucune évaluation disponible
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                  Veuillez d'abord effectuer une évaluation de risque dans le premier onglet.
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* Tab 2: Base de connaissances */}
          <TabPanel value={currentTab} index={2}>
            <SimpleKnowledgeBase />
          </TabPanel>

          {/* Tab 3: Mentions légales */}
          <TabPanel value={currentTab} index={3}>
            <LegalMentions />
          </TabPanel>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 8,
            py: 4,
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            textAlign: 'center'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body1" sx={{ mb: 1 }}>
              Perspicuus - Évaluation des Risques LCBFT
            </Typography>
            <Button 
              color="inherit" 
              size="small" 
              onClick={() => setCurrentTab(3)}
              sx={{ mt: 1, opacity: 0.8, fontSize: '0.75rem' }}
            >
              Mentions légales & Confidentialité
            </Button>
          </Container>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
