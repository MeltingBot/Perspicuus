/**
 * Service de validation sécurisé pour les imports JSON
 * Prévient les attaques de pollution de prototype et la désérialisation non sécurisée
 */

import { z } from 'zod';
import { RiskAssessmentRequest, RiskLevel, ClientType, PaymentMethod, ClientCategory, PPECategory } from '../types/lcbft';
import { NPOCategory, NPOActivityType, NPOFundingSource } from '../data/npoRiskData';
import { ClientSegment, WealthSource, WealthManagementServiceType, InvestmentVehicleType } from '../data/wealthManagementRiskData';
import { PPEFunctionType } from '../data/ppeRiskData';

// Schémas de validation Zod pour les structures de données
const ClientInfoSchema = z.object({
  type_client: z.nativeEnum(ClientType),
  category: z.nativeEnum(ClientCategory).optional(),
  code_naf: z.string().optional(),
  date_creation: z.date().optional(),
  annee_naissance: z.number().min(1900).max(new Date().getFullYear()).optional(),
  pep: z.boolean(),
  sanctions: z.boolean(),
  relation_etablie: z.number().min(0),
  notoriete_defavorable: z.boolean(),
  reticence_identification: z.boolean()
});

const GeographicInfoSchema = z.object({
  pays_residence: z.string().min(1, "Pays de résidence requis"),
  pays_compte: z.string().min(1, "Pays du compte requis"),
  distance_etablissement: z.number().min(0, "Distance ne peut pas être négative")
});

const TransactionInfoSchema = z.object({
  montant: z.number().min(0, "Montant ne peut pas être négatif"),
  mode_paiement: z.nativeEnum(PaymentMethod),
  complexite_montage: z.boolean(),
  canal_distribution: z.string().optional()
});

// Schémas pour les modules spécialisés (optionnels)
const WealthManagementInfoSchema = z.object({
  client_segment: z.nativeEnum(ClientSegment).optional(),
  assets_under_management: z.number().min(0).optional(),
  wealth_sources: z.array(z.nativeEnum(WealthSource)).optional(),
  investment_vehicles: z.array(z.nativeEnum(InvestmentVehicleType)).optional(),
  service_types: z.array(z.nativeEnum(WealthManagementServiceType)).optional(),
  geographic_exposure: z.array(z.string()).optional(),
  complexity_level: z.nativeEnum(RiskLevel).optional(),
  liquidity_needs: z.string().optional(),
  risk_tolerance: z.nativeEnum(RiskLevel).optional()
}).catchall(z.any()).optional();

const NPOInfoSchema = z.object({
  category: z.nativeEnum(NPOCategory).optional(),
  activity_types: z.array(z.nativeEnum(NPOActivityType)).optional(),
  funding_sources: z.array(z.nativeEnum(NPOFundingSource)).optional(),
  annual_budget: z.number().min(0).optional(),
  geographic_scope: z.array(z.string()).optional(),
  transparency_score: z.number().min(0).max(10).optional(),
  financial_reporting_quality: z.nativeEnum(RiskLevel).optional(),
  registration_number: z.string().optional(),
  legal_status: z.string().optional()
}).catchall(z.any()).optional();

const TravelRuleInfoSchema = z.object({
  transaction_type: z.string().optional(),
  cross_border: z.boolean().optional(),
  originator_complete: z.boolean().optional(),
  beneficiary_complete: z.boolean().optional(),
  threshold_exceeded: z.boolean().optional(),
  jurisdiction_compliance: z.record(z.string(), z.boolean()).optional(),
  missing_information: z.array(z.string()).optional()
}).catchall(z.any()).optional();

const PPEInfoSchema = z.object({
  pep_category: z.nativeEnum(PPECategory).optional(),
  pep_functions: z.array(z.nativeEnum(PPEFunctionType)).optional(),
  family_member: z.boolean().optional(),
  close_associate: z.boolean().optional(),
  risk_rating: z.nativeEnum(RiskLevel).optional(),
  source_of_wealth_verified: z.boolean().optional(),
  enhanced_monitoring: z.boolean().optional()
}).catchall(z.any()).optional();

