/**
 * Service de génération de rapports PDF pour les évaluations LCBFT
 */

import jsPDF from 'jspdf';
import { RiskAssessmentResult, RiskLevel, RiskAssessmentRequest } from '../types/lcbft';

export class PDFGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
    // Configuration de base avec support UTF-8
    this.pdf.setFont('helvetica');
  }

  /**
   * Nettoie le texte pour éviter les problèmes d'encodage PDF
   */
  private cleanText(text: string): string {
    return text
      .replace(/'/g, "'")  // Apostrophes courbes
      .replace(/"/g, '"')  // Guillemets courbes ouvrants
      .replace(/"/g, '"')  // Guillemets courbes fermants
      .replace(/–/g, '-')  // Tirets longs
      .replace(/—/g, '-')  // Tirets cadratin
      .replace(/…/g, '...')  // Points de suspension
      .replace(/°/g, 'deg')  // Degré
      .replace(/²/g, '2')    // Exposant 2
      .replace(/³/g, '3')    // Exposant 3
      .replace(/€/g, 'EUR')  // Euro
      // Supprimer les emojis problématiques pour PDF
      .replace(/🌍|🗺️|🌎|🌏/g, '[GEO]')  // Emojis géographiques
      .replace(/💼|🏢|🏪|🏭/g, '[BIZ]')  // Emojis business
      .replace(/👤|👥|🧑|👨|👩/g, '[USER]')  // Emojis personne
      .replace(/🚨|⚠️|ℹ️|✅|❌|⭐/g, '')  // Emojis d'alerte/état
      .replace(/👨‍👩‍👧‍👦/g, '[FAMILLE]')  // Emoji famille
      .replace(/🤝/g, '[PARTENARIAT]')  // Emoji partenariat
      // Normalisation finale des caractères français
      .normalize('NFC');
  }

  /**
   * Ajoute du texte avec nettoyage automatique
   */
  private addCleanText(text: string, x: number, y: number, options?: any): void {
    this.pdf.text(this.cleanText(text), x, y, options);
  }

  /**
   * Génère un rapport PDF complet de l'évaluation LCBFT
   */
  generateAssessmentReport(
    results: RiskAssessmentResult, 
    formData: RiskAssessmentRequest
  ): void {
    this.pdf = new jsPDF();
    this.addHeader();
    this.addSummary(results);
    this.addFormData(formData);
    this.addDetailedAnalysis(results);
    this.addRecommendations(results);
    this.addLegalDisclaimer();
    this.addFooter();
    
    // Téléchargement automatique
    const fileName = `rapport_lcbft_${new Date().toISOString().slice(0, 10)}.pdf`;
    this.pdf.save(fileName);
  }

  private addHeader(): void {
    const pageWidth = this.pdf.internal.pageSize.width;
    
    // En-tête avec dégradé visuel amélioré
    this.pdf.setFillColor(30, 60, 114); // Couleur primaire
    this.pdf.rect(0, 0, pageWidth, 45, 'F');
    
    // Bande décorative
    this.pdf.setFillColor(63, 81, 181);
    this.pdf.rect(0, 35, pageWidth, 10, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(22);
    this.pdf.setFont('helvetica', 'bold');
    this.addCleanText('RAPPORT D\'ÉVALUATION LCBFT', pageWidth / 2, 16, { align: 'center' });
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.addCleanText('Perspicuus - Aide à l\'évaluation des risques de blanchiment de capitaux', pageWidth / 2, 26, { align: 'center' });
    
    this.pdf.setFontSize(9);
    const now = new Date();
    this.addCleanText(`Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}`, pageWidth / 2, 38, { align: 'center' });
    
    this.pdf.setTextColor(0, 0, 0);
  }

  private addSummary(results: RiskAssessmentResult): void {
    let yPos = 60;
    
    // Titre de section
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(30, 60, 114);
    this.pdf.text('RÉSUMÉ EXÉCUTIF', 20, yPos);
    this.pdf.setTextColor(0, 0, 0);
    
    // Ligne décorative sous le titre (après le texte)
    this.pdf.setDrawColor(30, 60, 114);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(20, yPos + 3, 80, yPos + 3);
    
    yPos += 18;
    
    // Score et niveau de risque
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    const riskColor = this.getRiskColor(results.niveau_risque);
    this.pdf.setFillColor(riskColor.r, riskColor.g, riskColor.b);
    this.pdf.rect(20, yPos - 5, 170, 25, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.addCleanText(`NIVEAU DE RISQUE: ${results.niveau_risque}`, 25, yPos + 5);
    this.addCleanText(`SCORE TOTAL: ${results.score_total} points`, 25, yPos + 15);
    
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    yPos += 35;
    
    // Répartition des scores
    this.pdf.setFontSize(12);
    this.addCleanText('Répartition détaillée des scores:', 20, yPos);
    yPos += 10;
    
    this.addCleanText(`• Risque géographique: ${results.score_geo.score} points`, 25, yPos);
    yPos += 8;
    this.addCleanText(`• Risque produit/service: ${results.score_produit.score} points`, 25, yPos);
    yPos += 8;
    this.addCleanText(`• Risque client: ${results.score_client.score} points`, 25, yPos);
    yPos += 15;
  }

  private addFormData(formData: RiskAssessmentRequest): void {
    let yPos = 165;
    
    // Nouvelle page si nécessaire
    if (yPos > 250) {
      this.pdf.addPage();
      yPos = 20;
    }
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(30, 60, 114);
    this.pdf.text('DONNÉES D\'ÉVALUATION', 20, yPos);
    
    // Ligne décorative sous le titre
    this.pdf.setDrawColor(30, 60, 114);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(20, yPos + 3, 90, yPos + 3);
    
    this.pdf.setTextColor(0, 0, 0);
    yPos += 18;
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    
    // Informations client
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Informations Client:', 20, yPos);
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`• Type: ${formData.client.type_client}`, 25, yPos);
    yPos += 8;
    
    if (formData.client.code_naf) {
      this.pdf.text(`• Code NAF/APE: ${formData.client.code_naf}`, 25, yPos);
      yPos += 8;
    }
    
    if (formData.client.date_creation) {
      this.pdf.text(`• Date de création: ${formData.client.date_creation.toLocaleDateString('fr-FR')}`, 25, yPos);
      yPos += 8;
    }
    
    if (formData.client.annee_naissance) {
      this.pdf.text(`• Année de naissance: ${formData.client.annee_naissance}`, 25, yPos);
      yPos += 8;
    }
    
    this.pdf.text(`• Relation établie: ${formData.client.relation_etablie} ans`, 25, yPos);
    yPos += 8;
    
    // Drapeaux de risque client
    if (formData.client.pep || formData.client.sanctions || formData.client.notoriete_defavorable || formData.client.reticence_identification) {
      this.pdf.text('• Indicateurs de risque:', 25, yPos);
      yPos += 6;
      if (formData.client.pep) { this.pdf.text('  - PEP (Personne Politiquement Exposée)', 30, yPos); yPos += 6; }
      if (formData.client.sanctions) { this.pdf.text('  - Sous sanctions internationales', 30, yPos); yPos += 6; }
      if (formData.client.notoriete_defavorable) { this.pdf.text('  - Notoriété défavorable', 30, yPos); yPos += 6; }
      if (formData.client.reticence_identification) { this.pdf.text('  - Réticence à l\'identification', 30, yPos); yPos += 6; }
      yPos += 2;
    }
    
    // Informations géographiques
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Informations Géographiques:', 20, yPos);
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`• Pays de résidence: ${formData.geographic.pays_residence}`, 25, yPos);
    yPos += 8;
    this.pdf.text(`• Pays du compte: ${formData.geographic.pays_compte}`, 25, yPos);
    yPos += 8;
    this.pdf.text(`• Distance établissement: ${formData.geographic.distance_etablissement} km`, 25, yPos);
    yPos += 15;
    
    // Informations transaction
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Transaction:', 20, yPos);
    yPos += 8;
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`• Montant: ${formData.transaction.montant.toLocaleString('fr-FR')} €`, 25, yPos);
    yPos += 8;
    this.pdf.text(`• Mode de paiement: ${formData.transaction.mode_paiement}`, 25, yPos);
    yPos += 8;
    if (formData.transaction.complexite_montage) {
      this.pdf.text('• Montage juridique complexe', 25, yPos);
      yPos += 8;
    }
    if (formData.transaction.canal_distribution) {
      this.pdf.text(`• Canal: ${formData.transaction.canal_distribution}`, 25, yPos);
      yPos += 8;
    }
  }

  private addDetailedAnalysis(results: RiskAssessmentResult): void {
    this.pdf.addPage();
    let yPos = 20;
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(30, 60, 114);
    this.pdf.text('ANALYSE DÉTAILLÉE DES RISQUES', 20, yPos);
    
    // Ligne décorative sous le titre
    this.pdf.setDrawColor(30, 60, 114);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(20, yPos + 3, 120, yPos + 3);
    
    this.pdf.setTextColor(0, 0, 0);
    yPos += 18;
    
    // Risques géographiques
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.addCleanText(`1. Risques Géographiques (${results.score_geo.score} points)`, 20, yPos);
    yPos += 10;
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    if (results.score_geo.justifications.length > 0) {
      results.score_geo.justifications.forEach(justif => {
        const lines = this.pdf.splitTextToSize(`• ${justif}`, 170);
        this.pdf.text(lines, 25, yPos);
        yPos += lines.length * 6;
      });
    } else {
      this.pdf.text('• Aucun risque géographique identifié', 25, yPos);
      yPos += 8;
    }
    yPos += 10;
    
    // Risques produit/service
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.addCleanText(`2. Risques Produit/Service (${results.score_produit.score} points)`, 20, yPos);
    yPos += 10;
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    if (results.score_produit.justifications.length > 0) {
      results.score_produit.justifications.forEach(justif => {
        const lines = this.pdf.splitTextToSize(`• ${justif}`, 170);
        this.pdf.text(lines, 25, yPos);
        yPos += lines.length * 6;
      });
    } else {
      this.pdf.text('• Aucun risque opérationnel majeur', 25, yPos);
      yPos += 8;
    }
    yPos += 10;
    
    // Risques client
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.addCleanText(`3. Risques Client (${results.score_client.score} points)`, 20, yPos);
    yPos += 10;
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    if (results.score_client.justifications.length > 0) {
      results.score_client.justifications.forEach(justif => {
        const lines = this.pdf.splitTextToSize(`• ${justif}`, 170);
        this.pdf.text(lines, 25, yPos);
        yPos += lines.length * 6;
      });
    } else {
      this.pdf.text('• Profil client standard', 25, yPos);
      yPos += 8;
    }
  }

  private addRecommendations(results: RiskAssessmentResult): void {
    this.pdf.addPage();
    let yPos = 20;
    
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(30, 60, 114);
    this.pdf.text('RECOMMANDATIONS ET MESURES', 20, yPos);
    
    // Ligne décorative sous le titre
    this.pdf.setDrawColor(30, 60, 114);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(20, yPos + 3, 110, yPos + 3);
    
    this.pdf.setTextColor(0, 0, 0);
    yPos += 18;
    
    // Encadré coloré selon le niveau de risque
    const riskColor = this.getRiskColor(results.niveau_risque);
    this.pdf.setFillColor(riskColor.r, riskColor.g, riskColor.b);
    this.pdf.rect(20, yPos - 5, 170, 15, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    const riskMessage = this.getRiskMessage(results.niveau_risque);
    this.addCleanText(riskMessage, 25, yPos + 5);
    
    this.pdf.setTextColor(0, 0, 0);
    yPos += 25;
    
    // Recommandations détaillées
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    results.recommandations.forEach((rec, index) => {
      // Nettoyer le HTML
      const cleanRec = rec.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
      const lines = this.pdf.splitTextToSize(`${index + 1}. ${cleanRec}`, 170);
      
      // Vérifier si on a besoin d'une nouvelle page
      if (yPos + lines.length * 6 > 280) {
        this.pdf.addPage();
        yPos = 20;
      }
      
      this.pdf.text(lines, 25, yPos);
      yPos += lines.length * 6 + 5;
    });
  }

  private addLegalDisclaimer(): void {
    this.pdf.addPage();
    let yPos = 20;
    const pageWidth = this.pdf.internal.pageSize.width;
    
    // Titre de la section
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(30, 60, 114);
    this.pdf.text('MENTIONS LÉGALES ET LIMITATIONS', 20, yPos);
    
    // Ligne décorative sous le titre
    this.pdf.setDrawColor(30, 60, 114);
    this.pdf.setLineWidth(1.5);
    this.pdf.line(20, yPos + 3, 125, yPos + 3);
    
    this.pdf.setTextColor(0, 0, 0);
    yPos += 22;
    
    // Encadré d'avertissement
    this.pdf.setFillColor(255, 243, 224); // Couleur orange claire
    this.pdf.setDrawColor(255, 193, 7); // Bordure orange
    this.pdf.rect(15, yPos - 10, pageWidth - 30, 60, 'FD');
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(230, 81, 0); // Orange foncé
    this.pdf.text('AVERTISSEMENT IMPORTANT', 20, yPos);
    yPos += 15;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(10);
    
    const disclaimerText = [
      "Cette analyse de risque LCBFT constitue un outil d'aide à la décision et ne",
      "saurait se substituer au jugement professionnel de l'établissement financier.",
      "Les résultats présentés ne constituent pas un engagement de conformité",
      "réglementaire ni une garantie d'absence de risque de blanchiment."
    ];
    
    disclaimerText.forEach(line => {
      this.pdf.text(line, 20, yPos);
      yPos += 6;
    });
    
    yPos += 15;
    
    // Section des limites d'utilisation
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('LIMITES D\'UTILISATION :', 20, yPos);
    yPos += 10;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    
    const limitations = [
      "• L'évaluation est basée exclusivement sur les données fournies lors de l'analyse",
      "• Les informations doivent être régulièrement mises à jour selon l'évolution du profil client",
      "• Cette analyse ne dispense pas des obligations de vigilance et de déclaration TRACFIN",
      "• L'établissement reste responsable de ses décisions d'acceptation ou de refus de clientèle",
      "• Les seuils et critères appliqués peuvent nécessiter des ajustements selon le contexte"
    ];
    
    limitations.forEach(limitation => {
      const lines = this.pdf.splitTextToSize(limitation, 170);
      this.pdf.text(lines, 20, yPos);
      yPos += lines.length * 6 + 2;
    });
    
    yPos += 10;
    
    // Section responsabilité professionnelle
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RESPONSABILITÉ PROFESSIONNELLE :', 20, yPos);
    yPos += 10;
    
    this.pdf.setFont('helvetica', 'normal');
    const responsabilityText = [
      "L'utilisateur demeure seul responsable de l'interprétation des résultats et des",
      "décisions prises en conséquence. En cas de doute sur l'évaluation d'un dossier,",
      "il convient de solliciter l'avis du responsable conformité ou du correspondant",
      "TRACFIN de l'établissement."
    ];
    
    responsabilityText.forEach(line => {
      this.pdf.text(line, 20, yPos);
      yPos += 6;
    });
    
    yPos += 15;
    
    // Conformité réglementaire
    this.pdf.setFillColor(240, 248, 255); // Bleu très clair
    this.pdf.setDrawColor(33, 150, 243); // Bordure bleue
    this.pdf.rect(15, yPos - 5, pageWidth - 30, 25, 'FD');
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.pdf.text('RÉFÉRENCES RÉGLEMENTAIRES', 20, yPos + 5);
    yPos += 12;
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Basé sur les recommandations FATF/GAFI, directives européennes et Code monétaire', 20, yPos);
    yPos += 6;
    this.pdf.text('et financier français - Articles L561-1 et suivants', 20, yPos);
  }

  private addFooter(): void {
    const pageCount = this.pdf.internal.pages.length - 1;
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      const pageWidth = this.pdf.internal.pageSize.width;
      const pageHeight = this.pdf.internal.pageSize.height;
      
      // Ligne de séparation plus fine
      this.pdf.setDrawColor(220, 220, 220);
      this.pdf.setLineWidth(0.5);
      this.pdf.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25);
      
      // Informations de pied de page avec meilleure mise en page
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(120, 120, 120);
      this.pdf.text('Perspicuus LCBFT - Document confidentiel', 20, pageHeight - 15);
      this.pdf.text(`Page ${i}/${pageCount}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
      this.pdf.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Version 1.0`, pageWidth / 2, pageHeight - 15, { align: 'center' });
      
      // Mention légale en bas de page
      this.pdf.setFontSize(7);
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text('Outil d\'aide à la décision - Ne constitue pas une validation de conformité réglementaire', pageWidth / 2, pageHeight - 8, { align: 'center' });
    }
  }

  private getRiskColor(level: RiskLevel): { r: number, g: number, b: number } {
    switch (level) {
      case RiskLevel.FAIBLE: return { r: 76, g: 175, b: 80 };
      case RiskLevel.MODERE: return { r: 255, g: 152, b: 0 };
      case RiskLevel.ELEVE: return { r: 244, g: 67, b: 54 };
      case RiskLevel.TRES_ELEVE: return { r: 211, g: 47, b: 47 };
      default: return { r: 117, g: 117, b: 117 };
    }
  }

  private getRiskMessage(level: RiskLevel): string {
    switch (level) {
      case RiskLevel.TRES_ELEVE: return 'RISQUE TRÈS ÉLEVÉ - Vigilance renforcée obligatoire';
      case RiskLevel.ELEVE: return 'RISQUE ÉLEVÉ - Mesures de vigilance renforcées';
      case RiskLevel.MODERE: return 'RISQUE MODÉRÉ - Vigilance standard';
      case RiskLevel.FAIBLE: return 'RISQUE FAIBLE - Vigilance allégée possible';
      default: return 'NIVEAU DE RISQUE INDÉTERMINÉ';
    }
  }
}