import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Stack,
  Autocomplete,
  Slider,
  Divider,
  Chip,
  Grid,
  Paper,
  RadioGroup,
  Radio,
  FormLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR } from '@mui/x-date-pickers/locales';
import { fr } from 'date-fns/locale';
import { AssessmentOutlined, Business, LocationOn, Euro, Person, Security, Warning } from '@mui/icons-material';
import { 
  RiskAssessmentRequest, 
  ClientType, 
  PaymentMethod,
  RiskAssessmentResult 
} from '../types/lcbft';
import { COUNTRIES_LIST, RISK_DATA } from '../data/riskData';
import { LCBFTRiskEngine } from '../services/riskEngine';

interface EnhancedEvaluationFormProps {
  onResults: (results: RiskAssessmentResult, formData: RiskAssessmentRequest) => void;
}

// Données additionnelles pour les formulaires
const COMMON_NAF_CODES = [
  { code: '69.10Z', label: 'Activités juridiques', risk: 'ELEVE' },
  { code: '69.20Z', label: 'Activités comptables', risk: 'ELEVE' },
  { code: '68.31Z', label: 'Agences immobilières', risk: 'ELEVE' },
  { code: '41.20A', label: 'Construction de maisons individuelles', risk: 'ELEVE' },
  { code: '92.00Z', label: 'Organisation de jeux de hasard et d\'argent', risk: 'TRES_ELEVE' },
  { code: '64.99Z', label: 'Autres intermédiations monétaires (crypto-actifs)', risk: 'TRES_ELEVE' },
  { code: '47.77Z', label: 'Commerce de détail d\'articles d\'horlogerie et de bijouterie', risk: 'ELEVE' },
  { code: '82.11Z', label: 'Services administratifs combinés de bureau (domiciliation)', risk: 'ELEVE' },
  { code: '41.1', label: 'Promotion immobilière', risk: 'MODERE' },
  { code: '62.01Z', label: 'Programmation informatique', risk: 'STANDARD' },
  { code: '70.22Z', label: 'Conseil pour les affaires et autres conseils de gestion', risk: 'STANDARD' }
];

const CANAL_DISTRIBUTION = [
  'Présence physique en agence',
  'Vente à distance (Internet)',
  'Intermédiaire en assurance',
  'Courtier indépendant',
  'Partenariat bancaire',
  'Téléphone',
  'Application mobile'
];

const TRANSACTION_AMOUNTS = [
  { value: 5000, label: 'Moins de 5 000 €' },
  { value: 15000, label: '5 000 € - 15 000 €' },
  { value: 35000, label: '15 000 € - 50 000 €' },
  { value: 75000, label: '50 000 € - 100 000 €' },
  { value: 150000, label: '100 000 € - 200 000 €' },
  { value: 300000, label: '200 000 € - 500 000 €' },
  { value: 1000000, label: 'Plus de 500 000 €' }
];

