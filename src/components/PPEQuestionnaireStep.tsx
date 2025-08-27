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
  FormControlLabel,
  Switch,
  Autocomplete,
  Stack
} from '@mui/material';
import { PPECategory, PPEFunctionType } from '../data/ppeRiskData';
import { COUNTRIES_LIST } from '../data/riskData';

export interface PPEInfo {
  category: PPECategory;
  function_type: PPEFunctionType;
  pays_fonction: string;
  is_current_function: boolean;
  patrimoine_important: boolean;
  activites_complexes: boolean;
  exposition_mediatique: boolean;
  reseaux_internationaux: boolean;
  family_members_ppe: boolean;
  close_associates_ppe: boolean;
}

const defaultPPEInfo: PPEInfo = {
  category: PPECategory.PPE_NATIONALE,
  function_type: PPEFunctionType.AUTRE_FONCTION_PUBLIQUE_IMPORTANTE,
  pays_fonction: 'France',
  is_current_function: true,
  patrimoine_important: false,
  activites_complexes: false,
  exposition_mediatique: false,
  reseaux_internationaux: false,
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


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Évaluation Personne Politiquement Exposée (PPE)
      </Typography>

      <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Card sx={{ flex: 1 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Classification PPE
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


                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Éléments supplémentaires
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safePPEInfo.patrimoine_important}
                        onChange={(e) => updatePPEInfo('patrimoine_important', e.target.checked)}
                      />
                    }
                    label="Patrimoine important par rapport aux revenus déclarés"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safePPEInfo.activites_complexes}
                        onChange={(e) => updatePPEInfo('activites_complexes', e.target.checked)}
                      />
                    }
                    label="Activités commerciales ou montages juridiques complexes"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safePPEInfo.exposition_mediatique}
                        onChange={(e) => updatePPEInfo('exposition_mediatique', e.target.checked)}
                      />
                    }
                    label="Forte exposition médiatique"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={safePPEInfo.reseaux_internationaux}
                        onChange={(e) => updatePPEInfo('reseaux_internationaux', e.target.checked)}
                      />
                    }
                    label="Réseaux d'affaires internationaux étendus"
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
      </Stack>
    </Box>
  );
};

export default PPEQuestionnaireStep;