import React, { useState } from 'react';
import { ChevronLeft, Heart, Users, Stethoscope, LogIn, UserCheck, ShieldCheck } from 'lucide-react';
import { NutriSprout } from '../../design-system/mascot/NutriSprout';
import { SpeechBubble } from '../../design-system/primitives/SpeechBubble';
import { Button } from '../../design-system/primitives/Button';
import { TextField } from '../../design-system/primitives/TextField';
import { soundSynth } from '../../services/audio/synth';
import { api } from '../../services/api/client';
import type { AuthSession, UserRole } from '../../types/role';

export interface LoginViewProps {
  onBack: () => void;
  onRegister: () => void;
  onLoginSuccess: (session: AuthSession) => void;
}

// Pre-defined demo profiles for returning parents, cadres, and doctors
const DEFAULT_RETURNING_PROFILES: AuthSession[] = [
  {
    token: 'jwt-parent-demo',
    user: {
      id: 'u-parent-siti',
      fullName: 'Ibu Siti Rahma',
      role: 'parent',
      avatarId: 'av-1',
    },
  },
  {
    token: 'jwt-cadre-demo',
    user: {
      id: 'u-cadre-nurul',
      fullName: 'Kader Nurul Hidayah',
      role: 'cadre',
      avatarId: 'av-2',
      posyanduId: 'POSYANDU-MLT-01',
    },
  },
  {
    token: 'jwt-doctor-demo',
    user: {
      id: 'u-doctor-budi',
      fullName: 'dr. Budi Santoso, Sp.A',
      role: 'doctor',
      avatarId: 'av-3',
      faskesId: 'PUSK-TEGALREJO',
    },
  },
];

