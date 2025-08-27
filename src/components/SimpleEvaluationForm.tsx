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
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { frFR } from '@mui/x-date-pickers/locales';
import { AssessmentOutlined, Business, LocationOn, Euro, Person } from '@mui/icons-material';
import { 
  RiskAssessmentRequest, 
  ClientType, 
  PaymentMethod,
  RiskAssessmentResult 
} from '../types/lcbft';
import { COUNTRIES_LIST } from '../data/riskData';
import { LCBFTRiskEngine } from '../services/riskEngine';

interface SimpleEvaluationFormProps {
  onResults: (results: RiskAssessmentResult, formData: RiskAssessmentRequest) => void;
}

export const SimpleEvaluationForm: React.FC<SimpleEvaluationFormProps> = ({ onResults }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: string[] = [];
    if (!formData.transaction.montant || formData.transaction.montant <= 0) {
      newErrors.push("Montant de transaction invalide");
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

  return (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <AssessmentOutlined sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            Évaluation du Risque LCBFT
          </Typography>
        </Box>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            
            <Typography variant="h6" gutterBottom>
              🏢 Informations Client
            </Typography>
            
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Type de client</InputLabel>
                <Select
                  value={formData.client.type_client}
                  label="Type de client"
                  onChange={(e) => updateClient('type_client', e.target.value)}
                >
                  {Object.values(ClientType).map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Code NAF/APE"
                placeholder="Ex: 69.10Z"
                value={formData.client.code_naf || ''}
                onChange={(e) => updateClient('code_naf', e.target.value)}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {formData.client.type_client === ClientType.PERSONNE_PHYSIQUE && (
                <TextField
                  fullWidth
                  type="number"
                  label="Année de naissance"
                  value={formData.client.annee_naissance || ''}
                  onChange={(e) => updateClient('annee_naissance', parseInt(e.target.value) || undefined)}
                  inputProps={{ min: 1900, max: new Date().getFullYear() }}
                />
              )}

              <TextField
                fullWidth
                type="number"
                label="Durée relation commerciale (années)"
                value={formData.client.relation_etablie}
                onChange={(e) => updateClient('relation_etablie', parseInt(e.target.value) || 1)}
                inputProps={{ min: 0, max: 50 }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
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
                label="Sous sanctions internationales"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.client.notoriete_defavorable}
                    onChange={(e) => updateClient('notoriete_defavorable', e.target.checked)}
                  />
                }
                label="Notoriété défavorable"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.client.reticence_identification}
                    onChange={(e) => updateClient('reticence_identification', e.target.checked)}
                  />
                }
                label="Réticence identification"
              />
            </Stack>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              🌍 Facteurs Géographiques
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Pays de résidence</InputLabel>
                <Select
                  value={formData.geographic.pays_residence}
                  label="Pays de résidence"
                  onChange={(e) => updateGeographic('pays_residence', e.target.value)}
                >
                  {COUNTRIES_LIST.map(country => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Pays du compte bancaire</InputLabel>
                <Select
                  value={formData.geographic.pays_compte}
                  label="Pays du compte bancaire"
                  onChange={(e) => updateGeographic('pays_compte', e.target.value)}
                >
                  {COUNTRIES_LIST.map(country => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <TextField
              fullWidth
              type="number"
              label="Distance de votre établissement (km)"
              value={formData.geographic.distance_etablissement}
              onChange={(e) => updateGeographic('distance_etablissement', parseInt(e.target.value) || 0)}
              inputProps={{ min: 0, max: 10000 }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              💰 Transaction et Opération
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                type="number"
                label="Montant de la transaction (€)"
                value={formData.transaction.montant}
                onChange={(e) => updateTransaction('montant', parseFloat(e.target.value) || 0)}
                inputProps={{ min: 0 }}
              />

              <FormControl fullWidth>
                <InputLabel>Mode de paiement</InputLabel>
                <Select
                  value={formData.transaction.mode_paiement}
                  label="Mode de paiement"
                  onChange={(e) => updateTransaction('mode_paiement', e.target.value)}
                >
                  {Object.values(PaymentMethod).map(method => (
                    <MenuItem key={method} value={method}>{method}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                fullWidth
                label="Canal de distribution"
                value={formData.transaction.canal_distribution || ''}
                onChange={(e) => updateTransaction('canal_distribution', e.target.value)}
                placeholder="Présence physique, Vente à distance, etc."
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.transaction.complexite_montage}
                    onChange={(e) => updateTransaction('complexite_montage', e.target.checked)}
                  />
                }
                label="Montage juridique complexe"
              />
            </Stack>

            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AssessmentOutlined />}
                sx={{ px: 4 }}
              >
                🔍 Évaluer le Risque
              </Button>
            </Box>

          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};