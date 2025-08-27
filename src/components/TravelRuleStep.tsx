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
  Stack,
  Autocomplete
} from '@mui/material';
import { TravelRuleTransactionType } from '../data/travelRuleData';
import { COUNTRIES_LIST } from '../data/riskData';

export interface TravelRuleInfo {
  transaction_type: TravelRuleTransactionType;
  amount: number;
  currency: string;
  originator_country: string;
  beneficiary_country: string;
  is_cross_border: boolean;
  originator_name: string;
  beneficiary_name: string;
  sending_institution: string;
  receiving_institution: string;
}

interface TravelRuleStepProps {
  travelRuleInfo: TravelRuleInfo;
  onTravelRuleInfoChange: (info: TravelRuleInfo) => void;
}

const TravelRuleStep: React.FC<TravelRuleStepProps> = ({
  travelRuleInfo,
  onTravelRuleInfoChange
}) => {
  const handleChange = (field: keyof TravelRuleInfo, value: any) => {
    const updatedInfo = {
      ...travelRuleInfo,
      [field]: value
    };
    
    // Détection automatique des transactions transfrontalières
    if (field === 'originator_country' || field === 'beneficiary_country') {
      const originatorCountry = field === 'originator_country' ? value : travelRuleInfo.originator_country;
      const beneficiaryCountry = field === 'beneficiary_country' ? value : travelRuleInfo.beneficiary_country;
      
      if (originatorCountry && beneficiaryCountry && originatorCountry !== beneficiaryCountry) {
        updatedInfo.is_cross_border = true;
      } else if (originatorCountry && beneficiaryCountry && originatorCountry === beneficiaryCountry) {
        updatedInfo.is_cross_border = false;
      }
    }
    
    onTravelRuleInfoChange(updatedInfo);
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Règle du Voyage des Fonds (Travel Rule)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Travel Rule</strong> - Évaluation d'une transaction spécifique soumise aux obligations de transmission d'informations.
        </Typography>
      </Alert>


      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Transaction soumise à la Règle du Voyage
          </Typography>
          
          
          <Stack spacing={3}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Type de transaction</InputLabel>
              <Select
                value={travelRuleInfo.transaction_type}
                onChange={(e) => handleChange('transaction_type', e.target.value)}
                label="Type de transaction"
              >
                {Object.values(TravelRuleTransactionType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Montant de la transaction spécifique (€)"
              type="number"
              value={travelRuleInfo.amount}
              onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <Autocomplete
                fullWidth
                options={COUNTRIES_LIST}
                value={travelRuleInfo.originator_country || null}
                onChange={(_, value) => handleChange('originator_country', value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Pays du donneur d'ordre"
                    placeholder="Rechercher un pays..."
                  />
                )}
              />

              <Autocomplete
                fullWidth
                options={COUNTRIES_LIST}
                value={travelRuleInfo.beneficiary_country || null}
                onChange={(_, value) => handleChange('beneficiary_country', value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="Pays du bénéficiaire"
                    placeholder="Rechercher un pays..."
                  />
                )}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TravelRuleStep;