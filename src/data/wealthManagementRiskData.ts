/**
 * Module d'évaluation des risques LCB-FT pour la gestion de patrimoine
 * Basé sur les lignes directrices EBA et les bonnes pratiques sectorielles
 */

import { RiskLevel } from '../types/lcbft';

export enum WealthManagementServiceType {
  GESTION_DISCRETIONNAIRE = "Gestion discrétionnaire",
  CONSEIL_INVESTISSEMENT = "Conseil en investissement",
  GESTION_PATRIMOINE_GLOBAL = "Gestion de patrimoine globale",
  FAMILY_OFFICE = "Services de family office",
  STRUCTURATION_PATRIMOINE = "Structuration patrimoniale",
  PLANIFICATION_SUCCESSORALE = "Planification successorale",
  OPTIMISATION_FISCALE = "Optimisation fiscale",
  INVESTISSEMENTS_ALTERNATIFS = "Investissements alternatifs"
}

export enum WealthSource {
  HERITAGE_FAMILIAL = "Héritage familial",
  REVENUS_PROFESSIONNELS = "Revenus professionnels",
  PLUS_VALUES_IMMOBILIERES = "Plus-values immobilières",
  CESSION_ENTREPRISE = "Cession d'entreprise",
  REVENUS_FINANCIERS = "Revenus financiers",
  ACTIVITES_COMMERCIALES = "Activités commerciales",
  GAINS_EXCEPTIONNELS = "Gains exceptionnels",
  ORIGINE_INDETERMINEE = "Origine indéterminée"
}

export enum InvestmentVehicleType {
  COMPTE_TITRES_CLASSIQUE = "Compte-titres classique",
  PEA = "Plan d'Épargne en Actions",
  ASSURANCE_VIE = "Assurance-vie",
  SICAV_FCP = "SICAV/FCP",
  FONDS_HEDGE = "Fonds spéculatifs",
  PRIVATE_EQUITY = "Capital investissement",
  IMMOBILIER_PRIVE = "SCPI/OPCI",
  PRODUITS_STRUCTURES = "Produits structurés",
  CRYPTOACTIFS = "Cryptoactifs",
  ART_COLLECTION = "Art et collections",
  METAUX_PRECIEUX = "Métaux précieux",
  SOCIETES_HOLDINGS = "Sociétés holdings"
}

export enum ClientSegment {
  PARTICULIER_FORTUNE = "Particulier fortuné",
  TRES_HAUTE_FORTUNE = "Très haute fortune",
  ULTRA_HAUTE_FORTUNE = "Ultra haute fortune",
  ENTREPRENEUR = "Entrepreneur",
  DIRIGEANT_ENTREPRISE = "Dirigeant d'entreprise",
  PROFESSION_LIBERALE = "Profession libérale",
  INVESTISSEUR_INSTITUTIONNEL = "Investisseur institutionnel",
  FAMILLE_MULTI_GENERATIONNELLE = "Famille multigénérationnelle"
}

export interface WealthManagementClient {
  id: string;
  segment: ClientSegment;
  assets_under_management: number;
  wealth_sources: WealthSource[];
  service_types: WealthManagementServiceType[];
  investment_vehicles: InvestmentVehicleType[];
  geographic_exposure: string[];
  complexity_level: RiskLevel;
  liquidity_needs: 'HIGH' | 'MEDIUM' | 'LOW';
  risk_tolerance: RiskLevel;
}

export interface WealthManagementRiskFactors {
  complex_structures: boolean;
  offshore_exposure: boolean;
  high_cash_transactions: boolean;
  frequent_restructuring: boolean;
  multiple_jurisdictions: boolean;
  beneficial_ownership_unclear: boolean;
  pep_connections: boolean;
  sanctions_risk: boolean;
  reputational_risk: RiskLevel;
  operational_risk: RiskLevel;
  compliance_risk: RiskLevel;
  overall_risk: RiskLevel;
}

// Seuils de vigilance renforcée par segment client
export const ENHANCED_VIGILANCE_THRESHOLDS = {
  [ClientSegment.PARTICULIER_FORTUNE]: 500000, // 500K€
  [ClientSegment.TRES_HAUTE_FORTUNE]: 2000000, // 2M€
  [ClientSegment.ULTRA_HAUTE_FORTUNE]: 10000000, // 10M€
  [ClientSegment.ENTREPRENEUR]: 1000000, // 1M€
  [ClientSegment.DIRIGEANT_ENTREPRISE]: 1000000, // 1M€
  [ClientSegment.PROFESSION_LIBERALE]: 750000, // 750K€
  [ClientSegment.INVESTISSEUR_INSTITUTIONNEL]: 5000000, // 5M€
  [ClientSegment.FAMILLE_MULTI_GENERATIONNELLE]: 5000000 // 5M€
};

