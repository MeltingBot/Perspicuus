/**
 * Module d'évaluation des risques LCB-FT spécifique aux PPE (Personnes Politiquement Exposées)
 * Basé sur les lignes directrices EBA/GL/2017/17 et la directive (UE) 2015/849
 */

import { RiskLevel } from '../types/lcbft';

export enum PPECategory {
  PPE_NATIONALE = "PPE nationale",
  PPE_ETRANGERE = "PPE étrangère", 
  PPE_ORGANISATION_INTERNATIONALE = "PPE d'organisation internationale",
  MEMBRE_FAMILLE_PPE = "Membre de famille de PPE",
  PROCHE_COLLABORATEUR_PPE = "Proche collaborateur de PPE"
}

export enum PPEFunctionType {
  CHEF_ETAT_GOUVERNEMENT = "Chef d'État ou de gouvernement",
  MINISTRE_HAUT_RESPONSABLE = "Ministre ou haut responsable gouvernemental",
  PARLEMENTAIRE = "Parlementaire",
  JUGE_COUR_SUPREME = "Juge de cour suprême",
  DIRIGEANT_PARTI_POLITIQUE = "Dirigeant de parti politique majeur",
  GENERAL_OFFICIER_SUPERIEUR = "Général ou officier supérieur",
  MEMBRE_ORGANE_ADMINISTRATION = "Membre d'organe d'administration d'entreprise publique",
  DIRIGEANT_ORGANISATION_INTERNATIONALE = "Dirigeant d'organisation internationale",
  AUTRE_FONCTION_PUBLIQUE_IMPORTANTE = "Autre fonction publique importante"
}

export enum PPERiskFactor {
  FONCTION_ACTUELLE = "Fonction actuelle",
  FONCTION_PASSEE_MOINS_18_MOIS = "Fonction exercée il y a moins de 18 mois",
  PAYS_HAUT_RISQUE = "Fonction exercée dans un pays à haut risque",
  SECTEUR_SENSIBLE = "Secteur d'activité sensible",
  PATRIMOINE_IMPORTANT = "Patrimoine important",
  EXPOSITION_MEDIATIQUE = "Forte exposition médiatique",
  ACTIVITES_COMMERCIALES_COMPLEXES = "Activités commerciales complexes",
  RESEAUX_INTERNATIONAUX = "Réseaux internationaux étendus"
}

export interface PPEInfo {
  id: string;
  category: PPECategory;
  function_type: PPEFunctionType;
  function_country: string;
  is_current_function: boolean;
  function_end_date?: Date;
  risk_factors: PPERiskFactor[];
  wealth_sources: string[];
  business_activities: string[];
  family_members_ppe: boolean;
  close_associates_ppe: boolean;
}

export interface PPERiskAssessment {
  base_risk: RiskLevel;
  enhanced_factors: PPERiskFactor[];
  mitigation_measures: string[];
  monitoring_requirements: string[];
  relationship_decision: 'ACCEPT' | 'ACCEPT_WITH_CONDITIONS' | 'DECLINE';
  review_frequency: number; // en mois
  overall_risk: RiskLevel;
}

// Pays nécessitant une vigilance renforcée pour les PPE
export const HIGH_RISK_PPE_COUNTRIES = [
  "Afghanistan", "Iran", "Corée du Nord", "Syrie", "Myanmar",
  "Biélorussie", "Russie", "Chine", "Venezuela", "Cuba",
  "Érythrée", "Libye", "Somalie", "Soudan", "Zimbabwe"
];

// Fonctions PPE par niveau de risque
export const PPE_FUNCTION_RISK_LEVELS = {
  [PPEFunctionType.CHEF_ETAT_GOUVERNEMENT]: RiskLevel.TRES_ELEVE,
  [PPEFunctionType.MINISTRE_HAUT_RESPONSABLE]: RiskLevel.ELEVE,
  [PPEFunctionType.PARLEMENTAIRE]: RiskLevel.MODERE,
  [PPEFunctionType.JUGE_COUR_SUPREME]: RiskLevel.ELEVE,
  [PPEFunctionType.DIRIGEANT_PARTI_POLITIQUE]: RiskLevel.ELEVE,
  [PPEFunctionType.GENERAL_OFFICIER_SUPERIEUR]: RiskLevel.ELEVE,
  [PPEFunctionType.MEMBRE_ORGANE_ADMINISTRATION]: RiskLevel.MODERE,
  [PPEFunctionType.DIRIGEANT_ORGANISATION_INTERNATIONALE]: RiskLevel.ELEVE,
  [PPEFunctionType.AUTRE_FONCTION_PUBLIQUE_IMPORTANTE]: RiskLevel.MODERE
};

// Mesures de vigilance renforcée par catégorie PPE
export const PPE_ENHANCED_MEASURES = {
  [PPECategory.PPE_NATIONALE]: [
    "Approbation par la direction générale",
    "Vérification approfondie des sources de richesse",
    "Surveillance continue des transactions",
    "Revue annuelle du dossier"
  ],
  [PPECategory.PPE_ETRANGERE]: [
    "Approbation par la direction générale",
    "Due diligence renforcée sur le pays d'origine",
    "Vérification des sanctions internationales",
    "Surveillance renforcée des flux financiers",
    "Revue semestrielle du dossier"
  ],
  [PPECategory.PPE_ORGANISATION_INTERNATIONALE]: [
    "Vérification du statut officiel",
    "Analyse des conflits d'intérêts potentiels",
    "Surveillance des transactions internationales"
  ],
  [PPECategory.MEMBRE_FAMILLE_PPE]: [
    "Identification du lien familial avec la PPE",
    "Évaluation indirecte du risque PPE",
    "Surveillance adaptée selon le lien familial"
  ],
  [PPECategory.PROCHE_COLLABORATEUR_PPE]: [
    "Documentation de la relation avec la PPE",
    "Évaluation du niveau d'influence",
    "Surveillance proportionnelle au risque"
  ]
};

export default {
  PPECategory,
  PPEFunctionType,
  PPERiskFactor,
  HIGH_RISK_PPE_COUNTRIES,
  PPE_FUNCTION_RISK_LEVELS,
  PPE_ENHANCED_MEASURES
};