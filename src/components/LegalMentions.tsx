import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Stack,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import {
  Security,
  PrivacyTip,
  UpdateOutlined,
  NoAccounts,
  Storage,
  Shield
} from '@mui/icons-material';

export const LegalMentions: React.FC = () => {
  return (
    <Card elevation={3} sx={{ maxWidth: 800, margin: 'auto' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={4}>
          <Security sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Mentions Légales & Confidentialité
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Protection des données et anonymat garanti
            </Typography>
          </Box>
        </Box>

        <Stack spacing={4}>
          {/* Anonymat Complet */}
          <Paper sx={{ p: 3, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <NoAccounts sx={{ mr: 2, color: 'success.main', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold" color="success.main">
                🔒 Anonymat Complet Garanti
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              <strong>Aucune donnée personnelle ou identifiante n'est collectée.</strong>
            </Typography>
            
            <Stack spacing={2}>
              <Alert severity="success" sx={{ bgcolor: 'success.100' }}>
                ✓ Aucun nom, prénom, adresse ou identifiant client demandé
              </Alert>
              <Alert severity="success" sx={{ bgcolor: 'success.100' }}>
                ✓ Aucune adresse IP enregistrée ou tracée
              </Alert>
              <Alert severity="success" sx={{ bgcolor: 'success.100' }}>
                ✓ Évaluation basée uniquement sur des critères de risque anonymes
              </Alert>
              <Alert severity="success" sx={{ bgcolor: 'success.100' }}>
                ✓ Conformité totale avec le RGPD et les réglementations françaises
              </Alert>
            </Stack>
          </Paper>

          {/* Stockage des Données */}
          <Paper sx={{ p: 3, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Storage sx={{ mr: 2, color: 'info.main', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold" color="info.main">
                💾 Politique de Stockage
              </Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              <strong>Aucun stockage côté serveur - Protection maximale de vos données</strong>
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" color="info.main" gutterBottom>
                  🌐 Stockage Local Navigateur Uniquement
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Les données saisies restent exclusivement dans votre navigateur
                  <br />
                  • Aucune transmission vers nos serveurs
                  <br />
                  • Suppression automatique à la fermeture de l'onglet
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="h6" color="info.main" gutterBottom>
                  🚫 Aucun Stockage Permanent
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Aucune base de données côté serveur
                  <br />
                  • Aucun fichier de log conservé
                  <br />
                  • Aucune sauvegarde automatique
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ bgcolor: 'info.100' }}>
                <strong>💡 Recommandation :</strong> Sauvegardez vos rapports PDF localement si nécessaire
              </Alert>
            </Stack>
          </Paper>

          {/* Mise à Jour des Données */}
          <Paper sx={{ p: 3, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <UpdateOutlined sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                📅 Actualité des Données
              </Typography>
            </Box>
            
            <Stack spacing={3}>
              <Box>
                <Chip 
                  label="DERNIÈRE MISE À JOUR : 25 AOÛT 2025" 
                  color="warning" 
                  size="medium"
                  sx={{ fontWeight: 'bold', fontSize: '1.1rem', px: 2, py: 1 }}
                />
              </Box>
              
              <Typography variant="body1" paragraph>
                Les données réglementaires et critères de risque sont à jour au <strong>25 août 2025</strong> et incluent :
              </Typography>
              
              <Stack spacing={1}>
                <Typography variant="body2">
                  • <strong>Listes FATF/GAFI</strong> : Pays à haut risque et sanctions internationales
                </Typography>
                <Typography variant="body2">
                  • <strong>Codes NAF/APE</strong> : Classification française des secteurs d'activité (Insee 2025)
                </Typography>
                <Typography variant="body2">
                  • <strong>Réglementation PEP</strong> : Article R. 561-18 du Code monétaire et financier
                </Typography>
                <Typography variant="body2">
                  • <strong>Travel Rule</strong> : Règlement UE 2023/1113 et lignes directrices EBA/GL/2024/11
                </Typography>
                <Typography variant="body2">
                  • <strong>NPO</strong> : Lignes directrices EBA/GL/2023/03 sur les organismes à but non lucratif
                </Typography>
                <Typography variant="body2">
                  • <strong>Gestion de Fortune</strong> : Recommandations ACPR 2020
                </Typography>
              </Stack>
            </Stack>
          </Paper>

          {/* Sécurité */}
          <Paper sx={{ p: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Shield sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
              <Typography variant="h5" fontWeight="bold" color="primary.main">
                🛡️ Sécurité & Conformité
              </Typography>
            </Box>
            
            <Stack spacing={2}>
              <Typography variant="body1" paragraph>
                Cet outil respecte les plus hauts standards de sécurité et de conformité réglementaire :
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Chip label="RGPD Compliant" color="primary" variant="outlined" />
                <Chip label="LCBFT France" color="primary" variant="outlined" />
                <Chip label="No-Log Policy" color="primary" variant="outlined" />
                <Chip label="Client-Side Only" color="primary" variant="outlined" />
              </Stack>
              
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>Usage Professionnel :</strong> Cet outil est conçu pour assister les professionnels assujettis 
                  dans l'évaluation des risques LCBFT. Il ne remplace pas le jugement professionnel et l'analyse humaine.
                </Typography>
              </Alert>
            </Stack>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Footer */}
          <Box textAlign="center">
            <Typography variant="caption" color="textSecondary">
              Perspicuus LCBFT Risk Assessment Tool - Version 2025.08.25
              <br />
              Outil d'évaluation des risques de blanchiment et financement du terrorisme
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};