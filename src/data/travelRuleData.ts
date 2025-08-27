/**
 * Module d'évaluation des risques LCB-FT selon la Travel Rule
 * Basé sur les recommandations FATF/GAFI n°16
 */

import { RiskLevel } from '../types/lcbft';

export enum TravelRuleTransactionType {
  VIREMENT_BANCAIRE = "Virement bancaire",
  TRANSFERT_ELECTRONIQUE = "Transfert électronique", 
  CRYPTOMONNAIES = "Transfert de cryptomonnaies",
  MANDAT_WESTERN_UNION = "Mandat Western Union/similaire",
  COMPENSATION_CLEARING = "Compensation/Clearing",
  CORRESPONDENT_BANKING = "Correspondent Banking"
}

export enum TravelRuleRequiredInfo {
  NOM_DONNEUR_ORDRE = "Nom du donneur d'ordre",
  NUMERO_COMPTE_DONNEUR = "Numéro de compte du donneur d'ordre",
  ADRESSE_DONNEUR = "Adresse du donneur d'ordre",
  NOM_BENEFICIAIRE = "Nom du bénéficiaire",
  NUMERO_COMPTE_BENEFICIAIRE = "Numéro de compte du bénéficiaire",
  ADRESSE_BENEFICIAIRE = "Adresse du bénéficiaire",
  INSTITUTION_EXPEDITRICE = "Institution expéditrice",
  INSTITUTION_RECEPTRICE = "Institution réceptrice"
}

export interface TravelRuleTransaction {
  id: string;
  type: TravelRuleTransactionType;
  amount: number;
  currency: string;
  originator_info: {
    name: string;
    account?: string;
    address: string;
    country: string;
    identifier?: string;
  };
  beneficiary_info: {
    name: string;
    account?: string;
    address: string;
    country: string;
    identifier?: string;
  };
  sending_institution: string;
  receiving_institution: string;
  transaction_date: Date;
  is_cross_border: boolean;
}

export interface TravelRuleCompliance {
  threshold_amount: number;
  required_information: TravelRuleRequiredInfo[];
  exemptions: string[];
  reporting_obligations: string[];
  record_keeping_period: number; // en années
  sanctions_screening_required: boolean;
  enhanced_verification_required: boolean;
}

export interface TravelRuleRiskAssessment {
  transaction: TravelRuleTransaction;
  compliance_status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PARTIAL';
  missing_information: TravelRuleRequiredInfo[];
  risk_factors: string[];
  recommended_actions: string[];
  overall_risk: RiskLevel;
}

// Seuils Travel Rule par juridiction (en EUR)
export const TRAVEL_RULE_THRESHOLDS = {
  'UE': 1000,
  'USA': 3000,
  'SUISSE': 1000,
  'ROYAUME_UNI': 1000,
  'CANADA': 1000,
  'JAPON': 1000,
  'SINGAPOUR': 5000,
  'DEFAULT': 1000
};

// Pays avec réglementations Travel Rule strictes
export const STRICT_TRAVEL_RULE_COUNTRIES = [
  "États-Unis", "Canada", "Royaume-Uni", "Allemagne", 
  "France", "Pays-Bas", "Suisse", "Singapour", "Japon",
  "Australie", "Corée du Sud"
];

// Informations obligatoires par type de transaction
export const REQUIRED_INFO_BY_TRANSACTION_TYPE = {
  [TravelRuleTransactionType.VIREMENT_BANCAIRE]: [
    TravelRuleRequiredInfo.NOM_DONNEUR_ORDRE,
    TravelRuleRequiredInfo.NUMERO_COMPTE_DONNEUR,
    TravelRuleRequiredInfo.ADRESSE_DONNEUR,
    TravelRuleRequiredInfo.NOM_BENEFICIAIRE,
    TravelRuleRequiredInfo.NUMERO_COMPTE_BENEFICIAIRE,
    TravelRuleRequiredInfo.ADRESSE_BENEFICIAIRE,
    TravelRuleRequiredInfo.INSTITUTION_EXPEDITRICE,
    TravelRuleRequiredInfo.INSTITUTION_RECEPTRICE
  ],
  [TravelRuleTransactionType.CRYPTOMONNAIES]: [
    TravelRuleRequiredInfo.NOM_DONNEUR_ORDRE,
    TravelRuleRequiredInfo.ADRESSE_DONNEUR,
    TravelRuleRequiredInfo.NOM_BENEFICIAIRE,
    TravelRuleRequiredInfo.ADRESSE_BENEFICIAIRE,
    TravelRuleRequiredInfo.INSTITUTION_EXPEDITRICE,
    TravelRuleRequiredInfo.INSTITUTION_RECEPTRICE
  ]
};

// Facteurs de risque pour la Travel Rule
export const TRAVEL_RULE_RISK_FACTORS = [
  "Transaction vers pays à haut risque",
  "Montant proche du seuil de déclaration",
  "Transactions fractionnées (smurfing)",
  "Informations incomplètes sur les parties",
  "Institution correspondante non vérifiée",
  "Pays sans réglementation Travel Rule",
  "Transaction impliquant des cryptomonnaies",
  "Bénéficiaire dans une zone offshore"
];

export default {
  TravelRuleTransactionType,
  TravelRuleRequiredInfo,
  TRAVEL_RULE_THRESHOLDS,
  STRICT_TRAVEL_RULE_COUNTRIES,
  REQUIRED_INFO_BY_TRANSACTION_TYPE,
  TRAVEL_RULE_RISK_FACTORS
};