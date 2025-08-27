import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Stack
} from '@mui/material';
import {
  ExpandMore,
  Business,
  Public,
  Warning,
  Flag,
  Gavel,
  AccountBalance
} from '@mui/icons-material';
import { RISK_DATA, INDICATEURS_SOUPCON, EVALUATIONS_SPECIFIQUES } from '../data/riskData';

export const SimpleKnowledgeBase: React.FC = () => {

  const getRiskColor = (niveau: string) => {
    switch (niveau) {
      case 'TRES_ELEVE': return '#d32f2f';
      case 'ELEVE': return '#f57c00';
      case 'MODERE': return '#fbc02d';
      default: return '#388e3c';
    }
  };

  const getRiskLabel = (niveau: string) => {
    switch (niveau) {
      case 'TRES_ELEVE': return 'Très Élevé';
      case 'ELEVE': return 'Élevé';
      case 'MODERE': return 'Modéré';
      default: return 'Standard';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        📚 Base de Connaissances LCBFT
      </Typography>

      <Stack spacing={3}>
        {/* Secteurs à Risque */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Business sx={{ mr: 1 }} />
              Secteurs d'Activité par Niveau de Risque (Codes NAF/APE)
            </Typography>

            {Object.entries(RISK_DATA.SECTEURS_RISQUE).map(([niveau, secteurs]) => {
              const color = getRiskColor(niveau);
              const secteurCount = Object.keys(secteurs).length;
              
              return (
                <Accordion key={niveau} defaultExpanded={niveau === 'TRES_ELEVE'}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box display="flex" alignItems="center" width="100%">
                      <Typography variant="h6" sx={{ color, fontWeight: 'bold', flexGrow: 1 }}>
                        🚨 Risque {getRiskLabel(niveau)}
                      </Typography>
                      <Chip 
                        label={`${secteurCount} secteur${secteurCount > 1 ? 's' : ''}`}
                        size="small"
                        sx={{ backgroundColor: color, color: 'white' }}
                      />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {Object.entries(secteurs).map(([code, description]) => (
                        <ListItem key={code} divider>
                          <ListItemIcon>
                            <Gavel sx={{ color }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" fontWeight="bold">
                                {code}
                              </Typography>
                            }
                            secondary={description}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </CardContent>
        </Card>

        {/* Pays à Risque */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Public sx={{ mr: 1 }} />
              Pays et Territoires à Risque (Classifications GAFI/FATF)
            </Typography>

            {/* Très Haut Risque */}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                  🔴 Risque Très Élevé (Liste Noire GAFI) - {RISK_DATA.PAYS_RISQUE.TRES_ELEVE.length} pays
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" flexWrap="wrap" spacing={1}>
                  {RISK_DATA.PAYS_RISQUE.TRES_ELEVE.map(pays => (
                    <Chip 
                      key={pays}
                      icon={<Flag />}
                      label={pays}
                      variant="outlined"
                      color="error"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* Haut Risque */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                  🟠 Risque Élevé (Liste Grise GAFI + UE) - {RISK_DATA.PAYS_RISQUE.ELEVE.length} pays
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack direction="row" flexWrap="wrap" spacing={1}>
                  {RISK_DATA.PAYS_RISQUE.ELEVE.map(pays => (
                    <Chip 
                      key={pays}
                      icon={<Flag />}
                      label={pays}
                      variant="outlined"
                      color="warning"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>

        {/* Évaluations Spécifiques */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Gavel sx={{ mr: 1 }} />
              Évaluations Spécifiques par Secteur
            </Typography>

            {Object.entries(EVALUATIONS_SPECIFIQUES).map(([secteur, evaluations]) => (
              <Accordion key={secteur} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    💎 {secteur.replace('_', ' ')}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {Object.entries(evaluations).map(([cle, evaluation]) => (
                      <Box key={cle} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ flexGrow: 1 }}>
                            {evaluation.description}
                          </Typography>
                          <Chip 
                            label={getRiskLabel(evaluation.niveau)}
                            size="small"
                            sx={{ 
                              backgroundColor: getRiskColor(evaluation.niveau),
                              color: 'white' 
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Justification:</strong> {evaluation.justification}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* Indicateurs de Soupçon */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ mr: 1 }} />
              Indicateurs de Soupçon et Signaux d'Alerte
            </Typography>

            {Object.entries(INDICATEURS_SOUPCON).map(([categorie, indicateurs]) => (
              <Accordion key={categorie} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    📍 {categorie}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {indicateurs.map((indicateur, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <AccountBalance color="error" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={indicateur}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '1rem',
                              lineHeight: 1.5
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>

        {/* Informations Complémentaires */}
        <Card elevation={2} sx={{ backgroundColor: '#e3f2fd' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              ℹ️ Informations Importantes
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="TRACFIN"
                  secondary="Traitement du Renseignement et Action contre les Circuits FINanciers clandestins"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="GAFI/FATF"
                  secondary="Groupe d'Action Financière - Standards internationaux de lutte contre le blanchiment"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Déclaration de Soupçon"
                  secondary="Obligation légale de déclarer à TRACFIN toute opération suspecte"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};