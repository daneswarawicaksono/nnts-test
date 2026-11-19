import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Calendar, Eye, EyeOff, Heart, Stethoscope, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSynth } from '../../services/audio/synth';
import { api, type RegisterPayload } from '../../services/api/client';
import { ageInMonths } from '../../utils/age';
import type { UserRole, AuthSession } from '../../types/role';

export interface OnboardingViewProps {
  onBackToWelcome: () => void;
  onComplete: (session: AuthSession) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onBackToWelcome,
  onComplete,
}) => {
  // Step 1: Intro 1 (Hi there! I'm Kerro!)
  // Step 2: Intro 2 (Just 3 quick games...)
  // Step 3: Role Selection (Parent / Cadre / Doctor)
  // Step 4: "Kenalan dulu, yuk!" (Nama pengguna, tanpa avatar)
  // Step 5: "About your little one" / Setup akun & kata sandi
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Verification code for cadre / doctor
  const [inviteCode, setInviteCode] = useState('');
  const [codeError, setCodeError] = useState<string | undefined>();
  const [codeSuccess, setCodeSuccess] = useState<string | undefined>();
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Child data for parent
  const [childName, setChildName] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];
  const getDefaultBirthDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 30);
    return d.toISOString().split('T')[0];
  };
  const [childBirthDate, setChildBirthDate] = useState<string>(getDefaultBirthDate);
  const [childGender, setChildGender] = useState<'L' | 'P'>('P');

  const calculatedAgeMonths = childBirthDate ? ageInMonths(childBirthDate, todayStr) : 0;
  const isChildAgeValid = Boolean(childBirthDate) && calculatedAgeMonths >= 24 && calculatedAgeMonths <= 59;

  // Cadre & Doctor data
  const [cadrePosyandu, setCadrePosyandu] = useState('Posyandu Melati 1');
  const [cadreRw, setCadreRw] = useState('RW 03');
  const [doctorFaskes, setDoctorFaskes] = useState('Puskesmas Tegalrejo');
  const [doctorNip, setDoctorNip] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Verification helper for invitation codes
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

  // Step validations
  const isStep4Valid = fullName.trim().length >= 2;
  const isStep5Valid =
    selectedRole === 'parent'
      ? childName.trim().length >= 2 && Boolean(childBirthDate) && isChildAgeValid
      : selectedRole === 'cadre'
      ? cadrePosyandu.trim().length >= 3 && Boolean(codeSuccess)
      : doctorFaskes.trim().length >= 3 && Boolean(codeSuccess);

  const handleNext = () => {
    soundSynth.playPop();
    if (step < 5) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    soundSynth.playPop();
    if (step === 1) {
      onBackToWelcome();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isStep5Valid) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      soundSynth.playPop();
      const generatedUsername =
        fullName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 15) || `user_${Date.now()}`;
      const userEmail = email.trim() || `${generatedUsername}@posyandu.id`;
      const userPassword = password.trim() || 'password123';

      const payload: RegisterPayload = {
        role: selectedRole,
        fullName: fullName.trim(),
        avatarId: 'av-1',
        username: generatedUsername,
        email: userEmail,
        password: userPassword,
        invitationCode: selectedRole !== 'parent' ? inviteCode.trim() : undefined,
        childData:
          selectedRole === 'parent'
            ? {
                childName: childName.trim(),
                birthDate: childBirthDate,
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

      // Inisialisasi profil anak aktif di localStorage untuk dashboard orang tua
      if (selectedRole === 'parent') {
        const initialChild = {
          id: `c-${Date.now()}`,
          subjectId: session.user.childData?.subjectId || `sub-${Date.now()}`,
          birthDate: childBirthDate,
          name: childName.trim(),
          ageMonths: calculatedAgeMonths,
          gender: childGender,
          avatarEmoji: childGender === 'L' ? '👦' : '👧',
          status: 'Belum Ada Skrining',
          hasScreened: false,
          streakCount: 0,
        };
        localStorage.setItem(`nnts_children_${session.user.id}`, JSON.stringify([initialChild]));
      }

      // Confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#2F9E44', '#10B981', '#F59E0B', '#3B82F6'],
          disableForReducedMotion: true,
        });
      } catch {
        // ignore
      }

      soundSynth.playChime();
      onComplete(session);
    } catch (err: any) {
      setSubmitError(err.message || 'Gagal menyelesaikan pendaftaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress Bar for Steps 3, 4, 5
  const renderProgressBar = () => {
    if (step < 3) return null;
    const progressPercent = step === 3 ? 33 : step === 4 ? 66 : 100;
    return (
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-[#2F9E44] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between px-6 py-5 select-none relative overflow-y-auto">
      {/* TOP BAR */}
      <div className="w-full flex items-center justify-between pt-1 pb-1">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          otakatik
        </span>
      </div>

      {renderProgressBar()}

      {/* STEP 1: INTRO 1 (Hi there! I'm Kerro!) */}
      {step === 1 && (
        <div className="w-full max-w-xs mx-auto flex flex-col items-center justify-center my-auto py-4">
          {/* Speech Bubble */}
          <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-3 mb-6 text-center animate-fade-in">
            <span className="text-base sm:text-lg font-bold text-slate-800">
              Hi there! I&apos;m Kerro!
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-b border-r border-slate-200 rotate-45" />
          </div>

          {/* Kerro Waving */}
          <div className="animate-float-breath mb-8">
            <img
              src="/mascot/kerro_pose5_wave.png"
              alt="Kerro melambaikan tangan"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-md"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer"
          >
            CONTINUE
          </button>
        </div>
      )}

      {/* STEP 2: INTRO 2 (Just 3 quick games...) */}
      {step === 2 && (
        <div className="w-full max-w-xs mx-auto flex flex-col items-center justify-center my-auto py-4">
          {/* Speech Bubble */}
          <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl px-5 py-3.5 mb-6 text-center max-w-[270px] animate-fade-in">
            <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
              Just 3 quick games to check your child&apos;s superpowers!
            </span>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white border-b border-r border-slate-200 rotate-45" />
          </div>

          {/* Kerro Winking */}
          <div className="animate-float-breath mb-8">
            <img
              src="/mascot/kerro_pose3_wink.png"
              alt="Kerro mengedipkan mata"
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-md"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer"
          >
            CONTINUE
          </button>
        </div>
      )}

      {/* STEP 3: ROLE SELECTION (Who are you exploring for?) */}
      {step === 3 && (
        <div className="w-full max-w-sm mx-auto flex flex-col justify-between my-auto py-2">
          <div className="flex flex-col gap-3 mb-6">
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">
              Pilih Peran Anda
            </h2>

            {/* Parent Card */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('parent');
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'parent'
                  ? 'border-[#2F9E44] bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Parent / Family</h3>
                  <p className="text-xs text-slate-500">Tracking my child&apos;s healthy growth</p>
                </div>
              </div>
              {selectedRole === 'parent' && (
                <div className="w-6 h-6 rounded-full bg-[#2F9E44] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Cadre Card */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('cadre');
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'cadre'
                  ? 'border-[#2F9E44] bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Posyandu Cadre</h3>
                  <p className="text-xs text-slate-500">Weighing & screening session work</p>
                </div>
              </div>
              {selectedRole === 'cadre' && (
                <div className="w-6 h-6 rounded-full bg-[#2F9E44] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>

            {/* Doctor Card */}
            <div
              onClick={() => {
                soundSynth.playPop();
                setSelectedRole('doctor');
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                selectedRole === 'doctor'
                  ? 'border-[#2F9E44] bg-emerald-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Puskesmas Doctor</h3>
                  <p className="text-xs text-slate-500">Clinical referral & triage decision</p>
                </div>
              </div>
              {selectedRole === 'doctor' && (
                <div className="w-6 h-6 rounded-full bg-[#2F9E44] flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Kerro with speech bubble at bottom right */}
          <div className="flex items-center justify-end gap-3 mb-6">
            <div className="relative bg-white border border-slate-200 shadow-sm rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-700">
              Who are you exploring for?
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-t border-r border-slate-200 rotate-45" />
            </div>
            <img
              src="/mascot/kerro_pose1_smile.png"
              alt="Kerro senyum"
              className="w-12 h-12 object-contain"
            />
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer"
          >
            CONTINUE
          </button>
        </div>
      )}

      {/* STEP 4: "Kenalan dulu, yuk!" (Hanya Nama, Tanpa Avatar) */}
      {step === 4 && (
        <div className="w-full max-w-sm mx-auto flex flex-col justify-between my-auto py-2">
          {/* Top Kerro with speech bubble */}
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/mascot/kerro_pose1_smile.png"
              alt="Kerro senyum"
              className="w-14 h-14 object-contain shrink-0"
            />
            <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl px-4 py-2.5 text-xs text-slate-700 leading-snug">
              Halo! Aku Kero si Katak! Siap temani petualangan sehatmu! 🐸
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-b border-l border-slate-200 rotate-45" />
            </div>
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">
              Kenalan dulu, yuk!
            </h2>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700">
                Siapa namamu?
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nama akun pengguna (hanya huruf dan spasi)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isStep4Valid}
            className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            LANJUTKAN
          </button>
        </div>
      )}

      {/* STEP 5: ABOUT YOUR LITTLE ONE / CREDENTIALS SETUP */}
      {step === 5 && (
        <div className="w-full max-w-sm mx-auto flex flex-col justify-between my-auto py-1">
          {/* Top Kerro with speech bubble */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/mascot/kerro_pose1_smile.png"
              alt="Kerro senyum"
              className="w-12 h-12 object-contain shrink-0"
            />
            <div className="relative bg-white border border-slate-200 shadow-sm rounded-2xl px-3.5 py-2 text-xs text-slate-700 leading-snug">
              Nice to meet you, {fullName || 'Ayah/Bunda'}! Mari lengkapi profil untuk kalibrasi skrining.
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-b border-l border-slate-200 rotate-45" />
            </div>
          </div>

          {submitError && (
            <div className="w-full mb-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{submitError}</span>
            </div>
          )}

          {/* PARENT SPECIFIC FIELDS */}
          {selectedRole === 'parent' ? (
            <div className="flex flex-col gap-3.5 mb-5 text-left">
              <h2 className="text-lg font-extrabold text-slate-900">
                About your little one
              </h2>

              {/* Gender Selector */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    soundSynth.playPop();
                    setChildGender('L');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    childGender === 'L'
                      ? 'border-[#2F9E44] bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">👦</span>
                  <span className="text-xs font-bold text-slate-700">Boy</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundSynth.playPop();
                    setChildGender('P');
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    childGender === 'P'
                      ? 'border-[#2F9E44] bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">👧</span>
                  <span className="text-xs font-bold text-slate-700">Girl</span>
                </button>
              </div>

              {/* Child Name */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700">
                  Siapa nama si kecil?
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Nama si kecil"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Birth Date */}
              <div className="flex flex-col gap-1 text-left">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Tanggal lahir</span>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {calculatedAgeMonths > 0 ? `${calculatedAgeMonths} bulan` : ''}
                  </span>
                </label>
                <div className="relative w-full">
                  <input
                    type="date"
                    max={todayStr}
                    value={childBirthDate}
                    onChange={(e) => setChildBirthDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {!isChildAgeValid && childBirthDate && (
                  <p className="text-[11px] text-amber-600 font-medium">
                    ⚠️ Usia anak harus 24-59 bulan (saat ini {calculatedAgeMonths} bulan).
                  </p>
                )}
              </div>

              {/* Account Credentials */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-800">
                  Atur Akun & Kata Sandi (Opsional)
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email akun (contoh: bunda@gmail.com)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi (default: password123)"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : selectedRole === 'cadre' ? (
            /* CADRE SPECIFIC FIELDS */
            <div className="flex flex-col gap-3.5 mb-5 text-left">
              <h2 className="text-lg font-extrabold text-slate-900">
                Data Posyandu & Verifikasi
              </h2>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nama Posyandu & RW</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cadrePosyandu}
                    onChange={(e) => setCadrePosyandu(e.target.value)}
                    placeholder="Posyandu Melati 1"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                  <input
                    type="text"
                    value={cadreRw}
                    onChange={(e) => setCadreRw(e.target.value)}
                    placeholder="RW 03"
                    className="w-20 px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Kode Undangan Kader</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="KADER-MLT01"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyCode(inviteCode, 'cadre')}
                    disabled={isVerifyingCode}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Verifikasi
                  </button>
                </div>
                {codeSuccess && <p className="text-[11px] text-emerald-600">✅ {codeSuccess}</p>}
                {codeError && <p className="text-[11px] text-rose-600">❌ {codeError}</p>}
                <p className="text-[10px] text-slate-400">Kode demo: KADER-MLT01</p>
              </div>
            </div>
          ) : (
            /* DOCTOR SPECIFIC FIELDS */
            <div className="flex flex-col gap-3.5 mb-5 text-left">
              <h2 className="text-lg font-extrabold text-slate-900">
                Data Fasilitas Kesehatan & SIP
              </h2>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nama Puskesmas/FKTP</label>
                <input
                  type="text"
                  value={doctorFaskes}
                  onChange={(e) => setDoctorFaskes(e.target.value)}
                  placeholder="Puskesmas Tegalrejo"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Nomor SIP / NIP</label>
                <input
                  type="text"
                  value={doctorNip}
                  onChange={(e) => setDoctorNip(e.target.value)}
                  placeholder="19850101 201001 1 001"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700">Kode Undangan Dokter</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="DOKTER-FKTP"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyCode(inviteCode, 'doctor')}
                    disabled={isVerifyingCode}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Verifikasi
                  </button>
                </div>
                {codeSuccess && <p className="text-[11px] text-emerald-600">✅ {codeSuccess}</p>}
                {codeError && <p className="text-[11px] text-rose-600">❌ {codeError}</p>}
                <p className="text-[10px] text-slate-400">Kode demo: DOKTER-FKTP</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!isStep5Valid || isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'LANJUTKAN'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
