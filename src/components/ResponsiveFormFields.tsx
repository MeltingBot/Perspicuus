import React from 'react';
import {
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Slider,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Paper,
  Grid,
  Card,
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';

// Responsive field wrapper with consistent spacing
export const ResponsiveFieldWrapper: React.FC<{
  children: React.ReactNode;
  fullWidth?: boolean;
  spacing?: 'compact' | 'normal' | 'spacious';
}> = ({ children, fullWidth = true, spacing = 'normal' }) => {
  const spacingMap = {
    compact: { xs: 1, sm: 1.5 },
    normal: { xs: 2, sm: 3 },
    spacious: { xs: 3, sm: 4 }
  };

  return (
    <Box sx={{ 
      width: fullWidth ? '100%' : 'auto',
      '& .MuiFormControl-root': {
        width: fullWidth ? '100%' : 'auto',
        mb: spacingMap[spacing]
      }
    }}>
      {children}
    </Box>
  );
};

// Enhanced responsive stack for form layouts
export const ResponsiveFormStack: React.FC<{
  children: React.ReactNode;
  direction?: 'column' | 'row' | 'responsive';
  spacing?: number;
  breakpoint?: 'sm' | 'md' | 'lg';
}> = ({ children, direction = 'responsive', spacing = 3, breakpoint = 'md' }) => {
  const stackDirection = direction === 'responsive' 
    ? { xs: 'column' as const, [breakpoint]: 'row' as const }
    : direction;

  return (
    <Stack
      direction={stackDirection}
      spacing={spacing}
      sx={{
        width: '100%',
        alignItems: direction === 'responsive' ? { xs: 'stretch', [breakpoint]: 'flex-start' } : 'stretch'
      }}
    >
      {children}
    </Stack>
  );
};

// Responsive select field with mobile-optimized dropdown
export const ResponsiveSelectField: React.FC<{
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: any; label: string; disabled?: boolean }>;
  required?: boolean;
  helperText?: string;
  error?: boolean;
  size?: 'small' | 'medium';
}> = ({ label, value, onChange, options, required, helperText, error, size = 'medium' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FormControl 
      fullWidth 
      required={required}
      error={error}
      size={isMobile ? 'small' : size}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: isMobile ? '50vh' : '40vh',
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
            sx={{
              fontSize: isMobile ? '0.875rem' : '1rem',
              py: isMobile ? 1 : 0.75,
              whiteSpace: 'normal',
              wordWrap: 'break-word'
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'textSecondary'} sx={{ mt: 0.5, mx: 1.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

// Responsive autocomplete with mobile optimization
export const ResponsiveAutocomplete: React.FC<{
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: any[];
  getOptionLabel?: (option: any) => string;
  required?: boolean;
  helperText?: string;
  error?: boolean;
  placeholder?: string;
}> = ({ label, value, onChange, options, getOptionLabel, required, helperText, error, placeholder }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Autocomplete
      fullWidth
      options={options}
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
          placeholder={placeholder}
          size={isMobile ? 'small' : 'medium'}
        />
      )}
      ListboxProps={{
        style: {
          maxHeight: isMobile ? '40vh' : '30vh',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }
      }}
      slotProps={{
        popper: {
          sx: {
            '& .MuiAutocomplete-listbox': {
              fontSize: isMobile ? '0.875rem' : '1rem',
              '& .MuiAutocomplete-option': {
                py: isMobile ? 1 : 0.75,
              }
            }
          }
        }
      }}
    />
  );
};

// Enhanced slider with responsive labels and touch-friendly sizing
export const ResponsiveSlider: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Array<{ value: number; label: string }>;
  helperText?: string;
  formatValue?: (value: number) => string;
}> = ({ label, value, onChange, min = 0, max = 100, step = 1, marks, helperText, formatValue }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <Box sx={{ width: '100%' }}>
      <Typography gutterBottom fontWeight="bold" sx={{ mb: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
        {label}: {displayValue}
      </Typography>
      {helperText && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {helperText}
        </Typography>
      )}
      <Box sx={{ px: isMobile ? 1 : 2 }}>
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as number)}
          min={min}
          max={max}
          step={step}
          marks={marks?.map(mark => ({
            ...mark,
            label: isMobile ? mark.label.split(' ')[0] : mark.label // Truncate labels on mobile
          }))}
          valueLabelDisplay="auto"
          sx={{
            height: isMobile ? 6 : 4,
            '& .MuiSlider-thumb': {
              height: isMobile ? 24 : 20,
              width: isMobile ? 24 : 20,
            },
            '& .MuiSlider-markLabel': {
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              transform: isMobile ? 'rotate(-45deg)' : 'none',
              transformOrigin: 'top',
              whiteSpace: 'nowrap'
            }
          }}
        />
      </Box>
    </Box>
  );
};