export const EnhancedEvaluationForm: React.FC<EnhancedEvaluationFormProps> = ({ onResults }) => {
  const [formData, setFormData] = useState<RiskAssessmentRequest>({
    client: {
      type_client: ClientType.PERSONNE_PHYSIQUE,
      pep: false,
      sanctions: false,
      relation_etablie: 1,
      notoriete_defavorable: false,
      reticence_identification: false
    },
    geographic: {
      pays_residence: 'France',
      pays_compte: 'France',
      distance_etablissement: 50
    },
    transaction: {
      montant: 500,
      mode_paiement: PaymentMethod.VIREMENT,
      complexite_montage: false
    }
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [selectedNafCode, setSelectedNafCode] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    if (!formData.transaction.montant || formData.transaction.montant <= 0) {
      newErrors.push("Montant de transaction invalide");
    }
    if (formData.client.type_client === ClientType.PERSONNE_MORALE && !formData.client.code_naf) {
      newErrors.push("Code NAF/APE obligatoire pour les personnes morales");
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors([]);
    
    try {
      const results = LCBFTRiskEngine.evaluate(formData);
      onResults(results, formData);
    } catch (error) {
      setErrors(['Erreur lors de l\'évaluation du risque']);
    }
  };

  const updateClient = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [field]: value }
    }));
  };

  const updateGeographic = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      geographic: { ...prev.geographic, [field]: value }
    }));
  };

  const updateTransaction = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      transaction: { ...prev.transaction, [field]: value }
    }));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'TRES_ELEVE': return '#d32f2f';
      case 'ELEVE': return '#f57c00';
      case 'MODERE': return '#fbc02d';
      default: return '#4caf50';
    }
  };

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={fr}
      localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Card elevation={3}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <AssessmentOutlined sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Évaluation du Risque LCBFT
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Outil d'évaluation conforme aux standards GAFI/TRACFIN
              </Typography>
            </Box>
          </Box>

          {errors.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              
              {/* SECTION 1: Informations Client */}
              <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderLeftColor: 'primary.main' }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Person sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    🏢 Informations Client
                  </Typography>
                </Box>
                
                <Stack spacing={3}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Type de client *
                    </FormLabel>
                    <RadioGroup
                      row
                      value={formData.client.type_client}
                      onChange={(e) => updateClient('type_client', e.target.value)}
                    >
                      <FormControlLabel 
                        value={ClientType.PERSONNE_PHYSIQUE} 
                        control={<Radio />} 
                        label="Personne physique" 
                      />
                      <FormControlLabel 
                        value={ClientType.PERSONNE_MORALE} 
                        control={<Radio />} 
                        label="Personne morale" 
                      />
                    </RadioGroup>
                  </FormControl>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    {formData.client.type_client === ClientType.PERSONNE_MORALE && (
                      <Autocomplete
                        fullWidth
                        options={COMMON_NAF_CODES}
                        getOptionLabel={(option) => `${option.code} - ${option.label}`}
                        value={selectedNafCode}
                        onChange={(_, newValue) => {
                          setSelectedNafCode(newValue);
                          updateClient('code_naf', newValue?.code);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Code NAF/APE *" placeholder="Rechercher un secteur d'activité" />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body1" fontWeight="bold">
                                {option.code}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {option.label}
                              </Typography>
                              <Chip 
                                size="small" 
                                label={option.risk === 'TRES_ELEVE' ? 'Très Élevé' : option.risk === 'ELEVE' ? 'Élevé' : option.risk === 'MODERE' ? 'Modéré' : 'Standard'} 
                                sx={{ 
                                  backgroundColor: getRiskColor(option.risk),
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  mt: 0.5
                                }}
                              />
                            </Box>
                          </Box>
                        )}
                      />
                    )}

                    {formData.client.type_client === ClientType.PERSONNE_MORALE && (
                      <DatePicker
                        label="Date de création de la société"
                        value={formData.client.date_creation || null}
                        onChange={(date) => updateClient('date_creation', date)}
                        format="dd/MM/yyyy"
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            helperText: "Format: JJ/MM/YYYY - Influence le score de risque si récente"
                          } 
                        }}
                      />
                    )}

                    {formData.client.type_client === ClientType.PERSONNE_PHYSIQUE && (
                      <TextField
                        fullWidth
                        type="number"
                        label="Année de naissance"
                        value={formData.client.annee_naissance || ''}
                        onChange={(e) => updateClient('annee_naissance', parseInt(e.target.value) || undefined)}
                        inputProps={{ min: 1900, max: new Date().getFullYear() }}
                        helperText="Optionnel - Pour évaluer les risques liés à l'âge"
                      />
                    )}
                  </Stack>

                  <Box>
                    <Typography gutterBottom fontWeight="bold">
                      Durée de la relation commerciale: {formData.client.relation_etablie} année(s)
                    </Typography>
                    <Slider
                      value={formData.client.relation_etablie}
                      onChange={(_, value) => updateClient('relation_etablie', value)}
                      min={0}
                      max={20}
                      marks={[
                        { value: 0, label: '< 1 an' },
                        { value: 1, label: '1 an' },
                        { value: 5, label: '5 ans' },
                        { value: 10, label: '10 ans' },
                        { value: 20, label: '20+ ans' }
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ mt: 2 }}
                    />
                  </Box>

                  <Divider />

                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                      <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Indicateurs de Risque Élevé
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.client.pep}
                            onChange={(e) => updateClient('pep', e.target.checked)}
                            color="warning"
                          />
                        }
                        label="PEP (Personne Politiquement Exposée)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.client.sanctions}
                            onChange={(e) => updateClient('sanctions', e.target.checked)}
                            color="error"
                          />
                        }
                        label="Personne sous sanctions internationales"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.client.notoriete_defavorable}
                            onChange={(e) => updateClient('notoriete_defavorable', e.target.checked)}
                            color="error"
                          />
                        }
                        label="Notoriété défavorable (médias)"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.client.reticence_identification}
                            onChange={(e) => updateClient('reticence_identification', e.target.checked)}
                            color="warning"
                          />
                        }
                        label="Réticence à l'identification"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              {/* SECTION 2: Facteurs Géographiques */}
              <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderLeftColor: 'info.main' }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <LocationOn sx={{ mr: 2, color: 'info.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    🌍 Facteurs Géographiques
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <Autocomplete
                      fullWidth
                      options={COUNTRIES_LIST}
                      value={formData.geographic.pays_residence}
                      onChange={(_, value) => updateGeographic('pays_residence', value || 'France')}
                      renderInput={(params) => (
                        <TextField {...params} label="Pays de résidence *" />
                      )}
                      renderOption={(props, option) => {
                        const isHighRisk = RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) || 
                                          RISK_DATA.PAYS_RISQUE.ELEVE.includes(option);
                        return (
                          <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{option}</span>
                            {isHighRisk && (
                              <Chip 
                                size="small" 
                                label={RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) ? 'Très Élevé' : 'Élevé'} 
                                color={RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) ? 'error' : 'warning'}
                              />
                            )}
                          </Box>
                        );
                      }}
                    />

                    <Autocomplete
                      fullWidth
                      options={COUNTRIES_LIST}
                      value={formData.geographic.pays_compte}
                      onChange={(_, value) => updateGeographic('pays_compte', value || 'France')}
                      renderInput={(params) => (
                        <TextField {...params} label="Pays du compte bancaire *" />
                      )}
                      renderOption={(props, option) => {
                        const isHighRisk = RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) || 
                                          RISK_DATA.PAYS_RISQUE.ELEVE.includes(option);
                        return (
                          <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{option}</span>
                            {isHighRisk && (
                              <Chip 
                                size="small" 
                                label={RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) ? 'Très Élevé' : 'Élevé'} 
                                color={RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(option) ? 'error' : 'warning'}
                              />
                            )}
                          </Box>
                        );
                      }}
                    />
                  </Stack>

                  <Box>
                    <Typography gutterBottom fontWeight="bold">
                      Distance de votre établissement: {formData.geographic.distance_etablissement} km
                    </Typography>
                    <Slider
                      value={formData.geographic.distance_etablissement}
                      onChange={(_, value) => updateGeographic('distance_etablissement', value)}
                      min={0}
                      max={1000}
                      marks={[
                        { value: 0, label: '0 km' },
                        { value: 50, label: '50 km' },
                        { value: 100, label: '100 km' },
                        { value: 500, label: '500 km' },
                        { value: 1000, label: '1000+ km' }
                      ]}
                      valueLabelDisplay="auto"
                      sx={{ mt: 2 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      Distance &gt; 100km = facteur de risque supplémentaire
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* SECTION 3: Transaction et Opération */}
              <Paper elevation={2} sx={{ p: 3, borderLeft: 4, borderLeftColor: 'success.main' }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Euro sx={{ mr: 2, color: 'success.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    💰 Transaction et Opération
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Montant de la transaction *</InputLabel>
                      <Select
                        value={formData.transaction.montant}
                        label="Montant de la transaction *"
                        onChange={(e) => updateTransaction('montant', e.target.value)}
                      >
                        {TRANSACTION_AMOUNTS.map(amount => (
                          <MenuItem key={amount.value} value={amount.value}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                              <span>{amount.label}</span>
                              {amount.value > 50000 && (
                                <Chip 
                                  size="small" 
                                  label={amount.value > 100000 ? '+2 pts' : '+1 pt'} 
                                  color="warning"
                                />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel>Mode de paiement *</InputLabel>
                      <Select
                        value={formData.transaction.mode_paiement}
                        label="Mode de paiement *"
                        onChange={(e) => updateTransaction('mode_paiement', e.target.value)}
                      >
                        {Object.values(PaymentMethod).map(method => (
                          <MenuItem key={method} value={method}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                              <span>{method}</span>
                              {(method === PaymentMethod.ESPECES || method === PaymentMethod.FRACTIONNE) && (
                                <Chip size="small" label="+3 pts" color="error" />
                              )}
                              {method === PaymentMethod.VIREMENT_INTL && (
                                <Chip size="small" label="+2 pts" color="warning" />
                              )}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>

                  <Autocomplete
                    fullWidth
                    options={CANAL_DISTRIBUTION}
                    value={formData.transaction.canal_distribution || null}
                    onChange={(_, value) => updateTransaction('canal_distribution', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Canal de distribution" placeholder="Sélectionnez un canal" />
                    )}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.transaction.complexite_montage}
                        onChange={(e) => updateTransaction('complexite_montage', e.target.checked)}
                        color="warning"
                      />
                    }
                    label={
                      <Box>
                        <Typography component="span">
                          Montage juridique complexe 
                        </Typography>
                        <Typography variant="caption" display="block" color="textSecondary">
                          (Difficile d'identifier le bénéficiaire effectif - +3 points de risque)
                        </Typography>
                      </Box>
                    }
                  />
                </Stack>
              </Paper>

              {/* Submit Button */}
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Security />}
                  sx={{ 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    boxShadow: 3
                  }}
                >
                  🔍 Lancer l'Évaluation LCBFT
                </Button>
              </Box>

            </Stack>
          </form>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};