import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api, PRESET_ACCOUNTS } from '../../services/api/client';
import { soundSynth } from '../../services/audio/synth';
import type { AuthSession } from '../../types/role';

export interface LoginViewProps {
  onBack: () => void;
  onSuccess: (session: AuthSession) => void;
  onGoToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onBack,
  onSuccess,
  onGoToRegister,
}) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailOrUsername.trim()) {
      setErrorMessage('Silakan masukkan email atau username');
      return;
    }
    if (!password) {
      setErrorMessage('Silakan masukkan kata sandi');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      soundSynth.playPop();
      const session = await api.login({
        emailOrUsername: emailOrUsername.trim(),
        password,
      });
      soundSynth.playChime();
      onSuccess(session);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (key: 'parent' | 'kader' | 'dokter') => {
    const preset = PRESET_ACCOUNTS[key];
    if (!preset) return;
    setEmailOrUsername(preset.email);
    setPassword('password123');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      soundSynth.playPop();
      const session = await api.login({
        emailOrUsername: preset.email,
        password: 'password123',
      });
      soundSynth.playChime();
      onSuccess(session);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal masuk dengan akun demo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between px-6 py-5 select-none relative overflow-y-auto">
      {/* TOP BAR WITH BACK BUTTON */}
      <div className="w-full flex items-center justify-between pt-1 pb-2">
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onBack();
          }}
          className="p-2 -ml-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Kembali ke halaman utama"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
          otakatik
        </span>
      </div>

      {/* CENTER CONTENT */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center my-auto py-2">
        {/* Kerro Mascot (Waving Pose) */}
        <div className="mb-3 animate-float-breath">
          <img
            src="/mascot/kerro_pose5_wave.png"
            alt="Kerro melambaikan tangan"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-sm"
          />
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight text-center mb-1">
          Welcome back!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 text-center max-w-[280px] mb-6">
          Sign in to continue tracking growth & nutrition.
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Email or Username */}
          <div className="w-full flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">
              Email or username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          {/* Password */}
          <div className="w-full flex flex-col gap-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() =>
                  alert('Untuk reset kata sandi demo, gunakan password default: password123')
                }
                className="text-[11px] font-semibold text-[#2F9E44] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#2F9E44] hover:bg-[#2b8a3e] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>

        {/* DIVIDER OR */}
        <div className="w-full flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400 tracking-wider">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            handleQuickLogin('parent');
          }}
          className="w-full py-3 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* 1-CLICK DEMO PRESETS */}
        <div className="w-full mt-4 pt-3 border-t border-slate-100 flex flex-col items-center">
          <p className="text-[11px] font-semibold text-slate-400 mb-2">
            Masuk Cepat Mode Demo:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('parent')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
            >
              👶 Orang Tua
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('kader')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 font-medium transition-colors"
            >
              🩺 Kader/Bidan
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('dokter')}
              className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 font-medium transition-colors"
            >
              🏥 Dokter FKTP
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER: DON'T HAVE AN ACCOUNT */}
      <div className="w-full text-center py-2 text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={() => {
            soundSynth.playPop();
            onGoToRegister();
          }}
          className="text-[#2F9E44] font-bold hover:underline cursor-pointer"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};
