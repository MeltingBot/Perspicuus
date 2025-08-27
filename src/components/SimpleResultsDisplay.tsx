import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Stack,
  Button
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Cancel,
  LocationOn,
  Business,
  Person,
  TrendingUp,
  Edit,
  Download,
  Code
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import { RiskAssessmentResult, RiskLevel, RiskAssessmentRequest } from '../types/lcbft';

interface SimpleResultsDisplayProps {
  results: RiskAssessmentResult;
  formData?: RiskAssessmentRequest;
  onBackToEvaluation?: () => void;
}

export const SimpleResultsDisplay: React.FC<SimpleResultsDisplayProps> = ({ results, formData, onBackToEvaluation }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.FAIBLE: return { color: '#4caf50', bg: '#e8f5e8' };
      case RiskLevel.MODERE: return { color: '#ff9800', bg: '#fff3e0' };
      case RiskLevel.ELEVE: return { color: '#f44336', bg: '#ffebee' };
      case RiskLevel.TRES_ELEVE: return { color: '#d32f2f', bg: '#ffcdd2' };
      default: return { color: '#757575', bg: '#f5f5f5' };
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.FAIBLE: return <CheckCircle />;
      case RiskLevel.MODERE: return <Warning />;
      case RiskLevel.ELEVE: return <Error />;
      case RiskLevel.TRES_ELEVE: return <Cancel />;
      default: return <CheckCircle />;
    }
  };

  const getRiskSeverity = (level: RiskLevel): "success" | "warning" | "error" => {
    switch (level) {
      case RiskLevel.FAIBLE: return "success";
      case RiskLevel.MODERE: return "warning";
      case RiskLevel.ELEVE: 
      case RiskLevel.TRES_ELEVE: return "error";
      default: return "success";
    }
  };

  const { color, bg } = getRiskColor(results.niveau_risque);

  // Fonction pour traduire les niveaux de risque en français lisible
  const getRiskLabelFr = (level: RiskLevel): string => {
    switch (level) {
      case RiskLevel.FAIBLE: return 'Faible';
      case RiskLevel.MODERE: return 'Modéré';
      case RiskLevel.ELEVE: return 'Élevé';
      case RiskLevel.TRES_ELEVE: return 'Très élevé';
      default: return level;
    }
  };

  const generateJSONExport = () => {
    const exportData = {
      metadata: {
        application: "Perspicuus LCBFT",
        version: "1.0.0",
        generated_at: new Date().toISOString(),
        disclaimer: "Outil d'aide à la décision - Ne constitue pas un engagement de conformité réglementaire"
      },
      evaluation_request: formData || null,
      risk_assessment_results: {
        overall: {
          risk_level: results.niveau_risque,
          risk_level_fr: getRiskLabelFr(results.niveau_risque),
          total_score: results.score_total,
          max_possible_score: 20
        },
        geographic_risk: {
          score: results.score_geo.score,
          justifications: results.score_geo.justifications
        },
        product_service_risk: {
          score: results.score_produit.score,
          justifications: results.score_produit.justifications
        },
        client_risk: {
          score: results.score_client.score,
          justifications: results.score_client.justifications
        },
        recommendations: results.recommandations.map(rec => 
          rec.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
        )
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `perspicuus_evaluation_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const generateCompactJSONExport = () => {
    const compactData = {
      timestamp: new Date().toISOString(),
      risk_level: results.niveau_risque,
      total_score: results.score_total,
      scores: {
        geographic: results.score_geo.score,
        product_service: results.score_produit.score,
        client: results.score_client.score
      },
      key_factors: [
        ...results.score_geo.justifications,
        ...results.score_produit.justifications,
        ...results.score_client.justifications
      ]
    };
    
    const dataStr = JSON.stringify(compactData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `perspicuus_compact_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  // Données pour le graphique radar
  const radarData = [
    {
      category: 'Risque Géographique',
      score: results.score_geo.score,
      maxScore: 10
    },
    {
      category: 'Risque Produit/Service',
      score: results.score_produit.score,
      maxScore: 10
    },
    {
      category: 'Risque Client',
      score: results.score_client.score,
      maxScore: 10
    }
  ];


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1">
          📊 Résultats de l'Évaluation
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={generateJSONExport}
            sx={{ minWidth: 'fit-content' }}
          >
            Export JSON
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Code />}
            onClick={generateCompactJSONExport}
            sx={{ minWidth: 'fit-content' }}
          >
            JSON Compact
          </Button>
          {onBackToEvaluation && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Edit />}
              onClick={onBackToEvaluation}
              sx={{ minWidth: 'fit-content' }}
            >
              Modifier
            </Button>
          )}
        </Stack>
      </Box>

      {/* Score Global */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={4}>
        <Card elevation={2} sx={{ minWidth: 200 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Score Total
            </Typography>
            <Typography variant="h2" sx={{ color, fontWeight: 'bold' }}>
              {results.score_total}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              / 30+ points
            </Typography>
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', backgroundColor: bg }}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              {React.cloneElement(getRiskIcon(results.niveau_risque), { 
                sx: { fontSize: 40, color, mr: 2 } 
              })}
              <Typography variant="h3" sx={{ color, fontWeight: 'bold' }}>
                {getRiskLabelFr(results.niveau_risque)}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((results.score_total / 15) * 100, 100)}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                backgroundColor: '#e0e0e0',
                '& .MuiLinearProgress-bar': { backgroundColor: color }
              }}
            />
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ minWidth: 280 }}>
          <CardContent>
            <Typography variant="h6" color="textSecondary" align="center" gutterBottom>
              Détail des Scores
            </Typography>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <LocationOn sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body1">Géographique</Typography>
                </Box>
                <Typography variant="h6" color={color} fontWeight="bold">
                  {results.score_geo.score}/10
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Business sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body1">Produit/Service</Typography>
                </Box>
                <Typography variant="h6" color={color} fontWeight="bold">
                  {results.score_produit.score}/10
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center">
                  <Person sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body1">Client</Typography>
                </Box>
                <Typography variant="h6" color={color} fontWeight="bold">
                  {results.score_client.score}/10
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Graphique Radar Simplifié */}
      <Card elevation={2} sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            Répartition des Facteurs de Risque
          </Typography>
          <Box display="flex" justifyContent="center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" className="radar-label" />
                <PolarRadiusAxis domain={[0, 10]} tick={false} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Justifications Détaillées */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🌍 Risques Géographiques
            </Typography>
            {results.score_geo.justifications.length > 0 ? (
              <List dense>
                {results.score_geo.justifications.map((justif, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={justif} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                • Aucun risque géographique identifié
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              💼 Risques Produit/Service
            </Typography>
            {results.score_produit.justifications.length > 0 ? (
              <List dense>
                {results.score_produit.justifications.map((justif, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Business color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={justif} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                • Aucun risque opérationnel majeur
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              👤 Risques Client
            </Typography>
            {results.score_client.justifications.length > 0 ? (
              <List dense>
                {results.score_client.justifications.map((justif, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Person color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={justif} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                • Profil client standard
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Recommandations */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUp sx={{ mr: 2, color }} />
            <Typography variant="h5">
              💡 Recommandations
            </Typography>
          </Box>
          
          <Alert 
            severity={getRiskSeverity(results.niveau_risque)} 
            sx={{ mb: 3, fontSize: '1.1em' }}
          >
            <Typography variant="h6" gutterBottom>
              {results.niveau_risque === RiskLevel.TRES_ELEVE && "🚨 RISQUE TRÈS ÉLEVÉ - Vigilance renforcée obligatoire"}
              {results.niveau_risque === RiskLevel.ELEVE && "⚠️ RISQUE ÉLEVÉ - Mesures de vigilance renforcées"}
              {results.niveau_risque === RiskLevel.MODERE && "ℹ️ RISQUE MODÉRÉ - Vigilance standard"}
              {results.niveau_risque === RiskLevel.FAIBLE && "✅ RISQUE FAIBLE - Vigilance allégée possible"}
            </Typography>
          </Alert>

          <Stack spacing={2}>
            {results.recommandations.map((rec, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2 }}>
                <Typography 
                  variant="body1" 
                  dangerouslySetInnerHTML={{ __html: rec }}
                />
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};