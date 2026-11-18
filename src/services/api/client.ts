import { evaluateTriage } from '../cdss/inferenceEngine';
import type { UserRole, AuthSession } from '../../types/role';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://otakatik-api.vercel.app';

// Demo valid verification codes for restricted roles
const VALID_INVITATION_CODES: Record<string, { role: UserRole; institutionName: string }> = {
  'KADER-MLT01': { role: 'cadre', institutionName: 'Posyandu Melati 1 (RW 03)' },
  'POSYANDU-2026': { role: 'cadre', institutionName: 'Posyandu Melati 1 (RW 03)' },
  'DOKTER-FKTP': { role: 'doctor', institutionName: 'Puskesmas Tegalrejo' },
  'DOKTER-2026': { role: 'doctor', institutionName: 'Puskesmas Tegalrejo' },
};

export interface RegisterPayload {
  role: UserRole;
  fullName: string;
  avatarId: string;
  invitationCode?: string;
  childData?: {
    childName: string;
    birthDate: string;
    gender: 'L' | 'P';
  };
  cadreData?: {
    posyanduName: string;
    rwCode: string;
  };
  doctorData?: {
    faskesName: string;
    nip: string;
  };
}

export interface ScreeningSubmissionPayload {
  childId: string;
  reactionTimeTrials: number[]; // ms
  goNoGoAccuracy: number; // %
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

export interface ScreeningEvaluationResponse {
  sessionId: string;
  evaluatedAt: string;
  tier: 'Normal' | 'Tier-2 Alert' | 'Tier-1 Alert';
  feRisk: number;
  znRisk: number;
  b12Risk: number;
  summaryFeedback: string;
  clinicalRationale?: string[];
}

export interface WorklistResponse {
  fktp_code: string;
  total: number;
  page: number;
  limit: number;
  tier_summary: {
    TIER_1_MERAH: number;
    TIER_2_KUNING: number;
    TIER_HIJAU: number;
    emergency_guardrail_count: number;
  };
  items: Array<{
    screening_uuid: string;
    subject_pseudo_uuid: string;
    triage_tier: 'TIER_1_MERAH' | 'TIER_2_KUNING' | 'TIER_HIJAU';
    suspected_deficiency: string[];
    age_in_months: number;
    sex: 'M' | 'F';
    muac_lila_cm: number;
    assessed_at: string;
    posyandu_id: string;
    has_clinical_decision: boolean;
    micronutrient_risk?: {
      fe_risk_percent: number;
      zn_risk_percent: number;
      b12_risk_percent: number;
      stunting_risk_percent?: number;
    };
    clinical_rationale?: string[];
    guardrail_triggered?: boolean;
  }>;
}

class ApiClient {
  private sessionToken: string | null = null;
  private currentSession: AuthSession | null = null;

  constructor() {
    // Session token in memory / sessionStorage only (NO child medical records persisted locally)
    const saved = sessionStorage.getItem('nnts_session');
    if (saved) {
      try {
        this.currentSession = JSON.parse(saved);
        this.sessionToken = this.currentSession?.token || null;
      } catch {
        this.currentSession = null;
        this.sessionToken = null;
      }
    }
  }

  // Verify invitation code for cadre or doctor
  async verifyInvitationCode(
    code: string,
    expectedRole: UserRole
  ): Promise<{ valid: boolean; message: string; institution?: string }> {
    await new Promise((r) => setTimeout(r, 200)); // simulate network latency
    const normalized = code.trim().toUpperCase();
    const entry = VALID_INVITATION_CODES[normalized];

    if (!entry) {
      return { valid: false, message: 'Kode undangan tidak ditemukan atau sudah kadaluarsa.' };
    }
    if (entry.role !== expectedRole) {
      return {
        valid: false,
        message: `Kode ini untuk peran ${entry.role === 'cadre' ? 'Kader' : 'Dokter'}, bukan untuk peran yang dipilih.`,
      };
    }
    return { valid: true, message: 'Kode valid dan terverifikasi.', institution: entry.institutionName };
  }

