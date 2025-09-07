/**
 * Types pour l'évaluation des risques LCBFT
 */

// Import existing enums from data modules for consistency
import { 
  ClientSegment,
  WealthSource,
  InvestmentVehicleType,
  WealthManagementServiceType 
} from '../data/wealthManagementRiskData';
import {
  NPOCategory,
  NPOActivityType,
  NPOFundingSource
} from '../data/npoRiskData';

export enum RiskLevel {
  FAIBLE = "FAIBLE",
  MODERE = "MODERE",
  ELEVE = "ELEVE",
  TRES_ELEVE = "TRES_ELEVE"
}

export enum ClientType {
  PERSONNE_PHYSIQUE = "Personne physique",
  PERSONNE_MORALE = "Personne morale"
}

export enum ClientCategory {
  STANDARD = "Standard",
  NPO = "NPO",
  PEP = "PEP",
  SANCTIONS = "Sanctions",
  TRANSFER_MONITORING = "Travel Rule",
  WEALTH_MANAGEMENT = "Wealth Management"
}

export enum PaymentMethod {
  VIREMENT = "Virement bancaire",
  CHEQUE = "Chèque",
  CARTE = "Carte bancaire",
  ESPECES = "Espèces",
  FRACTIONNE = "Paiement fractionné",
  VIREMENT_INTL = "Virement international",
  CRYPTOMONNAIES = "Cryptomonnaies"
}

export interface ClientInfo {
  type_client: ClientType;
  category?: ClientCategory;
  code_naf?: string;
  date_creation?: Date;
  annee_naissance?: number;
  pep: boolean;
  sanctions: boolean;
  relation_etablie: number;
  notoriete_defavorable: boolean;
  reticence_identification: boolean;
}

export interface GeographicInfo {
  pays_residence: string;
  pays_compte: string;
  distance_etablissement: number;
}

export interface TransactionInfo {
  montant: number;
  mode_paiement: PaymentMethod;
  complexite_montage: boolean;
  canal_distribution?: string;
}

// NPOCategory is imported from npoRiskData

export enum PPECategory {
  PEP_NATIONAL = "PEP_NATIONAL",
  PEP_ETRANGER = "PEP_ETRANGER",
  ORGANISATION_INTERNATIONALE = "ORGANISATION_INTERNATIONALE"
}

export interface WealthManagementInfo {
  client_segment?: ClientSegment;
  assets_under_management?: number;
  wealth_sources?: WealthSource[];
  investment_vehicles?: InvestmentVehicleType[];
  service_types?: WealthManagementServiceType[];
  geographic_exposure?: string[];
  complexity_level?: RiskLevel;
  liquidity_needs?: 'HIGH' | 'MEDIUM' | 'LOW';
  risk_tolerance?: RiskLevel;
  // Preserve backward compatibility with any existing fields
  [key: string]: any;
}

export interface NPOInfo {
  category?: NPOCategory;
  activity_types?: NPOActivityType[];
  funding_sources?: NPOFundingSource[];
  annual_budget?: number;
  geographic_scope?: string[];
  transparency_score?: number;
  financial_reporting_quality?: RiskLevel;
  registration_number?: string;
  legal_status?: string;
  // Preserve backward compatibility with any existing fields
  [key: string]: any;
}

export interface TravelRuleInfo {
  transaction_type?: string;
  cross_border?: boolean;
  originator_complete?: boolean;
  beneficiary_complete?: boolean;
  threshold_exceeded?: boolean;
  jurisdiction_compliance?: Record<string, boolean>;
  missing_information?: string[];
  // Preserve backward compatibility with any existing fields
  [key: string]: any;
}

export interface PPEInfo {
  pep_category?: PPECategory;
  pep_functions?: string[];
  family_member?: boolean;
  close_associate?: boolean;
  risk_rating?: RiskLevel;
  source_of_wealth_verified?: boolean;
  enhanced_monitoring?: boolean;
  // Preserve backward compatibility with any existing fields
  [key: string]: any;
}

export interface RiskAssessmentRequest {
  client: ClientInfo;
  geographic: GeographicInfo;
  transaction: TransactionInfo;
  // Données spécialisées optionnelles avec typage strict
  wealthManagementInfo?: WealthManagementInfo;
  npoInfo?: NPOInfo;
  travelRuleInfo?: TravelRuleInfo;
  ppeInfo?: PPEInfo;
}

export interface RiskScore {
  score: number;
  justifications: string[];
}

export interface RiskAssessmentResult {
  score_geo: RiskScore;
  score_produit: RiskScore;
  score_client: RiskScore;
  score_total: number;
  niveau_risque: RiskLevel;
  recommandations: string[];
}

export interface SectorRisk {
  [code: string]: string;
}

export interface RiskData {
  SECTEURS_RISQUE: {
    TRES_ELEVE: SectorRisk;
    ELEVE: SectorRisk;
    MODERE: SectorRisk;
  };
  PAYS_RISQUE: {
    TRES_ELEVE: string[];
    ELEVE: string[];
  };
  PAYS_GAFI_UE_MAJORE: string[];
}