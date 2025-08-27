# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Perspicuus is a modern React-based anti-money laundering (AML) and counter-terrorism financing (CTF) risk assessment application for French financial institutions. The application provides an intuitive wizard interface for evaluating LCBFT (Lutte Contre le Blanchiment de Capitaux et le Financement du Terrorisme) risks with specialized modules for NPO, Travel Rule, Wealth Management, and PEP assessments.

## Running the Application

### React Development Server
```bash
# Install dependencies
npm install

# Start development server
npm start
```
Application available at `http://localhost:3000`

### Production Build
```bash
# Build for production
npm run build

# Serve production build locally (if needed)
npx serve -s build
```

## Technology Stack

- **React 18** with TypeScript
- **Material-UI v7** (MUI) for component library
- **Recharts** for data visualization (radar charts)
- **Date-fns** for date handling
- **MUI X Date Pickers** for date selection components

## Application Architecture

### Component Structure

#### Core Components (`src/components/`)
- **App.tsx**: Main application with tab navigation and state management
- **WizardEvaluationForm.tsx**: Primary wizard-based risk assessment form with step navigation
- **SimpleResultsDisplay.tsx**: Results visualization with radar charts and detailed scoring
- **SimpleKnowledgeBase.tsx**: Reference documentation and regulatory information
- **LegalMentions.tsx**: Legal compliance and data privacy information

#### Specialized Assessment Modules
- **NPOEvaluationStep.tsx**: Non-profit organization risk assessment (EBA/GL/2023/03 compliant)
- **TravelRuleStep.tsx**: FATF Recommendation 16 "Travel Rule" assessment for wire transfers
- **WealthManagementStep.tsx**: High-net-worth client and family office assessments
- **PPEQuestionnaireStep.tsx**: Politically Exposed Persons enhanced due diligence

#### Supporting Components
- **ApeCodeSearch.tsx**: French NAF/APE business sector code lookup with autocomplete
- **EnhancedEvaluationForm.tsx**: Alternative advanced form interface
- **SimpleEvaluationForm.tsx**: Simplified single-page assessment form

### Data Layer (`src/`)

#### Type Definitions (`src/types/lcbft.ts`)
- **RiskLevel**: Risk classification enum (FAIBLE, MODERE, ELEVE, TRES_ELEVE)
- **ClientType**: Person type enum (PERSONNE_PHYSIQUE, PERSONNE_MORALE) 
- **PaymentMethod**: Transaction method enum including CRYPTOMONNAIES
- **RiskAssessmentRequest**: Complete assessment input structure
- **RiskAssessmentResult**: Detailed risk scoring output

#### Data Sources (`src/data/`)
- **riskData.ts**: FATF country classifications, sector risk mappings, detection functions
- **travelRuleData.ts**: Travel Rule transaction types, thresholds by jurisdiction, compliance requirements

#### Services (`src/services/`)
- **riskEngine.ts**: Core LCBFT risk calculation engine with multi-factor scoring
- **pdfGenerator.ts**: Professional PDF report generation for assessments
- **apeCodeService.ts**: French business sector classification API integration

## Key Features

### Adaptive Module Activation
The application automatically activates specialized assessment modules based on:

**For Personnes Morales (PM):**
- **NPO Module**: Automatic via NAF/APE code detection
- **Travel Rule**: Automatic via `isTravelRuleProvider()` function
- **Wealth Management**: Automatic via `isWealthManagementClient()` function

**For Personnes Physiques (PP):**
- **Travel Rule**: Manual checkbox selection
- **Wealth Management**: Manual checkbox selection  

**Universal Triggers:**
- **Travel Rule**: Cryptomonnaie payments or amounts exceeding jurisdiction thresholds
- **PEP Module**: PEP status declaration

### Multi-Factor Risk Assessment

#### Geographical Risk (0-10+ points)
- FATF blacklist countries with EU majorations
- Cross-border relationships
- Distance from financial institution

#### Product/Service Risk (0-10+ points)  
- High-risk NAF/APE sector classifications
- Transaction amounts (>50K€, >100K€)
- Payment methods (cash, fragmented, cryptocurrency)

