import React, { useState } from 'react';
import {
  Plus,
  LogOut,
  User,
  Utensils,
  Flame,
} from 'lucide-react';
import { BottomSheet } from '../../design-system/primitives/BottomSheet';
import { GameSessionContainer } from '../Game/GameSessionContainer';
import { soundSynth } from '../../services/audio/synth';
import { ageInMonths } from '../../utils/age';
import type { AuthSession } from '../../types/role';

// New Venmo-Style 3-Tab Components
import { BottomNavVenmo, ParentTabType } from './components/BottomNavVenmo';
import { GrowthRingsCard } from './components/GrowthRingsCard';
import { PosyanduScheduleCard } from './components/PosyanduScheduleCard';
import { KerroDailyQuestCard } from './components/KerroDailyQuestCard';
import { AdventureTrailMap } from './components/AdventureTrailMap';
import { NutritionTrackerCard } from './components/NutritionTrackerCard';
import { DailyIntakeChecklist } from './components/DailyIntakeChecklist';

export interface ChildItem {
  id: string;
  subjectId?: string;
  birthDate?: string;
  name: string;
  ageMonths: number;
  gender: 'L' | 'P';
  avatarEmoji: string;
  status:
    | 'Belum Ada Skrining'
    | 'Gizi Optimal'
    | 'Perlu Pemantauan'
    | 'Perlu Rujukan Puskesmas'
    | 'Butuh Pendampingan Besi'
    | 'Jadwal Timbang Posyandu';
  hasScreened: boolean;
  streakCount: number;
  lastScreeningTier?: string;
  lastEvaluation?: {
    tier: string;
    avgLatency?: number;
    accuracy?: number;
    spanScore?: number;
    summaryFeedback?: string;
  };
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
    nutrients: 'Tinggi Zat Besi & Seng (Anti Anemia)',
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
    nutrients: 'Tinggi Kalsium & Vitamin B12',
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
      'Bentuk adonan menjadi stik memanjang yang pas digenggam balita (finger food).',
      'Kukus selama 15 menit hingga matang padat. Sajikan sebagai lauk pauk atau camilan sehat.',
    ],
  },
  {
    title: 'Puding Pisang Santan Gurih',
    nutrients: 'Kalori Padat Tumbuh Cerdas & Kalium',
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
  const [activeTab, setActiveTab] = useState<ParentTabType>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'game' || tabParam === 'games') return 'game';
    if (tabParam === 'dapur' || tabParam === 'rekomendasi' || tabParam === 'nutrisi') return 'rekomendasi';
    return 'beranda';
  });

  // Multi-profile state
  const [childrenList, setChildrenList] = useState<ChildItem[]>(() => {
    const cacheKey = `nnts_children_${session.user.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }

    if (session.user.childData?.childName) {
      const birthDate = session.user.childData.birthDate;
      const nowISO = new Date().toISOString();
      const calculatedAge = birthDate ? ageInMonths(birthDate, nowISO) : 24;

      return [
        {
          id: `c-${Date.now()}`,
          subjectId: session.user.childData.subjectId,
          birthDate: birthDate,
          name: session.user.childData.childName,
          ageMonths: calculatedAge,
          gender: session.user.childData.gender || 'P',
          avatarEmoji: session.user.childData.gender === 'L' ? '👦' : '👧',
          status: 'Belum Ada Skrining',
          hasScreened: false,
          streakCount: 0,
        },
      ];
    }

    // Default demo profile for parent evaluation
    return [
      {
        id: 'c-demo-1',
        name: 'Althaf Ceria',
        birthDate: '2024-05-19',
        ageMonths: ageInMonths('2024-05-19', new Date().toISOString()),
        gender: 'L',
        avatarEmoji: '👦',
        status: 'Gizi Optimal',
        hasScreened: true,
        streakCount: 4,
      },
      {
        id: 'c-demo-2',
        name: 'Anisa Maharani',
        birthDate: '2023-11-19',
        ageMonths: ageInMonths('2023-11-19', new Date().toISOString()),
        gender: 'P',
        avatarEmoji: '👧',
        status: 'Butuh Pendampingan Besi',
        hasScreened: true,
        streakCount: 2,
      },
    ];
  });

  const [activeChildId, setActiveChildId] = useState<string>(() => childrenList[0]?.id || 'c-demo-1');
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState<boolean>(false);
  const [isAddingChild, setIsAddingChild] = useState<boolean>(false);
  const [newChildName, setNewChildName] = useState<string>('');
  const [newChildAge, setNewChildAge] = useState<number>(30);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [bonusIntake, setBonusIntake] = useState<boolean>(false);

  // Modals for family report & recipes
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);

  // Simpan ke local storage setiap childrenList berubah
  React.useEffect(() => {
    localStorage.setItem(`nnts_children_${session.user.id}`, JSON.stringify(childrenList));
  }, [childrenList, session.user.id]);

  const activeChild = childrenList.find((c) => c.id === activeChildId) || childrenList[0];

  // Game full-screen view handler
  if (isGameActive) {
    return (
      <GameSessionContainer
        childId={activeChild.id}
        childName={activeChild.name}
        subjectId={activeChild.subjectId}
        birthDate={activeChild.birthDate}
        gender={activeChild.gender}
        onExit={() => setIsGameActive(false)}
        onFinishSession={(evaluation) => {
          setIsGameActive(false);

          let newStatus: ChildItem['status'] = 'Gizi Optimal';
          if (evaluation?.tier === 'Tier-1 Alert') {
            newStatus = 'Perlu Rujukan Puskesmas';
          } else if (evaluation?.tier === 'Tier-2 Alert') {
            newStatus = 'Perlu Pemantauan';
          } else if (evaluation?.tier === 'Normal') {
            newStatus = 'Gizi Optimal';
          }

          setChildrenList((prev) =>
            prev.map((c) =>
              c.id === activeChildId
                ? {
                    ...c,
                    status: newStatus,
                    hasScreened: true,
                    streakCount: (c.streakCount || 0) + 1,
                    lastScreeningTier: evaluation?.tier,
                    lastEvaluation: evaluation
                      ? {
                          tier: evaluation.tier,
                          summaryFeedback: evaluation.summaryFeedback,
                          avgLatency:
                            evaluation.reactionTimeTrials && evaluation.reactionTimeTrials.length > 0
                              ? Math.round(
                                  evaluation.reactionTimeTrials.reduce((a: number, b: number) => a + b, 0) /
                                    evaluation.reactionTimeTrials.length
                                )
                              : undefined,
                          accuracy: evaluation.goNoGoAccuracy,
                          spanScore: evaluation.memorySpanScore,
                        }
                      : undefined,
                  }
                : c
            )
          );
          soundSynth.playChime();
        }}
      />
    );
  }

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    const newRecord: ChildItem = {
      id: `c-${Date.now()}`,
      name: newChildName.trim(),
      ageMonths: newChildAge,
      gender: 'L',
      avatarEmoji: '👦',
      status: 'Belum Ada Skrining',
      hasScreened: false,
      streakCount: 0,
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

  return (
    <div className="w-full h-full min-h-[100dvh] bg-white flex flex-col justify-between font-sans select-none relative overflow-hidden">
      {/* TOP HEADER: CHILD PROFILE CHIP & STREAK */}
      <header className="px-5 pt-4 pb-3 flex items-center justify-between z-10 shrink-0 border-b border-[#E5E5E5] bg-white">
        {/* Child Profile Trigger */}
        <button
          onClick={() => {
            soundSynth.playPop();
            setIsProfileSheetOpen(true);
          }}
          className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-50 border border-[#E5E5E5] hover:bg-slate-100 transition-all text-left"
          title="Ganti atau tambah profil anak"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2B8A44] flex items-center justify-center text-sm font-bold border border-emerald-300">
            {activeChild.avatarEmoji}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none">
              Profil Balita
            </span>
            <span className="text-xs font-black text-slate-900 leading-tight">
              {activeChild.name} ({activeChild.ageMonths} bln)
            </span>
          </div>
        </button>

        {/* Global Streak & Settings */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{activeChild.streakCount} Hari</span>
          </div>
          <button
            onClick={() => {
              soundSynth.playPop();
              setIsProfileSheetOpen(true);
            }}
            className="w-8 h-8 rounded-full bg-slate-50 border border-[#E5E5E5] text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-xs"
            title="Kelola profil keluarga"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN BODY CONTENT AREA (SCROLLABLE) */}
      <main className="flex-1 px-4 py-4 overflow-y-auto z-10 space-y-4 pb-20">
        {/* ========================================= */}
        {/* TAB 1: BERANDA / HOME DASHBOARD           */}
        {/* ========================================= */}
        {activeTab === 'beranda' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* 0. Hero Status & Rapor Skrining Anak */}
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider">
                    Pantauan Gizi Posyandu
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">
                    {activeChild.status === 'Gizi Optimal'
                      ? `${activeChild.name} Sehat Ceria!`
                      : `Pantauan Gizi ${activeChild.name}`}
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    activeChild.status === 'Gizi Optimal'
                      ? 'bg-emerald-50 text-[#2B8A44] border-emerald-200'
                      : activeChild.status === 'Perlu Pemantauan'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : activeChild.status === 'Perlu Rujukan Puskesmas'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {activeChild.status}
                </span>
              </div>

              {/* Rapor Angka Riil */}
              {activeChild.hasScreened && activeChild.lastEvaluation ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl">
                      <div className="text-slate-400 text-[10px] font-bold">Reaksi (Fe)</div>
                      <div className="font-black text-slate-900 text-xs mt-0.5">
                        {activeChild.lastEvaluation.avgLatency ? `${activeChild.lastEvaluation.avgLatency} ms` : '-'}
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl">
                      <div className="text-slate-400 text-[10px] font-bold">Fokus (Zn)</div>
                      <div className="font-black text-slate-900 text-xs mt-0.5">
                        {activeChild.lastEvaluation.accuracy != null ? `${activeChild.lastEvaluation.accuracy}%` : '-'}
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-2xl">
                      <div className="text-slate-400 text-[10px] font-bold">Memori (B12)</div>
                      <div className="font-black text-slate-900 text-xs mt-0.5">
                        {activeChild.lastEvaluation.spanScore != null ? `Skor ${activeChild.lastEvaluation.spanScore}` : '-'}
                      </div>
                    </div>
                  </div>
                  {activeChild.lastEvaluation.summaryFeedback && (
                    <p className="text-xs text-slate-600 bg-emerald-50/60 border border-emerald-200/50 p-2.5 rounded-xl">
                      {activeChild.lastEvaluation.summaryFeedback}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-1.5">
                  <p className="text-xs font-bold text-slate-500">Belum ada data skrining</p>
                  <p className="text-[11px] text-slate-400">
                    Selesaikan petualangan game untuk mendeteksi dini risiko defisiensi gizi si kecil.
                  </p>
                </div>
              )}
            </div>

            {/* 1. Growth Rings Component (Revolut/Apple Health style) */}
            <GrowthRingsCard
              childName={activeChild.name}
              ageMonths={activeChild.ageMonths}
            />

            {/* 2. Jadwal & Pengingat Posyandu */}
            <PosyanduScheduleCard />

            {/* 3. Kerro Mascot Daily Quest */}
            <KerroDailyQuestCard
              onStartGame={() => {
                setActiveTab('game');
              }}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 2: GAME HUB / PETUALANGAN KERRO      */}
        {/* ========================================= */}
        {activeTab === 'game' && (
          <div className="animate-in fade-in duration-150">
            <AdventureTrailMap
              childName={activeChild.name}
              onLaunchGame={() => {
                setIsGameActive(true);
              }}
            />
          </div>
        )}

        {/* ========================================= */}
        {/* TAB 3: REKOMENDASI MAKAN & DAPUR GIZI    */}
        {/* ========================================= */}
        {activeTab === 'rekomendasi' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* 1. Nutrition Micronutrients Tracker (Quicken style) */}
            <NutritionTrackerCard bonusIntake={bonusIntake} />

            {/* 2. Daily Meals Checklist (Updates bars dynamically) */}
            <DailyIntakeChecklist
              bonusIntake={bonusIntake}
              onToggleBonus={(active) => setBonusIntake(active)}
            />

            {/* 3. Recommended Recipes for Stunting Prevention */}
            <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider">
                    Dapur Gizi Anti-Stunting
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                    Resep Pangan Lokal Bergizi
                  </h4>
                </div>
                <Utensils className="w-4 h-4 text-[#34A853]" />
              </div>

              <div className="space-y-2.5">
                {RECIPES_DATA.map((recipe, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      soundSynth.playPop();
                      setSelectedRecipe(recipe);
                    }}
                    className="p-3.5 rounded-2xl border border-[#E5E5E5] bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-all hover:border-[#34A853]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
                        {recipe.emoji}
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-slate-900 leading-tight">
                          {recipe.title}
                        </h5>
                        <p className="text-[11px] font-bold text-[#2B8A44] mt-0.5">
                          {recipe.nutrients}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-400 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                      {recipe.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================= */}
      {/* VENMO-STYLE SOLID BOTTOM NAVIGATION BAR   */}
      {/* ========================================= */}
      <BottomNavVenmo
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
      />

      {/* ========================================= */}
      {/* BOTTOM SHEET 1: DETAIL RESEP MAKANAN     */}
      {/* ========================================= */}
      <BottomSheet
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        title={selectedRecipe?.title || 'Resep'}
      >
        {selectedRecipe && (
          <div className="space-y-4 text-left">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#2B8A44] uppercase tracking-wider">
                  Nutrisi Unggulan
                </span>
                <p className="text-xs font-black text-slate-900 mt-0.5">
                  {selectedRecipe.nutrients}
                </p>
              </div>
              <span className="text-2xl">{selectedRecipe.emoji}</span>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-2">Bahan-Bahan Utama:</h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                {selectedRecipe.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-slate-900 mb-2">Langkah Memasak:</h4>
              <ol className="text-xs text-slate-600 space-y-2 list-decimal pl-4">
                {selectedRecipe.steps.map((step, i) => (
                  <li key={i} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setSelectedRecipe(null)}
              className="w-full py-2.5 rounded-xl btn-3d-white text-xs"
            >
              Tutup Resep
            </button>
          </div>
        )}
      </BottomSheet>

      {/* ========================================= */}
      {/* BOTTOM SHEET 2: KELOLA MULTI-PROFIL ANAK  */}
      {/* ========================================= */}
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
          <div className="p-3 bg-slate-50 rounded-2xl border border-[#E5E5E5] flex items-center justify-between">
            <div>
              <div className="text-xs font-black text-slate-900">{session.user.fullName}</div>
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

          <div className="text-xs font-extrabold text-slate-900">Daftar Buah Hati:</div>

          {/* Children List */}
          <div className="space-y-2">
            {childrenList.map((c) => {
              const isSelected = c.id === activeChildId;
              return (
                <div
                  key={c.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-50 border-[#34A853] shadow-xs'
                      : 'bg-white border-[#E5E5E5]'
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
                      <div className="text-xs font-extrabold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {c.ageMonths} Bulan • {c.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <span className="text-[11px] font-black text-[#2B8A44]">Aktif</span>
                    ) : (
                      <button
                        onClick={() => handleDeleteChild(c.id)}
                        className="text-[11px] text-slate-400 hover:text-red-500 font-bold"
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

          {/* Add New Child Form */}
          {isAddingChild ? (
            <div className="p-3.5 bg-slate-50 border border-[#E5E5E5] rounded-2xl space-y-3">
              <div className="text-xs font-black text-slate-900">Tambah Balita Baru</div>
              <input
                type="text"
                placeholder="Nama Balita"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#E5E5E5] bg-white font-bold"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Usia: {newChildAge} Bulan</span>
                <input
                  type="range"
                  min="12"
                  max="59"
                  value={newChildAge}
                  onChange={(e) => setNewChildAge(Number(e.target.value))}
                  className="w-32 accent-[#34A853]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="flex-1 py-2 rounded-xl btn-3d-green text-xs"
                >
                  Simpan Balita
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingChild(false)}
                  className="py-2 px-3 rounded-xl btn-3d-white text-xs"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingChild(true)}
              className="w-full py-2.5 rounded-xl btn-3d-white text-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#34A853]" />
              <span>Tambah Profil Balita Baru</span>
            </button>
          )}
        </div>
      </BottomSheet>
    </div>
  );
};
