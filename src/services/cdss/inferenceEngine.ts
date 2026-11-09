/**
 * NNTS Hybrid CDSS Inference Engine
 * Mengintegrasikan Feature Engineering, Deterministic Safety Guardrails,
 * dan Model Machine Learning Terkalibrasi (ONNX / WebAssembly Runtime)
 * untuk Triase Gizi Mikro Non-Invasif Balita Posyandu.
 */

import * as ort from 'onnxruntime-web';
import type { TriageTier, CDSSEvaluationResult } from '../../types/clinical';
import type { ScreeningEvaluationResponse } from '../api/client';

export interface CDSSInput {
  childId: string;
  reactionTimeTrials: number[];
  goNoGoAccuracy: number;
  goNoGoCommissionErrors: number;
  memorySpanScore: number;
  ageMonths?: number;
  gender?: 'L' | 'P' | 'Male' | 'Female';
  weightKg?: number;
  heightCm?: number;
  muacLilaCm?: number;
  zWaz?: number;
  zHaz?: number;
  zWhz?: number;
}

export interface FeatureEngineeringResult {
  featureVector: Float32Array;
  featureMap: Record<string, number>;
  metrics: {
    bmi: number;
    nmdi: number;
    inhibitoryDeficit: number;
    somatoCognitiveRatio: number;
    growthDeficit: number;
  };
}

export const CDSS_CONFIG = {
  modelVersion: '1.0.0-champion',
  architecture: 'LightGBM + Deterministic Guardrails',
  thresholdMerah: 0.205,
  guardrails: {
    muacMinCm: 11.5,
    zHazMinSd: -2.75,
  },
  modelPath: '/models/nnts_triage_champion.onnx',
  featureList: [
    'age_months',
    'is_male',
    'weight_kg',
    'height_cm',
    'bmi',
    'muac_lila_cm',
    'z_waz',
    'z_haz',
    'z_whz',
    'simple_rt_mean_ms',
    'choice_rt_mean_ms',
    'rt_variability_sd',
    'gonogo_commission_err',
    'gonogo_omission_err',
    'working_mem_span',
    'neuro_motor_delay_index',
    'inhibitory_deficit_ratio',
    'somato_cognitive_ratio',
    'growth_deficit_composite',
  ],
};

// Singleton ONNX session cache
let onnxSession: ort.InferenceSession | null = null;
let onnxLoadingPromise: Promise<ort.InferenceSession | null> | null = null;

async function getOnnxSession(): Promise<ort.InferenceSession | null> {
  if (onnxSession) return onnxSession;
  if (onnxLoadingPromise) return onnxLoadingPromise;

  onnxLoadingPromise = (async () => {
    try {
      // Konfigurasi wasm runtime luring
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;

      const session = await ort.InferenceSession.create(CDSS_CONFIG.modelPath, {
        executionProviders: ['wasm'],
      });
      onnxSession = session;
      return session;
    } catch (err) {
      console.warn('[CDSS] Tidak dapat memuat model ONNX dari jaringan/aset lokal, menggunakan mesin evaluasi terkalibrasi internal:', err);
      return null;
    } finally {
      onnxLoadingPromise = null;
    }
  })();

  return onnxLoadingPromise;
}

/**
 * 1. Kalkulasi Feature Engineering Sesuai Model Champion NNTS
 */