// Responsive radio group with stacked layout on mobile
export const ResponsiveRadioGroup: React.FC<{
  label: string;
  value: any;
  onChange: (value: any) => void;
  options: Array<{ value: any; label: string; disabled?: boolean }>;
  required?: boolean;
  helperText?: string;
  error?: boolean;
}> = ({ label, value, onChange, options, required, helperText, error }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <FormControl component="fieldset" error={error} fullWidth>
      <FormLabel 
        component="legend" 
        sx={{ 
          fontWeight: 'bold', 
          mb: 1,
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}
      >
        {label} {required && '*'}
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row={!isMobile}
        sx={{
          gap: isMobile ? 0.5 : 2,
          '& .MuiFormControlLabel-root': {
            ml: 0,
            mr: isMobile ? 0 : 2
          }
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size={isMobile ? 'small' : 'medium'} />}
            label={
              <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {option.label}
              </Typography>
            }
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
      {helperText && (
        <Typography variant="caption" color={error ? 'error' : 'textSecondary'} sx={{ mt: 0.5 }}>
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
};

// Enhanced checkbox list with responsive layout
export const ResponsiveCheckboxGroup: React.FC<{
  title?: string;
  items: Array<{
    key: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    helperText?: string;
    disabled?: boolean;
  }>;
  columns?: 1 | 2 | 3;
}> = ({ title, items, columns = 1 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const effectiveColumns = isMobile ? 1 : columns;

  return (
    <Box sx={{ width: '100%' }}>
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 'bold'
          }}
        >
          {title}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid size={{ xs: 12, sm: 12/effectiveColumns }} key={item.key}>
            <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    size={isMobile ? 'small' : 'medium'}
                    disabled={item.disabled}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {item.label}
                    </Typography>
                    {item.helperText && (
                      <Typography 
                        variant="caption" 
                        color="textSecondary" 
                        sx={{ display: 'block', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                      >
                        {item.helperText}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ 
                  alignItems: 'flex-start',
                  ml: 0,
                  mr: 0,
                  width: '100%'
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Field with help tooltip optimized for touch devices
export const ResponsiveFieldWithHelp: React.FC<{
  children: React.ReactNode;
  helpText: string;
  helpTitle?: string;
}> = ({ children, helpText, helpTitle = "Aide" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
        <Tooltip
          title={
            <Box sx={{ p: 1 }}>
              {helpTitle && (
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {helpTitle}
                </Typography>
              )}
              <Typography variant="body2">
                {helpText}
              </Typography>
            </Box>
          }
          arrow
          placement={isMobile ? "top" : "right"}
          PopperProps={{
            sx: {
              '& .MuiTooltip-tooltip': {
                maxWidth: isMobile ? '90vw' : 400,
                fontSize: isMobile ? '0.8rem' : '0.875rem'
              }
            }
          }}
        >
          <IconButton 
            size="small" 
            sx={{ 
              color: 'info.main', 
              mt: 0.5,
              minWidth: isMobile ? 40 : 32,
              minHeight: isMobile ? 40 : 32
            }}
          >
            <InfoOutlined sx={{ fontSize: isMobile ? 20 : 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};