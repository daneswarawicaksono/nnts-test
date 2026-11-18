import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';
import type { ToddlerRecord } from '../../../services/api/cadreApi';

const MOCK_QUEUE: ToddlerRecord[] = [
  {
    id: 'T-01',
    name: 'Gilang Ramadhan',
    ageMonths: 22,
    gender: 'L',
    parentName: 'Ibu Ratna',
    weightKg: 9.8,
    heightCm: 79.0,
    muacCm: 11.2,
    hasMeasuredToday: true,
    alert: true,
    alertReason: 'Pita Merah (<11.5 cm) — Rujuk ke Puskesmas',
  },
  {
    id: 'T-02',
    name: 'Rian Pratama',
    ageMonths: 28,
    gender: 'L',
    parentName: 'Ibu Dewi',
    weightKg: 11.2,
    heightCm: 86.5,
    muacCm: 12.0,
    hasMeasuredToday: true,
    alert: true,
    alertReason: 'Pita Kuning (12.0 cm) — Waspada Defisiensi Besi',
  },
  {
    id: 'T-03',
    name: 'Zahra Salsabila',
    ageMonths: 34,
    gender: 'P',
    parentName: 'Ibu Halimah',
    weightKg: 13.5,
    heightCm: 94.0,
    muacCm: 13.8,
    hasMeasuredToday: false,
    alert: false,
  },
];

export const QueueView: React.FC = () => {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [toddlers] = useState<ToddlerRecord[]>(MOCK_QUEUE);

  const filtered = toddlers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.parentName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* Search & Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama balita / ibu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-teal-600"
          />
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() => alert('Fitur pendaftaran balita baru dibuka!')}
        >
          Daftar
        </Button>
      </div>

      {/* Queue List */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-700 flex justify-between items-center">
          <span>Antrean Posyandu Hari Ini</span>
          <span className="text-[10px] text-teal-800 font-extrabold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            {toddlers.length} Balita
          </span>
        </div>

        {filtered.map((item) => (
          <GlassCard key={item.id} className="p-3 border-slate-200/90 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">({item.ageMonths} bln)</span>
                {item.hasMeasuredToday ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Selesai
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Belum Diukur
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">Ibu: {item.parentName}</div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              onClick={() => setLocation(`/cadre/weigh?id=${item.id}`)}
            >
              Ukur
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
