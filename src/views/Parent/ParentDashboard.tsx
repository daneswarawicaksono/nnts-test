import React, { useState } from 'react';
import {
  Calendar,
  TrendingUp,
  Plus,
  LogOut,
  ChevronRight,
  User,
  FileText,
  Share2,
  Star,
  Utensils,
  Award,
  Zap,
  Apple,
  Footprints,
  Printer,
} from 'lucide-react';
import { GlassCard } from '../../design-system/primitives/GlassCard';
import { Button } from '../../design-system/primitives/Button';
import { StreakBadge } from '../../design-system/primitives/StreakBadge';
import { ProgressBar } from '../../design-system/primitives/ProgressBar';
import { BottomSheet } from '../../design-system/primitives/BottomSheet';
import { NutriSprout } from '../../design-system/mascot/NutriSprout';
import { GameSessionContainer } from '../Game/GameSessionContainer';
import { PrintableKiaReportModal } from './components/PrintableKiaReportModal';
import { soundSynth } from '../../services/audio/synth';
import { filterNameInput, validateName } from '../../utils/formValidation';
import type { AuthSession } from '../../types/role';

export interface ChildItem {
  id: string;
  name: string;
  ageMonths: number;
  gender: 'L' | 'P';
  avatarEmoji: string;
  status: 'Gizi Optimal' | 'Butuh Pendampingan Besi' | 'Jadwal Timbang Posyandu';
}

export interface ParentDashboardProps {
  session: AuthSession;
  onLogout: () => void;
}

interface RecipeItem {
  title: string;
  nutrients: string;
  time: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
}

