/**
 * Données de référence pour l'évaluation LCBFT
 */

import { RiskData } from '../types/lcbft';

export const RISK_DATA: RiskData = {
  SECTEURS_RISQUE: {
    TRES_ELEVE: {
      "66.12Z": "Courtage de valeurs mobilières et de marchandises",
      "92.00Z": "Organisation de jeux de hasard et d'argent",
      "64.99Z": "Autres intermédiations monétaires (crypto-actifs)",
      "43.3": "Travaux de finition (peinture, plâtrerie)",
      "43.2": "Travaux d'installation électrique et plomberie"
    },
    ELEVE: {
      "41.2": "Construction de bâtiments résidentiels et non résidentiels",
      "41.20A": "Construction de maisons individuelles",
      "41.20B": "Construction d'autres bâtiments",
      "43.1": "Démolition et préparation des sites",
      "43.9": "Autres travaux de construction spécialisés",
      "42": "Génie civil",
      "68.31Z": "Agences immobilières",
      "47.77Z": "Commerce de détail d'articles d'horlogerie et de bijouterie",
      "69.10Z": "Activités juridiques",
      "69.20Z": "Activités comptables",
      "82.11Z": "Services administratifs combinés de bureau (domiciliation)",
      "47.91B": "Vente à distance (e-commerce)"
    },
    MODERE: {
      "41.1": "Promotion immobilière"
    }
  },
  PAYS_RISQUE: {
    TRES_ELEVE: [
      "Corée du Nord",
      "Iran", 
      "Myanmar"
    ],
    ELEVE: [
      // Liste GAFI + UE haut risque (score majoré)
      "Afghanistan", "Algérie", "Angola", "Burkina Faso", "Cameroun", "Côte d'Ivoire",
      "République démocratique du Congo", "Haïti", "Kenya", "Laos", "Liban", "Mali", 
      "Monaco", "Mozambique", "Namibie", "Népal", "Nigeria", "Afrique du Sud", 
      "Soudan du Sud", "Syrie", "Tanzanie", "Trinité-et-Tobago", "Vanuatu", 
      "Venezuela", "Vietnam", "Yémen",
      // Liste GAFI seule
      "Albanie", "Bulgarie", "Cambodge", "Croatie", "Jordanie", "Maroc", "Nicaragua", 
      "Pakistan", "Turquie", "Zimbabwe",
      // Liste non-coopération fiscale UE + FR ETNC
      "Anguilla", "Antigua-et-Barbuda", "Bahamas", "Belize", "Fidji", "Fédération de Russie", 
      "Guam", "Îles Turques-et-Caïques", "Îles Vierges américaines", "Palaos", "Panama", 
      "Samoa", "Samoa américaines", "Seychelles"
    ]
  },
  PAYS_GAFI_UE_MAJORE: [
    "Afghanistan", "Algérie", "Angola", "Burkina Faso", "Cameroun", "Côte d'Ivoire",
    "République démocratique du Congo", "Haïti", "Kenya", "Laos", "Liban", "Mali", 
    "Monaco", "Mozambique", "Myanmar", "Namibie", "Népal", "Nigeria", "Afrique du Sud", 
    "Soudan du Sud", "Syrie", "Tanzanie", "Trinité-et-Tobago", "Vanuatu", 
    "Venezuela", "Vietnam", "Yémen"
  ]
};

export const COUNTRIES_LIST = [
  "France", "Allemagne", "Espagne", "Italie", "Belgique",
  ...RISK_DATA.PAYS_RISQUE.ELEVE,
  ...RISK_DATA.PAYS_RISQUE.TRES_ELEVE
].sort();

