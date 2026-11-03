import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, Check, ShieldCheck, Heart, Stethoscope, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '../../design-system/primitives/Button';
import { TextField } from '../../design-system/primitives/TextField';
import { Stepper } from '../../design-system/primitives/Stepper';
import { AvatarPicker } from '../../design-system/primitives/AvatarPicker';
import { SpeechBubble } from '../../design-system/primitives/SpeechBubble';
import { NutriSprout, type NutriSproutMood } from '../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../services/audio/synth';
import { api, type RegisterPayload } from '../../services/api/client';
import type { UserRole, AuthSession } from '../../types/role';

export interface OnboardingViewProps {
  onBackToWelcome: () => void;
  onComplete: (session: AuthSession) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onBackToWelcome,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [mascotMood, setMascotMood] = useState<NutriSproutMood>('happy');

  // Form states
  const [fullName, setFullName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('av-1');
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');

  // Verification code for cadre / doctor
  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [codeSuccess, setCodeSuccess] = useState<string | undefined>();
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Contextual data for step 3
  const [childName, setChildName] = useState('');
  const [childAgeMonths, setChildAgeMonths] = useState<number>(30);
  const [childGender, setChildGender] = useState<'L' | 'P'>('P');

  const [cadrePosyandu, setCadrePosyandu] = useState('Posyandu Melati 1');
  const [cadreRw, setCadreRw] = useState('RW 03');

  const [doctorFaskes, setDoctorFaskes] = useState('Puskesmas Tegalrejo');
  const [doctorNip, setDoctorNip] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation logic
  const isStep1Valid = fullName.trim().length >= 2;

  const isStep2Valid =
    selectedRole === 'parent' || (Boolean(codeSuccess) && !codeError);

  const isStep3Valid =
    selectedRole === 'parent'
      ? childName.trim().length >= 2 && childAgeMonths >= 12 && childAgeMonths <= 60
      : selectedRole === 'cadre'
      ? cadrePosyandu.trim().length >= 3 && cadreRw.trim().length >= 1
      : doctorFaskes.trim().length >= 3 && doctorNip.trim().length >= 5;

  // Handle invitation code verification
  const handleVerifyCode = async (codeToVerify: string, roleToVerify: UserRole) => {
    if (!codeToVerify.trim()) {
      setCodeError(undefined);
      setCodeSuccess(undefined);
      return;
    }
    setIsVerifyingCode(true);
    setCodeError(undefined);
    setCodeSuccess(undefined);

    const res = await api.verifyInvitationCode(codeToVerify, roleToVerify);
    setIsVerifyingCode(false);

    if (res.valid) {
      setCodeSuccess(res.institution || res.message);
      setCodeError(undefined);
      soundSynth.playChime();
    } else {
      setCodeError(res.message);
      setCodeSuccess(undefined);
    }
  };

  const handleNext = async () => {
    soundSynth.playPop();

    if (step === 1 && isStep1Valid) {
      setStep(2);
      setMascotMood('curious');
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
      setMascotMood('calm');
    } else if (step === 3 && isStep3Valid) {
      // Final submission
      setIsSubmitting(true);
      try {
        const payload: RegisterPayload = {
          role: selectedRole,
          fullName: fullName.trim(),
          avatarId: selectedAvatar,
          invitationCode: selectedRole !== 'parent' ? inviteCode.trim() : undefined,
          childData:
            selectedRole === 'parent'
              ? {
                  childName: childName.trim(),
                  birthDate: new Date(Date.now() - childAgeMonths * 30 * 86400000)
                    .toISOString()
                    .split('T')[0],
                  gender: childGender,
                }
              : undefined,
          cadreData:
            selectedRole === 'cadre'
              ? { posyanduName: cadrePosyandu.trim(), rwCode: cadreRw.trim() }
              : undefined,
          doctorData:
            selectedRole === 'doctor'
              ? { faskesName: doctorFaskes.trim(), nip: doctorNip.trim() }
              : undefined,
        };

        const session = await api.registerUser(payload);

        // Confetti burst on successful registration
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#0F766E', '#10B981', '#F97316', '#FDE047'],
            disableForReducedMotion: true,
          });
        } catch {
          // ignore if canvas blocked
        }

        soundSynth.playChime();
        onComplete(session);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Pendaftaran gagal');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    soundSynth.playPop();
    if (step === 1) {
      onBackToWelcome();
    } else {
      setStep((s) => s - 1);
    }
  };

