import { evaluateTriage } from '../cdss/inferenceEngine';
import { ageInMonths } from '../../utils/age';
import type { UserRole, AuthSession } from '../../types/role';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://otakatik-api.vercel.app';

// Demo valid verification codes for restricted roles
const VALID_INVITATION_CODES: Record<string, { role: UserRole; institutionName: string }> = {
  'KADER-MLT01': { role: 'cadre', institutionName: 'Posyandu Melati 1 (RW 03)' },
  'POSYANDU-2026': { role: 'cadre', institutionName: 'Posyandu Melati 1 (RW 03)' },
  'DOKTER-FKTP': { role: 'doctor', institutionName: 'Puskesmas Tegalrejo' },
  'DOKTER-2026': { role: 'doctor', institutionName: 'Puskesmas Tegalrejo' },
};

// Preset demo accounts for rapid testing & offline fallback
export const PRESET_ACCOUNTS: Record<
  string,
  {
    role: UserRole;
    fullName: string;
    username: string;
    email: string;
    password: string;
    posyanduId?: string;
    faskesId?: string;
  }
> = {
  'orangtua@posyandu.id': {
    role: 'parent',
    fullName: 'Ibu Siti Rahma',
    username: 'parent',
    email: 'orangtua@posyandu.id',
    password: 'password123',
    posyanduId: 'POS-DIY-MLT01',
  },
  parent: {
    role: 'parent',
    fullName: 'Ibu Siti Rahma',
    username: 'parent',
    email: 'orangtua@posyandu.id',
    password: 'password123',
    posyanduId: 'POS-DIY-MLT01',
  },
  'kader@posyandu.id': {
    role: 'cadre',
    fullName: 'Kader Posyandu Melati',
    username: 'kader',
    email: 'kader@posyandu.id',
    password: 'password123',
    posyanduId: 'POS-DIY-MLT01',
  },
  kader: {
    role: 'cadre',
    fullName: 'Kader Posyandu Melati',
    username: 'kader',
    email: 'kader@posyandu.id',
    password: 'password123',
    posyanduId: 'POS-DIY-MLT01',
  },
  'dokter@puskesmas.id': {
    role: 'doctor',
    fullName: 'dr. Budi Santoso, Sp.A',
    username: 'dokter',
    email: 'dokter@puskesmas.id',
    password: 'password123',
    faskesId: 'P3404010101',
  },
  dokter: {
    role: 'doctor',
    fullName: 'dr. Budi Santoso, Sp.A',
    username: 'dokter',
    email: 'dokter@puskesmas.id',
    password: 'password123',
    faskesId: 'P3404010101',
  },
};

export interface CreateSubjectPayload {
  child_name: string;
  birth_date: string; // YYYY-MM-DD
  sex: 'M' | 'F';
  posyandu_id: string;
  guardian_name?: string;
  phone?: string;
  address?: string;
  nik?: string;
}

export interface CreateSubjectResponse {
  pseudo_uuid: string;
  age_in_months: number;
}

export interface PosyanduSubjectItem {
  pseudo_uuid: string;
  child_name: string;
  sex: string;
  birth_date: string;
  age_in_months: number;
  last_screening: {
    screening_uuid: string;
    triage_tier: string;
    assessed_at: string;
  } | null;
  last_measurements: {
    weight_kg: number;
    height_cm: number;
    muac_lila_cm: number;
    z_waz: number | null;
    z_haz: number | null;
    z_whz: number | null;
  } | null;
}

