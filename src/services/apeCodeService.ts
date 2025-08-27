export interface ApeCode {
  code: string;
  libelle: string;
  libelle_court: string;
  libelle_tres_court: string;
}

class ApeCodeService {
  private apeCodes: Map<string, ApeCode> = new Map();
  private allCodes: ApeCode[] = [];
  private isLoaded = false;

  async loadApeCodes(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/codes_naf.json');
      const data = await response.json();
      
      this.apeCodes.clear();
      this.allCodes = [];

      Object.entries(data).forEach(([code, details]: [string, any]) => {
        const apeCode: ApeCode = {
          code,
          libelle: details.libelle,
          libelle_court: details.libelle_court,
          libelle_tres_court: details.libelle_tres_court
        };
        
        this.apeCodes.set(code, apeCode);
        this.allCodes.push(apeCode);
      });

      this.isLoaded = true;
      console.log(`Chargement de ${this.allCodes.length} codes APE terminé`);
    } catch (error) {
      console.error('Erreur lors du chargement des codes APE:', error);
      throw error;
    }
  }

  async searchCodes(query: string, limit: number = 50): Promise<ApeCode[]> {
    await this.loadApeCodes();
    
    if (!query || query.trim().length < 2) {
      return this.allCodes.slice(0, limit);
    }

    const searchTerm = query.trim().toLowerCase();
    const results: ApeCode[] = [];

    // Recherche exacte par code en priorité
    const exactCodeMatch = this.apeCodes.get(query.toUpperCase());
    if (exactCodeMatch) {
      results.push(exactCodeMatch);
    }

    // Recherche par début de code
    for (const apeCode of this.allCodes) {
      if (results.length >= limit) break;
      if (apeCode.code.toLowerCase().startsWith(searchTerm) && !results.includes(apeCode)) {
        results.push(apeCode);
      }
    }

    // Recherche dans les libellés
    for (const apeCode of this.allCodes) {
      if (results.length >= limit) break;
      
      const matchesLibelle = 
        apeCode.libelle.toLowerCase().includes(searchTerm) ||
        apeCode.libelle_court.toLowerCase().includes(searchTerm) ||
        apeCode.libelle_tres_court.toLowerCase().includes(searchTerm);

      if (matchesLibelle && !results.includes(apeCode)) {
        results.push(apeCode);
      }
    }

    // Recherche floue par mots-clés
    if (results.length < limit) {
      const keywords = searchTerm.split(' ').filter(word => word.length > 2);
      
      for (const apeCode of this.allCodes) {
        if (results.length >= limit) break;
        
        const allText = `${apeCode.libelle} ${apeCode.libelle_court} ${apeCode.libelle_tres_court}`.toLowerCase();
        const matchedKeywords = keywords.filter(keyword => allText.includes(keyword));
        
        if (matchedKeywords.length > 0 && !results.includes(apeCode)) {
          results.push(apeCode);
        }
      }
    }

    return results.slice(0, limit);
  }

  async getCodeByCode(code: string): Promise<ApeCode | undefined> {
    await this.loadApeCodes();
    return this.apeCodes.get(code.toUpperCase());
  }

  async getAllCodes(limit?: number): Promise<ApeCode[]> {
    await this.loadApeCodes();
    return limit ? this.allCodes.slice(0, limit) : this.allCodes;
  }

  async getCodesCount(): Promise<number> {
    await this.loadApeCodes();
    return this.allCodes.length;
  }

  // Recherche par secteur d'activité
  async getCodesBySector(sectorKeywords: string[]): Promise<ApeCode[]> {
    await this.loadApeCodes();
    
    const results: ApeCode[] = [];
    const lowerKeywords = sectorKeywords.map(k => k.toLowerCase());

    for (const apeCode of this.allCodes) {
      const allText = `${apeCode.libelle} ${apeCode.libelle_court}`.toLowerCase();
      
      if (lowerKeywords.some(keyword => allText.includes(keyword))) {
        results.push(apeCode);
      }
    }

    return results;
  }
}

export const apeCodeService = new ApeCodeService();