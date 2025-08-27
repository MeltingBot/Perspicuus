# Documentation - Format JSON Perspicuus

## Vue d'ensemble

Perspicuus supporte deux formats JSON pour l'import/export des évaluations LCBFT :
- **Format Complet** : Contient toutes les données d'évaluation et les résultats détaillés
- **Format Compact** : Version allégée avec les résultats essentiels uniquement

## Format JSON Complet

### Structure générale

```json
{
  "metadata": {
    "application": "Perspicuus LCBFT",
    "version": "1.0.0",
    "generated_at": "2025-01-15T10:30:00.000Z",
    "disclaimer": "Outil d'aide à la décision - Ne constitue pas un engagement de conformité réglementaire"
  },
  "evaluation_request": {
    "client": { /* Données client */ },
    "geographic": { /* Données géographiques */ },
    "transaction": { /* Données transaction */ }
  },
  "risk_assessment_results": {
    "overall": { /* Résultats globaux */ },
    "geographic_risk": { /* Risques géographiques */ },
    "product_service_risk": { /* Risques produit/service */ },
    "client_risk": { /* Risques client */ },
    "recommendations": [ /* Recommandations */ ]
  }
}
```

### Section `evaluation_request`

#### Objet `client`
```json
{
  "type_client": "Personne physique|Personne morale",
  "category": "Standard|NPO|PEP|Sanctions|Travel Rule|Wealth Management",
  "code_naf": "69.10Z", // Optionnel, requis pour personnes morales
  "date_creation": "2020-01-15T00:00:00.000Z", // Optionnel, personnes morales
  "annee_naissance": 1985, // Optionnel, personnes physiques
  "pep": false,
  "sanctions": false,
  "relation_etablie": 3, // Nombre d'années (0-20)
  "notoriete_defavorable": false,
  "reticence_identification": false
}
```

#### Objet `geographic`
```json
{
  "pays_residence": "France",
  "pays_compte": "France", 
  "distance_etablissement": 50 // Distance en km (0-1000)
}
```

#### Objet `transaction`
```json
{
  "montant": 75000, // Montant typique
  "mode_paiement": "Virement bancaire|Chèque|Carte bancaire|Espèces|Paiement fractionné|Virement international|Cryptomonnaies",
  "complexite_montage": false,
  "canal_distribution": "Présence physique en agence" // Optionnel
}
```

### Section `risk_assessment_results`

#### Objet `overall`
```json
{
  "risk_level": "FAIBLE|MODERE|ELEVE|TRES_ELEVE",
  "risk_level_fr": "Faible|Modéré|Élevé|Très élevé",
  "total_score": 8,
  "scoring_system": "open_scoring"
}
```

#### Objets de risque (`geographic_risk`, `product_service_risk`, `client_risk`)
```json
{
  "score": 3,
  "justifications": [
    "Client résident en Belgique (pays à haut risque GAFI + UE)",
    "Montant de transaction significatif (>50K€)"
  ]
}
```

#### Array `recommendations`
```json
[
  "<b>Vérification d'identité renforcée</b> : Mise en œuvre de contrôles complémentaires...",
  "Justification de l'origine des fonds : Obtenir et analyser les justificatifs..."
]
```

## Format JSON Compact

Structure simplifiée pour les analyses rapides :

```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "risk_level": "ELEVE",
  "total_score": 8,
  "scores": {
    "geographic": 2,
    "product_service": 3,
    "client": 3
  },
  "key_factors": [
    "Client résident en Belgique (pays à haut risque GAFI + UE)",
    "Montant de transaction significatif (>50K€)",
    "Secteur à haut risque: Activités juridiques"
  ]
}
```

## Utilisation des formats

### Export depuis Perspicuus

1. **Export JSON Complet** : Bouton "Export JSON" 
   - Contient toutes les données pour ré-importer et modifier l'évaluation
   - Nom du fichier : `perspicuus_evaluation_YYYY-MM-DD.json`

2. **Export JSON Compact** : Bouton "JSON Compact"
   - Format allégé pour intégration avec d'autres systèmes
   - Nom du fichier : `perspicuus_compact_YYYY-MM-DD.json`

### Import dans Perspicuus

#### Import dans l'onglet "Évaluation"
- **Format Complet** ✅ : Pré-remplit le formulaire pour modification/réévaluation
- **Format Compact** ⚠️ : Données insuffisantes, redirection vers onglet Résultats

#### Import dans l'onglet "Résultats"  
- **Format Complet** ✅ : Affiche les résultats complets et permet modification
- **Format Compact** ✅ : Reconstruit les données minimales pour visualisation

