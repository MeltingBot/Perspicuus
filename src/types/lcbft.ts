/**
 * Types pour l'évaluation des risques LCBFT
 */

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

export interface RiskAssessmentRequest {
  client: ClientInfo;
  geographic: GeographicInfo;
  transaction: TransactionInfo;
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