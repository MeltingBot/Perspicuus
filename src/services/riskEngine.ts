/**
 * Moteur d'évaluation des risques LCBFT - Version JavaScript/TypeScript
 */

import { 
  RiskAssessmentRequest, 
  RiskAssessmentResult, 
  RiskScore, 
  RiskLevel,
  GeographicInfo,
  ClientInfo,
  TransactionInfo,
  PaymentMethod,
  ClientType
} from '../types/lcbft';
import { RISK_DATA } from '../data/riskData';
import { getCountryRiskProfile } from '../data/countryRiskProfiles';

export class LCBFTRiskEngine {
  
  /**
   * Évaluation du risque géographique
   */
  static evaluerRisqueGeographique(geo: GeographicInfo): RiskScore {
    let score = 0;
    const justifications: string[] = [];
    
    // Évaluation du pays de résidence
    if (RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(geo.pays_residence)) {
      if (RISK_DATA.PAYS_GAFI_UE_MAJORE.includes(geo.pays_residence)) {
        score += 5; // Score majoré GAFI + UE
        justifications.push(`Client résident en ${geo.pays_residence} (liste noire GAFI + UE)`);
      } else {
        score += 4;
        justifications.push(`Client résident en ${geo.pays_residence} (liste noire GAFI)`);
      }
    } else if (RISK_DATA.PAYS_RISQUE.ELEVE.includes(geo.pays_residence)) {
      if (RISK_DATA.PAYS_GAFI_UE_MAJORE.includes(geo.pays_residence)) {
        score += 4; // Score majoré GAFI + UE 
        justifications.push(`Client résident en ${geo.pays_residence} (pays à haut risque GAFI + UE)`);
      } else {
        score += 3;
        justifications.push(`Client résident en ${geo.pays_residence} (pays à haut risque GAFI)`);
      }
    }
    
    // Évaluation du pays du compte bancaire
    if (RISK_DATA.PAYS_RISQUE.TRES_ELEVE.includes(geo.pays_compte)) {
      if (RISK_DATA.PAYS_GAFI_UE_MAJORE.includes(geo.pays_compte)) {
        score += 5; // Score majoré GAFI + UE
        justifications.push(`Compte bancaire en ${geo.pays_compte} (liste noire GAFI + UE)`);
      } else {
        score += 4;
        justifications.push(`Compte bancaire en ${geo.pays_compte} (liste noire GAFI)`);
      }
    } else if (RISK_DATA.PAYS_RISQUE.ELEVE.includes(geo.pays_compte)) {
      if (RISK_DATA.PAYS_GAFI_UE_MAJORE.includes(geo.pays_compte)) {
        score += 4; // Score majoré GAFI + UE 
        justifications.push(`Compte bancaire en ${geo.pays_compte} (pays à haut risque GAFI + UE)`);
      } else {
        score += 3;
        justifications.push(`Compte bancaire en ${geo.pays_compte} (pays à haut risque GAFI)`);
      }
    }
    
    // Risque supplémentaire si compte et résidence différents
    if (geo.pays_compte !== geo.pays_residence && geo.pays_compte !== "France") {
      score += 2;
      justifications.push("Compte bancaire dans un pays différent de la résidence");
    }
    
    if (geo.distance_etablissement > 100) {
      score += 1;
      justifications.push("Client situé hors zone de chalandise habituelle (>100km)");
    }
    
    return { score, justifications };
  }

