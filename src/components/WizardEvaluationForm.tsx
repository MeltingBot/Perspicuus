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
  Stepper,
  Step,
  StepLabel,
  Paper,
  RadioGroup,
  Radio,
  FormLabel,
  LinearProgress,
  Fade,
  Tooltip,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR } from '@mui/x-date-pickers/locales';
import { fr } from 'date-fns/locale';
import { 
  NavigateNext, 
  NavigateBefore, 
  AssessmentOutlined, 
  Business,
  LocationOn, 
  Euro, 
  Person, 
  Security,
  InfoOutlined
} from '@mui/icons-material';
import { 
  RiskAssessmentRequest, 
  ClientType, 
  PaymentMethod,
  RiskAssessmentResult 
} from '../types/lcbft';
import { COUNTRIES_LIST, isNPO, isTravelRuleProvider, isWealthManagementClient } from '../data/riskData';
import { TRAVEL_RULE_THRESHOLDS } from '../data/travelRuleData';
import { LCBFTRiskEngine } from '../services/riskEngine';
import { ApeCodeSearch } from './ApeCodeSearch';
import { ApeCode } from '../services/apeCodeService';
import NPOEvaluationStep from './NPOEvaluationStep';
import TravelRuleStep from './TravelRuleStep';
import WealthManagementStep from './WealthManagementStep';
import PPEQuestionnaireStep from './PPEQuestionnaireStep';
import { ClientCategory } from '../types/lcbft';
import { NPOInfo } from './NPOEvaluationStep';
import { TravelRuleInfo } from './TravelRuleStep';
import { WealthManagementInfo } from './WealthManagementStep';
import { PPEInfo } from './PPEQuestionnaireStep';

interface WizardEvaluationFormProps {
  onResults: (results: RiskAssessmentResult, formData: RiskAssessmentRequest) => void;
}


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

const getSteps = (isNPOClient: boolean, isTravelRuleClient: boolean, isWealthClient: boolean, isPEP: boolean) => {
  const baseSteps = [
    'Informations Client',
    'Localisation', 
    'Transaction',
    'Vérifications'
  ];
  
  // Ajouter les évaluations spécialisées APRÈS vérifications
  if (isPEP) {
    baseSteps.push('Évaluation PEP');
  }
  
  if (isNPOClient) {
    baseSteps.push('Évaluation NPO');
  }
  
  if (isTravelRuleClient) {
    baseSteps.push('Travel Rule');
  }
  
  if (isWealthClient) {
    baseSteps.push('Wealth Management');
  }
  
  return baseSteps;
};