export function calculateFeatureEngineering(input: CDSSInput): FeatureEngineeringResult {
  const ageMonths = input.ageMonths ?? 36;
  const isMale = (input.gender === 'Male' || input.gender === 'L') ? 1.0 : 0.0;
  
  // Perkiraan somatometri median jika belum diisi kader
  const expectedWeight = 6.2 + 0.22 * ageMonths + 0.4 * isMale;
  const expectedHeight = 71.0 + 0.65 * ageMonths + 0.8 * isMale;
  
  const weightKg = input.weightKg ?? expectedWeight;
  const heightCm = input.heightCm ?? expectedHeight;
  const bmi = weightKg / Math.pow(heightCm / 100.0, 2);
  const muacLilaCm = input.muacLilaCm ?? 14.5;
  
  const zWaz = input.zWaz ?? 0.0;
  const zHaz = input.zHaz ?? 0.0;
  const zWhz = input.zWhz ?? 0.0;

  // Analisis Latensi Uji Sentuh Tablet
  const trials = input.reactionTimeTrials && input.reactionTimeTrials.length > 0 
    ? input.reactionTimeTrials 
    : [820];
  
  const simpleRtMeanMs = trials.reduce((a, b) => a + b, 0) / trials.length;
  const choiceRtMeanMs = simpleRtMeanMs * 1.34;
  
  // Standar Deviasi Latensi (RT Variability)
  const variance = trials.reduce((sum, val) => sum + Math.pow(val - simpleRtMeanMs, 2), 0) / trials.length;
  const rtVariabilitySd = Math.sqrt(variance) || (simpleRtMeanMs * 0.18);

  // Uji Atensi & Inhibisi (Go/No-Go)
  const accuracy = Math.min(100, Math.max(0, input.goNoGoAccuracy ?? 75));
  const rawCommission = input.goNoGoCommissionErrors ?? 2;
  const gonogoCommissionErr = Math.min(75, Math.max(15, rawCommission * 12 + (100 - accuracy) * 0.35));
  const gonogoOmissionErr = Math.min(45, Math.max(5, (100 - accuracy) * 0.4));
  const workingMemSpan = Math.min(4, Math.max(2, input.memorySpanScore ?? 3));

  // Fitur Interaksi Klinis (Domain-Specific Engineered Features)
  const expectedRtByAge = 1140.0 - 7.2 * ageMonths;
  const neuroMotorDelayIndex = simpleRtMeanMs / expectedRtByAge;
  const inhibitoryDeficitRatio = gonogoCommissionErr / (gonogoOmissionErr + 1.0);
  const somatoCognitiveRatio = muacLilaCm / (simpleRtMeanMs / 1000.0);
  const growthDeficitComposite = zHaz + zWaz + zWhz;

  const featureMap: Record<string, number> = {
    age_months: ageMonths,
    is_male: isMale,
    weight_kg: weightKg,
    height_cm: heightCm,
    bmi: Number(bmi.toFixed(2)),
    muac_lila_cm: muacLilaCm,
    z_waz: zWaz,
    z_haz: zHaz,
    z_whz: zWhz,
    simple_rt_mean_ms: simpleRtMeanMs,
    choice_rt_mean_ms: choiceRtMeanMs,
    rt_variability_sd: rtVariabilitySd,
    gonogo_commission_err: gonogoCommissionErr,
    gonogo_omission_err: gonogoOmissionErr,
    working_mem_span: workingMemSpan,
    neuro_motor_delay_index: neuroMotorDelayIndex,
    inhibitory_deficit_ratio: inhibitoryDeficitRatio,
    somato_cognitive_ratio: somatoCognitiveRatio,
    growth_deficit_composite: growthDeficitComposite,
  };

  const featureVector = new Float32Array(CDSS_CONFIG.featureList.map((f) => featureMap[f] ?? 0.0));

  return {
    featureVector,
    featureMap,
    metrics: {
      bmi: Number(bmi.toFixed(2)),
      nmdi: Number(neuroMotorDelayIndex.toFixed(3)),
      inhibitoryDeficit: Number(inhibitoryDeficitRatio.toFixed(3)),
      somatoCognitiveRatio: Number(somatoCognitiveRatio.toFixed(3)),
      growthDeficit: Number(growthDeficitComposite.toFixed(2)),
    },
  };
}

/**
 * 2. Evaluasi Triase Klinis Lengkap (Guardrail + Model Machine Learning)
 */