  /**
   * Évaluation du risque lié aux produits/services
   */
  static evaluerRisqueProduit(client: ClientInfo, transaction: TransactionInfo): RiskScore {
    let score = 0;
    const justifications: string[] = [];
    
    // Risque lié au secteur d'activité
    if (client.code_naf) {
      for (const [niveau, secteurs] of Object.entries(RISK_DATA.SECTEURS_RISQUE)) {
        if (client.code_naf in secteurs) {
          if (niveau === "TRES_ELEVE") {
            score += 4;
            justifications.push(`Secteur à très haut risque: ${secteurs[client.code_naf]}`);
          } else if (niveau === "ELEVE") {
            score += 3;
            justifications.push(`Secteur à haut risque: ${secteurs[client.code_naf]}`);
          } else if (niveau === "MODERE") {
            score += 2;
            justifications.push(`Secteur à risque modéré: ${secteurs[client.code_naf]}`);
          }
          break;
        }
      }
    }
    
    // Risque lié au montant
    if (transaction.montant > 100000) {
      score += 2;
      justifications.push("Montant de transaction élevé (>100K€)");
    } else if (transaction.montant > 50000) {
      score += 1;
      justifications.push("Montant de transaction significatif (>50K€)");
    }
    
    // Risque lié au mode de paiement
    if (transaction.mode_paiement === PaymentMethod.ESPECES) {
      score += 3;
      justifications.push("Paiement en espèces (risque de blanchiment)");
    } else if (transaction.mode_paiement === PaymentMethod.FRACTIONNE) {
      score += 3;
      justifications.push("Paiement fractionné (tentative de contournement)");
    } else if (transaction.mode_paiement === PaymentMethod.CRYPTOMONNAIES) {
      score += 2;
      justifications.push("Transaction en cryptomonnaies (risque réglementaire et volatilité)");
    } else if (transaction.mode_paiement === PaymentMethod.VIREMENT_INTL) {
      score += 2;
      justifications.push("Virement international");
    }
    
    // Complexité du montage juridique
    if (transaction.complexite_montage) {
      score += 3;
      justifications.push("Montage juridique complexe (difficile d'identifier le bénéficiaire effectif)");
    }
    
    return { score, justifications };
  }

