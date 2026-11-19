import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bell, BellRing, CheckCircle2 } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

export const PosyanduScheduleCard: React.FC = () => {
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleToggleReminder = () => {
    soundSynth.playChime();
    setIsReminderSet(!isReminderSet);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-3.5 relative overflow-hidden">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-3 left-4 right-4 bg-slate-900 text-white text-xs py-2 px-3.5 rounded-xl shadow-lg flex items-center gap-2 z-20 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
          <span>{isReminderSet ? 'Pengingat Posyandu aktif di kalender!' : 'Pengingat dimatikan.'}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#34A853] flex items-center justify-center border border-emerald-200">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-[#34A853] uppercase tracking-wider">
              Agenda Posyandu
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
              Jadwal Timbang & Vaksin
            </h4>
          </div>
        </div>
        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          ⏳ 5 Hari Lagi
        </span>
      </div>

      {/* Date & Location Details */}
      <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Senin, 24 Nov 2026 • 08:30 - 11:00 WIB</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <span>Posyandu Melati RW 04, Kelurahan Terban</span>
        </div>
      </div>

      {/* Clinical Checklist Pills */}
      <div className="flex flex-wrap gap-1.5 pt-0.5">
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✓ Timbang BB & TB
        </span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
          ✓ Kapsul Vitamin A
        </span>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
          ✓ Imunisasi PCV 3
        </span>
      </div>

      {/* Action Button: Pasang Pengingat */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleToggleReminder}
          className={`w-full py-2.5 px-4 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            isReminderSet
              ? 'bg-slate-100 text-slate-700 border border-slate-300'
              : 'btn-3d-green'
          }`}
        >
          {isReminderSet ? (
            <>
              <BellRing className="w-4 h-4 text-[#34A853]" />
              <span>Pengingat Sudah Terpasang</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Pasang Pengingat Posyandu</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
