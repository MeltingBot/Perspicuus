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
  Stack
} from '@mui/material';
import {
  Security,
  Assessment,
  MenuBook,
  Analytics,
  GetApp,
  Refresh,
  Info,
  CloudUpload
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Valider que c'est un export Perspicuus
        if (jsonData.metadata?.application === "Perspicuus LCBFT" || jsonData.timestamp) {
          // Import JSON complet
          if (jsonData.evaluation_request && jsonData.risk_assessment_results) {
            setCurrentFormData(jsonData.evaluation_request);
            setAssessmentResults(jsonData.risk_assessment_results);
            setCurrentTab(1); // Aller aux résultats
            
            // Notification de succès (optionnelle)
            console.log("✅ Évaluation importée avec succès (format complet)");
          }
          // Import JSON compact - reconstruction des données minimales
          else if (jsonData.risk_level && jsonData.total_score) {
            // Créer un objet RiskAssessmentResult basique depuis le format compact
            const reconstructedResults: RiskAssessmentResult = {
              niveau_risque: jsonData.risk_level,
              score_total: jsonData.total_score,
              score_geo: { 
                score: jsonData.scores?.geographic || 0, 
                justifications: jsonData.key_factors?.filter((f: string) => 
                  f.toLowerCase().includes('géographique') || 
                  f.toLowerCase().includes('pays') ||
                  f.toLowerCase().includes('distance') ||
                  f.toLowerCase().includes('frontière')
                ) || []
              },
              score_produit: { 
                score: jsonData.scores?.product_service || 0, 
                justifications: jsonData.key_factors?.filter((f: string) => 
                  f.toLowerCase().includes('transaction') || 
                  f.toLowerCase().includes('paiement') || 
                  f.toLowerCase().includes('montant') ||
                  f.toLowerCase().includes('cryptomonnaies') ||
                  f.toLowerCase().includes('espèces') ||
                  f.toLowerCase().includes('secteur')
                ) || []
              },
              score_client: { 
                score: jsonData.scores?.client || 0, 
                justifications: jsonData.key_factors?.filter((f: string) => 
                  f.toLowerCase().includes('client') || 
                  f.toLowerCase().includes('pep') || 
                  f.toLowerCase().includes('sanction') ||
                  f.toLowerCase().includes('âge') ||
                  f.toLowerCase().includes('notoriété') ||
                  f.toLowerCase().includes('réticence')
                ) || []
              },
              recommandations: ["Évaluation importée depuis un format compact - recommandations détaillées non disponibles"]
            };
            
            setAssessmentResults(reconstructedResults);
            setCurrentFormData(null); // Pas de données de formulaire dans le format compact
            setCurrentTab(1);
            
            console.log("✅ Évaluation importée avec succès (format compact)");
          }
        } else {
          alert("⚠️ Fichier JSON non reconnu. Veuillez importer un fichier exporté depuis Perspicuus.");
        }
      } catch (error) {
        console.error("Erreur lors de l'import:", error);
        alert("❌ Erreur lors de l'import du fichier JSON. Vérifiez le format du fichier.");
      }
    };
    
    reader.readAsText(file);
    
    // Reset input pour permettre le re-upload du même fichier
    event.target.value = '';
  };

  const triggerFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const mockEvent = {
        target,
        currentTarget: target
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    });
    input.click();
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
            <WizardEvaluationForm 
              onResults={handleResults} 
              formData={currentFormData || undefined}
              assessmentResults={assessmentResults || undefined}
            />
          </TabPanel>

          {/* Tab 1: Résultats */}
          <TabPanel value={currentTab} index={1}>
            {assessmentResults ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap" gap={1}>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<Refresh />}
                      onClick={startNewEvaluation}
                      sx={{ borderRadius: 2 }}
                    >
                      Nouvelle évaluation
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloudUpload />}
                      onClick={triggerFileUpload}
                      sx={{ borderRadius: 2 }}
                    >
                      Importer JSON
                    </Button>
                  </Stack>
                  <Button
                    variant="contained"
                    startIcon={<GetApp />}
                    onClick={generatePDFReport}
                    sx={{ borderRadius: 2 }}
                  >
                    Télécharger le rapport PDF
                  </Button>
                </Box>
                <SimpleResultsDisplay results={assessmentResults} formData={currentFormData || undefined} onBackToEvaluation={handleBackToEvaluation} />
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <Assessment sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  Aucune évaluation disponible
                </Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                  Effectuez une nouvelle évaluation ou importez une évaluation existante.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<Assessment />}
                    onClick={() => setCurrentTab(0)}
                    sx={{ borderRadius: 2 }}
                  >
                    Nouvelle évaluation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloudUpload />}
                    onClick={triggerFileUpload}
                    sx={{ borderRadius: 2 }}
                  >
                    Importer JSON
                  </Button>
                </Stack>
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
