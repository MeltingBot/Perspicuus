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
    this.addFooter();
    
    // Téléchargement automatique
    const fileName = `rapport_lcbft_${new Date().toISOString().slice(0, 10)}.pdf`;
    this.pdf.save(fileName);
  }

  private addHeader(): void {
    const pageWidth = this.pdf.internal.pageSize.width;
    
    // En-tête avec logo/titre
    this.pdf.setFillColor(30, 60, 114); // Couleur primaire
    this.pdf.rect(0, 0, pageWidth, 40, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.addCleanText('RAPPORT D\'EVALUATION LCBFT', pageWidth / 2, 15, { align: 'center' });
    
    this.pdf.setFontSize(12);
    this.addCleanText('Perspicuus - Outil d\'evaluation des risques de blanchiment', pageWidth / 2, 25, { align: 'center' });
    
    this.pdf.setFontSize(10);
    this.addCleanText(`Genere le ${new Date().toLocaleDateString('fr-FR')} a ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, 35, { align: 'center' });
    
    this.pdf.setTextColor(0, 0, 0);
  }

  private addSummary(results: RiskAssessmentResult): void {
    let yPos = 55;
    
    // Titre de section
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RÉSUMÉ EXÉCUTIF', 20, yPos);
    yPos += 15;
    
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
    this.pdf.text('DONNÉES D\'ÉVALUATION', 20, yPos);
    yPos += 15;
    
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
    this.pdf.text('ANALYSE DÉTAILLÉE DES RISQUES', 20, yPos);
    yPos += 15;
    
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
    this.pdf.text('RECOMMANDATIONS ET MESURES', 20, yPos);
    yPos += 15;
    
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

  private addFooter(): void {
    const pageCount = this.pdf.internal.pages.length - 1;
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      const pageWidth = this.pdf.internal.pageSize.width;
      const pageHeight = this.pdf.internal.pageSize.height;
      
      // Ligne de séparation
      this.pdf.setDrawColor(200, 200, 200);
      this.pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
      
      // Informations de pied de page
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(100, 100, 100);
      this.pdf.text('Perspicuus LCBFT - Confidentiel', 20, pageHeight - 10);
      this.pdf.text(`Page ${i} sur ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      this.pdf.text('Conforme aux standards GAFI/FATF et réglementation française', pageWidth / 2, pageHeight - 10, { align: 'center' });
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