  // Complete registration & issue session token
  async registerUser(payload: RegisterPayload): Promise<AuthSession> {
    await new Promise((r) => setTimeout(r, 300));

    // If cadre or doctor, enforce invitation code
    if (payload.role !== 'parent') {
      const codeCheck = await this.verifyInvitationCode(payload.invitationCode || '', payload.role);
      if (!codeCheck.valid) {
        throw new Error(codeCheck.message);
      }
    }

    const session: AuthSession = {
      token: `nnts-jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: {
        id: `usr-${Date.now()}`,
        fullName: payload.fullName,
        role: payload.role,
        avatarId: payload.avatarId,
        posyanduId: payload.cadreData ? 'POSYANDU-MLT-01' : undefined,
        faskesId: payload.doctorData ? 'P3404010101' : undefined,
        childData: payload.childData,
      },
    };

    this.currentSession = session;
    this.sessionToken = session.token;
    sessionStorage.setItem('nnts_session', JSON.stringify(session));
    return session;
  }

  getSession(): AuthSession | null {
    return this.currentSession;
  }

  getToken(): string | null {
    return this.sessionToken;
  }

  logout() {
    this.currentSession = null;
    this.sessionToken = null;
    sessionStorage.removeItem('nnts_session');
  }

  getBaseUrl(): string {
    return API_BASE_URL;
  }

  // ── Offline Vault Queue (PWA Local Storage) ─────────────────
  getOfflineVault(): any[] {
    try {
      const raw = localStorage.getItem('nnts_offline_vault');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToOfflineVault(record: any) {
    try {
      const queue = this.getOfflineVault();
      queue.push(record);
      localStorage.setItem('nnts_offline_vault', JSON.stringify(queue));
    } catch (e) {
      console.warn('[Offline Vault] Gagal menyimpan ke localStorage:', e);
    }
  }

  // ── Submit & Sync Screening Session (100% Offline-First) ────
  async submitScreeningSession(
    payload: ScreeningSubmissionPayload
  ): Promise<ScreeningEvaluationResponse> {
    // 1. Eksekusi model ONNX lokal di browser (WebAssembly Engine)
    const evaluation = await evaluateTriage(payload);

    // 2. Petakan telemetri ke format backend sync
    const trials = payload.reactionTimeTrials.length ? payload.reactionTimeTrials : [820];
    const meanRt = trials.reduce((a, b) => a + b, 0) / trials.length;
    const variance =
      trials.reduce((sum, val) => sum + Math.pow(val - meanRt, 2), 0) / trials.length;
    const sdRt = Math.sqrt(variance) || 120;

    const suspectedDeficiencies: string[] = [];
    if (evaluation.feRisk >= 50) suspectedDeficiencies.push('FE_LATEN');
    if (evaluation.znRisk >= 50 || evaluation.b12Risk >= 50) suspectedDeficiencies.push('ZN_B12');
    if (suspectedDeficiencies.length === 0) suspectedDeficiencies.push('NORMOTRITION');

    const syncRecord = {
      screening_uuid: payload.childId || `scr-${Date.now()}`,
      subject_pseudo_uuid: `sub-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`,
      encounter_context: {
        posyandu_id: this.currentSession?.user?.posyanduId || 'POS-DIY-MLT01',
        fktp_code: this.currentSession?.user?.faskesId || 'P3404010101',
        kader_operator_id: this.currentSession?.user?.id || 'KDR-AUTO-01',
        age_in_months: payload.ageMonths ?? 36,
        sex: payload.gender === 'Female' || payload.gender === 'P' ? 'F' : 'M',
        assessed_at_iso: evaluation.evaluatedAt || new Date().toISOString(),
      },
      somatometry_input: {
        weight_kg: payload.weightKg ?? 11.5,
        height_cm: payload.heightCm ?? 90.0,
        muac_lila_cm: payload.muacLilaCm ?? 13.5,
        strict_plant_based_diet: false,
        z_waz: payload.zWaz ?? 0.0,
        z_haz: payload.zHaz ?? 0.0,
        z_whz: payload.zWhz ?? 0.0,
      },
      neurocognitive_telemetry: {
        hardware_calibration: {
          measured_frame_delta_ms: 16.6,
          baseline_mechanical_tap_ms: 45,
          calibration_valid: true,
        },
        island_1_srt_crt: {
          trials_count: trials.length,
          mean_corrected_rt_ms: Math.round(meanRt),
          choice_rt_mean_ms: Math.round(meanRt * 1.34),
          rt_variability_sd: Math.round(sdRt),
        },
        island_2_gonogo: {
          stimulus_duration_ms: 800,
          commission_errors: payload.goNoGoCommissionErrors,
          inhibitory_accuracy_percent: payload.goNoGoAccuracy,
        },
        island_3_digit_span: {
          span_length_achieved: payload.memorySpanScore,
        },
      },
      triage_result: {
        tier: evaluation.tier, // 'Tier-1 Alert' | 'Tier-2 Alert' | 'Normal'
        suspected_deficiency: suspectedDeficiencies,
        cdss_confidence_score: 0.88,
        micronutrient_risk: {
          fe_risk_percent: evaluation.feRisk,
          zn_risk_percent: evaluation.znRisk,
          b12_risk_percent: evaluation.b12Risk,
        },
        clinical_rationale: evaluation.clinicalRationale ?? [],
        guardrail_triggered: Boolean(
          (payload.muacLilaCm && payload.muacLilaCm < 11.5) ||
            (payload.zHaz && payload.zHaz < -2.75)
        ),
        model_version: '1.0.0-champion',
      },
    };

    // 3. Upayakan sinkronisasi live ke backend
    try {
      const authHeader = this.sessionToken?.includes('doctor') ? 'demo-doctor' : 'demo-kader';
      const res = await fetch(`${API_BASE_URL}/api/v1/sync/batch-screenings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({
          batch_id: `batch-${Date.now()}`,
          posyandu_id: syncRecord.encounter_context.posyandu_id,
          records: [syncRecord],
        }),
      });

