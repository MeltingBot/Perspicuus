import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  Card,
  CardContent,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Stack
} from '@mui/material';
import {
  WealthManagementServiceType,
  WealthSource,
  InvestmentVehicleType,
  ClientSegment,
  ENHANCED_VIGILANCE_THRESHOLDS
} from '../data/wealthManagementRiskData';
import { RiskLevel } from '../types/lcbft';

export interface WealthManagementInfo {
  client_segment: ClientSegment;
  assets_under_management: number;
  wealth_sources: WealthSource[];
  service_types: WealthManagementServiceType[];
  investment_vehicles: InvestmentVehicleType[];
  geographic_exposure: string[];
  liquidity_needs: 'HIGH' | 'MEDIUM' | 'LOW';
  risk_tolerance: RiskLevel;
}

const defaultWealthManagementInfo: WealthManagementInfo = {
  client_segment: ClientSegment.PARTICULIER_FORTUNE,
  assets_under_management: 0,
  wealth_sources: [],
  service_types: [],
  investment_vehicles: [],
  geographic_exposure: [],
  liquidity_needs: 'MEDIUM',
  risk_tolerance: RiskLevel.MODERE
};

interface WealthManagementStepProps {
  wealthManagementInfo: WealthManagementInfo;
  onWealthManagementInfoChange: (info: WealthManagementInfo) => void;
}

const WealthManagementStep: React.FC<WealthManagementStepProps> = ({
  wealthManagementInfo,
  onWealthManagementInfoChange
}) => {
  const safeWealthInfo = { ...defaultWealthManagementInfo, ...wealthManagementInfo };
  
  const handleChange = (field: keyof WealthManagementInfo, value: any) => {
    onWealthManagementInfoChange({
      ...safeWealthInfo,
      [field]: value
    });
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Évaluation Gestion de Patrimoine
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Cette évaluation permet d'identifier les risques spécifiques à la gestion de patrimoine selon les lignes directrices EBA.
      </Alert>


      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Profil client
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Segment client</InputLabel>
                <Select
                  value={safeWealthInfo.client_segment}
                  onChange={(e) => handleChange('client_segment', e.target.value)}
                  label="Segment client"
                >
                  {Object.values(ClientSegment).map((segment) => (
                    <MenuItem key={segment} value={segment}>
                      {segment}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Encours sous gestion (€)"
                type="number"
                value={safeWealthInfo.assets_under_management}
                onChange={(e) => handleChange('assets_under_management', parseInt(e.target.value) || 0)}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Sources de richesse</InputLabel>
                <Select
                  multiple
                  value={safeWealthInfo.wealth_sources}
                  onChange={(e) => handleChange('wealth_sources', e.target.value)}
                  input={<OutlinedInput label="Sources de richesse" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(WealthSource).map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Services et produits
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Types de services</InputLabel>
                <Select
                  multiple
                  value={safeWealthInfo.service_types}
                  onChange={(e) => handleChange('service_types', e.target.value)}
                  input={<OutlinedInput label="Types de services" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(WealthManagementServiceType).map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Véhicules d'investissement</InputLabel>
                <Select
                  multiple
                  value={safeWealthInfo.investment_vehicles}
                  onChange={(e) => handleChange('investment_vehicles', e.target.value)}
                  input={<OutlinedInput label="Véhicules d'investissement" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(InvestmentVehicleType).map((vehicle) => (
                    <MenuItem key={vehicle} value={vehicle}>
                      {vehicle}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Profil de risque
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ flex: 1 }}>
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Besoins de liquidité</FormLabel>
                  <RadioGroup
                    value={safeWealthInfo.liquidity_needs}
                    onChange={(e) => handleChange('liquidity_needs', e.target.value)}
                  >
                    <FormControlLabel value="HIGH" control={<Radio />} label="Élevés" />
                    <FormControlLabel value="MEDIUM" control={<Radio />} label="Modérés" />
                    <FormControlLabel value="LOW" control={<Radio />} label="Faibles" />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <FormControl component="fieldset" margin="normal">
                  <FormLabel component="legend">Tolérance au risque</FormLabel>
                  <RadioGroup
                    value={safeWealthInfo.risk_tolerance}
                    onChange={(e) => handleChange('risk_tolerance', e.target.value)}
                  >
                    <FormControlLabel value={RiskLevel.FAIBLE} control={<Radio />} label="Prudent" />
                    <FormControlLabel value={RiskLevel.MODERE} control={<Radio />} label="Équilibré" />
                    <FormControlLabel value={RiskLevel.ELEVE} control={<Radio />} label="Dynamique" />
                    <FormControlLabel value={RiskLevel.TRES_ELEVE} control={<Radio />} label="Spéculatif" />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default WealthManagementStep;