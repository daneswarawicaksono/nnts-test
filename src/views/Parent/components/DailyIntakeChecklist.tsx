import React from 'react';
import { Check } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface DailyIntakeChecklistProps {
  bonusIntake: boolean;
  onToggleBonus: (active: boolean) => void;
}

export const DailyIntakeChecklist: React.FC<DailyIntakeChecklistProps> = ({
  bonusIntake,
  onToggleBonus,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider">
            Checklist Harian
          </span>
          <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
            Pencatatan Porsi Makan Si Kecil
          </h4>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Hari Ini
        </span>
      </div>

      <div className="space-y-2">
        {/* Item 1: Sarapan */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#2B8A44] flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Sarapan Pagi (07:30)</div>
              <div className="text-[11px] text-slate-500">Telur orak-arik + nasi tim sayur</div>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            +30% Gizi
          </span>
        </div>

        {/* Item 2: Camilan Buah */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#2B8A44] flex items-center justify-center text-xs font-bold">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Snack Siang (10:00)</div>
              <div className="text-[11px] text-slate-500">Potongan pisang + santan murni</div>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            +20% Energi
          </span>
        </div>

        {/* Item 3: Makan Siang (Interactive Toggle) */}
        <div
          onClick={() => {
            soundSynth.playPop();
            onToggleBonus(!bonusIntake);
          }}
          className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
            bonusIntake
              ? 'bg-emerald-50 border-[#34A853] shadow-xs'
              : 'bg-white border-[#E5E5E5] hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                bonusIntake
                  ? 'bg-[#34A853] text-white shadow-[0_2px_0_#2B8A44]'
                  : 'border border-slate-300 text-transparent'
              }`}
            >
              {bonusIntake && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">Makan Siang: Hati Ayam & Bayam</div>
              <div className="text-[11px] text-slate-500">
                {bonusIntake ? 'Sudah dikonsumsi (Zat Besi bertambah!)' : 'Ketuk untuk tandai sudah dimakan'}
              </div>
            </div>
          </div>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              bonusIntake
                ? 'text-[#2B8A44] bg-emerald-100'
                : 'text-amber-700 bg-amber-50 border border-amber-200'
            }`}
          >
            +Zat Besi & Seng
          </span>
        </div>
      </div>
    </div>
  );
};
