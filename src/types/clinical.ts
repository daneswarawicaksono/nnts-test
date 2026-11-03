export type TriageTier = 'Tier-1 Alert' | 'Tier-2 Alert' | 'Normal';

export interface CDSSEvaluationResult {
  childId: string;
  evaluatedAt: string;
  tier: TriageTier;
  feDeficiencyRisk: number; // 0-100%
  znDeficiencyRisk: number; // 0-100%
  b12DeficiencyRisk: number; // 0-100%
  stuntingRisk: number; // 0-100%
  clinicalRationale: string[];
}

// [ASUMSI] Catatan Intervensi (menggantikan Tulis Resep sampai konfirmasi pengguna)
export interface InterventionNote {
  id: string;
  childId: string;
  doctorId?: string;
  cadreId?: string;
  createdAt: string;
  dietaryCounselingNotes: string;
  micronutrientSupplementationNotes: string;
  followUpDate: string;
}