  // Dynamic dialogue for mascot
  const mascotDialogue =
    step === 1
      ? 'Yuk kenalan! Siapa namamu dan pilih avatar ceriamu.'
      : step === 2
      ? selectedRole === 'parent'
        ? 'Orang tua hebat! Siap mendampingi gizi buah hati.'
        : 'Masukkan kode faskes untuk verifikasi wewenang penugasan.'
      : selectedRole === 'parent'
      ? 'Satu langkah lagi! Lengkapi data awal si kecil.'
      : 'Konfirmasi wilayah faskes tugasmu.';

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#F0FDF4] via-[#F8FAFC] to-[#FFFBEB] flex flex-col justify-between px-5 py-5 sm:py-6 font-sans select-none relative overflow-y-auto">
      {/* TOP HEADER: Back Button & Stepper */}
      <header className="w-full max-w-sm mx-auto flex items-center justify-between gap-3 mb-4 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-subtle shrink-0"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-[240px]">
          <Stepper
            steps={['Profil', 'Peran', 'Data Dasar']}
            currentStep={step}
          />
        </div>
      </header>

      {/* MASCOT DIALOGUE GUIDANCE */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 my-2 shrink-0">
        <NutriSprout size={72} mood={mascotMood} showShadow={false} />
        <SpeechBubble message={mascotDialogue} className="flex-1" />
      </div>

      {/* STEP CONTENT BODY */}
      <main className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center py-3">
        {/* LANGKAH 1: NAMA & AVATAR */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-normal">
            <TextField
              label="Nama Lengkap Anda"
              placeholder="Contoh: Ibu Siti Rahma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              helperText="Gunakan nama yang mudah dikenali kader atau dokter."
              error={fullName.length > 0 && fullName.length < 2 ? 'Nama minimal 2 huruf' : undefined}
              success={fullName.length >= 2}
            />

            <div>
              <div className="text-xs font-bold text-slate-900 mb-2">Pilih Avatar Ceria:</div>
              <AvatarPicker
                selectedId={selectedAvatar}
                onSelect={(id) => {
                  soundSynth.playPop();
                  setSelectedAvatar(id);
                }}
              />
            </div>
          </div>
        )}