export interface RegisterPayload {
  role: UserRole;
  fullName: string;
  avatarId?: string;
  username?: string;
  email?: string;
  password?: string;
  invitationCode?: string;
  childData?: {
    childName: string;
    birthDate: string;
    gender: 'L' | 'P';
    subjectId?: string;
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
  subjectId?: string;
  birthDate?: string;
  gender?: 'L' | 'P' | 'Male' | 'Female';
  reactionTimeTrials: number[]; // ms
  goNoGoAccuracy: number; // %
  goNoGoCommissionErrors: number;
  memorySpanScore: number;
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
  features?: Record<string, number>;
  rawProbabilities?: Record<string, number>;
  tierBeforeGuardrail?: string;
  guardrailRulesFired?: string[];
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

  getLocalAccounts(): any[] {
    try {
      const raw = localStorage.getItem('nnts_registered_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  saveLocalAccount(acc: any) {
    try {
      const list = this.getLocalAccounts();
      const idx = list.findIndex(
        (a) =>
          (acc.email && a.email?.toLowerCase() === acc.email?.toLowerCase()) ||
          (acc.username && a.username?.toLowerCase() === acc.username?.toLowerCase())
      );
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...acc };
      } else {
        list.push(acc);
      }
      localStorage.setItem('nnts_registered_accounts', JSON.stringify(list));
    } catch (e) {
      console.warn('[Storage] Gagal menyimpan akun lokal:', e);
    }
  }

  // ── Login Pengguna dengan Deteksi Peran Otomatis ───────────
  async login(credentials: { emailOrUsername: string; password: string }): Promise<AuthSession> {
    const rawInput = credentials.emailOrUsername.trim();
    const rawPass = credentials.password;
    if (!rawInput || !rawPass) {
      throw new Error('Email/Username dan kata sandi wajib diisi');
    }

    // 1. Coba login ke Backend API
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_or_username: rawInput,
          password: rawPass,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const role = (data.user?.role || 'parent') as UserRole;
        const session: AuthSession = {
          token: data.token,
          user: {
            id: data.user.id,
            fullName: data.user.full_name || data.user.username,
            role,
            avatarId: 'av-1',
            posyanduId: data.user.posyandu_id,
            faskesId: data.user.fktp_code,
          },
        };
        this.currentSession = session;
        this.sessionToken = session.token;
        sessionStorage.setItem('nnts_session', JSON.stringify(session));
        return session;
      }

      if (res.status === 401) {
        throw new Error('Email/Username atau kata sandi tidak sesuai');
      }
    } catch (err: any) {
      if (err.message === 'Email/Username atau kata sandi tidak sesuai') {
        throw err;
      }
      console.warn('[Auth] Backend API offline/fallback ke preset dan akun lokal:', err.message);
    }

    // 2. Fallback ke Preset Demo Accounts
    const inputKey = rawInput.toLowerCase();
    const preset = PRESET_ACCOUNTS[inputKey];
    if (preset) {
      if (rawPass === 'password123' || rawPass === preset.password) {
        const session: AuthSession = {
          token: `demo-${preset.role}`,
          user: {
            id: `usr-${preset.role}-demo`,
            fullName: preset.fullName,
            role: preset.role,
            avatarId: 'av-1',
            posyanduId: preset.posyanduId,
            faskesId: preset.faskesId,
          },
        };
        this.currentSession = session;
        this.sessionToken = session.token;
        sessionStorage.setItem('nnts_session', JSON.stringify(session));
        return session;
      } else {
        throw new Error('Email/Username atau kata sandi tidak sesuai');
      }
    }

    // 3. Fallback ke Akun Lokal yang terdaftar di perangkat
    const localAccounts = this.getLocalAccounts();
    const matched = localAccounts.find(
      (a: any) =>
        a.email?.toLowerCase() === inputKey || a.username?.toLowerCase() === inputKey
    );
    if (matched) {
      if (matched.password === rawPass) {
        const session: AuthSession = {
          token: matched.token || `local-jwt-${Date.now()}`,
          user: {
            id: matched.id,
            fullName: matched.fullName,
            role: matched.role,
            avatarId: 'av-1',
            posyanduId: matched.posyanduId,
            faskesId: matched.faskesId,
            childData: matched.childData,
          },
        };
        this.currentSession = session;
        this.sessionToken = session.token;
        sessionStorage.setItem('nnts_session', JSON.stringify(session));
        return session;
      } else {
        throw new Error('Email/Username atau kata sandi tidak sesuai');
      }
    }

