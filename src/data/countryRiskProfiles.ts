/**
 * Profils de risque géographique centralisés
 * Utilisable par tous les modules (NPO, Travel Rule, évaluation principale)
 */

export interface CountryRiskProfile {
  isSanctioned: boolean;
  isHighRisk: boolean;
  isEU: boolean;
  hasTravelRule: boolean;
  corruptionRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  politicalStability: 'STABLE' | 'UNSTABLE' | 'CRISIS';
  cooperationLevel: 'FULL' | 'LIMITED' | 'NON_COOPERATIVE';
  fatfMember?: boolean;
  taxTransparency?: 'COMPLIANT' | 'PARTIALLY_COMPLIANT' | 'NON_COMPLIANT';
  bankingSecrecy?: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * Base de données centralisée des profils de risque pays
 * Inspiré des indicateurs PEP et enrichi pour les besoins Travel Rule
 */
export const COUNTRY_RISK_PROFILES: Record<string, CountryRiskProfile> = {
  // Pays sous sanctions internationales (très haut risque)
  "Corée du Nord": {
    isSanctioned: true,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: false,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Iran": {
    isSanctioned: true,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Myanmar": {
    isSanctioned: true,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },

  // Union Européenne - Pays fondateurs/principaux (faible risque)
  "France": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Allemagne": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Pays-Bas": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Belgique": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Luxembourg": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },

  // Union Européenne - Autres pays membres
  "Espagne": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Italie": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Portugal": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Autriche": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: true,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },

  // Pays haut risque GAFI/UE avec contextes spécifiques
  "Afghanistan": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Nigeria": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Pakistan": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Venezuela": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Yémen": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Syrie": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },

  // Grandes puissances avec contextes géopolitiques spécifiques
  "Russie": {
    isSanctioned: true,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'NON_COOPERATIVE',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Chine": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "États-Unis": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },
  "Royaume-Uni": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'LOW'
  },

  // Centres financiers et juridictions spéciales
  "Suisse": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Singapour": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Hong Kong": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },

  // Paradis fiscaux et juridictions à risque
  "Îles Caïmans": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: false,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Îles Vierges britanniques": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: false,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Panama": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'HIGH',
    politicalStability: 'STABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Monaco": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'LOW',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },

  // Pays émergents avec niveaux de risque variables
  "Inde": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Brésil": {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Turquie": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Afrique du Sud": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'HIGH',
    politicalStability: 'UNSTABLE',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },

  // Pays du Moyen-Orient et Afrique du Nord
  "Maroc": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  },
  "Liban": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'VERY_HIGH',
    politicalStability: 'CRISIS',
    cooperationLevel: 'LIMITED',
    fatfMember: true,
    taxTransparency: 'NON_COMPLIANT',
    bankingSecrecy: 'HIGH'
  },
  "Jordanie": {
    isSanctioned: false,
    isHighRisk: true,
    isEU: false,
    hasTravelRule: false,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: true,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  }
};

/**
 * Fonction utilitaire pour obtenir le profil de risque d'un pays
 * Retourne un profil par défaut prudent si le pays n'est pas listé
 */
export const getCountryRiskProfile = (countryName: string): CountryRiskProfile => {
  return COUNTRY_RISK_PROFILES[countryName] || {
    isSanctioned: false,
    isHighRisk: false,
    isEU: false,
    hasTravelRule: true,
    corruptionRisk: 'MEDIUM',
    politicalStability: 'STABLE',
    cooperationLevel: 'FULL',
    fatfMember: false,
    taxTransparency: 'PARTIALLY_COMPLIANT',
    bankingSecrecy: 'MEDIUM'
  };
};

/**
 * Fonctions utilitaires pour filtrer les pays par critères
 */
export const getSanctionedCountries = (): string[] => {
  return Object.entries(COUNTRY_RISK_PROFILES)
    .filter(([, profile]) => profile.isSanctioned)
    .map(([country]) => country);
};

export const getHighRiskCountries = (): string[] => {
  return Object.entries(COUNTRY_RISK_PROFILES)
    .filter(([, profile]) => profile.isHighRisk)
    .map(([country]) => country);
};

export const getEUCountries = (): string[] => {
  return Object.entries(COUNTRY_RISK_PROFILES)
    .filter(([, profile]) => profile.isEU)
    .map(([country]) => country);
};

export const getTravelRuleCountries = (): string[] => {
  return Object.entries(COUNTRY_RISK_PROFILES)
    .filter(([, profile]) => profile.hasTravelRule)
    .map(([country]) => country);
};

export const getCountriesByCorruptionRisk = (level: CountryRiskProfile['corruptionRisk']): string[] => {
  return Object.entries(COUNTRY_RISK_PROFILES)
    .filter(([, profile]) => profile.corruptionRisk === level)
    .map(([country]) => country);
};

/**
 * Fonction pour évaluer le risque géographique d'un transfert
 */
export interface GeographicRiskAssessment {
  hasSanctionedCountry: boolean;
  hasHighRiskCountry: boolean;
  isCrossBorderComplex: boolean;
  hasNoTravelRule: boolean;
  corruptionRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  overallRiskScore: number;
}

export const assessGeographicRisk = (
  originCountry: string, 
  destinationCountry: string
): GeographicRiskAssessment => {
  const originProfile = getCountryRiskProfile(originCountry);
  const destProfile = getCountryRiskProfile(destinationCountry);

  const hasSanctionedCountry = originProfile.isSanctioned || destProfile.isSanctioned;
  const hasHighRiskCountry = originProfile.isHighRisk || destProfile.isHighRisk;
  const hasNoTravelRule = !originProfile.hasTravelRule || !destProfile.hasTravelRule;
  
  // Transfert transfrontalier complexe : différents pays ET au moins un hors UE
  const isCrossBorder = originCountry !== destinationCountry;
  const bothInEU = originProfile.isEU && destProfile.isEU;
  const isCrossBorderComplex = isCrossBorder && !bothInEU;

  // Niveau de corruption maximum entre les deux pays
  const corruptionLevels = ['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH'];
  const maxCorruptionIndex = Math.max(
    corruptionLevels.indexOf(originProfile.corruptionRisk),
    corruptionLevels.indexOf(destProfile.corruptionRisk)
  );
  const corruptionRiskLevel = corruptionLevels[maxCorruptionIndex] as CountryRiskProfile['corruptionRisk'];

  // Calcul du score de risque global (0-10)
  let riskScore = 0;
  if (hasSanctionedCountry) riskScore += 4;
  if (hasHighRiskCountry) riskScore += 3;
  if (isCrossBorderComplex) riskScore += 2;
  if (hasNoTravelRule) riskScore += 1;
  if (corruptionRiskLevel === 'VERY_HIGH') riskScore += 2;
  else if (corruptionRiskLevel === 'HIGH') riskScore += 1;

  return {
    hasSanctionedCountry,
    hasHighRiskCountry,
    isCrossBorderComplex,
    hasNoTravelRule,
    corruptionRiskLevel,
    overallRiskScore: Math.min(riskScore, 10)
  };
};