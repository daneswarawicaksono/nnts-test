import React, { useState } from 'react';
import {
  Button,
  TextField,
  GlassCard,
  BottomSheet,
  Stepper,
  AvatarPicker,
  ProgressBar,
  StreakBadge,
  SpeechBubble,
  Skeleton,
  EmptyState,
  ErrorState,
  AccessDenied,
} from '../../design-system/primitives';
import { NutriSprout, type NutriSproutMood } from '../../design-system/mascot/NutriSprout';
import { Sparkles } from 'lucide-react';

export const ComponentShowcase: React.FC = () => {
  // Interactive state demos
  const [mascotMood, setMascotMood] = useState<NutriSproutMood>('calm');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState('av-1');
  const [progressVal, setProgressVal] = useState(65);
  const [inputText, setInputText] = useState('');
  const [simulateReducedTrans, setSimulateReducedTrans] = useState(false);

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 font-sans ${
        simulateReducedTrans ? '[&_.glass-card]:!bg-white [&_.glass-card]:!backdrop-filter-none' : ''
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-10">
        {/* DEV BANNER */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold">DEV ONLY ROUTE (/dev?dev=1)</span>
            <span className="text-amber-700 hidden sm:inline">• Halaman Demo &amp; Inspeksi Komponen Dasar NNTS v2</span>
          </div>
          <button
            onClick={() => setSimulateReducedTrans(!simulateReducedTrans)}
            className="px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200 text-[11px] font-bold"
          >
            {simulateReducedTrans ? 'Matikan Fallback Transparansi' : 'Simulasi Reduced-Transparency'}
          </button>
        </div>

        {/* 1. TOKENS: COLOR PALETTE */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">1. Color Palette Tokens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs">
              <div className="h-10 rounded bg-[#0F766E] mb-2" />
              <div className="text-xs font-bold">Teal 700 (Primary CTA)</div>
              <div className="text-[10px] text-slate-500">#0F766E (WCAG AA 4.9:1)</div>
            </div>
            <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs">
              <div className="h-10 rounded bg-[#0D9488] mb-2" />
              <div className="text-xs font-bold">Teal 600 (Brand Base)</div>
              <div className="text-[10px] text-slate-500">#0D9488</div>
            </div>
            <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs">
              <div className="h-10 rounded bg-[#F97316] mb-2" />
              <div className="text-xs font-bold">Orange 500 (Streak)</div>
              <div className="text-[10px] text-slate-500">#F97316</div>
            </div>
            <div className="p-3 rounded-md bg-white border border-slate-200 shadow-xs">
              <div className="h-10 rounded bg-[#0F172A] mb-2" />
              <div className="text-xs font-bold text-slate-900">Slate 900 (Main Text)</div>
              <div className="text-[10px] text-slate-500">#0F172A (WCAG AAA 16:1)</div>
            </div>
          </div>
        </section>

        {/* 2. MASCOT NUTRISPROUT */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">2. Maskot Orisinal SVG: NutriSprout (Timi)</h2>
          <GlassCard className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6">
            <div className="text-center">
              <NutriSprout
                size={130}
                mood={mascotMood}
                onClick={() => {
                  setMascotMood((m) => (m === 'calm' ? 'happy' : m === 'happy' ? 'curious' : 'calm'));
                }}
              />
              <p className="text-[11px] text-slate-500 mt-2">Klik maskot untuk ganti ekspresi ({mascotMood})</p>
            </div>
            <div className="space-y-2 max-w-xs text-left">
              <SpeechBubble
                message="Halo! Aku Timi, tunas nutrisi pendamping tumbuh kembang si kecil!"
                onDismiss={() => alert('Pesan ditutup')}
              />
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="secondary" onClick={() => setMascotMood('calm')}>Tenang</Button>
                <Button size="sm" variant="secondary" onClick={() => setMascotMood('happy')}>Gembira</Button>
                <Button size="sm" variant="secondary" onClick={() => setMascotMood('curious')}>Penasaran</Button>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* 3. BUTTONS (TACTILE SPRING) */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">3. Tactile Spring Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Tombol Utama</Button>
            <Button variant="warm" icon={<Sparkles className="w-4 h-4" />}>Aksen Hangat</Button>
            <Button variant="secondary">Sekunder</Button>
            <Button variant="ghost">Teks Ghost</Button>
            <Button variant="primary" isLoading>Memuat</Button>
            <Button variant="primary" disabled>Dinonaktifkan</Button>
          </div>
        </section>

        {/* 4. TEXT FIELDS */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">4. TextFields dengan Validasi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Nama Lengkap Balita"
              placeholder="Contoh: Anisa"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              helperText="Masukkan nama panggilan anak."
            />
            <TextField
              label="Nomor Induk Kependudukan (NIK)"
              placeholder="16 digit angka"
              error={inputText.length > 0 && inputText.length < 16 ? 'NIK harus 16 digit' : undefined}
              success={inputText.length === 16}
            />
          </div>
        </section>

        {/* 5. STEPPER & AVATAR PICKER */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">5. Stepper &amp; AvatarPicker</h2>
          <GlassCard className="space-y-6">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stepper (Langkah {currentStep} dari 3):</div>
              <Stepper
                steps={['Profil', 'Peran', 'Wilayah']}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Pilih Avatar Ceria:</div>
              <AvatarPicker selectedId={selectedAvatar} onSelect={setSelectedAvatar} />
            </div>
          </GlassCard>
        </section>

        {/* 6. PROGRESS BAR & STREAK BADGE */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">6. Progress &amp; Streak</h2>
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">Progres Skrining:</span>
              <StreakBadge count={7} />
            </div>
            <ProgressBar value={progressVal} showLabel />
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => setProgressVal(Math.max(0, progressVal - 15))}>-15%</Button>
              <Button size="sm" variant="secondary" onClick={() => setProgressVal(Math.min(100, progressVal + 15))}>+15%</Button>
            </div>
          </GlassCard>
        </section>

        {/* 7. BOTTOM SHEET MODAL */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">7. Bottom Sheet Modal</h2>
          <Button variant="secondary" onClick={() => setIsSheetOpen(true)}>
            Buka Bottom Sheet Contoh
          </Button>

          <BottomSheet
            isOpen={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            title="Kelola Profil Anak"
          >
            <div className="space-y-3 text-left">
              <p className="text-xs text-slate-600">
                Pilih profil anak yang ingin dipantau atau daftarkan adik balita baru:
              </p>
              <div className="p-3 rounded-lg border border-teal-200 bg-teal-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Anisa (32 Bulan)</div>
                  <div className="text-[11px] text-slate-500">Posyandu Melati 1</div>
                </div>
                <span className="text-xs font-bold text-teal-800">Aktif</span>
              </div>
              <Button fullWidth variant="primary" size="sm" onClick={() => setIsSheetOpen(false)}>
                Tutup Lembar
              </Button>
            </div>
          </BottomSheet>
        </section>

        {/* 8. SKELETON, EMPTY STATE, & ERROR STATE */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">8. Skeleton &amp; Feedback States</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <GlassCard>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton variant="circular" width={36} height={36} />
                  <div className="flex-1 space-y-1">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={48} />
              </div>
            </GlassCard>

            <GlassCard padding="sm">
              <EmptyState
                title="Belum Ada Balita"
                description="Daftarkan balita pertama untuk memulai pemantauan."
                actionLabel="Tambah Balita"
                onAction={() => alert('Tambah balita')}
              />
            </GlassCard>

            <GlassCard padding="sm">
              <ErrorState
                title="Koneksi Terputus"
                message="Gagal memuat daftar anak dari server."
                onRetry={() => alert('Mencoba lagi')}
              />
            </GlassCard>
          </div>
        </section>

        {/* 9. ACCESS DENIED (FRIENDLY 403) */}
        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-1">9. Friendly Access Denied (403 State)</h2>
          <GlassCard>
            <AccessDenied onBack={() => alert('Kembali')} />
          </GlassCard>
        </section>
      </div>
    </div>
  );
};