#### Client Risk (0-10+ points)
- PEP status and sanctions screening
- Adverse media coverage
- Age-based factors (minors, elderly)
- Relationship duration and corporate age
- Beneficial ownership complexity

### Advanced Features

#### Travel Rule Compliance (FATF Recommendation 16)
- **Jurisdiction-specific thresholds**: EU (1000€), USA (3000€), Singapore (5000€)
- **Automatic cross-border detection**: Based on originator/beneficiary countries
- **Transaction type classification**: Wire transfers, cryptocurrencies, money orders
- **Compliance status tracking**: Information completeness validation

#### Enhanced Due Diligence Modules
- **NPO Risk Assessment**: EBA guidelines compliance with funding source analysis
- **Wealth Management**: Investment profile, liquidity needs, risk tolerance evaluation
- **PEP Classification**: Function-based risk scoring with 27 PEP categories

## Development Commands

### Code Quality
```bash
# Type checking
npm run type-check

# Linting (if configured)
npm run lint

# Format code (if configured)  
npm run format
```

### Development Workflow
```bash
# Start development server with hot reload
npm start

# Build and preview production bundle
npm run build && npx serve -s build

# Analyze bundle size (if configured)
npm run analyze
```

## Risk Assessment Logic

### Scoring Algorithm
1. **Geographic Risk**: FATF lists + EU majorations + distance factors
2. **Product Risk**: NAF/APE classifications + transaction analysis + payment methods
3. **Client Risk**: PEP + sanctions + media + age + relationship factors
4. **Total Score**: Sum of all risk factors with weighted justifications

### Risk Level Thresholds
- **FAIBLE (0-3)**: Low risk - Simplified due diligence
- **MODÉRÉ (4-6)**: Moderate risk - Standard vigilance
- **ÉLEVÉ (7-10)**: High risk - Enhanced due diligence required
- **TRÈS ÉLEVÉ (11+)**: Very high risk - Relationship evaluation required

## Compliance and Security

### Data Protection
- **No personal data storage**: All assessments are session-based only
- **GDPR compliant**: No persistent data collection or profiling
- **Anonymized assessments**: Risk evaluation without identity storage

### Regulatory Compliance
- **FATF Standards**: Official country risk classifications
- **French AML/CTF Law**: Full compliance with Code monétaire et financier
- **EBA Guidelines**: NPO risk assessment per EBA/GL/2023/03
- **Travel Rule**: FATF Recommendation 16 implementation

## French Regulatory Context

- **LCBFT**: Lutte Contre le Blanchiment de Capitaux et le Financement du Terrorisme
- **ACPR**: Autorité de Contrôle Prudentiel et de Résolution
- **TRACFIN**: Traitement du Renseignement et Action contre les Circuits FINanciers
- **GAFI**: Groupe d'Action Financière (FATF in French)
- **PPE**: Personne Politiquement Exposée (PEP)
- **OSC**: Organisation de la Société Civile (NPO/Civil Society Organization)

## Navigation and User Experience

### Wizard Interface
- **Step-by-step assessment**: Guided risk evaluation process
- **Direct navigation**: Click any step to jump directly to that section
- **Progress tracking**: Visual progress bar and step completion indicators
- **Bidirectional flow**: Return to evaluation from results without data loss

### Results Visualization
- **Radar chart**: Multi-factor risk visualization with centered layout
- **Detailed scoring**: Individual risk component breakdown
- **Risk level translation**: French labels (Faible, Modéré, Élevé, Très élevé)
- **PDF export**: Professional assessment report generation

## Important Notes

### Module Activation Logic
The application uses intelligent module activation based on client characteristics:
- **PM clients**: Automatic detection via NAF/APE codes for specialized assessments
- **PP clients**: Manual selection via checkboxes for Travel Rule and Wealth Management
- **Amount thresholds**: Travel Rule automatically activates for high-value transactions
- **Payment methods**: Cryptocurrency payments trigger Travel Rule compliance

### UI/UX Principles
- **Non-influential interface**: No risk indicators shown during assessment to avoid bias
- **Regulatory neutral**: Assessment remains objective without leading questions
- **Professional presentation**: Clean, banking-appropriate interface design