const RECIPES_DATA: RecipeItem[] = [
  {
    title: 'Bubur Hati Ayam Bayam Manis',
    nutrients: 'Tinggi Zat Besi & Seng',
    time: '15 Menit',
    emoji: '🥣',
    ingredients: [
      '50 gr hati ayam segar matang (kukus dengan bawang putih)',
      '1 mangkok kecil bubur nasi hangat lembut',
      '1 genggam daun bayam hijau cincang halus rebus',
      '1 sdt minyak kelapa / santan peras murni',
    ],
    steps: [
      'Haluskan hati ayam matang bersama bubur nasi menggunakan saringan kawat halus.',
      'Campurkan bayam rebus cincang ke dalam bubur yang sudah lembut.',
      'Bubuhi 1 sdt minyak kelapa hangat sebagai lemak tambahan padat energi, aduk rata dan sajikan.',
    ],
  },
  {
    title: 'Nugget Ikan Teri Tempe Kukus',
    nutrients: 'Kalsium & Vitamin B12',
    time: '20 Menit',
    emoji: '🐟',
    ingredients: [
      '100 gr tempe kedelai segar, kukus & lumatkan',
      '30 gr teri basah tawar cuci bersih',
      '1 butir telur ayam',
      '1 sdm tepung tapioka',
      '1 siung bawang putih cincang halus',
    ],
    steps: [
      'Campur semua bahan menjadi adonan lembut.',
      'Bentuk adonan menjadi stik bulat memanjang yang pas digenggam balita (finger food).',
      'Kukus selama 15 menit hingga matang padat. Sajikan sebagai lauk pauk atau camilan sehat.',
    ],
  },
  {
    title: 'Puding Pisang Santan Gurih',
    nutrients: 'Kalori Padat Tumbuh Cerdas',
    time: '10 Menit',
    emoji: '🍌',
    ingredients: [
      '1 buah pisang ambon matang harum',
      '60 ml santan kelapa matang hangat',
      '1/2 sdt bubuk agar-agar tanpa pewarna',
      '100 ml air putih hangat',
    ],
    steps: [
      'Lumatkan pisang menggunakan sendok garpu hingga teksturnya menyerupai bubur buah.',
      'Rebus air, santan, dan agar-agar dengan api kecil hingga mulai mendidih perlahan.',
      'Campurkan pisang halus, aduk rata, lalu tuangkan ke wadah cetak kecil. Dinginkan sebelum disajikan.',
    ],
  },
];

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'beranda' | 'pita-kms' | 'dapur'>('beranda');

  // Multi-profile state (managed via BottomSheet)
  const [childrenList, setChildrenList] = useState<ChildItem[]>([
    {
      id: 'c-1',
      name: 'Anisa',
      ageMonths: 30,
      gender: 'P',
      avatarEmoji: '🌱',
      status: 'Gizi Optimal',
    },
    {
      id: 'c-2',
      name: 'Bima',
      ageMonths: 14,
      gender: 'L',
      avatarEmoji: '🍊',
      status: 'Jadwal Timbang Posyandu',
    },
  ]);
  const [activeChildId, setActiveChildId] = useState<string>('c-1');
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState<boolean>(false);
  const [isAddingChild, setIsAddingChild] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState<string>('');
  const [newChildAge, setNewChildAge] = useState<number>(24);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);

  // Modals for family report, recipes, and printable KIA
  const [isFamilyReportOpen, setIsFamilyReportOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);

  const activeChild = childrenList.find((c) => c.id === activeChildId) || childrenList[0];

  if (isGameActive) {
    return (
      <GameSessionContainer
        childId={activeChild.id}
        childName={activeChild.name}
        onExit={() => setIsGameActive(false)}
        onFinishSession={() => {
          setIsGameActive(false);
          setChildrenList((prev) =>
            prev.map((c) =>
              c.id === activeChildId ? { ...c, status: 'Gizi Optimal' } : c
            )
          );
        }}
      />
    );
  }

  const handleAddChild = () => {
    const val = validateName(newChildName);
    if (!val.valid) {
      alert(val.error || 'Nama balita minimal 2 huruf dan tidak boleh mengandung angka.');
      return;
    }
    const newRecord: ChildItem = {
      id: `c-${Date.now()}`,
      name: newChildName.trim(),
      ageMonths: newChildAge,
      gender: 'P',
      avatarEmoji: '🍎',
      status: 'Jadwal Timbang Posyandu',
    };
    setChildrenList((prev) => [...prev, newRecord]);
    setActiveChildId(newRecord.id);
    setNewChildName('');
    setIsAddingChild(false);
    soundSynth.playChime();
  };

  const handleDeleteChild = (id: string) => {
    if (childrenList.length <= 1) {
      alert('Setidaknya harus ada 1 profil anak.');
      return;
    }
    if (confirm('Yakin ingin menghapus profil ini?')) {
      const filtered = childrenList.filter((c) => c.id !== id);
      setChildrenList(filtered);
      if (activeChildId === id) {
        setActiveChildId(filtered[0].id);
      }
    }
  };

  const handleShareToWhatsApp = () => {
    soundSynth.playChime();
    const text = encodeURIComponent(
      `Alhamdulillah, Rapor Gizi & Tumbuh Kembang ${activeChild.name} (${activeChild.ageMonths} Bulan) di Posyandu terpantau sehat dan ceria! Refleks motorik cepat dan asupan pangan lokal seimbang. Pantau bersama NNTS.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  return (
    <div className="w-full h-full min-h-[100dvh] bg-[#F8FAFC] flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* TOP BAR / MULTI-PROFILE SELECTOR (OPSI INTEGRATED BAR) */}
      <header className="px-5 pt-5 pb-3 flex items-center justify-between z-10 shrink-0">
        {/* Child Profile Trigger */}
        <button
          onClick={() => {
            soundSynth.playPop();
            setIsProfileSheetOpen(true);
          }}
          className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/90 shadow-subtle hover:bg-white transition-all text-left group"
          title="Ganti atau tambah profil anak"
        >
          <div className="w-8 h-8 rounded-full bg-nutri-teal-700/10 text-nutri-teal-800 flex items-center justify-center text-sm font-bold border border-nutri-teal-700/20 group-hover:scale-105 transition-transform">
            {activeChild.avatarEmoji}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600 font-bold uppercase tracking-wider leading-none">
              Profil Anak
            </span>
            <span className="text-xs font-extrabold text-slate-900 leading-tight">
              {activeChild.name} ({activeChild.ageMonths} bln)
            </span>
          </div>
        </button>

        {/* Global Streak & User Info */}
        <div className="flex items-center gap-2">
          <StreakBadge count={5} label="Hari" />
          <button
            onClick={() => {
              soundSynth.playPop();
              setIsProfileSheetOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-white/80 border border-slate-200/90 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-subtle"
            title="Pengaturan akun keluarga"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN BODY CONTENT AREA */}
      <main className="flex-1 px-5 py-2 overflow-y-auto z-10 space-y-4">
        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <div className="space-y-4 animate-in fade-in duration-normal">
            {/* IN-CARD CONTEXTUAL ACTION HERO (OPSI B1) */}
            <GlassCard padding="lg" className="border-teal-200/80 bg-white/95 space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">
                    Pantauan Gizi Posyandu
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {activeChild.name} Sehat Ceria!
                  </h2>
                </div>
                <NutriSprout size={64} mood="happy" showShadow={false} />
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 text-xs font-bold text-teal-900 py-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Status: {activeChild.status}</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Kelengkapan Pemantauan Gizi</span>
                  <span>80%</span>
                </div>
                <ProgressBar value={80} variant="teal" />
              </div>

              {/* ACTION BUTTONS (Mulai Game) */}
              <div className="pt-1">
                <Button
                  variant="primary"
                  fullWidth
                  size="md"
                  onClick={() => {
                    soundSynth.playChime();
                    setIsGameActive(true);
                  }}
                >
                  Mulai Pantau Gizi Hari Ini →
                </Button>
              </div>
            </GlassCard>

            {/* KARTU RAPOR GIZI & TUMBUH KEMBANG (VISIBLE DIRECTLY ON BERANDA) */}
            <GlassCard padding="md" className="border-amber-200/90 bg-white/95 space-y-3 shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Rapor Gizi &amp; Tumbuh Kembang</h3>
                    <p className="text-xs text-slate-600 font-medium">{activeChild.name} • {activeChild.ageMonths} Bulan</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Gizi Optimal
                </span>
              </div>

              {/* 3 Domain Telemetry Rows */}
              <div className="space-y-2 divide-y divide-slate-100">
                {/* Fe */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Kecekatan Motorik (Zat Besi)</div>
                      <div className="text-xs text-slate-600 font-medium">Refleks cepat (305 ms)</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  </div>
                </div>

                {/* Zn */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Apple className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Fokus &amp; Atensi (Seng)</div>
                      <div className="text-xs text-slate-600 font-medium">Paham memilah buah segar (85%)</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>

                {/* B12 */}
                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Footprints className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Daya Ingat Spasial (B12)</div>
                      <div className="text-xs text-slate-600 font-medium">Ingat jejak terbalik (Skor 3)</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <Star className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                </div>
              </div>

              {/* Rekomendasi Menu Pangan Lokal Singkat */}
              <div className="pt-2 border-t border-slate-100 text-xs text-teal-950 flex items-start gap-2">
                <Utensils className="w-3.5 h-3.5 text-nutri-teal-700 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  <span className="font-bold">Saran Piring Gizi:</span> Berikan kombinasi hati ayam/telur dan bayam 3x sepekan untuk menjaga cadangan zat besi otak.
                </p>
              </div>

              {/* Action Buttons: Bagikan ke WhatsApp */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FileText className="w-4 h-4 text-nutri-teal-700" />}
                  onClick={() => {
                    soundSynth.playPop();
                    setIsFamilyReportOpen(true);
                  }}
                >
                  Detail Rapor
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  icon={<Share2 className="w-4 h-4" />}
                  onClick={handleShareToWhatsApp}
                >
                  {copiedShareLink ? 'Dibuka!' : 'Bagikan WA'}
                </Button>
              </div>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                icon={<Printer className="w-3.5 h-3.5 text-teal-700" />}
                onClick={() => {
                  soundSynth.playPop();
                  setIsPrintModalOpen(true);
                }}
                className="mt-1.5 text-xs font-bold text-slate-700"
              >
                Cetak Lembar Buku KIA (A5)
              </Button>
            </GlassCard>

            {/* Quick Insights Summary (Flat Layout) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Zat Besi (Fe)</div>
                <div className="text-xs text-emerald-800 font-bold">Cadangan Baik</div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">Jadwal Posyandu</div>
                <div className="text-xs text-slate-700 font-medium">18 Nov 2026</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PITA KMS MODERN (Opsi C2) */}
        {activeTab === 'pita-kms' && (
          <div className="space-y-4 animate-in fade-in duration-normal">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Pita Usia Kartu Menuju Sehat</h2>
              <p className="text-xs text-slate-600">Alur perkembangan gizi balita usia 24–59 bulan</p>
            </div>

            {/* Horizontal Scrollable KMS Timeline Rail (Opsi C2) */}
            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 snap-x">
              {[
                { month: 24, label: 'Lulus Awal', status: 'done', note: 'BB/TB Normal' },
                { month: 30, label: 'Bulan Ini', status: 'current', note: 'Aktif Dipantau' },
                { month: 36, label: '3 Tahun', status: 'upcoming', note: 'Tes Kognitif Lanjutan' },
                { month: 48, label: '4 Tahun', status: 'locked', note: 'Persiapan Masuk PAUD' },
                { month: 59, label: 'Lulus Emas', status: 'locked', note: 'Bebas Stunting' },
              ].map((item) => (
                <div
                  key={item.month}
                  className={`min-w-[140px] p-3.5 rounded-xl border snap-start flex flex-col justify-between shrink-0 ${
                    item.status === 'current'
                      ? 'bg-nutri-teal-700 text-white shadow-md border-nutri-teal-700'
                      : item.status === 'done'
                      ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 opacity-60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase">{item.label}</span>
                    <span className="text-xs font-black">{item.month} bln</span>
                  </div>
                  <div className="text-xs font-semibold leading-tight">{item.note}</div>
                </div>
              ))}
            </div>

            <GlassCard padding="md" className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Catatan Gizi Terakhir:</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Asupan protein nabati dan hewani {activeChild.name} terpantau seimbang. Lanjutkan pemberian telur dan hati ayam 3x seminggu.
              </p>
            </GlassCard>
          </div>
        )}

        {/* TAB 3: DAPUR GIZI LOKAL */}
        {activeTab === 'dapur' && (
          <div className="space-y-3 animate-in fade-in duration-normal">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Dapur Pangan Lokal Ceria</h2>
              <p className="text-xs text-slate-600">Ide menu terjangkau kaya Zat Besi, Seng, &amp; Vitamin B12</p>
            </div>

            {RECIPES_DATA.map((recipe) => (
              <GlassCard
                key={recipe.title}
                variant="interactive"
                padding="sm"
                className="flex items-center justify-between cursor-pointer"
                onClick={() => {
                  soundSynth.playPop();
                  setSelectedRecipe(recipe);
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{recipe.emoji}</span>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900">{recipe.title}</div>
                    <div className="text-[11px] text-teal-700 font-semibold">{recipe.nutrients} • {recipe.time}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </GlassCard>
            ))}
          </div>
        )}
      </main>

      {/* INTEGRATED BOTTOM SEGMENTED RAIL (OPSI A2) */}
      <nav className="w-full bg-white border-t border-slate-200 px-4 py-2 shrink-0 z-20">
        <div className="max-w-sm mx-auto grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setActiveTab('beranda');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'beranda'
                ? 'bg-white text-nutri-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Beranda
          </button>

          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setActiveTab('pita-kms');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'pita-kms'
                ? 'bg-white text-nutri-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pita KMS
          </button>

          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setActiveTab('dapur');
            }}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'dapur'
                ? 'bg-white text-nutri-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dapur Gizi
          </button>
        </div>
      </nav>

      {/* BOTTOM SHEET 1: RAPOR GIZI KELUARGA & BAGIKAN */}
      <BottomSheet
        isOpen={isFamilyReportOpen}
        onClose={() => setIsFamilyReportOpen(false)}
        title={`Rapor Gizi ${activeChild.name}`}
      >
        <div className="space-y-4 text-left">
          {/* Status Header */}
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wide">
                Status Tumbuh Kembang:
              </span>
              <h3 className="text-base font-black text-teal-950 mt-0.5">
                {activeChild.name} Sehat &amp; Tangkas
              </h3>
              <p className="text-[11px] text-teal-700 mt-0.5">
                Usia {activeChild.ageMonths} Bulan • Posyandu Melati 1
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-xs">
              {activeChild.avatarEmoji}
            </div>
          </div>

          {/* 3 Domain Star Ratings */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Pencapaian Motorik &amp; Kognitif Terakhir:
            </span>

            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
              {/* Fe */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Kecekatan Gerak (Zat Besi)</div>
                  <div className="text-[10px] text-slate-500">Respon kilat menangkap balon</div>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>

              {/* Zn */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-900">Fokus &amp; Ketelitian (Seng)</div>
                  <div className="text-[10px] text-slate-500">Paham memilah buah segar &amp; berulat</div>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 text-slate-200" />
                </div>
              </div>

              {/* B12 */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-900">Daya Ingat (Vitamin B12)</div>
                  <div className="text-[10px] text-slate-500">Mampu mengulang jejak hewan terbalik</div>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 fill-amber-400" />
                  <Star className="w-4 h-4 text-slate-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Rekomendasi Piring Gizi */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Utensils className="w-3.5 h-3.5 text-amber-700" />
              <span>Saran Piring Gizi Hari Ini:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kombinasikan hati ayam atau telur rebus dengan sayur bayam dan tempe. Hindari memberi teh/kopi bersamaan dengan makan karena menghambat penyerapan zat besi.
            </p>
          </div>

          {/* Share Action */}
          <div className="pt-2">
            <Button
              variant="primary"
              fullWidth
              size="md"
              icon={<Share2 className="w-4 h-4" />}
              onClick={handleShareToWhatsApp}
            >
              {copiedShareLink ? 'Tautan Terbuka di WhatsApp!' : 'Bagikan Rapor ke WhatsApp Keluarga'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* BOTTOM SHEET 2: DETAIL RESEP PANGAN LOKAL */}
      <BottomSheet
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.title || 'Resep'}
      >
        {selectedRecipe && (
          <div className="space-y-4 text-left">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-teal-900">{selectedRecipe.nutrients}</span>
                <div className="text-[11px] text-teal-700 mt-0.5">Waktu Memasak: {selectedRecipe.time}</div>
              </div>
              <span className="text-3xl">{selectedRecipe.emoji}</span>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Bahan-Bahan Murah &amp; Mudah:</h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-2">Langkah Pembuatan:</h4>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <Button
              variant="secondary"
              fullWidth
              size="sm"
              onClick={() => setSelectedRecipe(null)}
            >
              Tutup Resep
            </Button>
          </div>
        )}
      </BottomSheet>

      {/* BOTTOM SHEET 3: KELOLA MULTI-PROFIL ANAK */}
      <BottomSheet
        isOpen={isProfileSheetOpen}
        onClose={() => {
          setIsProfileSheetOpen(false);
          setIsAddingChild(false);
        }}
        title="Kelola Profil Keluarga"
      >
        <div className="space-y-4 text-left">
          {/* Active User Information */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">{session.user.fullName}</div>
              <div className="text-[11px] text-slate-500">Akun Orang Tua Terdaftar</div>
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-red-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-900">Daftar Buah Hati:</div>

          {/* Children List */}
          <div className="space-y-2">
            {childrenList.map((c) => {
              const isSelected = c.id === activeChildId;
              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-nutri-teal-700 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div
                    onClick={() => {
                      setActiveChildId(c.id);
                      soundSynth.playPop();
                    }}
                    className="flex items-center gap-2.5 cursor-pointer flex-1"
                  >
                    <span className="text-xl">{c.avatarEmoji}</span>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.ageMonths} Bulan • {c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="text-[11px] font-bold text-nutri-teal-700">Aktif</span>
                    ) : (
                      <button
                        onClick={() => handleDeleteChild(c.id)}
                        className="text-[11px] text-slate-400 hover:text-red-500"
                        title="Hapus profil"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Child Toggle Form */}
          {isAddingChild ? (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-slate-900">Tambah Balita Baru</div>
              <input
                type="text"
                placeholder="Nama Balita"
                value={newChildName}
                onChange={(e) => setNewChildName(filterNameInput(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white"
              />
              <span className="text-[10px] text-slate-500 block">Hanya huruf dan spasi (tanpa angka).</span>
              <div className="flex items-center justify-between text-xs">
                <span>Usia: {newChildAge} Bulan</span>
                <input
                  type="range"
                  min="12"
                  max="59"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(Number(e.target.value))}
                  className="w-32 accent-teal-700"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={handleAddChild}>
                  Simpan Balita
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingChild(false)}>
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="secondary"
              fullWidth
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddingChild(true)}
            >
              Tambah Profil Balita Baru
            </Button>
          )}
        </div>
      </BottomSheet>

      {/* MODAL PRINTABLE BUKU KIA A5 */}
      <PrintableKiaReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        childData={{
          name: activeChild.name,
          ageMonths: activeChild.ageMonths,
          gender: activeChild.gender,
          parentName: session.user.fullName || 'Ibu Balita',
          posyandu: 'Posyandu Melati 1',
          faskesName: 'Puskesmas Tegalrejo',
          screenedDate: '08 Nov 2026',
          weightKg: 11.2,
          heightCm: 86.5,
          muacCm: 12.8,
          waz: -0.4,
          haz: -0.2,
          whz: 0.1,
          feStars: 5,
          znStars: 4,
          b12Stars: 4,
          doctorRecommendation:
            'Pertahankan asupan pangan hewani kaya zat besi dan seng. Berikan buah sumber vitamin C alami untuk meningkatkan penyerapan mikronutrien.',
        }}
      />
    </div>
  );
};