        {/* LANGKAH 2: PERAN & KODE UNDANGAN */}
        {step === 2 && (
          <div className="space-y-3.5 animate-in fade-in duration-normal">
            <div className="text-xs font-bold text-slate-900 mb-1">Pilih Peran Anda:</div>

            {/* Role Option 1: Orang Tua */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('parent');
                setCodeError(undefined);
                setCodeSuccess(undefined);
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'parent'
                  ? 'bg-amber-50/80 border-nutri-teal-700 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 fill-amber-600 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">Orang Tua / Wali</div>
                  <div className="text-[11px] text-slate-500">Akses pemantauan gizi buah hati keluarga</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Publik
              </span>
            </div>

            {/* Role Option 2: Kader Posyandu */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('cadre');
                setCodeError(undefined);
                setCodeSuccess(undefined);
                setInviteCode('');
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'cadre'
                  ? 'bg-teal-50/80 border-nutri-teal-700 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">Kader Posyandu</div>
                  <div className="text-[11px] text-slate-500">Skrining &amp; penimbangan balita wilayah</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Perlu Kode
              </span>
            </div>

            {/* Role Option 3: Dokter / Tenaga Medis */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('doctor');
                setCodeError(undefined);
                setCodeSuccess(undefined);
                setInviteCode('');
              }}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'doctor'
                  ? 'bg-cyan-50/80 border-nutri-teal-700 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900">Dokter / Petugas Gizi</div>
                  <div className="text-[11px] text-slate-500">Triase rujukan &amp; intervensi klinis FKTP</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Perlu Kode
              </span>
            </div>

            {/* Kode Undangan Field for Kader or Dokter */}
            {selectedRole !== 'parent' && (
              <div className="pt-2 p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <TextField
                  label={`Kode Undangan ${selectedRole === 'cadre' ? 'Kader' : 'Dokter'}`}
                  placeholder={selectedRole === 'cadre' ? 'Contoh: POSYANDU-2026' : 'Contoh: DOKTER-2026'}
                  value={inviteCode}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setInviteCode(val);
                    handleVerifyCode(val, selectedRole);
                  }}
                  error={codeError}
                  success={Boolean(codeSuccess)}
                  helperText={
                    codeSuccess
                      ? `Terverifikasi untuk: ${codeSuccess}`
                      : `Gunakan kode resmi dari Puskesmas. (Demo: ${
                          selectedRole === 'cadre' ? 'POSYANDU-2026' : 'DOKTER-2026'
                        })`
                  }
                  leftIcon={<ShieldCheck className="w-4 h-4" />}
                />
              </div>
            )}
          </div>
        )}

        {/* LANGKAH 3: DATA DASAR KONTEKSTUAL */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-normal">
            {selectedRole === 'parent' && (
              <>
                <TextField
                  label="Nama Panggilan Balita"
                  placeholder="Contoh: Anisa"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  error={childName.length > 0 && childName.length < 2 ? 'Minimal 2 huruf' : undefined}
                  success={childName.length >= 2}
                />

                <div>
                  <div className="text-xs font-bold text-slate-900 mb-1.5">Jenis Kelamin:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChildGender('L')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        childGender === 'L'
                          ? 'bg-sky-50 border-sky-600 text-sky-800'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      Laki-laki 👦
                    </button>
                    <button
                      type="button"
                      onClick={() => setChildGender('P')}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        childGender === 'P'
                          ? 'bg-rose-50 border-rose-600 text-rose-800'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      Perempuan 👧
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-900">Usia Balita:</span>
                    <span className="text-xs font-extrabold text-teal-800">{childAgeMonths} Bulan</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="59"
                    value={childAgeMonths}
                    onChange={(e) => setChildAgeMonths(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>12 Bulan</span>
                    <span>24-36 Bulan (Kritis)</span>
                    <span>59 Bulan</span>
                  </div>
                </div>
              </>
            )}

            {selectedRole === 'cadre' && (
              <>
                <TextField
                  label="Nama Posyandu Penugasan"
                  value={cadrePosyandu}
                  onChange={(e) => setCadrePosyandu(e.target.value)}
                  helperText="Sesuai SK penugasan dari Puskesmas pembina."
                />
                <TextField
                  label="Wilayah RW / Dusun"
                  value={cadreRw}
                  onChange={(e) => setCadreRw(e.target.value)}
                  placeholder="Contoh: RW 03"
                />
              </>
            )}

            {selectedRole === 'doctor' && (
              <>
                <TextField
                  label="Fasilitas Pelayanan Kesehatan (FKTP)"
                  value={doctorFaskes}
                  onChange={(e) => setDoctorFaskes(e.target.value)}
                  helperText="Puskesmas atau Klinik rujukan stunting."
                />
                <TextField
                  label="Nomor Induk Pegawai (NIP / SIP)"
                  placeholder="Contoh: 198902142015031002"
                  value={doctorNip}
                  onChange={(e) => setDoctorNip(e.target.value)}
                  error={doctorNip.length > 0 && doctorNip.length < 5 ? 'Minimal 5 karakter' : undefined}
                  success={doctorNip.length >= 5}
                />
              </>
            )}
          </div>
        )}
      </main>

      {/* BOTTOM ACTION BUTTON */}
      <footer className="w-full max-w-sm mx-auto pt-4 shrink-0">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={
            step === 1
              ? !isStep1Valid
              : step === 2
              ? !isStep2Valid || isVerifyingCode
              : !isStep3Valid || isSubmitting
          }
          isLoading={isSubmitting}
          onClick={handleNext}
          icon={step === 3 ? <Check className="w-5 h-5 stroke-[2.5]" /> : <ArrowRight className="w-5 h-5" />}
          iconPosition="right"
        >
          {step === 3 ? 'Selesai & Masuk' : 'Lanjut'}
        </Button>
      </footer>
    </div>
  );
};