export const WizardEvaluationForm: React.FC<WizardEvaluationFormProps> = ({ onResults }) => {
  const [activeStep, setActiveStep] = useState(0);
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
      montant: 2000,
      mode_paiement: PaymentMethod.VIREMENT,
      complexite_montage: false
    }
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [selectedApeCode, setSelectedApeCode] = useState<ApeCode | null>(null);
  const [npoInfo, setNpoInfo] = useState<Partial<NPOInfo>>({});
  const [travelRuleInfo, setTravelRuleInfo] = useState<Partial<TravelRuleInfo>>({});
  const [wealthManagementInfo, setWealthManagementInfo] = useState<Partial<WealthManagementInfo>>({});
  const [ppeInfo, setPpeInfo] = useState<Partial<PPEInfo>>({});
  
  // Cases à cocher manuelles pour les PP
  const [manualTravelRule, setManualTravelRule] = useState(false);
  const [manualWealthManagement, setManualWealthManagement] = useState(false);
  
  // Helper function pour obtenir le seuil Travel Rule applicable
  const getTravelRuleThreshold = (clientCountry: string, transactionCountry?: string): number => {
    const countries = [clientCountry, transactionCountry].filter(Boolean);
    const thresholds = countries.map(country => {
      if (country === 'États-Unis') return TRAVEL_RULE_THRESHOLDS.USA;
      if (country === 'Suisse') return TRAVEL_RULE_THRESHOLDS.SUISSE;
      if (country === 'Royaume-Uni') return TRAVEL_RULE_THRESHOLDS.ROYAUME_UNI;
      if (country === 'Canada') return TRAVEL_RULE_THRESHOLDS.CANADA;
      if (country === 'Japon') return TRAVEL_RULE_THRESHOLDS.JAPON;
      if (country === 'Singapour') return TRAVEL_RULE_THRESHOLDS.SINGAPOUR;
      return TRAVEL_RULE_THRESHOLDS.UE;
    });
    return Math.min(...thresholds, TRAVEL_RULE_THRESHOLDS.DEFAULT);
  };

  // Détection automatique NPO, Travel Rule, Wealth Management et PEP
  const isNPOClient = formData.client.category === ClientCategory.NPO || isNPO(formData.client.code_naf);
  
  // Travel Rule activation: différent selon PP/PM + crypto avec montant élevé
  const travelRuleThreshold = getTravelRuleThreshold(formData.geographic.pays_residence, formData.geographic.pays_compte);
  const isCryptoAboveThreshold = formData.transaction.mode_paiement === PaymentMethod.CRYPTOMONNAIES && 
                                formData.transaction.montant >= travelRuleThreshold;
  const isCryptoPortfolioManager = formData.client.type_client === ClientType.PERSONNE_MORALE && 
                                   formData.client.code_naf && 
                                   (formData.client.code_naf.includes('66.19Z') || // Autres auxiliaires financiers
                                    formData.client.code_naf.includes('66.30Z') || // Gestion de portefeuille
                                    formData.client.code_naf.includes('64.99Z'));  // Services financiers crypto
  const isTravelRuleClient = !!(formData.client.category === ClientCategory.TRANSFER_MONITORING || 
                             (formData.client.type_client === ClientType.PERSONNE_MORALE ? isTravelRuleProvider(formData.client.code_naf) : manualTravelRule) ||
                             isCryptoAboveThreshold ||
                             isCryptoPortfolioManager);
  
  // Wealth Management: différent selon PP/PM                           
  const isWealthClient = !!(formData.client.category === ClientCategory.WEALTH_MANAGEMENT || 
                          (formData.client.type_client === ClientType.PERSONNE_MORALE ? isWealthManagementClient(formData.client.code_naf) : manualWealthManagement));
  const isPEPClient = formData.client.pep;
  const steps = React.useMemo(() => getSteps(isNPOClient, isTravelRuleClient, isWealthClient, isPEPClient), [isNPOClient, isTravelRuleClient, isWealthClient, isPEPClient]);

  const updateClient = (field: string, value: any) => {
    const newClient = { ...formData.client, [field]: value };
    
    // Détection automatique NPO lors du changement de code NAF
    if (field === 'code_naf' && isNPO(value)) {
      newClient.category = ClientCategory.NPO;
    }
    
    setFormData(prev => ({
      ...prev,
      client: newClient
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

  const handleNext = () => {
    const stepErrors: string[] = [];
    
    switch (activeStep) {
      case 0: // Validation étape Client
        if (formData.client.type_client === ClientType.PERSONNE_MORALE && !formData.client.code_naf) {
          stepErrors.push("Code NAF/APE obligatoire pour les personnes morales");
        }
        break;
      case 2: // Validation étape Transaction
        if (!formData.transaction.montant || formData.transaction.montant <= 0) {
          stepErrors.push("Montant de transaction obligatoire");
        }
        break;
    }

    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors([]);
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setErrors([]);
    setActiveStep(prev => prev - 1);
  };

  const handleFinish = () => {
    const finalErrors: string[] = [];
    
    if (!formData.transaction.montant || formData.transaction.montant <= 0) {
      finalErrors.push("Montant de transaction invalide");
    }
    if (formData.client.type_client === ClientType.PERSONNE_MORALE && !formData.client.code_naf) {
      finalErrors.push("Code NAF/APE obligatoire pour les personnes morales");
    }
    
    if (finalErrors.length > 0) {
      setErrors(finalErrors);
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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Stack spacing={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 2, color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold">
                  Informations Client
                </Typography>
              </Box>

              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 2 }}>
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


              {formData.client.type_client === ClientType.PERSONNE_MORALE && (
                <Stack spacing={3}>
                  <ApeCodeSearch
                    value={selectedApeCode}
                    onChange={(apeCode) => {
                      setSelectedApeCode(apeCode);
                      updateClient('code_naf', apeCode?.code || undefined);
                    }}
                    label="Code NAF/APE"
                    placeholder="Rechercher par code (ex: 69.10Z) ou par activité (ex: avocat)"
                    required={true}
                    helperText="Recherche dynamique dans plus de 700 codes d'activité"
                  />

                  <DatePicker
                    label="Date de création de la société"
                    value={formData.client.date_creation || null}
                    onChange={(date) => updateClient('date_creation', date)}
                    format="dd/MM/yyyy"
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        helperText: "Format: JJ/MM/YYYY - Optionnel pour évaluer l'ancienneté"
                      } 
                    }}
                  />
                </Stack>
              )}

              {formData.client.type_client === ClientType.PERSONNE_PHYSIQUE && (
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Année de naissance"
                    value={formData.client.annee_naissance || ''}
                    onChange={(e) => updateClient('annee_naissance', parseInt(e.target.value) || undefined)}
                    inputProps={{ min: 1900, max: new Date().getFullYear() }}
                    helperText="Optionnel - Pour évaluer les facteurs liés à l'âge"
                  />

                </Stack>
              )}

              <Box>
                <Typography gutterBottom fontWeight="bold" mb={2}>
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
                />
              </Box>
            </Stack>
          </Fade>
        );

      case 1:
        return (
          <Fade in timeout={500}>
            <Stack spacing={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <LocationOn sx={{ mr: 2, color: 'info.main', fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold">
                  Informations Géographiques
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Autocomplete
                  fullWidth
                  options={COUNTRIES_LIST}
                  value={formData.geographic.pays_residence}
                  onChange={(_, value) => updateGeographic('pays_residence', value || 'France')}
                  renderInput={(params) => (
                    <TextField {...params} label="Pays de résidence *" />
                  )}
                />

                <Autocomplete
                  fullWidth
                  options={COUNTRIES_LIST}
                  value={formData.geographic.pays_compte}
                  onChange={(_, value) => updateGeographic('pays_compte', value || 'France')}
                  renderInput={(params) => (
                    <TextField {...params} label="Pays du compte bancaire *" />
                  )}
                />
              </Stack>

              <Box>
                <Typography gutterBottom fontWeight="bold" mb={1}>
                  Distance de votre établissement: {formData.geographic.distance_etablissement} km
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Distance entre le domicile/siège social du client et votre établissement
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
                />
              </Box>
            </Stack>
          </Fade>
        );

      case 2:
        return (
          <Fade in timeout={500}>
            <Stack spacing={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Euro sx={{ mr: 2, color: 'success.main', fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
                  Transactions Typiques du Client
                </Typography>
                <Tooltip 
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Aide pour l'évaluation
                      </Typography>
                      <Typography variant="body2" component="div">
                        Ces informations permettent d'évaluer le niveau de risque selon :
                        <br />
                        • <strong>Seuils réglementaires</strong> : {'>'}50K€ et {'>'}100K€
                        <br />
                        • <strong>Moyens de paiement à risque</strong> : espèces, crypto, fractionnement
                        <br />
                        • <strong>Canaux sensibles</strong> : correspondants, internet sans contrôle
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="left"
                >
                  <IconButton size="small" sx={{ color: 'info.main' }}>
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Décrivez les <strong>transactions habituelles</strong> de ce client dans le cadre normal de son activité.
                </Typography>
              </Alert>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Montant typique des opérations *</InputLabel>
                  <Select
                    value={formData.transaction.montant}
                    label="Montant typique des opérations *"
                    onChange={(e) => updateTransaction('montant', e.target.value)}
                  >
                    {TRANSACTION_AMOUNTS.map(amount => (
                      <MenuItem key={amount.value} value={amount.value}>
                        {amount.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Mode de paiement habituel *</InputLabel>
                  <Select
                    value={formData.transaction.mode_paiement}
                    label="Mode de paiement habituel *"
                    onChange={(e) => updateTransaction('mode_paiement', e.target.value)}
                  >
                    {Object.values(PaymentMethod).map(method => (
                      <MenuItem key={method} value={method}>
                        {method}
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
                  <TextField {...params} label="Canal de distribution habituel" placeholder="Comment il effectue ses opérations" />
                )}
              />

            </Stack>
          </Fade>
        );


      default:
        // Gestion dynamique des étapes spécialisées
        const currentStepName = steps[step];
        
        if (currentStepName === 'Évaluation NPO' && isNPOClient) {
          return (
            <Fade in timeout={500}>
              <Stack spacing={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Business sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Évaluation Spécialisée NPO
                  </Typography>
                </Box>

                <NPOEvaluationStep
                  npoInfo={npoInfo as NPOInfo}
                  onNPOInfoChange={setNpoInfo}
                />
              </Stack>
            </Fade>
          );
        }

        if (currentStepName === 'Travel Rule' && isTravelRuleClient) {
          return (
            <Fade in timeout={500}>
              <Stack spacing={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssessmentOutlined sx={{ mr: 2, color: 'secondary.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Évaluation Travel Rule
                  </Typography>
                </Box>

                <TravelRuleStep
                  travelRuleInfo={travelRuleInfo as TravelRuleInfo}
                  onTravelRuleInfoChange={setTravelRuleInfo}
                />
              </Stack>
            </Fade>
          );
        }

        if (currentStepName === 'Wealth Management') {
          return (
            <Fade in timeout={500}>
              <Stack spacing={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssessmentOutlined color="primary" sx={{ mr: 2 }} />
                  <Typography variant="h5" color="primary.main" fontWeight="bold">
                    Évaluation Wealth Management
                  </Typography>
                </Box>

                <WealthManagementStep
                  wealthManagementInfo={wealthManagementInfo as WealthManagementInfo}
                  onWealthManagementInfoChange={setWealthManagementInfo}
                />
              </Stack>
            </Fade>
          );
        }

        if (currentStepName === 'Évaluation PEP' && isPEPClient) {
          return (
            <Fade in timeout={500}>
              <Stack spacing={4}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                  <Typography variant="h5" fontWeight="bold" color="warning.main">
                    Évaluation PEP
                  </Typography>
                </Box>

                <PPEQuestionnaireStep
                  ppeInfo={ppeInfo as PPEInfo}
                  onPPEInfoChange={setPpeInfo}
                />
              </Stack>
            </Fade>
          );
        }

        if (currentStepName === 'Vérifications') {
        
        return (
          <Fade in timeout={500}>
            <Stack spacing={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Security sx={{ mr: 2, color: 'warning.main', fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold">
                  Vérifications Complémentaires
                </Typography>
              </Box>

              <Typography variant="body1" color="textSecondary" mb={3}>
                Cochez les éléments qui s'appliquent à votre client (optionnel)
              </Typography>

              <Stack spacing={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.client.pep}
                      onChange={(e) => updateClient('pep', e.target.checked)}
                    />
                  }
                  label="PEP (Personne Politiquement Exposée)"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.client.sanctions}
                      onChange={(e) => updateClient('sanctions', e.target.checked)}
                    />
                  }
                  label="Personne sous sanctions internationales"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.client.notoriete_defavorable}
                      onChange={(e) => updateClient('notoriete_defavorable', e.target.checked)}
                    />
                  }
                  label="Notoriété défavorable (médias)"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.client.reticence_identification}
                      onChange={(e) => updateClient('reticence_identification', e.target.checked)}
                    />
                  }
                  label="Réticence à l'identification"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.transaction.complexite_montage}
                      onChange={(e) => updateTransaction('complexite_montage', e.target.checked)}
                    />
                  }
                  label="Montage juridique complexe (difficile d'identifier le bénéficiaire effectif)"
                />

                {formData.client.type_client === ClientType.PERSONNE_PHYSIQUE && (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={manualTravelRule}
                          onChange={(e) => setManualTravelRule(e.target.checked)}
                        />
                      }
                      label="Activité de transferts monétaires (Travel Rule)"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={manualWealthManagement}
                          onChange={(e) => setManualWealthManagement(e.target.checked)}
                        />
                      }
                      label="Client gestion de fortune / Family Office"
                    />
                  </>
                )}
              </Stack>
            </Stack>
          </Fade>
        );
        }

        return null;
    }
  };

  return (
    <LocalizationProvider 
      dateAdapter={AdapterDateFns} 
      adapterLocale={fr}
      localeText={frFR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Card elevation={3} sx={{ maxWidth: 800, margin: 'auto' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={4}>
            <AssessmentOutlined sx={{ mr: 2, color: 'primary.main', fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                Évaluation LCBFT
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Assistant d'évaluation des risques
              </Typography>
            </Box>
          </Box>

          <Box mb={4}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel 
                    onClick={() => setActiveStep(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <LinearProgress 
              variant="determinate" 
              value={(activeStep / (steps.length - 1)) * 100} 
              sx={{ mt: 2, height: 6, borderRadius: 3 }}
            />
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

          <Paper elevation={1} sx={{ p: 4, mb: 4, minHeight: 400 }}>
            {renderStepContent(activeStep)}
          </Paper>

          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<NavigateBefore />}
              variant="outlined"
              size="large"
            >
              Précédent
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                onClick={handleFinish}
                variant="contained"
                size="large"
                startIcon={<Security />}
                sx={{ px: 4 }}
              >
                Lancer l'Évaluation
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                variant="contained"
                size="large"
                endIcon={<NavigateNext />}
                sx={{ px: 4 }}
              >
                Suivant
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};