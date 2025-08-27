import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Paper
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { apeCodeService, ApeCode } from '../services/apeCodeService';

interface ApeCodeSearchProps {
  value?: ApeCode | null;
  onChange: (apeCode: ApeCode | null) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export const ApeCodeSearch: React.FC<ApeCodeSearchProps> = ({
  value,
  onChange,
  label = "Code NAF/APE",
  placeholder = "Rechercher par code ou activité",
  required = false,
  disabled = false,
  helperText
}) => {
  const [options, setOptions] = useState<ApeCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Recherche initiale au chargement
  useEffect(() => {
    const loadInitialCodes = async () => {
      setLoading(true);
      try {
        const initialCodes = await apeCodeService.getAllCodes(50);
        setOptions(initialCodes);
      } catch (error) {
        console.error('Erreur lors du chargement initial:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialCodes();
  }, []);

  // Recherche quand l'input change (avec timeout simple)
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (inputValue.trim().length >= 2) {
        setLoading(true);
        try {
          const results = await apeCodeService.searchCodes(inputValue, 100);
          setOptions(results);
        } catch (error) {
          console.error('Erreur lors de la recherche APE:', error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      } else if (inputValue.trim().length === 0) {
        // Recharger les codes initiaux si l'input est vide
        const initialCodes = await apeCodeService.getAllCodes(50);
        setOptions(initialCodes);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputValue]);


  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => `${option.code} - ${option.libelle_court}`}
      loading={loading}
      disabled={disabled}
      filterOptions={(x) => x} // Désactiver le filtrage côté client
      isOptionEqualToValue={(option, value) => option.code === value.code}
      renderInput={(params) => (
        <TextField
          {...params}
          label={required ? `${label} *` : label}
          placeholder={placeholder}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Typography variant="body2">
            <strong>{option.code}</strong> - {option.libelle_court}
          </Typography>
        </Box>
      )}
      PaperComponent={({ children, ...other }) => (
        <Paper {...other} sx={{ '& .MuiAutocomplete-listbox': { maxHeight: 300 } }}>
          {children}
        </Paper>
      )}
      sx={{
        '& .MuiAutocomplete-inputRoot': {
          paddingRight: '50px !important'
        }
      }}
    />
  );
};