# 🛡️ Perspicuus - Évaluation des Risques LCBFT

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/MeltingBot/Perspicuus)
[![React](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178c6.svg)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.0-0081cb.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Perspicuus** est un outil d'aide à la décision pour l'évaluation des risques de **blanchiment de capitaux et financement du terrorisme (LCBFT)** destiné aux établissements financiers français.

![Perspicuus Interface](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=Perspicuus+-+Interface+d%27%C3%A9valuation+LCBFT)

## 🎯 Objectifs

- **Évaluation objective** des risques LCBFT selon les standards FATF/GAFI
- **Interface intuitive** avec questionnaire guidé multi-étapes
- **Génération automatique** de rapports PDF professionnels
- **Conformité réglementaire** aux exigences françaises et européennes
- **Modules spécialisés** : Travel Rule, PPE, Gestion de Fortune, ONG

## ✨ Fonctionnalités Principales

### 🔍 **Évaluation Multi-Dimensionnelle**
- **Risques géographiques** : Analyse basée sur les listes FATF/GAFI
- **Risques clients** : PPE, sanctions, notoriété, âge, secteur d'activité
- **Risques produits/services** : Montants, modes de paiement, complexité

### 📊 **Scoring Automatisé**
- Algorithme de notation sur 20+ points
- Classification en 4 niveaux : Faible, Modéré, Élevé, Très Élevé
- Justifications détaillées pour chaque facteur de risque

### 🎛️ **Modules Spécialisés**
- **Travel Rule** : Évaluation conforme FATF Rec. 16 (cryptomonnaies, transferts internationaux)
- **PPE (PEP)** : Questionnaire dédié aux Personnes Politiquement Exposées
- **Gestion de Fortune** : Analyse des services de wealth management
- **ONG** : Évaluation spécifique des organismes à but non lucratif

### 📄 **Rapports Professionnels**
- Génération PDF automatique avec mise en page soignée
- Synthèse exécutive, analyse détaillée, recommandations
- Mentions légales et limitations d'utilisation incluses
- Conforme aux standards de documentation TRACFIN

### 🚀 **Interface Moderne**
- Design responsive Material-UI
- Navigation par étapes avec progression visuelle
- Validation en temps réel des saisies
- Visualisations graphiques des scores (radar, barres)

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + TypeScript
- **UI/UX** : Material-UI v5, Recharts pour les graphiques
- **PDF** : jsPDF pour la génération de rapports
- **Date** : Material-UI Date Pickers avec localisation française
- **Build** : Create React App avec optimisations de production

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/MeltingBot/Perspicuus.git
cd Perspicuus

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Build de Production
```bash
# Créer le build optimisé
npm run build

# Les fichiers seront générés dans le dossier /build
```

## 📖 Guide d'Utilisation

### 1. **Évaluation Standard**
1. Renseigner les informations client (type, secteur, âge, relation)
2. Compléter les données géographiques (résidence, comptes, distance)
3. Détailler la transaction (montant, mode de paiement, canal)
4. Consulter l'analyse et télécharger le rapport PDF

### 2. **Modules Spécialisés** 
Les modules se déclenchent automatiquement selon les critères :
- **Travel Rule** : Crypto >1000€ OU codes NAF spécifiques (gestionnaires de portefeuille)
- **PPE** : Cases manuelles (PP) ou codes NAF (PM)  
- **Gestion de Fortune** : Encours >100K€ ou services wealth management
- **ONG** : Organismes à but non lucratif

### 3. **Interprétation des Résultats**
- **Faible (0-3 pts)** : Vigilance simplifiée possible
- **Modéré (4-6 pts)** : Vigilance standard
- **Élevé (7-10 pts)** : Vigilance renforcée requise
- **Très Élevé (11+ pts)** : Relation fortement déconseillée

## ⚖️ Conformité Réglementaire

### Références Normatives
- **Recommandations FATF/GAFI** (notamment Rec. 16 Travel Rule)
- **Directive (UE) 2015/849** (4ème directive anti-blanchiment)
- **Code monétaire et financier français** (Articles L561-1 et suivants)
- **Lignes directrices EBA** sur l'évaluation des risques

### Limitations Importantes
⚠️ **Cet outil constitue une aide à la décision et ne saurait se substituer au jugement professionnel de l'établissement financier.**

- L'évaluation est basée exclusivement sur les données fournies
- Ne dispense pas des obligations de vigilance et déclaration TRACFIN  
- L'établissement reste responsable de ses décisions d'acceptation/refus
- Les seuils peuvent nécessiter des ajustements selon le contexte

## 🏗️ Architecture Technique

```
src/
├── components/           # Composants React réutilisables
│   ├── WizardEvaluationForm.tsx    # Formulaire principal multi-étapes
│   ├── TravelRuleStep.tsx          # Module Travel Rule
│   ├── PPEQuestionnaireStep.tsx    # Module PPE
│   ├── WealthManagementStep.tsx    # Module Gestion de Fortune
│   └── SimpleResultsDisplay.tsx    # Affichage des résultats
├── services/            # Services métier
│   ├── riskEngine.ts    # Moteur de calcul des risques
│   └── pdfGenerator.ts  # Générateur de rapports PDF
├── data/               # Référentiels de données
│   ├── riskData.ts     # Pays à risque, secteurs sensibles
│   ├── travelRuleData.ts # Données Travel Rule
│   └── ppeRiskData.ts  # Classifications PPE
└── types/              # Interfaces TypeScript
    └── lcbft.ts        # Types pour l'évaluation LCBFT
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez votre branche (`git checkout -b feature/amelioration`)
3. Commitez vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrez une **Pull Request**

### Standards de Code
- **TypeScript** strict activé
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage
- Tests avec **Jest** et **React Testing Library**

## 📋 Roadmap

### Version 1.1 (Prochaine)
- [ ] Export Excel des évaluations
- [ ] Historique et suivi des dossiers clients
- [ ] API REST pour intégration SI
- [ ] Tableaux de bord et statistiques

### Version 1.2 (Moyen terme)
- [ ] Module sanctions temps réel
- [ ] Connecteur bases de données PEP
- [ ] Notifications et alertes automatiques
- [ ] Multi-devises et seuils personnalisables

## 📞 Support

- **Documentation** : Consultez le fichier `CLAUDE.md` pour les détails techniques
- **Issues** : [GitHub Issues](https://github.com/MeltingBot/Perspicuus/issues)
- **Discussions** : [GitHub Discussions](https://github.com/MeltingBot/Perspicuus/discussions)

## 📜 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**🛡️ Perspicuus** - *Clarté dans l'évaluation des risques LCBFT*

Développé avec ❤️ pour les professionnels de la conformité

[🌐 Site Web](https://github.com/MeltingBot/Perspicuus) • [📖 Documentation](CLAUDE.md) • [🐛 Issues](https://github.com/MeltingBot/Perspicuus/issues)

</div>