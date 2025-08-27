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
  Slider,
  Card,
  CardContent,
  Alert,
  Stack
} from '@mui/material';
import { NPOCategory, NPOActivityType, NPOFundingSource } from '../data/npoRiskData';

export interface NPOInfo {
  category: NPOCategory;
  activity_types: NPOActivityType[];
  funding_sources: NPOFundingSource[];
  annual_budget: number;
  geographic_scope: string[];
  beneficiaries_count: number;
  employees_count: number;
  volunteers_count: number;
  transparency_score: number;
}

const defaultNPOInfo: NPOInfo = {
  category: NPOCategory.ASSOCIATION_1901,
  activity_types: [],
  funding_sources: [],
  annual_budget: 0,
  geographic_scope: [],
  beneficiaries_count: 0,
  employees_count: 0,
  volunteers_count: 0,
  transparency_score: 5
};

interface NPOEvaluationStepProps {
  npoInfo: NPOInfo;
  onNPOInfoChange: (info: NPOInfo) => void;
}

const NPOEvaluationStep: React.FC<NPOEvaluationStepProps> = ({
  npoInfo,
  onNPOInfoChange
}) => {
  const safeNPOInfo = { ...defaultNPOInfo, ...npoInfo };
  
  const handleChange = (field: keyof NPOInfo, value: any) => {
    onNPOInfoChange({
      ...safeNPOInfo,
      [field]: value
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Évaluation des Organismes à But Non Lucratif (NPO)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Cette évaluation permet d'identifier les risques spécifiques aux NPO selon les lignes directrices EBA/GL/2023/03
      </Alert>

      <Stack spacing={3}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations générales
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Catégorie NPO</InputLabel>
                <Select
                  value={safeNPOInfo.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  label="Catégorie NPO"
                >
                  {Object.values(NPOCategory).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Types d'activités</InputLabel>
                <Select
                  multiple
                  value={safeNPOInfo.activity_types}
                  onChange={(e) => handleChange('activity_types', e.target.value)}
                  input={<OutlinedInput label="Types d'activités" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(NPOActivityType).map((activity) => (
                    <MenuItem key={activity} value={activity}>
                      {activity}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Budget annuel (€)"
                type="number"
                value={safeNPOInfo.annual_budget}
                onChange={(e) => handleChange('annual_budget', parseInt(e.target.value) || 0)}
              />
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sources de financement
              </Typography>
              
              <FormControl fullWidth margin="normal">
                <InputLabel>Sources de financement</InputLabel>
                <Select
                  multiple
                  value={safeNPOInfo.funding_sources}
                  onChange={(e) => handleChange('funding_sources', e.target.value)}
                  input={<OutlinedInput label="Sources de financement" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(NPOFundingSource).map((source) => (
                    <MenuItem key={source} value={source}>
                      {source}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Nombre de bénéficiaires"
                type="number"
                value={safeNPOInfo.beneficiaries_count}
                onChange={(e) => handleChange('beneficiaries_count', parseInt(e.target.value) || 0)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Nombre d'employés"
                type="number"
                value={safeNPOInfo.employees_count}
                onChange={(e) => handleChange('employees_count', parseInt(e.target.value) || 0)}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Nombre de bénévoles"
                type="number"
                value={safeNPOInfo.volunteers_count}
                onChange={(e) => handleChange('volunteers_count', parseInt(e.target.value) || 0)}
              />
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transparence et gouvernance
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography gutterBottom>
                  Score de transparence: {npoInfo.transparency_score}/10
                </Typography>
                <Slider
                  value={safeNPOInfo.transparency_score}
                  onChange={(_, value) => handleChange('transparency_score', value)}
                  min={0}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default NPOEvaluationStep;