import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Stack,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Chip,
  IconButton,
  Collapse,
  Paper,
  MobileStepper
} from '@mui/material';
import {
  NavigateNext,
  NavigateBefore,
  Security,
  KeyboardArrowUp,
  KeyboardArrowDown,
  SkipNext,
  SkipPrevious
} from '@mui/icons-material';

interface ResponsiveWizardFormProps {
  activeStep: number;
  steps: string[];
  children: React.ReactNode;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
  onStepClick?: (step: number) => void;
  errors?: string[];
  isLoading?: boolean;
}

export const ResponsiveWizardForm: React.FC<ResponsiveWizardFormProps> = ({
  activeStep,
  steps,
  children,
  onNext,
  onBack,
  onFinish,
  onStepClick,
  errors = [],
  isLoading = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [showSteps, setShowSteps] = useState(!isMobile);

  // Mobile stepper component
  const MobileStepperComponent = () => (
    <Paper 
      elevation={1} 
      sx={{ 
        p: 2, 
        mb: 2,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Étape {activeStep + 1} sur {steps.length}
        </Typography>
        <IconButton
          size="small"
          onClick={() => setShowSteps(!showSteps)}
        >
          {showSteps ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
        </IconButton>
      </Box>

      <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
        {steps[activeStep]}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(activeStep / (steps.length - 1)) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          mb: 1
        }}
      />

      <Collapse in={showSteps}>
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
          {steps.map((step, index) => (
            <Chip
              key={step}
              label={`${index + 1}`}
              size="small"
              variant={index === activeStep ? "filled" : "outlined"}
              color={index === activeStep ? "primary" : "default"}
              onClick={() => onStepClick?.(index)}
              sx={{
                minWidth: 32,
                cursor: onStepClick ? 'pointer' : 'default',
                '&:hover': onStepClick ? { backgroundColor: 'action.hover' } : {}
              }}
            />
          ))}
        </Stack>
      </Collapse>

      <MobileStepper
        steps={steps.length}
        position="static"
        activeStep={activeStep}
        sx={{ backgroundColor: 'transparent', p: 0, mt: 1 }}
        nextButton={
          <Button
            size="small"
            onClick={activeStep === steps.length - 1 ? onFinish : onNext}
            disabled={isLoading}
            endIcon={activeStep === steps.length - 1 ? <Security /> : <SkipNext />}
          >
            {activeStep === steps.length - 1 ? 'Évaluer' : 'Suivant'}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={onBack}
            disabled={activeStep === 0 || isLoading}
            startIcon={<SkipPrevious />}
          >
            Précédent
          </Button>
        }
      />
    </Paper>
  );

  // Desktop stepper component
  const DesktopStepperComponent = () => (
    <Box sx={{ mb: 4 }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel={!isTablet}
        orientation={isTablet ? "vertical" : "horizontal"}
        sx={{
          '& .MuiStepLabel-root': {
            cursor: onStepClick ? 'pointer' : 'default',
          },
          '& .MuiStepLabel-label': {
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel 
              onClick={() => onStepClick?.(index)}
              sx={{ 
                '&:hover': onStepClick ? { 
                  '& .MuiStepLabel-label': { color: 'primary.main' }
                } : {}
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <LinearProgress
        variant="determinate"
        value={(activeStep / (steps.length - 1)) * 100}
        sx={{ 
          mt: 2, 
          height: 6, 
          borderRadius: 3,
          display: { xs: 'block', md: 'none' } // Show only on mobile/tablet
        }}
      />
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 800, lg: 1000 }, mx: 'auto' }}>
      {/* Mobile Stepper */}
      {isMobile && <MobileStepperComponent />}
      
      {/* Desktop/Tablet Stepper */}
      {!isMobile && <DesktopStepperComponent />}

      {/* Error Display */}
      {errors.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 3,
            backgroundColor: 'error.light',
            color: 'error.contrastText',
            borderLeft: '4px solid',
            borderColor: 'error.main'
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Erreurs de validation:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, index) => (
              <li key={index}>
                <Typography variant="body2">{error}</Typography>
              </li>
            ))}
          </ul>
        </Paper>
      )}

      {/* Form Content */}
      <Card 
        elevation={isMobile ? 1 : 3}
        sx={{ 
          minHeight: { xs: '60vh', sm: 400, md: 500 },
          mb: isMobile ? 2 : 4,
        }}
      >
        <CardContent 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ flex: 1 }}>
            {children}
          </Box>
        </CardContent>
      </Card>

      {/* Desktop Navigation Buttons */}
      {!isMobile && (
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button
            disabled={activeStep === 0 || isLoading}
            onClick={onBack}
            startIcon={<NavigateBefore />}
            variant="outlined"
            size="large"
            sx={{ minWidth: { sm: 120, md: 140 } }}
          >
            Précédent
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              onClick={onFinish}
              variant="contained"
              size="large"
              startIcon={<Security />}
              disabled={isLoading}
              sx={{ 
                px: { sm: 3, md: 4 },
                minWidth: { sm: 140, md: 160 }
              }}
            >
              {isLoading ? 'Évaluation...' : 'Lancer l\'Évaluation'}
            </Button>
          ) : (
            <Button
              onClick={onNext}
              variant="contained"
              size="large"
              endIcon={<NavigateNext />}
              disabled={isLoading}
              sx={{ 
                px: { sm: 3, md: 4 },
                minWidth: { sm: 120, md: 140 }
              }}
            >
              Suivant
            </Button>
          )}
        </Stack>
      )}
    </Box>
  );
};

// Enhanced form step wrapper with responsive spacing
export const ResponsiveFormStep: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  subtitle?: string;
}> = ({ title, icon, children, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack spacing={{ xs: 3, sm: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
        {icon && (
          <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
            <Box
              component="span"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: { xs: 28, sm: 32, md: 36 },
                color: 'primary.main',
                '& svg': {
                  fontSize: 'inherit'
                }
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
        <Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"}
            fontWeight="bold"
            sx={{ lineHeight: 1.2 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ 
        '& > *': { 
          mb: { xs: 2, sm: 3 } 
        },
        '& > *:last-child': { 
          mb: 0 
        }
      }}>
        {children}
      </Box>
    </Stack>
  );
};