## Validation des imports

Perspicuus valide la structure JSON avant import :

### Critères de reconnaissance
- **Format Complet** : Présence de `metadata.application === "Perspicuus LCBFT"`
- **Format Compact** : Présence de `timestamp` et `risk_level`

### Gestion d'erreurs
- Fichier JSON invalide → Message d'erreur avec détails
- Format non reconnu → Alerte demandant un fichier Perspicuus
- Import réussi → Notification de confirmation

## Scoring ouvert

Le système utilise un **scoring ouvert** (non limité) :
- Chaque facteur de risque ajoute des points selon son intensité
- Pas de plafond fixe par catégorie (géographique, produit, client)
- Score total détermine le niveau de risque final

### Seuils de classification
- **FAIBLE** : 0-3 points
- **MODÉRÉ** : 4-6 points  
- **ÉLEVÉ** : 7-10 points
- **TRÈS ÉLEVÉ** : 11+ points

## Exemples complets

### Exemple - Format Complet
```json
{
  "metadata": {
    "application": "Perspicuus LCBFT",
    "version": "1.0.0",
    "generated_at": "2025-01-15T10:30:00.000Z",
    "disclaimer": "Outil d'aide à la décision - Ne constitue pas un engagement de conformité réglementaire"
  },
  "evaluation_request": {
    "client": {
      "type_client": "Personne morale",
      "code_naf": "69.10Z",
      "date_creation": "2020-06-15T00:00:00.000Z",
      "pep": false,
      "sanctions": false,
      "relation_etablie": 2,
      "notoriete_defavorable": false,
      "reticence_identification": false
    },
    "geographic": {
      "pays_residence": "Belgique",
      "pays_compte": "France",
      "distance_etablissement": 120
    },
    "transaction": {
      "montant": 75000,
      "mode_paiement": "Virement international",
      "complexite_montage": false,
      "canal_distribution": "Vente à distance (Internet)"
    }
  },
  "risk_assessment_results": {
    "overall": {
      "risk_level": "ELEVE",
      "risk_level_fr": "Élevé",
      "total_score": 8,
      "scoring_system": "open_scoring"
    },
    "geographic_risk": {
      "score": 3,
      "justifications": [
        "Client résident en Belgique (pays à haut risque GAFI + UE)",
        "Client situé hors zone de chalandise habituelle (>100km)"
      ]
    },
    "product_service_risk": {
      "score": 5,
      "justifications": [
        "Secteur à haut risque: Activités juridiques",
        "Montant de transaction significatif (>50K€)",
        "Virement international"
      ]
    },
    "client_risk": {
      "score": 2,
      "justifications": [
        "Société nouvellement créée (<2 ans)"
      ]
    },
    "recommendations": [
      "<b>Vérification d'identité renforcée</b> : Mise en œuvre de contrôles complémentaires incluant vérification de l'adresse par courrier recommandé, consultation des bases de données de sanctions et PEP, et validation de l'activité professionnelle.",
      "Justification de l'origine des fonds : Obtenir et analyser les justificatifs détaillés de la provenance des capitaux (bulletins de salaire, déclarations fiscales, actes de vente, etc.) avec validation de leur cohérence.",
      "Supervision des transactions importantes : Mise en place d'un seuil de surveillance abaissé avec validation hiérarchique obligatoire pour toute opération dépassant les montants définis selon le profil client.",
      "Documentation détaillée : Constitution et mise à jour régulière d'un dossier client complet incluant l'ensemble des justificatifs, analyses de risque et décisions prises avec leur motivation."
    ]
  }
}
```

### Exemple - Format Compact
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "risk_level": "ELEVE", 
  "total_score": 8,
  "scores": {
    "geographic": 3,
    "product_service": 5,
    "client": 2
  },
  "key_factors": [
    "Client résident en Belgique (pays à haut risque GAFI + UE)",
    "Client situé hors zone de chalandise habituelle (>100km)",
    "Secteur à haut risque: Activités juridiques",
    "Montant de transaction significatif (>50K€)",
    "Virement international",
    "Société nouvellement créée (<2 ans)"
  ]
}
```

## Intégration avec des systèmes tiers

Le format JSON Perspicuus peut être utilisé pour :
- **Archivage** des évaluations de risque
- **Intégration** avec des systèmes de GRC (Gouvernance, Risque, Conformité)
- **Reporting** réglementaire automatisé
- **Analyse** de portefeuille client
- **Audit** et traçabilité des évaluations

---

*Cette documentation couvre la version 1.0.0 du format JSON Perspicuus. Pour toute question technique, consultez le code source sur GitHub.*