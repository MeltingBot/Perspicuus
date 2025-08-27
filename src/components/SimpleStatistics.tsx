import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Report,
  Security,
  Groups
} from '@mui/icons-material';

export const SimpleStatistics: React.FC = () => {
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    delta?: string;
    deltaPositive?: boolean;
    icon: React.ReactElement;
  }> = ({ title, value, delta, deltaPositive, icon }) => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
            {delta && (
              <Box display="flex" alignItems="center" mt={1}>
                {deltaPositive ? (
                  <TrendingUp color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                ) : (
                  <TrendingDown color="error" sx={{ fontSize: 16, mr: 0.5 }} />
                )}
                <Typography
                  variant="caption"
                  color={deltaPositive ? "success.main" : "error.main"}
                  fontWeight="bold"
                >
                  {delta}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: 'primary.main', opacity: 0.3 }}>
            <Box component="span" sx={{ fontSize: 48 }}>
              {React.cloneElement(icon)}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        📊 Statistiques et Tendances LCBFT
      </Typography>

      {/* Métriques Clés */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
        <MetricCard
          title="Total Évaluations"
          value="275"
          delta="+12 ce mois"
          deltaPositive={true}
          icon={<Assessment />}
        />
        <MetricCard
          title="Déclarations de Soupçon"
          value="8"
          delta="+2 ce mois"
          deltaPositive={false}
          icon={<Report />}
        />
        <MetricCard
          title="Taux de Risque Élevé"
          value="40%"
          delta="-5% vs mois dernier"
          deltaPositive={true}
          icon={<Security />}
        />
        <MetricCard
          title="Secteurs Surveillés"
          value="25"
          delta="+3 secteurs"
          deltaPositive={false}
          icon={<Groups />}
        />
      </Stack>

      {/* Graphiques Principaux */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={4}>
        
        {/* Répartition des Niveaux de Risque */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom align="center">
              Répartition des Niveaux de Risque
            </Typography>
            
            <Stack spacing={2} mt={3}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: '50%', mr: 2 }} />
                  <Typography>Faible</Typography>
                </Box>
                <Typography fontWeight="bold">45 (16.4%)</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#ff9800', borderRadius: '50%', mr: 2 }} />
                  <Typography>Modéré</Typography>
                </Box>
                <Typography fontWeight="bold">120 (43.6%)</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', borderRadius: '50%', mr: 2 }} />
                  <Typography>Élevé</Typography>
                </Box>
                <Typography fontWeight="bold">85 (30.9%)</Typography>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center">
                  <Box sx={{ width: 16, height: 16, backgroundColor: '#d32f2f', borderRadius: '50%', mr: 2 }} />
                  <Typography>Très Élevé</Typography>
                </Box>
                <Typography fontWeight="bold">25 (9.1%)</Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Tendances et Alertes */}
        <Card elevation={2} sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alertes et Tendances
            </Typography>
            
            <Stack spacing={2}>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#ffebee' }}>
                <Typography variant="subtitle2" color="error" fontWeight="bold">
                  🚨 Hausse des Risques Crypto-actifs
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  +25% d'évaluations dans le secteur des crypto-monnaies ce mois
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#fff3e0' }}>
                <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
                  ⚠️ Surveillance Immobilière
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Augmentation des montages complexes dans l'immobilier
                </Typography>
              </Paper>

              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                  ✅ Amélioration BTP
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Baisse des risques très élevés dans la construction (-15%)
                </Typography>
              </Paper>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Évolution des Déclarations TRACFIN */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Évolution des Déclarations de Soupçon TRACFIN
          </Typography>
          
          <Stack spacing={2} mt={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography>Janvier 2024</Typography>
              <Typography fontWeight="bold" color="error">2 déclarations</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography>Février 2024</Typography>
              <Typography fontWeight="bold" color="error">3 déclarations</Typography>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography>Mars 2024</Typography>
              <Typography fontWeight="bold" color="error">1 déclaration</Typography>
            </Box>
          </Stack>
          
          <Box mt={2}>
            <Typography variant="body2" color="textSecondary" align="center">
              Corrélation entre évaluations à risque très élevé et déclarations effectives
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Note de Conformité */}
      <Card elevation={2} sx={{ backgroundColor: '#e3f2fd' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
            📋 Notes de Conformité
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Security color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Toutes les données présentées sont anonymisées et agrégées"
                secondary="Aucune information personnelle ou nominative n'est stockée ou affichée"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Report color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Conformité TRACFIN et réglementation française"
                secondary="Les seuils et classifications respectent les directives de l'ACPR et de TRACFIN"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Assessment color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Basé sur les recommandations GAFI/FATF"
                secondary="Classifications de pays et secteurs mises à jour selon les listes officielles"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};