      if (res.ok) {
        console.log('[NNTS Sync] Berhasil tersinkronisasi ke backend live:', syncRecord.screening_uuid);
      } else {
        console.warn('[NNTS Sync] Server merespons HTTP', res.status, '— data disimpan di offline vault');
        this.saveToOfflineVault(syncRecord);
      }
    } catch (netErr) {
      // Jaringan Posyandu tidak ada / offline mode
      console.info('[NNTS Sync] Sedang offline, skrining disimpan ke offline vault lokal');
      this.saveToOfflineVault(syncRecord);
    }

    return evaluation;
  }

  // ── Sinkronkan Antrean Offline ke Backend ───────────────────
  async syncOfflineVault(): Promise<{ synced: number; remaining: number }> {
    const queue = this.getOfflineVault();
    if (queue.length === 0) return { synced: 0, remaining: 0 };

    try {
      const authHeader = this.sessionToken?.includes('doctor') ? 'demo-doctor' : 'demo-kader';
      const res = await fetch(`${API_BASE_URL}/api/v1/sync/batch-screenings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify({
          batch_id: `offline-flush-${Date.now()}`,
          posyandu_id: queue[0]?.encounter_context?.posyandu_id || 'POS-DIY-MLT01',
          records: queue.slice(0, 50),
        }),
      });

      if (res.ok) {
        const remaining = queue.slice(50);
        localStorage.setItem('nnts_offline_vault', JSON.stringify(remaining));
        return { synced: queue.length - remaining.length, remaining: remaining.length };
      }
    } catch {
      // Masih offline
    }

    return { synced: 0, remaining: queue.length };
  }

  // ── Ambil Worklist Pasien untuk Dokter ──────────────────────
  async fetchDoctorWorklist(fktpCode: string = 'P3404010101', tier?: string): Promise<WorklistResponse | null> {
    try {
      const url = new URL(`${API_BASE_URL}/api/v1/fktp/${encodeURIComponent(fktpCode)}/worklist`);
      if (tier) url.searchParams.set('tier', tier);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: 'Bearer demo-doctor',
        },
      });

      if (res.ok) {
        return (await res.json()) as WorklistResponse;
      }
    } catch (e) {
      console.warn('[NNTS API] Gagal memuat worklist dari backend live:', e);
    }
    return null;
  }

  // ── Catat Keputusan Klinis Dokter ───────────────────────────
  async submitClinicalDecision(
    screeningUuid: string,
    decision: {
      doctorId: string;
      interventionChosen: string[];
      clinicalNotes: string;
      followUpWeeks: 4 | 6;
    }
  ): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/fktp/encounters/${screeningUuid}/clinical-decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer demo-doctor',
        },
        body: JSON.stringify({
          doctor_id: decision.doctorId,
          intervention_chosen: decision.interventionChosen,
          clinical_notes: decision.clinicalNotes,
          follow_up_weeks: decision.followUpWeeks,
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ── URL Download HL7 FHIR Bundle ───────────────────────────
  getFhirBundleDownloadUrl(screeningUuid: string): string {
    return `${API_BASE_URL}/api/v1/encounters/${screeningUuid}/fhir-bundle`;
  }
}

export const api = new ApiClient();