// Schéma principal pour les évaluations de risque
export const RiskAssessmentRequestSchema = z.object({
  client: ClientInfoSchema,
  geographic: GeographicInfoSchema,
  transaction: TransactionInfoSchema,
  wealthManagementInfo: WealthManagementInfoSchema,
  npoInfo: NPOInfoSchema,
  travelRuleInfo: TravelRuleInfoSchema,
  ppeInfo: PPEInfoSchema
});

// Schéma pour la métadonnée des exports JSON
const ExportMetadataSchema = z.object({
  application: z.string(),
  version: z.string(),
  generated_at: z.string(),
  disclaimer: z.string().optional()
});

// Schéma pour les exports JSON complets
export const JSONExportSchema = z.object({
  metadata: ExportMetadataSchema,
  evaluation_request: RiskAssessmentRequestSchema.nullable().optional(),
  risk_assessment_results: z.object({
    overall: z.object({
      risk_level: z.nativeEnum(RiskLevel),
      risk_level_fr: z.string(),
      total_score: z.number(),
      scoring_system: z.string()
    }),
    geographic_risk: z.object({
      score: z.number(),
      justifications: z.array(z.string())
    }),
    product_service_risk: z.object({
      score: z.number(),
      justifications: z.array(z.string())
    }),
    client_risk: z.object({
      score: z.number(),
      justifications: z.array(z.string())
    }),
    recommendations: z.array(z.string())
  })
});

// Types d'erreurs de validation
export class ValidationError extends Error {
  constructor(
    public message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Service de validation sécurisé
export class SecureValidationService {
  /**
   * Parse et valide du JSON de manière sécurisée
   */
  static safeJsonParse<T>(
    jsonString: string,
    schema: z.ZodSchema<T>
  ): { success: true; data: T } | { success: false; error: ValidationError } {
    try {
      // Première vérification : longueur maximale (protection DoS)
      if (jsonString.length > 10 * 1024 * 1024) { // 10MB max
        return {
          success: false,
          error: new ValidationError('Fichier JSON trop volumineux (>10MB)', 'size', 'FILE_TOO_LARGE')
        };
      }

      // Parse JSON avec protection contre pollution de prototype
      const rawData = JSON.parse(jsonString, (key, value) => {
        // Blocage des clés dangereuses
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          return undefined;
        }
        return value;
      });

      // Validation avec Zod
      const result = schema.safeParse(rawData);
      
      if (!result.success) {
        return {
          success: false,
          error: new ValidationError(
            `Données invalides: ${result.error.message || 'Format invalide'}`,
            'validation',
            'VALIDATION_ERROR'
          )
        };
      }

      return { success: true, data: result.data };

    } catch (parseError) {
      return {
        success: false,
        error: new ValidationError(
          'Format JSON invalide',
          'json',
          'INVALID_JSON'
        )
      };
    }
  }

  /**
   * Valide une évaluation de risque importée
   */
  static validateRiskAssessment(jsonString: string) {
    return this.safeJsonParse(jsonString, RiskAssessmentRequestSchema);
  }

  /**
   * Valide un export JSON complet
   */
  static validateJSONExport(jsonString: string) {
    return this.safeJsonParse(jsonString, JSONExportSchema);
  }

  /**
   * Nettoie et valide une chaîne de texte
   */
  static sanitizeText(text: string): string {
    return text
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprime les scripts
      .replace(/<[^>]*>/g, '') // Supprime toutes les balises HTML
      .replace(/javascript:/gi, '') // Supprime les URLs javascript
      .replace(/on\w+\s*=/gi, '') // Supprime les handlers d'événements
      .trim();
  }

  /**
   * Valide les métadonnées d'un fichier uploadé
   */
  static validateFileMetadata(file: File): { valid: boolean; error?: string } {
    // Vérification du type MIME
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      return { valid: false, error: 'Seuls les fichiers JSON sont autorisés' };
    }

    // Vérification de la taille
    if (file.size > 10 * 1024 * 1024) { // 10MB max
      return { valid: false, error: 'Fichier trop volumineux (maximum 10MB)' };
    }

    // Vérification du nom de fichier (prévention directory traversal)
    if (file.name.includes('../') || file.name.includes('..\\')) {
      return { valid: false, error: 'Nom de fichier invalide' };
    }

    return { valid: true };
  }
}

export default SecureValidationService;