  /**
   * Évaluation du risque client
   */
  static evaluerRisqueClient(client: ClientInfo): RiskScore {
    let score = 0;
    const justifications: string[] = [];
    
    if (client.pep) {
      score += 4;
      justifications.push("Personne politiquement exposée (PEP)");
    }
    
    if (client.sanctions) {
      score += 4;
      justifications.push("Personne sous sanctions internationales");
    }
    
    // Nouveaux critères de risque très élevé
    if (client.notoriete_defavorable) {
      score += 5;
      justifications.push("Notoriété défavorable du client en sources ouvertes (médias)");
    }
    
    if (client.reticence_identification) {
      score += 4;
      justifications.push("Réticence ou refus de dévoiler l'identité du représenté");
    }
    
    // Risque lié à l'âge pour les personnes physiques
    if (client.type_client === ClientType.PERSONNE_PHYSIQUE && client.annee_naissance) {
      const age = new Date().getFullYear() - client.annee_naissance;
      if (age < 18) {
        score += 3;
        justifications.push("Client mineur (risque de tutelle/curatelle)");
      } else if (age >= 70) {
        score += 2;
        justifications.push("Client âgé (risque d'abus de faiblesse)");
      }
    }
    
    if (client.type_client === ClientType.PERSONNE_MORALE && client.date_creation) {
      const anciennete = (new Date().getTime() - client.date_creation.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (anciennete < 1) {
        score += 3;
        justifications.push("Société récemment créée (<1 an)");
      } else if (anciennete < 2) {
        score += 2;
        justifications.push("Société nouvellement créée (<2 ans)");
      }
    }
    
    if (client.relation_etablie < 1) {
      score += 1;
      justifications.push("Nouvelle relation commerciale");
    } else if (client.relation_etablie > 5) {
      score -= 1;
      justifications.push("Relation commerciale établie (>5 ans)");
    }
    
    return { score, justifications };
  }

  /**
   * Calcul du risque final et niveau de risque
   */
  static calculerRisqueFinal(scoreGeo: number, scoreProduit: number, scoreClient: number): [RiskLevel, number] {
    const scoreTotal = scoreGeo + scoreProduit + scoreClient;
    
    if (scoreTotal <= 3) {
      return [RiskLevel.FAIBLE, scoreTotal];
    } else if (scoreTotal <= 6) {
      return [RiskLevel.MODERE, scoreTotal];
    } else if (scoreTotal <= 10) {
      return [RiskLevel.ELEVE, scoreTotal];
    } else {
      return [RiskLevel.TRES_ELEVE, scoreTotal];
    }
  }

  /**
   * Génération des recommandations
   */
  static genererRecommandations(niveauRisque: RiskLevel): string[] {
    const recommendations: Record<RiskLevel, string[]> = {
      [RiskLevel.TRES_ELEVE]: [
        "<b>⚠ ATTENTION - Relation d'affaires fortement déconseillée</b> : En raison du niveau de risque extrême, l'établissement de toute relation commerciale doit être évitée sauf circonstances exceptionnelles avec justification métier impérieuse.",
        "Approbation direction générale obligatoire : Toute décision d'acceptation doit faire l'objet d'une validation par la direction générale après présentation d'un dossier complet justifiant l'intérêt commercial exceptionnel.",
        "Vérification d'identité exhaustive avec sources multiples : Mise en œuvre de contrôles renforcés incluant vérification documentaire approfondie, recoupement avec bases de données internationales et validation par sources tierces indépendantes.",
        "Documentation juridique complète et justification métier exceptionnelle : Constitution d'un dossier complet avec analyse des risques, justification économique de la relation et mise en place de mesures d'atténuation spécifiques.",
        "Déclaration de soupçon systématique à considérer : Évaluer la nécessité d'effectuer une déclaration de soupçon à TRACFIN compte tenu des éléments de risque identifiés et de la nature des opérations envisagées.",
        "Surveillance continue renforcée et reporting régulier : Mise en place d'un suivi quotidien des opérations avec reporting mensuel à la direction et revue trimestrielle du profil de risque."
      ],
      [RiskLevel.ELEVE]: [
        "Vérification d'identité renforcée : Mise en œuvre de contrôles complémentaires incluant vérification de l'adresse par courrier recommandé, consultation des bases de données de sanctions et PEP, et validation de l'activité professionnelle.",
        "Justification de l'origine des fonds : Obtenir et analyser les justificatifs détaillés de la provenance des capitaux (bulletins de salaire, déclarations fiscales, actes de vente, etc.) avec validation de leur cohérence.",
        "Supervision des transactions importantes : Mise en place d'un seuil de surveillance abaissé avec validation hiérarchique obligatoire pour toute opération dépassant les montants définis selon le profil client.",
        "Documentation détaillée : Constitution et mise à jour régulière d'un dossier client complet incluant l'ensemble des justificatifs, analyses de risque et décisions prises avec leur motivation."
      ],
      [RiskLevel.MODERE]: [
        "Mesures de vigilance habituelles : Application des procédures standard de connaissance client avec attention particulière aux éléments ayant généré le scoring de risque modéré.",
        "Vérification d'identité standard : Contrôle d'identité selon les procédures habituelles complété par une vérification ponctuelle de l'adresse et de l'activité déclarée.",
        "Surveillance périodique : Mise en place d'une revue semestrielle du profil client et surveillance des opérations inhabituelles par rapport au profil établi."
      ],
      [RiskLevel.FAIBLE]: [
        "Mesures de vigilance simplifiées possibles : Application des mesures de vigilance allégées conformément à la réglementation, tout en maintenant les contrôles de base obligatoires.",
        "Vérification d'identité standard : Contrôle d'identité selon les procédures habituelles avec conservation des justificatifs réglementaires requis.",
        "Surveillance normale : Surveillance des opérations selon les seuils standard et revue annuelle du profil client dans le cadre du processus habituel de mise à jour."
      ]
    };
    
    return recommendations[niveauRisque] || [];
  }

  /**
   * Évaluation complète du risque
   */
  static evaluate(request: RiskAssessmentRequest): RiskAssessmentResult {
    const scoreGeo = this.evaluerRisqueGeographique(request.geographic);
    const scoreProduit = this.evaluerRisqueProduit(request.client, request.transaction);
    const scoreClient = this.evaluerRisqueClient(request.client);
    
    const [niveauRisque, scoreTotal] = this.calculerRisqueFinal(
      scoreGeo.score, 
      scoreProduit.score, 
      scoreClient.score
    );
    
    const recommandations = this.genererRecommandations(niveauRisque);
    
    return {
      score_geo: scoreGeo,
      score_produit: scoreProduit,
      score_client: scoreClient,
      score_total: scoreTotal,
      niveau_risque: niveauRisque,
      recommandations
    };
  }
}