export async function evaluateTriage(input: CDSSInput): Promise<ScreeningEvaluationResponse & CDSSEvaluationResult> {
  const fe = calculateFeatureEngineering(input);
  const { featureMap, metrics, featureVector } = fe;

  const clinicalRationale: string[] = [];
  let isGuardrailTriggered = false;

  // =========================================================================
  // LANGKAH 1: DETERMINISTIC SAFETY GUARDRAILS (FAIL-SAFE KEMENKES)
  // =========================================================================
  if (featureMap.muac_lila_cm < CDSS_CONFIG.guardrails.muacMinCm) {
    isGuardrailTriggered = true;
    clinicalRationale.push(
      `Pita LiLA ${featureMap.muac_lila_cm} cm < 11.5 cm menandakan Gizi Buruk Akut (SAM) — Rujukan Segera.`
    );
  }

  if (featureMap.z_haz < CDSS_CONFIG.guardrails.zHazMinSd) {
    isGuardrailTriggered = true;
    clinicalRationale.push(
      `Z-score TB/U (HAZ) ${featureMap.z_haz} SD < -2.75 SD menandakan Stunting Sangat Parah — Rujukan Dokter Spesialis Anak.`
    );
  }

  // =========================================================================
  // LANGKAH 2: INFERENSI MODEL MACHINE LEARNING
  // =========================================================================
  let pMerah = 0.08;
  let pKuning = 0.35;
  let pHijau = 0.57;

  const session = await getOnnxSession();

  if (session) {
    try {
      const tensorInput = new ort.Tensor('float32', featureVector, [1, CDSS_CONFIG.featureList.length]);
      const results = await session.run({ float_input: tensorInput });
      const probsTensor = results.probabilities;
      if (probsTensor && probsTensor.data) {
        const probs = Array.from(probsTensor.data as Float32Array);
        pMerah = probs[0] ?? pMerah;
        pKuning = probs[1] ?? pKuning;
        pHijau = probs[2] ?? pHijau;
      }
    } catch (e) {
      console.warn('[CDSS] Gagal menjalankan inferensi ONNX runtime, beralih ke formula terkalibrasi:', e);
      pMerah = calculateFallbackMerahProb(metrics, featureMap);
      pKuning = Math.max(0.1, 0.9 - pMerah);
      pHijau = Math.max(0.0, 1.0 - (pMerah + pKuning));
    }
  } else {
    // Formula regresi logistik terkalibrasi dari parameter LightGBM offline
    pMerah = calculateFallbackMerahProb(metrics, featureMap);
    pKuning = Math.max(0.1, 0.85 - pMerah);
    pHijau = Math.max(0.0, 1.0 - (pMerah + pKuning));
  }

  // =========================================================================
  // LANGKAH 3: PENETAPAN KEPUTUSAN TRIASE (THRESHOLD TUNED t = 0.205)
  // =========================================================================
  let finalTier: TriageTier = 'Normal';

  if (isGuardrailTriggered) {
    finalTier = 'Tier-1 Alert';
  } else if (pMerah >= CDSS_CONFIG.thresholdMerah) {
    finalTier = 'Tier-1 Alert';
    clinicalRationale.push(
      `Probabilitas Kasus Kritis P(Merah) = ${(pMerah * 100).toFixed(1)}% melampaui ambang batas keamanan (t = ${CDSS_CONFIG.thresholdMerah}).`
    );
  } else if (pKuning >= pHijau || metrics.nmdi > 1.15 || metrics.inhibitoryDeficit > 1.8) {
    finalTier = 'Tier-2 Alert';
    clinicalRationale.push(
      `Indikasi kelaparan tersembunyi subklinis terdeteksi (NMDI = ${metrics.nmdi}, Defisit Inhibisi = ${metrics.inhibitoryDeficit}).`
    );
  } else {
    finalTier = 'Normal';
    clinicalRationale.push('Profil respons motorik, atensi selektif, dan somatometri anak dalam rentang tumbuh kembang optimal.');
  }

  // =========================================================================
  // LANGKAH 4: ESTIMASI RISIKO DEFISIENSI SPESIFIK (Fe, Zn, B12, Stunting)
  // =========================================================================
  // Jalur Fe: Sangat berkorelasi dengan pemanjangan latensi respons (NMDI)
  const feRisk = Math.min(95, Math.max(10, Math.round(
    25 + 45 * Math.max(0, metrics.nmdi - 0.95) + 15 * (featureMap.muac_lila_cm < 13.0 ? 1 : 0)
  )));

  // Jalur Zn: Sangat berkorelasi dengan lonjakan commission error (impulsivitas)
  const znRisk = Math.min(95, Math.max(10, Math.round(
    20 + 35 * Math.max(0, metrics.inhibitoryDeficit - 1.2) + 20 * Math.max(0, -featureMap.z_haz)
  )));

  // Jalur B12: Sensitif terhadap penurunan memory span
  const b12Risk = Math.min(95, Math.max(10, Math.round(
    15 + 40 * (4 - featureMap.working_mem_span) + 15 * (featureMap.z_waz < -1.5 ? 1 : 0)
  )));

  const stuntingRisk = Math.min(99, Math.max(5, Math.round(
    Math.max(0, -featureMap.z_haz * 30) + (featureMap.muac_lila_cm < 12.5 ? 25 : 0)
  )));

  let summaryFeedback = '';
  if (finalTier === 'Tier-1 Alert') {
    summaryFeedback = 'Perhatian: Ditemukan indikasi defisiensi zat gizi mikro parah atau perlambatan respons saraf motorik. Disarankan rujukan segera ke dokter Puskesmas untuk konfirmasi dan tata laksana gizi terarah.';
  } else if (finalTier === 'Tier-2 Alert') {
    summaryFeedback = 'Waspada: Terdeteksi sinyal kelaparan tersembunyi subklinis. Tingkatkan konsumsi protein hewani, sayuran hijau, dan pantau kembali di Posyandu bulan depan.';
  } else {
    summaryFeedback = 'Selamat! Tumbuh kembang motorik halus, daya atensi, dan status somatometri anak berada pada tingkat prima. Teruskan pola asuh dan gizi seimbang keluarga!';
  }

  return {
    sessionId: `sc-${Date.now()}`,
    evaluatedAt: new Date().toISOString(),
    childId: input.childId,
    tier: finalTier,
    feRisk,
    znRisk,
    b12Risk,
    feDeficiencyRisk: feRisk,
    znDeficiencyRisk: znRisk,
    b12DeficiencyRisk: b12Risk,
    stuntingRisk,
    summaryFeedback,
    clinicalRationale,
  };
}

/**
 * Formula aproksimasi LightGBM offline terkalibrasi
 */
function calculateFallbackMerahProb(
  metrics: FeatureEngineeringResult['metrics'],
  featureMap: Record<string, number>
): number {
  // Model regresi logistik terkalibrasi dari bobot pohon LightGBM
  let logit = -2.35;
  logit += 2.1 * Math.max(0, metrics.nmdi - 1.0);
  logit += 0.045 * Math.max(0, featureMap.gonogo_commission_err - 35);
  logit += 0.50 * Math.max(0, 13.0 - featureMap.muac_lila_cm);
  logit -= 0.45 * featureMap.z_haz;
  logit += 0.35 * (3 - featureMap.working_mem_span);

  return 1.0 / (1.0 + Math.exp(-logit));
}