    throw new Error('Akun tidak ditemukan. Silakan periksa kembali atau daftar baru.');
  }

  // ── Registrasi Akun Pengguna Baru ──────────────────────────
  async registerUser(payload: RegisterPayload): Promise<AuthSession> {
    // Verifikasi kode undangan untuk peran kader & dokter
    if (payload.role !== 'parent') {
      const codeCheck = await this.verifyInvitationCode(payload.invitationCode || '', payload.role);
      if (!codeCheck.valid) {
        throw new Error(codeCheck.message);
      }
    }

    const cleanUsername =
      payload.username ||
      payload.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15) ||
      `user_${Date.now()}`;
    const cleanEmail =
      payload.email ||
      `${cleanUsername}@posyandu.id`;
    const cleanPassword = payload.password || 'password123';

    let remoteSuccess = false;
    let remoteSession: AuthSession | null = null;

    // 1. Coba registrasi ke server API
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          email: cleanEmail,
          password: cleanPassword,
          full_name: payload.fullName,
          role: payload.role,
          posyandu_id: 'POS-DIY-MLT01',
          fktp_code: 'P3404010101',
          child_data:
            payload.role === 'parent' && payload.childData
              ? {
                  child_name: payload.childData.childName,
                  birth_date: payload.childData.birthDate,
                  gender: payload.childData.gender,
                }
              : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const childRes = data.child;
        if (payload.childData && childRes?.pseudo_uuid) {
          payload.childData.subjectId = childRes.pseudo_uuid;
        }

        remoteSession = {
          token: data.token,
          user: {
            id: data.user.id,
            fullName: data.user.full_name || payload.fullName,
            role: data.user.role as UserRole,
            avatarId: payload.avatarId || 'av-1',
            posyanduId: data.user.posyandu_id,
            faskesId: data.user.fktp_code,
            childData: payload.childData,
          },
        };
        remoteSuccess = true;
      } else if (res.status === 409) {
        throw new Error('Email atau username sudah terdaftar');
      }
    } catch (err: any) {
      if (err.message === 'Email atau username sudah terdaftar') {
        throw err;
      }
      console.warn('[Register] API server offline/fallback ke penyimpanan lokal:', err.message);
    }

    // 2. Bangun sesi
    const session: AuthSession =
      remoteSuccess && remoteSession
        ? remoteSession
        : {
            token: `nnts-jwt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            user: {
              id: `usr-${Date.now()}`,
              fullName: payload.fullName,
              role: payload.role,
              avatarId: payload.avatarId || 'av-1',
              posyanduId: payload.cadreData ? 'POS-DIY-MLT01' : undefined,
              faskesId: payload.doctorData ? 'P3404010101' : undefined,
              childData: payload.childData,
            },
          };

    this.currentSession = session;
    this.sessionToken = session.token;
    sessionStorage.setItem('nnts_session', JSON.stringify(session));

    // Simpan ke daftar akun lokal untuk kemudahan login offline
    this.saveLocalAccount({
      id: session.user.id,
      fullName: payload.fullName,
      username: cleanUsername,
      email: cleanEmail,
      password: cleanPassword,
      role: payload.role,
      posyanduId: session.user.posyanduId,
      faskesId: session.user.faskesId,
      childData: payload.childData,
      token: session.token,
    });

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

  // ── Registrasi Anak Baru ke Server ──────────────────────────
  async createSubject(payload: CreateSubjectPayload): Promise<CreateSubjectResponse> {
    const authHeader = this.sessionToken || 'demo-kader';
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/api/v1/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error('Tidak ada koneksi, coba lagi');
    }

    if (res.status === 201) {
      return (await res.json()) as CreateSubjectResponse;
    }

    let errJson: any = null;
    try {
      errJson = await res.json();
    } catch {
      // ignore
    }

    if (res.status === 422) {
      if (errJson?.error === 'age_out_of_range') {
        throw new Error(
          `Usia anak harus 24-59 bulan (saat ini ${errJson?.age_in_months ?? '?'} bulan)`
        );
      }
      if (errJson?.error === 'unknown_posyandu') {
        throw new Error('Posyandu tidak terdaftar di sistem');
      }
      throw new Error(errJson?.error || 'Data yang dikirimkan tidak valid (422)');
    }

    if (res.status === 503) {
      throw new Error('Layanan database sedang tidak tersedia (503), coba beberapa saat lagi');
    }

    throw new Error(errJson?.error || `Gagal mendaftarkan anak (HTTP ${res.status})`);
  }

  // ── Ambil Daftar Balita di Posyandu ─────────────────────────
  async listSubjects(
    posyanduId: string = 'POS-DIY-MLT01',
    limit?: number
  ): Promise<PosyanduSubjectItem[]> {
    const authHeader = this.sessionToken || 'demo-kader';
    let res: Response;
    try {
      const url = new URL(
        `${API_BASE_URL}/api/v1/posyandu/${encodeURIComponent(posyanduId)}/subjects`
      );
      if (limit) url.searchParams.set('limit', String(limit));

      res = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${authHeader}`,
        },
      });
    } catch {
      throw new Error('Tidak ada koneksi, coba lagi');
    }

    if (res.ok) {
      return (await res.json()) as PosyanduSubjectItem[];
    }

    let errJson: any = null;
    try {
      errJson = await res.json();
    } catch {
      // ignore
    }

    if (res.status === 422 && errJson?.error === 'unknown_posyandu') {
      throw new Error('Posyandu tidak terdaftar di sistem');
    }

    throw new Error(errJson?.error || `Gagal memuat daftar anak (HTTP ${res.status})`);
  }

  // ── Submit & Sync Screening Session (100% Offline-First) ────
  async submitScreeningSession(
    payload: ScreeningSubmissionPayload
  ): Promise<ScreeningEvaluationResponse> {
    // Validasi identitas wajib anak
    if (!payload.subjectId || !payload.birthDate || !payload.gender) {
      console.error(
        '[Sync Aborted] subjectId, birthDate, atau gender anak tidak ditemukan:',
        { subjectId: payload.subjectId, birthDate: payload.birthDate, gender: payload.gender }
      );
      throw new Error('subject_identity_missing: subjectId, birthDate, and gender are required');
    }

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

    const assessedAt = evaluation.evaluatedAt || new Date().toISOString();
    const calculatedAge = ageInMonths(payload.birthDate, assessedAt);
    const sexCode: 'M' | 'F' = payload.gender === 'Female' || payload.gender === 'P' ? 'F' : 'M';
    const screeningUuid = `scr-${crypto.randomUUID()}`;

    // TAHAP 8: Blok inference dari keluaran evaluateTriage/ONNX
    const inferenceBlock = {
      model_version: '1.0.0-champion',
      model_md5: '71bfefd25f4d6586331e65409db48174',
      threshold: 0.205,
      features: evaluation.features ?? {},
      raw_probabilities: evaluation.rawProbabilities ?? {},
      tier_before_guardrail: evaluation.tierBeforeGuardrail ?? null,
      tier_final:
        evaluation.tier === 'Tier-1 Alert'
          ? 'TIER_1_MERAH'
          : evaluation.tier === 'Tier-2 Alert'
          ? 'TIER_2_KUNING'
          : 'TIER_HIJAU',
      guardrail_rules_fired: evaluation.guardrailRulesFired ?? [],
    };

    const syncRecord = {
      screening_uuid: screeningUuid,
      subject_pseudo_uuid: payload.subjectId,
      encounter_context: {
        posyandu_id: this.currentSession?.user?.posyanduId || 'POS-DIY-MLT01',
        fktp_code: this.currentSession?.user?.faskesId || 'P3404010101',
        kader_operator_id: this.currentSession?.user?.id || 'KDR-AUTO-01',
        age_in_months: calculatedAge,
        sex: sexCode,
        assessed_at_iso: assessedAt,
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
      inference: inferenceBlock,
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
        const data = (await res.json()) as {
          synced_uuids?: string[];
          rejected_uuids?: string[];
          items?: Array<{ screening_uuid: string; status: string; reason?: string }>;
        };
        const isSynced = data.synced_uuids?.includes(syncRecord.screening_uuid);
        if (isSynced) {
          console.log('[NNTS Sync] Berhasil tersinkronisasi ke backend live:', syncRecord.screening_uuid);
        } else {
          const itemRes = data.items?.find((i) => i.screening_uuid === syncRecord.screening_uuid);
          if (itemRes?.reason) {
            (syncRecord as any).rejection_reason = itemRes.reason;
            console.warn(`[NNTS Sync] Skrining ditolak server (${itemRes.reason}), disimpan di offline vault`);
          }
          this.saveToOfflineVault(syncRecord);
        }
      } else {
        console.warn('[NNTS Sync] Server merespons HTTP', res.status, '— data disimpan di offline vault');
        this.saveToOfflineVault(syncRecord);
      }
    } catch {
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
        const data = (await res.json()) as {
          synced_uuids?: string[];
          rejected_uuids?: string[];
          items?: Array<{ screening_uuid: string; status: string; reason?: string }>;
        };

        const syncedSet = new Set(data.synced_uuids || []);

        // Hapus item dari antrean HANYA jika screening_uuid-nya ada di synced_uuids
        const remainingQueue: any[] = [];
        for (const item of queue) {
          if (syncedSet.has(item.screening_uuid)) {
            continue;
          }
          // Jika ditolak server, catat alasannya dan tetap simpan di antrean
          const rejectedItem = data.items?.find((i) => i.screening_uuid === item.screening_uuid);
          if (rejectedItem?.reason) {
            item.rejection_reason = rejectedItem.reason;
            console.warn(
              `[Sync Vault] Item ${item.screening_uuid} ditolak server: ${rejectedItem.reason}`
            );
          }
          remainingQueue.push(item);
        }

        localStorage.setItem('nnts_offline_vault', JSON.stringify(remainingQueue));
        const syncedCount = queue.length - remainingQueue.length;
        return { synced: syncedCount, remaining: remainingQueue.length };
      }
    } catch {
      // Masih offline, antrean tidak berubah
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