export const EVALUATIONS_SPECIFIQUES = {
  "BIENS_PRECIEUX": {
    "achat_vente_or_avec_justificatif": {
      niveau: "MODERE",
      description: "Achat-vente d'or d'investissement (lingots, lingotins, pièces d'or) avec justificatif de provenance",
      justification: "Évaluation normale du niveau de risque lorsqu'aucun critère ne justifie un risque faible, élevé ou très élevé. Les justificatifs de provenance acceptables sont par exemple la facture d'achat, un acte de donation, acte de succession…"
    },
    "achat_vente_or_sans_justificatif": {
      niveau: "ELEVE",
      description: "Achat-vente d'or d'investissement (lingots, lingotins, pièces d'or) sans justificatif de provenance",
      justification: "L'or est un bien considéré à risque BC-FT élevé par l'Analyse Sectorielle des Risques (ASR), une attention accrue doit être portée sur les transactions avec ce métal."
    },
    "achat_vente_bijoux_vrac_sans_justificatif": {
      niveau: "ELEVE",
      description: "Achat-vente de bijoux en vrac sans justificatif de provenance",
      justification: "Le vol et le recel sont des menaces identifiées dans l'ASR et sont des infractions sanctionnées d'une peine d'emprisonnement de plus d'un an. Les indices laissant penser à du vol ou du recel peuvent être la venue régulière d'un particulier, des bijoux de style ou de tailles différentes, des marquages personnels différents entre les bijoux (telle qu'une gravure d'une initiale ou message personnel)."
    },
    "bien_risque_pillage": {
      niveau: "TRES_ELEVE",
      description: "Achat-vente d'un bien (monnaie, sculpture…) exposé au risque de pillage ou provenant d'une zone exposée au risque de pillage",
      justification: "Le trafic et le pillage archéologique sont des menaces identifiées dans l'ASR et sont des infractions sanctionnées d'une peine d'emprisonnement de plus d'un an. Les indices laissant penser à du pillage peuvent être des traces de terre sur l'objet, ou son origine géographique (zone de conflit)."
    },
    "bien_liste_rouge_icom": {
      niveau: "ELEVE",
      description: "Achat-vente d'un bien présent sur les listes rouges de l'ICOM",
      justification: "Les listes rouges répertorient les catégories d'objets culturels exposées au pillage et au trafic."
    },
    "montant_double_habituel": {
      niveau: "ELEVE",
      description: "Achat-vente d'un montant supérieur au double des transactions habituellement effectuées par un client",
      justification: "L'achat est inhabituel par rapport à la connaissance de la relation d'affaires et des habitudes d'achat du client."
    },
    "montant_inhabituellement_eleve": {
      niveau: "ELEVE",
      description: "Achat-vente d'un bien au montant inhabituellement élevé",
      justification: "Le professionnel doit consacrer une attention particulière aux transactions présentant une forte décorrélation entre le montant estimé du bien et son prix de vente/achat."
    },
    "doute_certificat_authenticite": {
      niveau: "ELEVE",
      description: "Doute quant à l'authenticité du certificat d'importation/exportation d'un bien ou de la facture d'achat",
      justification: "Les professionnels peuvent vérifier l'existence de l'organisme de délivrance du certificat, vérifier le SIREN de la société ayant vendu le bien."
    }
  }
};

// Codes NAF spécifiques aux NPO
export const SECTEURS_RISQUE_NPO = {
  MODERE: {
    "94.11Z": "Activités d'organisations patronales et consulaires",
    "94.12Z": "Activités d'organisations professionnelles", 
    "94.91Z": "Activités d'organisations religieuses",
    "94.92Z": "Activités d'organisations politiques",
    "85.31Z": "Enseignement secondaire général",
    "85.32Z": "Enseignement secondaire technique ou professionnel"
  },
  ELEVE: {
    "94.99Z": "Autres organisations fonctionnant par adhésion volontaire",
    "88.99B": "Action sociale sans hébergement n.c.a."
  }
};

// Codes NAF spécifiques aux prestataires de services de paiement (Travel Rule)
export const SECTEURS_RISQUE_TRAVEL_RULE = {
  TRES_ELEVE: {
    "64.19Z": "Autres intermédiations monétaires",
    "64.99Z": "Autres intermédiations monétaires (crypto-actifs)",
    "66.12Z": "Courtage de valeurs mobilières et de marchandises"
  },
  ELEVE: {
    "64.11Z": "Activités de banque centrale",
    "64.20Z": "Activités des sociétés holding",
    "66.11Z": "Administration de marchés financiers",
    "66.19A": "Supports juridiques de gestion de patrimoine mobilier",
    "66.22Z": "Activités des agents et courtiers d'assurances"
  }
};

// Codes NAF spécifiques à la gestion de fortune et wealth management
export const SECTEURS_RISQUE_WEALTH_MANAGEMENT = {
  TRES_ELEVE: {
    "66.11Z": "Administration de marchés financiers",
    "66.30Z": "Gestion de fonds",
    "70.22Z": "Conseil pour affaires et gestion (wealth management)"
  },
  ELEVE: {
    "66.12Z": "Courtage valeurs mobilières", 
    "66.19A": "Supports juridiques de gestion de patrimoine mobilier",
    "66.19B": "Autres auxiliaires services financiers",
    "69.20Z": "Activités comptables (wealth management)",
    "68.31Z": "Agences immobilières (prestige)",
    "77.39Z": "Autres locations et location-bail (art, yachts)"
  },
  MODERE: {
    "64.20Z": "Activités des sociétés holding",
    "66.22Z": "Activités des agents et courtiers d'assurances (haut de gamme)",
    "69.10Z": "Activités juridiques (droit patrimonial)"
  }
};

// Fonction de détection automatique des NPO
export const isNPO = (codeNaf?: string): boolean => {
  if (!codeNaf) return false;
  
  const npoNafCodes = [
    "94.11Z", "94.12Z", "94.91Z", "94.92Z", "94.99Z", 
    "88.99B", "85.31Z", "85.32Z", "88.10A", "88.91A"
  ];
  
  return npoNafCodes.includes(codeNaf);
};

