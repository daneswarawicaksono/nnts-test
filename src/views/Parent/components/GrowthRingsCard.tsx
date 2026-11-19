import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface GrowthRingsCardProps {
  childName: string;
  ageMonths: number;
}

export const GrowthRingsCard: React.FC<GrowthRingsCardProps> = ({
  childName,
  ageMonths,
}) => {
  const [selectedRing, setSelectedRing] = useState<'all' | 'growth' | 'nutrition' | 'games'>('all');

  // Metric values (0 - 100)
  const growthVal = 92;     // Pita Hijau KMS (Normal)
  const nutritionVal = 78;  // Asupan Gizi Harian (Fe, Zn, B12)
  const gamesVal = 67;      // 2 dari 3 game skrining tuntas

  // SVG ring circumference calculation
  // Radius: Outer=68, Middle=52, Inner=36
  const getCircumference = (r: number) => 2 * Math.PI * r;
  const cOuter = getCircumference(68);
  const cMiddle = getCircumference(52);
  const cInner = getCircumference(36);

  const offsetOuter = cOuter - (growthVal / 100) * cOuter;
  const offsetMiddle = cMiddle - (nutritionVal / 100) * cMiddle;
  const offsetInner = cInner - (gamesVal / 100) * cInner;

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider">
            Pantauan Tumbuh Kembang
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
            Cincin Kesehatan {childName}
          </h3>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#2B8A44] border border-emerald-200">
          {ageMonths} Bulan
        </span>
      </div>

      {/* Main Rings Display */}
      <div className="flex items-center justify-center gap-6 py-1">
        {/* SVG Concentric Rings */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
            {/* Background Tracks */}
            <circle cx="80" cy="80" r="68" stroke="#E5E5E5" strokeWidth="10" fill="none" opacity="0.4" />
            <circle cx="80" cy="80" r="52" stroke="#E5E5E5" strokeWidth="10" fill="none" opacity="0.4" />
            <circle cx="80" cy="80" r="36" stroke="#E5E5E5" strokeWidth="10" fill="none" opacity="0.4" />

            {/* Active Outer Ring (Pertumbuhan - Google Green) */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#34A853"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={cOuter}
              strokeDashoffset={offsetOuter}
              className="transition-all duration-700 ease-out"
              opacity={selectedRing === 'all' || selectedRing === 'growth' ? 1 : 0.25}
            />

            {/* Active Middle Ring (Nutrisi - Orange) */}
            <circle
              cx="80"
              cy="80"
              r="52"
              stroke="#FB923C"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={cMiddle}
              strokeDashoffset={offsetMiddle}
              className="transition-all duration-700 ease-out"
              opacity={selectedRing === 'all' || selectedRing === 'nutrition' ? 1 : 0.25}
            />

            {/* Active Inner Ring (Stimulasi Games - Google Blue) */}
            <circle
              cx="80"
              cy="80"
              r="36"
              stroke="#4285F4"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={cInner}
              strokeDashoffset={offsetInner}
              className="transition-all duration-700 ease-out"
              opacity={selectedRing === 'all' || selectedRing === 'games' ? 1 : 0.25}
            />
          </svg>

          {/* Center Text Indicator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Skor Total</span>
            <span className="text-xl font-black text-slate-900 leading-none">82%</span>
            <span className="text-[9px] font-extrabold text-[#34A853] mt-0.5">Optimal</span>
          </div>
        </div>

        {/* Legend / Interactive Chips */}
        <div className="flex flex-col gap-2 flex-1">
          {/* Chip 1: Pertumbuhan */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setSelectedRing(selectedRing === 'growth' ? 'all' : 'growth');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedRing === 'growth'
                ? 'bg-emerald-50 border-[#34A853] shadow-xs'
                : 'bg-white border-[#E5E5E5] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
                Fisik (TB/BB)
              </span>
              <span className="text-xs font-bold text-[#2B8A44]">{growthVal}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Pita Hijau KMS (Normal)</p>
          </button>

          {/* Chip 2: Nutrisi */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setSelectedRing(selectedRing === 'nutrition' ? 'all' : 'nutrition');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedRing === 'nutrition'
                ? 'bg-orange-50 border-orange-400 shadow-xs'
                : 'bg-white border-[#E5E5E5] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
                Asupan Gizi
              </span>
              <span className="text-xs font-bold text-orange-600">{nutritionVal}%</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Fe & Zn terpenuhi 78%</p>
          </button>

          {/* Chip 3: Game Skrining */}
          <button
            type="button"
            onClick={() => {
              soundSynth.playPop();
              setSelectedRing(selectedRing === 'games' ? 'all' : 'games');
            }}
            className={`p-2 rounded-2xl border text-left transition-all ${
              selectedRing === 'games'
                ? 'bg-blue-50 border-blue-400 shadow-xs'
                : 'bg-white border-[#E5E5E5] hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
                Game Otak
              </span>
              <span className="text-xs font-bold text-blue-600">2/3 Game</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Refleks & Kognitif Cepat</p>
          </button>
        </div>
      </div>

      {/* Dynamic Breakdown Notice */}
      {selectedRing !== 'all' && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2 animate-in fade-in">
          <Info className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
          <div>
            {selectedRing === 'growth' && (
              <p>
                <strong>Tumbuh Kembang Fisik:</strong> Tinggi badan 88.5 cm dan Berat badan 12.4 kg berada tepat di kurva hijau standar WHO 2026.
              </p>
            )}
            {selectedRing === 'nutrition' && (
              <p>
                <strong>Kebutuhan Mikronutrien:</strong> Asupan Zat Besi (Fe) membutuhkan tambahan 1 porsi hati ayam/bayam untuk mencapai 100% hari ini.
              </p>
            )}
            {selectedRing === 'games' && (
              <p>
                <strong>Stimulasi Kognitif:</strong> Si kecil telah menyelesaikan <em>Pulau Balon</em> dan <em>Kebun Buah</em>. Tinggal 1 game <em>Susun Bentuk</em> untuk tuntas!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
