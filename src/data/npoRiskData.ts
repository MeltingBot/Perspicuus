/**
 * Module d'évaluation des risques LCB-FT spécifique aux NPO (Organismes à But Non Lucratif)
 * Basé sur les lignes directrices EBA/GL/2023/03
 */

import { RiskLevel } from '../types/lcbft';

export enum NPOCategory {
  ASSOCIATION_1901 = "Association loi 1901",
  FONDATION = "Fondation",
  ORGANISATION_CULTUELLE = "Organisation cultuelle",
  SYNDICAT = "Syndicat",
  PARTI_POLITIQUE = "Parti politique",
  ORGANISATION_INTERNATIONALE = "Organisation internationale",
  AUTRE_NPO = "Autre NPO"
}

export enum NPOActivityType {
  AIDE_HUMANITAIRE = "Aide humanitaire",
  COOPERATION_DEVELOPPEMENT = "Coopération et développement",
  EDUCATION_FORMATION = "Éducation et formation",
  SANTE_SOCIAL = "Santé et social",
  CULTURE_SPORT = "Culture et sport",
  DEFENSE_DROITS = "Défense des droits",
  ENVIRONNEMENT = "Protection de l'environnement",
  RECHERCHE = "Recherche",
  ACTIVITE_RELIGIEUSE = "Activité religieuse",
  COLLECTE_FONDS = "Collecte de fonds"
}

export enum NPOFundingSource {
  DONS_PRIVES = "Dons privés",
  SUBVENTIONS_PUBLIQUES = "Subventions publiques",
  FONDS_EUROPEENS = "Fonds européens",
  ORGANISMES_INTERNATIONAUX = "Organismes internationaux",
  AUTOFINANCEMENT = "Autofinancement",
  COTISATIONS = "Cotisations",
  ACTIVITES_COMMERCIALES = "Activités commerciales",
  LEGS_DONATIONS = "Legs et donations"
}

export interface NPOInfo {
  id: string;
  category: NPOCategory;
  activity_types: NPOActivityType[];
  funding_sources: NPOFundingSource[];
  annual_budget?: number;
  geographic_scope: string[];
  beneficiaries_count?: number;
  employees_count?: number;
  volunteers_count?: number;
  creation_date?: Date;
  legal_status: string;
  registration_number?: string;
  transparency_score: number;
  financial_reporting_quality: RiskLevel;
}

export interface NPORiskFactors {
  high_risk_activities: NPOActivityType[];
  sensitive_zones: string[];
  high_external_funding: boolean;
  large_cash_transactions: boolean;
  weak_governance: boolean;
  politically_exposed: boolean;
  sanctions_risk: boolean;
  terrorism_financing_risk: RiskLevel;
  money_laundering_risk: RiskLevel;
  overall_risk: RiskLevel;
  risk_mitigation_measures: string[];
  enhanced_monitoring_required: boolean;
}

// Mapping des codes NAF vers les catégories NPO
export const NAF_TO_NPO_MAPPING: Record<string, NPOCategory> = {
  "94.11Z": NPOCategory.ASSOCIATION_1901,
  "94.12Z": NPOCategory.SYNDICAT,
  "94.20Z": NPOCategory.PARTI_POLITIQUE,
  "94.91Z": NPOCategory.ORGANISATION_CULTUELLE,
  "94.92Z": NPOCategory.PARTI_POLITIQUE,
  "94.99Z": NPOCategory.AUTRE_NPO,
  "85.31Z": NPOCategory.ASSOCIATION_1901, // Formation continue d'adultes
  "88.10A": NPOCategory.ASSOCIATION_1901, // Aide à domicile
  "88.91A": NPOCategory.ASSOCIATION_1901, // Accueil de jeunes enfants
  "88.99A": NPOCategory.ASSOCIATION_1901, // Autres actions sociales sans hébergement
  "90.01Z": NPOCategory.ASSOCIATION_1901, // Arts du spectacle vivant
  "90.02Z": NPOCategory.ASSOCIATION_1901, // Activités de soutien au spectacle vivant
  "90.03A": NPOCategory.ASSOCIATION_1901, // Création artistique relevant des arts plastiques
  "90.04Z": NPOCategory.ASSOCIATION_1901, // Gestion de salles de spectacles
  "91.02Z": NPOCategory.FONDATION, // Gestion des musées
  "91.03Z": NPOCategory.ASSOCIATION_1901, // Gestion des sites et monuments historiques
};

// Base de données des activités à haut risque pour les NPO
const HIGH_RISK_NPO_ACTIVITIES = {
  [NPOActivityType.AIDE_HUMANITAIRE]: {
    riskLevel: RiskLevel.ELEVE,
    reasons: [
      "Opérations dans des zones de conflit",
      "Transferts d'argent liquide importants",
      "Difficultés de contrôle sur le terrain"
    ]
  },
  [NPOActivityType.COOPERATION_DEVELOPPEMENT]: {
    riskLevel: RiskLevel.MODERE,
    reasons: [
      "Partenariats avec des ONG locales non vérifiées",
      "Projets dans des pays à haut risque"
    ]
  },
  [NPOActivityType.DEFENSE_DROITS]: {
    riskLevel: RiskLevel.ELEVE,
    reasons: [
      "Activités politiquement sensibles",
      "Risque d'instrumentalisation"
    ]
  },
  [NPOActivityType.ACTIVITE_RELIGIEUSE]: {
    riskLevel: RiskLevel.ELEVE,
    reasons: [
      "Collectes de fonds importantes",
      "Réseaux internationaux complexes",
      "Risque de radicalisation"
    ]
  },
  [NPOActivityType.COLLECTE_FONDS]: {
    riskLevel: RiskLevel.TRES_ELEVE,
    reasons: [
      "Manipulation potentielle des fonds",
      "Détournement vers des activités illicites",
      "Transparence limitée"
    ]
  }
};

// Zones géographiques à haut risque pour les NPO
const HIGH_RISK_GEOGRAPHIC_ZONES = [
  "Afghanistan", "Somalie", "Syrie", "Yemen", "Sud-Soudan",
  "République centrafricaine", "Mali", "Burkina Faso", "Niger",
  "Pakistan", "Bangladesh", "Myanmar", "Philippines"
];

export default {
  NPOCategory,
  NPOActivityType,
  NPOFundingSource,
  NAF_TO_NPO_MAPPING,
  HIGH_RISK_NPO_ACTIVITIES,
  HIGH_RISK_GEOGRAPHIC_ZONES
};