// Sources de richesse par niveau de risque
export const WEALTH_SOURCE_RISK_LEVELS = {
  [WealthSource.HERITAGE_FAMILIAL]: RiskLevel.FAIBLE,
  [WealthSource.REVENUS_PROFESSIONNELS]: RiskLevel.FAIBLE,
  [WealthSource.PLUS_VALUES_IMMOBILIERES]: RiskLevel.FAIBLE,
  [WealthSource.CESSION_ENTREPRISE]: RiskLevel.MODERE,
  [WealthSource.REVENUS_FINANCIERS]: RiskLevel.MODERE,
  [WealthSource.ACTIVITES_COMMERCIALES]: RiskLevel.MODERE,
  [WealthSource.GAINS_EXCEPTIONNELS]: RiskLevel.ELEVE,
  [WealthSource.ORIGINE_INDETERMINEE]: RiskLevel.TRES_ELEVE
};

// Véhicules d'investissement par niveau de risque
export const INVESTMENT_VEHICLE_RISK_LEVELS = {
  [InvestmentVehicleType.COMPTE_TITRES_CLASSIQUE]: RiskLevel.FAIBLE,
  [InvestmentVehicleType.PEA]: RiskLevel.FAIBLE,
  [InvestmentVehicleType.ASSURANCE_VIE]: RiskLevel.FAIBLE,
  [InvestmentVehicleType.SICAV_FCP]: RiskLevel.FAIBLE,
  [InvestmentVehicleType.FONDS_HEDGE]: RiskLevel.ELEVE,
  [InvestmentVehicleType.PRIVATE_EQUITY]: RiskLevel.MODERE,
  [InvestmentVehicleType.IMMOBILIER_PRIVE]: RiskLevel.MODERE,
  [InvestmentVehicleType.PRODUITS_STRUCTURES]: RiskLevel.ELEVE,
  [InvestmentVehicleType.CRYPTOACTIFS]: RiskLevel.TRES_ELEVE,
  [InvestmentVehicleType.ART_COLLECTION]: RiskLevel.ELEVE,
  [InvestmentVehicleType.METAUX_PRECIEUX]: RiskLevel.MODERE,
  [InvestmentVehicleType.SOCIETES_HOLDINGS]: RiskLevel.ELEVE
};

// Juridictions offshore à surveiller
export const OFFSHORE_JURISDICTIONS = [
  "Îles Caïmans", "Bermudes", "Îles Vierges britanniques",
  "Jersey", "Guernesey", "île de Man",
  "Luxembourg", "Suisse", "Singapour",
  "Hong Kong", "Monaco", "Liechtenstein",
  "Andorre", "Chypre", "Malte"
];

// Mesures de vigilance par niveau de complexité
export const VIGILANCE_MEASURES_BY_COMPLEXITY = {
  [RiskLevel.FAIBLE]: [
    "Vérification standard des sources de richesse",
    "Surveillance des transactions inhabituelles",
    "Revue annuelle du profil client"
  ],
  [RiskLevel.MODERE]: [
    "Documentation détaillée des sources de richesse",
    "Vérification des bénéficiaires effectifs",
    "Surveillance renforcée des flux",
    "Revue semestrielle du dossier"
  ],
  [RiskLevel.ELEVE]: [
    "Due diligence approfondie sur les sources de richesse",
    "Approbation hiérarchique pour nouveaux investissements",
    "Surveillance continue des transactions",
    "Revue trimestrielle obligatoire",
    "Vérification des liens PEP"
  ],
  [RiskLevel.TRES_ELEVE]: [
    "Approbation direction générale",
    "Audit externe des structures patrimoniales",
    "Surveillance quotidienne des flux",
    "Revue mensuelle du dossier",
    "Vérification sanctions et listes noires",
    "Documentation exhaustive de toutes les opérations"
  ]
};

export default {
  WealthManagementServiceType,
  WealthSource,
  InvestmentVehicleType,
  ClientSegment,
  ENHANCED_VIGILANCE_THRESHOLDS,
  WEALTH_SOURCE_RISK_LEVELS,
  INVESTMENT_VEHICLE_RISK_LEVELS,
  OFFSHORE_JURISDICTIONS,
  VIGILANCE_MEASURES_BY_COMPLEXITY
};