export const LoginView: React.FC<LoginViewProps> = ({
  onBack,
  onRegister,
  onLoginSuccess,
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>(
    DEFAULT_RETURNING_PROFILES[0].user.id
  );
  const [activeTab, setActiveTab] = useState<'saved' | 'manual'>('saved');

  // Manual sign-in inputs
  const [manualName, setManualName] = useState('');
  const [manualRole, setManualRole] = useState<UserRole>('parent');
  const [manualCode, setManualCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Combine locally saved profiles with demo profiles
  const savedProfiles = React.useMemo(() => {
    const fromStorage = api.getSavedProfiles();
    const existingIds = new Set(fromStorage.map((p: AuthSession) => p.user.id));
    const combined = [...fromStorage];
    for (const def of DEFAULT_RETURNING_PROFILES) {
      if (!existingIds.has(def.user.id)) {
        combined.push(def);
      }
    }
    return combined;
  }, []);

  const handleSelectProfile = (session: AuthSession) => {
    soundSynth.playPop();
    setSelectedProfileId(session.user.id);
  };

  const handleConfirmLogin = (sessionToLogin?: AuthSession) => {
    const session =
      sessionToLogin ||
      savedProfiles.find((p) => p.user.id === selectedProfileId) ||
      savedProfiles[0];

    if (!session) return;

    soundSynth.playChime();
    api.loginSession(session);
    onLoginSuccess(session);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    setIsLoggingIn(true);
    setCodeError(undefined);

    try {
      if (manualRole !== 'parent' && manualCode) {
        const verify = await api.verifyInvitationCode(manualCode, manualRole);
        if (!verify.valid) {
          setCodeError(verify.message);
          setIsLoggingIn(false);
          return;
        }
      }

      const customSession: AuthSession = {
        token: `jwt-returning-${Date.now()}`,
        user: {
          id: `usr-${Date.now()}`,
          fullName: manualName.trim(),
          role: manualRole,
          avatarId: 'av-1',
          posyanduId: manualRole === 'cadre' ? 'POSYANDU-MLT-01' : undefined,
          faskesId: manualRole === 'doctor' ? 'PUSK-TEGALREJO' : undefined,
        },
      };

      soundSynth.playChime();
      api.loginSession(customSession);
      onLoginSuccess(customSession);
    } catch {
      setCodeError('Gagal memverifikasi akun.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div
      style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}
      className="w-full h-full bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-[#FFFBEB] flex flex-col justify-between px-5 pt-10 pb-5 sm:pb-6 font-sans select-none relative overflow-y-auto"
    >
      {/* TOP HEADER: Back Button (>=44x44px) & Title */}
      <header className="w-full max-w-sm mx-auto flex items-center justify-between gap-3 mb-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onBack();
          }}
          className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-subtle shrink-0 cursor-pointer active:scale-95"
          aria-label="Kembali ke beranda"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 text-center pr-11">
          <h2 className="text-base font-extrabold text-slate-900">Masuk Akun</h2>
          <p className="text-xs text-slate-600 font-medium">Akses data posyandu Anda</p>
        </div>
      </header>

      {/* MASCOT GREETING GUIDANCE */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 my-2 shrink-0">
        <NutriSprout size={68} mood="happy" showShadow={false} />
        <SpeechBubble
          message="Senang bertemu kembali! Pilih profilmu untuk langsung masuk tanpa mengisi ulang formulir."
          className="flex-1"
        />
      </div>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center py-2 space-y-3">
        {/* Toggle Mode: Profil Tersimpan / Masuk Cepat */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setActiveTab('saved');
            }}
            className={`min-h-[44px] py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-[#475569] hover:text-slate-900'
            }`}
          >
            Pilih Profil ({savedProfiles.length})
          </button>
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setActiveTab('manual');
            }}
            className={`min-h-[44px] py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-[#475569] hover:text-slate-900'
            }`}
          >
            Masuk Manual
          </button>
        </div>

        {/* TAB 1: SAVED PROFILES SELECTOR */}
        {activeTab === 'saved' && (
          <div className="space-y-2.5 animate-in fade-in duration-normal">
            <div className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
              <span>Profil Pengguna Terdaftar:</span>
              <span className="text-xs text-slate-600 font-medium">Klik untuk memilih</span>
            </div>

            <div className="space-y-2">
              {savedProfiles.map((prof) => {
                const isSelected = selectedProfileId === prof.user.id;
                const isParent = prof.user.role === 'parent';
                const isCadre = prof.user.role === 'cadre';

                return (
                  <div
                    key={prof.user.id}
                    onClick={() => handleSelectProfile(prof)}
                    onDoubleClick={() => handleConfirmLogin(prof)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] ${
                      isSelected
                        ? 'bg-teal-50/80 border-nutri-teal-700 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isParent
                            ? 'bg-amber-100 text-amber-700'
                            : isCadre
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-cyan-100 text-cyan-700'
                        }`}
                      >
                        {isParent ? (
                          <Heart className="w-5 h-5 fill-amber-600 text-amber-600" />
                        ) : isCadre ? (
                          <Users className="w-5 h-5 text-teal-700" />
                        ) : (
                          <Stethoscope className="w-5 h-5 text-cyan-700" />
                        )}
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {prof.user.fullName}
                        </div>
                        <div className="text-xs text-slate-600 font-medium truncate">
                          {isParent
                            ? 'Balita: Anisa (30 Bulan)'
                            : isCadre
                            ? prof.user.posyanduId || 'Posyandu Melati 1 (RW 03)'
                            : prof.user.faskesId || 'Puskesmas Tegalrejo'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 ml-2">
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          isParent
                            ? 'bg-amber-100 text-amber-800'
                            : isCadre
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {isParent ? 'Orang Tua' : isCadre ? 'Kader' : 'Dokter'}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-nutri-teal-700 text-white flex items-center justify-center">
                          <UserCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MANUAL SIGN-IN */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualLogin} className="space-y-3 animate-in fade-in duration-normal">
            <TextField
              label="Nama Lengkap"
              placeholder="Contoh: Ibu Siti Rahma"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              helperText="Masukkan nama sesuai akun yang terdaftar."
              required
            />

            <div>
              <label className="text-xs font-bold text-slate-900 block mb-1">Peran Akun:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['parent', 'cadre', 'doctor'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setManualRole(r)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      manualRole === r
                        ? 'bg-nutri-teal-700 text-white border-nutri-teal-700 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {r === 'parent' ? 'Orang Tua' : r === 'cadre' ? 'Kader' : 'Dokter'}
                  </button>
                ))}
              </div>
            </div>

            {manualRole !== 'parent' && (
              <TextField
                label="Kode Undangan Faskes"
                placeholder={manualRole === 'cadre' ? 'POSYANDU-2026' : 'DOKTER-2026'}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                error={codeError}
                helperText="Gunakan kode resmi dari instansi kesehatan."
                leftIcon={<ShieldCheck className="w-4 h-4" />}
              />
            )}
          </form>
        )}
      </main>

      {/* BOTTOM ACTIONS: Masuk Button & Link Daftar Akun Baru */}
      <footer className="w-full max-w-sm mx-auto pt-3 shrink-0 flex flex-col gap-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoggingIn}
          onClick={() => {
            if (activeTab === 'manual') {
              handleManualLogin({ preventDefault: () => {} } as React.FormEvent);
            } else {
              handleConfirmLogin();
            }
          }}
          icon={<LogIn className="w-5 h-5" />}
          iconPosition="right"
          className="shadow-btn-primary"
        >
          Masuk ke Dashboard
        </Button>

        {/* Separated Pathway back to Registration */}
        <div className="text-xs text-[#475569] flex items-center justify-center gap-1.5 pt-1">
          <span>Belum punya akun?</span>
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              onRegister();
            }}
            className="min-h-[44px] px-2 text-nutri-teal-700 hover:text-nutri-teal-800 font-bold hover:underline cursor-pointer flex items-center justify-center active:scale-95"
            aria-label="Buka pendaftaran akun baru"
          >
            Daftar Baru
          </button>
        </div>
      </footer>
    </div>
  );
};
