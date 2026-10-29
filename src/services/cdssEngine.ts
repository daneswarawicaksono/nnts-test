import type { PatientRecord, TierAlert, FamilyStatus } from '../types';

export interface CDSSInput {
  muac: number;
  weight: number;
  height: number;
  waz: number;
  haz: number;
  avgLatency: number;
  goNoGoAccuracy: number;
  memorySpanScore: number;
}

export interface CDSSResult {
  feDeficiencyRisk: number;
  znDeficiencyRisk: number;
  b12DeficiencyRisk: number;
  tierAlert: TierAlert;
  clinicalRationale: string[];
  familyStatus: FamilyStatus;
}

/**
 * Calculates WHO Standard Anthropometry approximations
 */
export function calculateZScores(ageMonths: number, weightKg: number, heightCm: number): { waz: number; haz: number; whz: number } {
  // Approximate standard medians for toddlers (36-60 months)
  const medianWeight = 9 + (ageMonths * 0.18);
  const medianHeight = 70 + (ageMonths * 0.7);

  const waz = Number(((weightKg - medianWeight) / (medianWeight * 0.12)).toFixed(2));
  const haz = Number(((heightCm - medianHeight) / (medianHeight * 0.05)).toFixed(2));
  const whz = Number(((waz + haz) / 2).toFixed(2));

  return { waz, haz, whz };
}

/**
 * Hybrid CDSS Rule Engine
 * Maps neurocognitive latencies + anthropometric bounds into probabilistic micronutrient risks
 */
export function evaluateCDSS(input: CDSSInput): CDSSResult {
  const rationale: string[] = [];
  let feRisk = 15;
  let znRisk = 12;
  let b12Risk = 10;

  const isSlowLatency = input.avgLatency > 480;
  const isPoorInhibition = input.goNoGoAccuracy < 70;
  const isBorderlineMUAC = input.muac >= 11.5 && input.muac <= 12.5;
  const isSevereMUAC = input.muac < 11.5;
  const isLowMemorySpan = input.memorySpanScore <= 2;
  const isSomaticStunted = input.haz < -2.0 || input.waz < -2.0;

  // Rule 3: Complex Deficit (Macro + Micro)
  if (isSlowLatency && isPoorInhibition && isLowMemorySpan && isSomaticStunted) {
    feRisk = 94;
    znRisk = 92;
    b12Risk = 90;
    rationale.push(
      "Defisit Kompleks (Makronutrisi + Multi-Mikronutrisi): Seluruh skor kognitif ≤ −2 SD terkonfirmasi beriringan dengan stunting/wasting somatik (HAZ/WAZ < −2 SD)."
    );
  }
  // Rule 1: High Risk of Iron (Fe) Deficiency (Motor Conduction & Basal Dopamine)
  else if (isSlowLatency && isPoorInhibition) {
    feRisk = 88;
    znRisk = isBorderlineMUAC ? 65 : 30;
    b12Risk = isLowMemorySpan ? 60 : 25;
    rationale.push(
      "Suspek Latent Iron Deficiency: Latensi motorik lambat (>480 ms) & akurasi Go/No-Go <70% mengindikasikan hendaya transmisi dopaminergik basal & kontrol inhibisi prefrontal sebelum anemia klinis muncul."
    );
  }
  // Rule 2: High Risk of Zinc & B12 Deficiency (Hippocampus & Synaptic Plasticity)
  else if (isLowMemorySpan && (isBorderlineMUAC || isSevereMUAC)) {
    znRisk = 86;
    b12Risk = 84;
    feRisk = isSlowLatency ? 70 : 35;
    rationale.push(
      "Ko-Defisiensi Seng (Zn) & Vitamin B12: Hendaya memori kerja hipokampus (Span ≤2) berkorelasi kuat dengan cadangan somatik sub-optimal (LiLA zona kuning 11.5–12.5 cm)."
    );
  }
  // Borderline checks
  else {
    if (input.avgLatency > 440) {
      feRisk = Math.max(feRisk, 55);
      rationale.push("Kecenderungan latensi motorik memanjang dibanding populasi sebaya (440–480 ms).");
    }
    if (input.goNoGoAccuracy < 80) {
      feRisk = Math.max(feRisk, 50);
      rationale.push("Fluktuasi atensi selektif prefrontal (akurasi 70–80%).");
    }
    if (isBorderlineMUAC) {
      znRisk = Math.max(znRisk, 52);
      rationale.push("LiLA di ambang batas kuning (11.5–12.5 cm), memerlukan pemantauan asupan seng.");
    }
  }

  // Rule 4: Normal / Normonutritive
  if (input.avgLatency <= 420 && input.goNoGoAccuracy >= 80 && input.memorySpanScore >= 3 && input.muac > 12.5) {
    feRisk = 12;
    znRisk = 10;
    b12Risk = 8;
    rationale.push(
      "Normonutrisi / Risiko Rendah: Kecepatan transmisi konduksi motorik, inhibisi prefrontal, dan memori kerja dalam rentang normal (±1 SD)."
    );
  }

  // Determine Clinician Tier
  let tierAlert: TierAlert = 'Normal (Hijau)';
  if (feRisk >= 80 || znRisk >= 80 || b12Risk >= 80 || isSevereMUAC) {
    tierAlert = 'Tier-1 Alert (Merah)';
  } else if (feRisk >= 50 || znRisk >= 50 || b12Risk >= 50 || isBorderlineMUAC) {
    tierAlert = 'Tier-2 Alert (Kuning)';
  }

  // Determine Family Status (Plain Language, Non-Judgmental)
  let familyStatus: FamilyStatus = 'Tumbuh Kembang Baik';
  if (tierAlert === 'Tier-1 Alert (Merah)') {
    familyStatus = 'Perlu Kunjungan Lanjutan';
  } else if (tierAlert === 'Tier-2 Alert (Kuning)') {
    familyStatus = 'Perlu Sedikit Perhatian';
  }

  return {
    feDeficiencyRisk: feRisk,
    znDeficiencyRisk: znRisk,
    b12DeficiencyRisk: b12Risk,
    tierAlert,
    clinicalRationale: rationale,
    familyStatus,
  };
}

/**
 * Syncs patient record with updated metrics
 */
export function recalculatePatientCDSS(record: PatientRecord): PatientRecord {
  const cdss = evaluateCDSS({
    muac: record.muac,
    weight: record.weight,
    height: record.height,
    waz: record.waz,
    haz: record.haz,
    avgLatency: record.reactionTime.avgLatency,
    goNoGoAccuracy: record.goNoGo.accuracyRate,
    memorySpanScore: record.memorySpan.spanScore,
  });

  return {
    ...record,
    feDeficiencyRisk: cdss.feDeficiencyRisk,
    znDeficiencyRisk: cdss.znDeficiencyRisk,
    b12DeficiencyRisk: cdss.b12DeficiencyRisk,
    tierAlert: cdss.tierAlert,
    clinicalRationale: cdss.clinicalRationale,
    familyStatus: cdss.familyStatus,
  };
}
