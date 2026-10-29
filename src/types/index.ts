export type Gender = 'L' | 'P';

export type TierAlert = 'Tier-1 Alert (Merah)' | 'Tier-2 Alert (Kuning)' | 'Normal (Hijau)';

export type FamilyStatus = 'Tumbuh Kembang Baik' | 'Perlu Sedikit Perhatian' | 'Perlu Kunjungan Lanjutan';

export interface PatientRecord {
  id: string; // e.g. "ID-FKTP-BLT-042"
  name: string; // e.g. "Anisa"
  ageMonths: number;
  gender: Gender;
  posyandu: string;
  examDate: string;
  
  // Somatometri (WHO Standards)
  muac: number; // Lingkar Lengan Atas (cm)
  weight: number; // BB (kg)
  height: number; // TB (cm)
  waz: number; // Weight-for-Age Z-Score
  haz: number; // Height-for-Age Z-Score
  whz: number; // Weight-for-Height Z-Score

  // Neurocognitive Raw Results
  reactionTime: {
    trials: number[]; // ms per trial
    avgLatency: number; // ms
    variance: number;
    completed: boolean;
  };
  goNoGo: {
    totalRounds: number;
    accuracyRate: number; // %
    commissionErrors: number; // false alarm on spoiled fruit
    omissionErrors: number; // missed fresh fruit
    completed: boolean;
  };
  memorySpan: {
    spanScore: number; // 1 to 5
    sequenceLengthTested: number;
    completed: boolean;
  };

  // Hybrid CDSS Output
  feDeficiencyRisk: number; // 0 - 100%
  znDeficiencyRisk: number; // 0 - 100%
  b12DeficiencyRisk: number; // 0 - 100%
  tierAlert: TierAlert;
  clinicalRationale: string[];
  familyStatus: FamilyStatus;

  // Clinician Human-in-the-Loop Checklist
  checklist: {
    paleConjunctiva: boolean;
    posturalFatigue: boolean;
    lowAnimalProteinDiet: boolean;
    noAcuteInfection: boolean;
  };

  // Precision Prescriptive Intervention
  prescriptions: {
    ironSyrup: boolean; // Sirup Besi Elemental (3 mg/kgBB/hari)
    zincSupplement: boolean; // Tablet/Sirup Suplemen Seng (10–20 mg/hari)
    taburiaMNP: boolean; // Bubuk Multi-Mikronutrien (Taburia / MNP)
    localDietCounseling: boolean; // Konseling Edukasi Modifikasi Pangan Lokal
    customNotes: string;
    isPrescribed: boolean;
    prescribedAt?: string;
  };

  followUpWindowWeeks: string; // "4–6 Minggu"
  historicTrend: {
    week: string;
    latency: number;
    normalBaseline: number;
  }[];
}

export type ActiveAppView = 'child-screening' | 'clinician-dashboard' | 'family-report';
