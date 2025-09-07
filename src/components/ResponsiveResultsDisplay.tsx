import React, { useMemo, useCallback } from 'react';
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
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Tooltip
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
  Code,
  ExpandMore,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { RiskAssessmentResult, RiskLevel, RiskAssessmentRequest } from '../types/lcbft';

interface ResponsiveResultsDisplayProps {
  results: RiskAssessmentResult;
  formData?: RiskAssessmentRequest;
  onBackToEvaluation?: () => void;
}

export const ResponsiveResultsDisplay: React.FC<ResponsiveResultsDisplayProps> = ({
  results,
  formData,
  onBackToEvaluation
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [fullscreenChart, setFullscreenChart] = React.useState(false);

  // Risk styling utilities
  const riskStyles = useMemo(() => {
    const getRiskColor = (level: RiskLevel) => {
      switch (level) {
        case RiskLevel.FAIBLE: return { color: '#4caf50', bg: '#e8f5e8', severity: 'success' as const };
        case RiskLevel.MODERE: return { color: '#ff9800', bg: '#fff3e0', severity: 'warning' as const };
        case RiskLevel.ELEVE: return { color: '#f44336', bg: '#ffebee', severity: 'error' as const };
        case RiskLevel.TRES_ELEVE: return { color: '#d32f2f', bg: '#ffcdd2', severity: 'error' as const };
        default: return { color: '#757575', bg: '#f5f5f5', severity: 'info' as const };
      }
    };
    return getRiskColor(results.niveau_risque);
  }, [results.niveau_risque]);

  const riskIcon = useMemo(() => {
    const icons = {
      [RiskLevel.FAIBLE]: CheckCircle,
      [RiskLevel.MODERE]: Warning,
      [RiskLevel.ELEVE]: Error,
      [RiskLevel.TRES_ELEVE]: Cancel,
    };
    const IconComponent = icons[results.niveau_risque] || CheckCircle;
    return <IconComponent />;
  }, [results.niveau_risque]);

  const riskLabelFr = useMemo(() => {
    const labels = {
      [RiskLevel.FAIBLE]: 'Faible',
      [RiskLevel.MODERE]: 'Modéré',
      [RiskLevel.ELEVE]: 'Élevé',
      [RiskLevel.TRES_ELEVE]: 'Très élevé',
    };
    return labels[results.niveau_risque] || results.niveau_risque;
  }, [results.niveau_risque]);

  // Chart data preparation
  const radarData = useMemo(() => [
    { category: isMobile ? 'Géo' : 'Risque Géographique', score: results.score_geo?.score || 0 },
    { category: isMobile ? 'Produit' : 'Risque Produit/Service', score: results.score_produit?.score || 0 },
    { category: isMobile ? 'Client' : 'Risque Client', score: results.score_client?.score || 0 }
  ], [results, isMobile]);

  const pieData = useMemo(() => [
    { name: 'Géographique', value: results.score_geo?.score || 0, color: '#FF6B6B' },
    { name: 'Produit/Service', value: results.score_produit?.score || 0, color: '#4ECDC4' },
    { name: 'Client', value: results.score_client?.score || 0, color: '#45B7D1' }
  ], [results]);

  const barData = useMemo(() => [
    { name: 'Géographique', score: results.score_geo?.score || 0 },
    { name: 'Produit/Service', score: results.score_produit?.score || 0 },
    { name: 'Client', score: results.score_client?.score || 0 }
  ], [results]);

  const maxScore = useMemo(() => Math.max(
    results.score_geo?.score || 0,
    results.score_produit?.score || 0,
    results.score_client?.score || 0,
    5
  ) + 2, [results]);

  // Export functions
  const generateJSONExport = useCallback(() => {
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
          risk_level_fr: riskLabelFr,
          total_score: results.score_total,
          scoring_system: "open_scoring"
        },
        geographic_risk: {
          score: results.score_geo?.score || 0,
          justifications: results.score_geo?.justifications || []
        },
        product_service_risk: {
          score: results.score_produit?.score || 0,
          justifications: results.score_produit?.justifications || []
        },
        client_risk: {
          score: results.score_client?.score || 0,
          justifications: results.score_client?.justifications || []
        },
        recommendations: results.recommandations
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `perspicuus_evaluation_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  }, [formData, results, riskLabelFr]);

  // Responsive chart wrapper
  const ChartContainer: React.FC<{ children: React.ReactElement; title: string }> = ({ children, title }) => (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {title}
          </Typography>
          {!isMobile && (
            <IconButton
              size="small"
              onClick={() => setFullscreenChart(!fullscreenChart)}
            >
              {fullscreenChart ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          )}
        </Box>
        <Box sx={{ height: { xs: 250, sm: 300, md: fullscreenChart ? 500 : 350 } }}>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Header with Actions */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          📊 Résultats de l'Évaluation
        </Typography>
        
        <Stack 
          direction="row" 
          spacing={1} 
          sx={{ 
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' }
          }}
        >
          <Button
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            startIcon={<Download />}
            onClick={generateJSONExport}
            sx={{ minWidth: 'fit-content' }}
          >
            {isMobile ? 'Export' : 'Export JSON'}
          </Button>
          
          {onBackToEvaluation && (
            <Button
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              startIcon={<Edit />}
              onClick={onBackToEvaluation}
              sx={{ minWidth: 'fit-content' }}
            >
              Modifier
            </Button>
          )}
        </Stack>
      </Box>

      {/* Risk Summary Cards */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {/* Total Score */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Score Total
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: riskStyles.color, 
                  fontWeight: 'bold',
                  fontSize: { xs: '2rem', sm: '3rem' }
                }}
              >
                {results.score_total}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                points (scoring ouvert)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Level */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={2}>
            <CardContent 
              sx={{ 
                textAlign: 'center', 
                backgroundColor: riskStyles.bg,
                p: { xs: 2, sm: 3 }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                {React.cloneElement(riskIcon, { 
                  sx: { fontSize: { xs: 32, sm: 40 }, color: riskStyles.color, mr: 1 } 
                })}
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: riskStyles.color, 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' }
                  }}
                >
                  {riskLabelFr}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((results.score_total / 15) * 100, 100)}
                sx={{ 
                  height: { xs: 8, sm: 10 }, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { backgroundColor: riskStyles.color }
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Score Breakdown */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" color="textSecondary" align="center" gutterBottom>
                Détail des Scores
              </Typography>
              <Stack spacing={2}>
                {[
                  { icon: LocationOn, label: 'Géographique', score: results.score_geo?.score || 0 },
                  { icon: Business, label: 'Produit/Service', score: results.score_produit?.score || 0 },
                  { icon: Person, label: 'Client', score: results.score_client?.score || 0 }
                ].map(({ icon: Icon, label, score }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon sx={{ mr: 1, color: 'action.active', fontSize: { xs: 18, sm: 24 } }} />
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {label}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="h6" 
                      color={riskStyles.color} 
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                    >
                      {score}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        {/* Radar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Répartition des Risques">
            <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <PolarRadiusAxis 
                domain={[0, maxScore]} 
                tick={false} 
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke={riskStyles.color}
                fill={riskStyles.color}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ChartContainer>
        </Grid>

        {/* Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Comparaison des Scores">
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 40}
              />
              <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
              <Bar dataKey="score" fill={riskStyles.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Grid>
      </Grid>

      {/* Risk Details Accordions (Mobile) or Cards (Desktop) */}
      {isMobile ? (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {[
            { title: '🌍 Risques Géographiques', data: results.score_geo, icon: LocationOn },
            { title: '💼 Risques Produit/Service', data: results.score_produit, icon: Business },
            { title: '👤 Risques Client', data: results.score_client, icon: Person }
          ].map(({ title, data, icon: Icon }) => (
            <Accordion key={title}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Icon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                    {title}
                  </Typography>
                  <Chip 
                    label={data?.score || 0}
                    size="small"
                    color="primary"
                    sx={{ ml: 'auto', mr: 2 }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {(data?.justifications || []).length > 0 ? (
                  <List dense>
                    {data?.justifications?.map((justif, index) => (
                      <ListItem key={index} divider>
                        <ListItemText 
                          primary={justif}
                          primaryTypographyProps={{ fontSize: '0.875rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Aucun risque identifié dans cette catégorie
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { title: '🌍 Risques Géographiques', data: results.score_geo, icon: LocationOn },
            { title: '💼 Risques Produit/Service', data: results.score_produit, icon: Business },
            { title: '👤 Risques Client', data: results.score_client, icon: Person }
          ].map(({ title, data, icon: Icon }) => (
            <Grid size={{ xs: 12, md: 4 }} key={title}>
              <Card elevation={2} sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {title}
                  </Typography>
                  {(data?.justifications || []).length > 0 ? (
                    <List dense>
                      {data?.justifications?.map((justif, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Icon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={justif} />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="textSecondary">
                      • Aucun risque identifié
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Recommendations */}
      <Card elevation={2}>
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUp sx={{ mr: 2, color: riskStyles.color }} />
            <Typography variant="h5" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              💡 Recommandations
            </Typography>
          </Box>
          
          <Alert 
            severity={riskStyles.severity} 
            sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {results.niveau_risque === RiskLevel.TRES_ELEVE && "🚨 RISQUE TRÈS ÉLEVÉ - Vigilance renforcée obligatoire"}
              {results.niveau_risque === RiskLevel.ELEVE && "⚠️ RISQUE ÉLEVÉ - Mesures de vigilance renforcées"}
              {results.niveau_risque === RiskLevel.MODERE && "ℹ️ RISQUE MODÉRÉ - Vigilance standard"}
              {results.niveau_risque === RiskLevel.FAIBLE && "✅ RISQUE FAIBLE - Vigilance allégée possible"}
            </Typography>
          </Alert>

          <Stack spacing={2}>
            {results.recommandations.map((rec, index) => (
              <Paper key={index} elevation={1} sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="body1"
                  sx={{ 
                    whiteSpace: 'pre-line',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  {rec.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};