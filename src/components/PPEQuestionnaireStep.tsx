import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  FormControlLabel,
  Switch,
  Autocomplete,
  Chip,
  Stack
} from '@mui/material';
import { PPECategory, PPEFunctionType, PPE_FUNCTION_RISK_LEVELS } from '../data/ppeRiskData';
import { COUNTRIES_LIST } from '../data/riskData';
import { RiskLevel } from '../types/lcbft';

export interface PPEInfo {
  is_ppe: boolean;
  category: PPECategory;
  function_type: PPEFunctionType;
  pays_fonction: string;
  is_current_function: boolean;
  function_end_date?: string;
  wealth_sources: string[];
  family_members_ppe: boolean;
  close_associates_ppe: boolean;
}

const defaultPPEInfo: PPEInfo = {
  is_ppe: false,
  category: PPECategory.PPE_NATIONALE,
  function_type: PPEFunctionType.AUTRE_FONCTION_PUBLIQUE_IMPORTANTE,
  pays_fonction: 'France',
  is_current_function: true,
  wealth_sources: [],
  family_members_ppe: false,
  close_associates_ppe: false
};

interface PPEQuestionnaireStepProps {
  ppeInfo: PPEInfo;
  onPPEInfoChange: (info: PPEInfo) => void;
}

const PPEQuestionnaireStep: React.FC<PPEQuestionnaireStepProps> = ({
  ppeInfo,
  onPPEInfoChange
}) => {
  const safePPEInfo = { ...defaultPPEInfo, ...ppeInfo };
  
  const updatePPEInfo = (field: keyof PPEInfo, value: any) => {
    onPPEInfoChange({
      ...safePPEInfo,
      [field]: value
    });
  };

  const getRiskLevel = (functionType: PPEFunctionType): RiskLevel => {
    return PPE_FUNCTION_RISK_LEVELS[functionType] || RiskLevel.MODERE;
  };

  const getCurrentRiskLevel = () => {
    if (!safePPEInfo.is_ppe) return RiskLevel.FAIBLE;
    return getRiskLevel(safePPEInfo.function_type);
  };

  const riskLevel = getCurrentRiskLevel();
  const riskColors = {
    [RiskLevel.FAIBLE]: 'success',
    [RiskLevel.MODERE]: 'warning', 
    [RiskLevel.ELEVE]: 'error',
    [RiskLevel.TRES_ELEVE]: 'error'
  } as const;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Évaluation Personne Politiquement Exposée (PPE)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Cette évaluation permet d'identifier les risques liés aux Personnes Politiquement Exposées selon la directive (UE) 2015/849.
      </Alert>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <FormControlLabel
              control={
                <Switch
                  checked={safePPEInfo.is_ppe}
                  onChange={(e) => updatePPEInfo('is_ppe', e.target.checked)}
                />
              }
              label="Le client est-il une Personne Politiquement Exposée (PPE) ?"
            />
          </CardContent>
        </Card>

        {safePPEInfo.is_ppe && (
          <>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Classification PPE
                    <Chip 
                      label={riskLevel}
                      color={riskColors[riskLevel]}
                      size="small"
                      sx={{ ml: 2 }}
                    />
                  </Typography>
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Catégorie PPE</InputLabel>
                    <Select
                      value={safePPEInfo.category}
                      onChange={(e) => updatePPEInfo('category', e.target.value)}
                      label="Catégorie PPE"
                    >
                      {Object.values(PPECategory).map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Type de fonction</InputLabel>
                    <Select
                      value={safePPEInfo.function_type}
                      onChange={(e) => updatePPEInfo('function_type', e.target.value)}
                      label="Type de fonction"
                    >
                      {Object.values(PPEFunctionType).map((functionType) => (
                        <MenuItem key={functionType} value={functionType}>
                          {functionType}
                          <Chip 
                            label={getRiskLevel(functionType)}
                            color={riskColors[getRiskLevel(functionType)]}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Autocomplete
                    fullWidth
                    options={COUNTRIES_LIST}
                    value={safePPEInfo.pays_fonction || 'France'}
                    onChange={(_, value) => updatePPEInfo('pays_fonction', value || 'France')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Pays d'exercice de la fonction"
                        margin="normal"
                      />
                    )}
                  />
                </CardContent>
              </Card>

              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statut de la fonction
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safePPEInfo.is_current_function}
                        onChange={(e) => updatePPEInfo('is_current_function', e.target.checked)}
                      />
                    }
                    label="Fonction actuellement exercée"
                  />

                  {!safePPEInfo.is_current_function && (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Date de fin de fonction"
                      type="date"
                      value={safePPEInfo.function_end_date || ''}
                      onChange={(e) => updatePPEInfo('function_end_date', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}

                  <TextField
                    fullWidth
                    margin="normal"
                    label="Sources de richesse (déclaration)"
                    multiline
                    rows={3}
                    value={safePPEInfo.wealth_sources.join('\n')}
                    onChange={(e) => updatePPEInfo('wealth_sources', e.target.value.split('\n').filter(s => s.trim()))}
                    placeholder="Ex: Salaire fonction publique, héritages, revenus immobiliers..."
                  />
                </CardContent>
              </Card>
            </Box>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Liens familiaux et associés
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={safePPEInfo.family_members_ppe}
                          onChange={(e) => updatePPEInfo('family_members_ppe', e.target.checked)}
                        />
                      }
                      label="Membres de famille également PPE"
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={safePPEInfo.close_associates_ppe}
                          onChange={(e) => updatePPEInfo('close_associates_ppe', e.target.checked)}
                        />
                      }
                      label="Proches collaborateurs PPE"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default PPEQuestionnaireStep;