// Fonction de détection automatique des prestataires Travel Rule
export const isTravelRuleProvider = (codeNaf?: string): boolean => {
  if (!codeNaf) return false;
  
  const travelRuleNafCodes = [
    "64.11Z", "64.19Z", "64.20Z", "64.99Z", "66.11Z", 
    "66.12Z", "66.19A", "66.22Z"
  ];
  
  return travelRuleNafCodes.includes(codeNaf);
};

// Fonction de détection automatique des clients wealth management
export const isWealthManagementClient = (codeNaf?: string): boolean => {
  if (!codeNaf) return false;
  
  const wealthManagementNafCodes = [
    "66.11Z", "66.30Z", "70.22Z", "66.12Z", "66.19A", "66.19B",
    "69.20Z", "68.31Z", "77.39Z", "64.20Z", "66.22Z", "69.10Z"
  ];
  
  return wealthManagementNafCodes.includes(codeNaf);
};

export const INDICATEURS_SOUPCON = {
  "Transactions": [
    "Montants disproportionnés par rapport à l'activité",
    "Paiements en espèces répétés et importants",
    "Virements vers des paradis fiscaux",
    "Opérations de change complexes"
  ],
  "Comportement Client": [
    "Réticence à fournir des informations",
    "Changement soudain de comportement",
    "Demandes de discrétion particulière",
    "Connaissance limitée de ses propres opérations"
  ],
  "Géographique": [
    "Opérations sans lien géographique logique",
    "Utilisation de comptes dans plusieurs pays",
    "Transits par des pays à risque"
  ],
  "Biens Précieux et Œuvres d'Art": [
    "Or d'investissement sans justificatif de provenance",
    "Bijoux en vrac sans justificatif",
    "Objets provenant de zones de conflit",
    "Biens présents sur listes rouges ICOM",
    "Montants inhabituels par rapport aux habitudes client",
    "Certificats d'authenticité douteux",
    "Traces de terre sur objets archéologiques",
    "Décorrélation prix estimé/prix de vente"
  ],
  "NPO - Organismes à But Non Lucratif": [
    "Absence de statut légal reconnu",
    "Gouvernance opaque ou non documentée",
    "Sources de financement opaques ou non traçables",
    "Dépendance exclusive aux dons en espèces",
    "Utilisation importante de crypto-actifs",
    "Financement par des juridictions à haut risque",
    "Activités dans des zones de conflit sans justification claire",
    "Utilisation d'intermédiaires non surveillés",
    "Liens suspectés avec des organisations extrémistes",
    "Antécédents de manquements ou activités criminelles",
    "Réticence à fournir des informations sur la gouvernance",
    "Changements fréquents de dirigeants",
    "Transactions vers des pays sous sanctions sans exemption",
    "Écart significatif entre mission déclarée et activités réelles"
  ],
  "Travel Rule - Règles de Voyage": [
    "Informations du donneur d'ordre systématiquement manquantes",
    "Utilisation répétée de caractères non admissibles",
    "Noms génériques ou dépourvus de sens (XXX, ABCDEF, etc.)",
    "Adresses incohérentes ou fictives",
    "Transferts multiples juste sous les seuils réglementaires",
    "Séquences rapides de transferts vers même bénéficiaire",
    "Montants inhabituels répétés (ex: 999€, 2999€)",
    "Transferts vers pays sous sanctions sans exemption",
    "Transit par pays sans règles de voyage",
    "Prestataires avec omissions répétées",
    "Systèmes techniquement défaillants",
    "Adresses auto-hébergées non vérifiées &gt;1000€",
    "Utilisation de services de mixage/brassage",
    "Techniques d'anonymisation avancées",
    "Tokens de confidentialité (privacy coins)",
    "Transferts en dehors des heures d'activité normale",
    "Fréquence anormalement élevée de transferts",
    "Évitement des périodes de surveillance renforcée"
  ],
  "Wealth Management - Gestion de Fortune": [
    "Patrimoine disproportionné aux revenus déclarés",
    "Évolution patrimoniale inexpliquée et rapide",
    "Actifs concentrés dans paradis fiscaux",
    "Structures de détention opaques ou complexes",
    "Origine des fonds non documentée ou suspecte",
    "Espèces importantes et répétées sans justification",
    "Rachats précoces fréquents contrats assurance-vie",
    "Crédits lombards sur actifs douteux",
    "Arbitrages sans logique économique",
    "Fractionnement pour éviter seuils déclaratifs",
    "Utilisation trusts offshore sans justification",
    "Holdings en cascade dans juridictions opaques",
    "Sociétés écrans à l'activité fictive",
    "Changements fréquents bénéficiaires effectifs",
    "Montages dissimulant propriété réelle",
    "Résidences fiscales multiples suspectes",
    "Actifs dans États non coopératifs",
    "Transit par juridictions à secret bancaire",
    "Évitement systématique obligations déclaratives",
    "Mouvements vers pays à haut risque",
    "Demandes confidentialité excessive",
    "Réticence à documenter origine patrimoine",
    "Instructions de gestion incohérentes",
    "Changements fréquents d'interlocuteurs",
    "Pression temporelle sur opérations"
  ]
};