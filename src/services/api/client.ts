import type { UserRole, AuthSession } from '../../types/role';

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
}

export interface ScreeningEvaluationResponse {
  sessionId: string;
  evaluatedAt: string;
  tier: 'Normal' | 'Tier-2 Alert' | 'Tier-1 Alert';
  feRisk: number;
  znRisk: number;
  b12Risk: number;
  summaryFeedback: string;
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
  async verifyInvitationCode(code: string, expectedRole: UserRole): Promise<{ valid: boolean; message: string; institution?: string }> {
    await new Promise((r) => setTimeout(r, 200)); // simulate network latency
    const normalized = code.trim().toUpperCase();
    const entry = VALID_INVITATION_CODES[normalized];

    if (!entry) {
      return { valid: false, message: 'Kode undangan tidak ditemukan atau sudah kadaluarsa.' };
    }
    if (entry.role !== expectedRole) {
      return { valid: false, message: `Kode ini untuk peran ${entry.role === 'cadre' ? 'Kader' : 'Dokter'}, bukan untuk peran yang dipilih.` };
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
        faskesId: payload.doctorData ? 'PUSK-TEGALREJO' : undefined,
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

  getSavedProfiles(): AuthSession[] {
    try {
      const raw = localStorage.getItem('nnts_saved_profiles');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  loginSession(session: AuthSession): void {
    this.currentSession = session;
    this.sessionToken = session.token;
    try {
      sessionStorage.setItem('nnts_session', JSON.stringify(session));
      const profiles = this.getSavedProfiles();
      const updated = [session, ...profiles.filter((p) => p.user.id !== session.user.id)].slice(0, 5);
      localStorage.setItem('nnts_saved_profiles', JSON.stringify(updated));
    } catch {
      // ignore storage error
    }
  }

  // Submit screening data to backend CDSS evaluation endpoint
  async submitScreeningSession(payload: ScreeningSubmissionPayload): Promise<ScreeningEvaluationResponse> {
    await new Promise((r) => setTimeout(r, 350));
    const avgRt = payload.reactionTimeTrials.reduce((a, b) => a + b, 0) / (payload.reactionTimeTrials.length || 1);

    const isHighFeRisk = avgRt > 480;
    const isHighZnRisk = payload.goNoGoCommissionErrors >= 2 || payload.goNoGoAccuracy < 75;
    const isHighB12Risk = payload.memorySpanScore < 2;

    const feRisk = isHighFeRisk ? 78 : 22;
    const znRisk = isHighZnRisk ? 68 : 19;
    const b12Risk = isHighB12Risk ? 65 : 18;

    const tier = (feRisk > 70 || znRisk > 70) ? 'Tier-1 Alert' : (feRisk > 50 || znRisk > 50 || b12Risk > 50) ? 'Tier-2 Alert' : 'Normal';

    return {
      sessionId: `sc-${Date.now()}`,
      evaluatedAt: new Date().toISOString(),
      tier,
      feRisk,
      znRisk,
      b12Risk,
      summaryFeedback: tier === 'Normal' 
        ? 'Tumbuh kembang motorik dan atensi si kecil sangat baik! Terus jaga asupan gizi seimbang.'
        : 'Perlu sedikit dorongan gizi kaya zat besi dan seng pada menu makanan harian keluarga.',
    };
  }
}

export const api = new ApiClient();
