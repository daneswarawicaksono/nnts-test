import { coreClient, API_BASE_URL } from './coreClient';

export interface DoctorWorklistItem {
  encounterId: string;
  childName: string;
  ageMonths: number;
  gender: 'L' | 'P';
  posyanduName: string;
  triageTier: 'TIER_1_MERAH' | 'TIER_2_KUNING' | 'TIER_HIJAU';
  suspectedDeficiency: string[];
  screeningDate: string;
  confidenceScore: number;
  somatometry: {
    weightKg: number;
    heightCm: number;
    muacCm: number;
    zWaz?: number;
    zHaz?: number;
    zWhz?: number;
  };
  neurocognitive: {
    meanReactionTimeMs: number;
    inhibitoryAccuracyPct: number;
    memorySpan: number;
  };
}

export interface ClinicalDecisionPayload {
  doctorId: string;
  interventionChosen: string[];
  clinicalNotes: string;
  followUpWeeks: 4 | 6;
}

export const doctorApi = {
  /**
   * Mengambil antrean rujukan balita di FKTP / Puskesmas
   */
  async getWorklist(fktpCode: string = 'PUSK-TEGALREJO', tier?: string): Promise<DoctorWorklistItem[]> {
    try {
      const endpoint = tier 
        ? `/api/v1/fktp/${encodeURIComponent(fktpCode)}/worklist?tier=${encodeURIComponent(tier)}`
        : `/api/v1/fktp/${encodeURIComponent(fktpCode)}/worklist`;
      
      const data = await coreClient.request<{ items: DoctorWorklistItem[] }>(endpoint);
      return data.items;
    } catch {
      return [];
    }
  },

  /**
   * Mengirim keputusan klinis & intervensi dokter
   */
  async submitDecision(encounterId: string, decision: ClinicalDecisionPayload): Promise<boolean> {
    try {
      await coreClient.request(`/api/v1/fktp/encounters/${encodeURIComponent(encounterId)}/clinical-decision`, {
        method: 'POST',
        body: JSON.stringify(decision),
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Mendapatkan link unduh dokumen SATUSEHAT FHIR R4 Bundle
   */
  getFhirBundleDownloadUrl(encounterId: string): string {
    return `${API_BASE_URL}/api/v1/encounters/${encodeURIComponent(encounterId)}/fhir-bundle`;
  },
};
