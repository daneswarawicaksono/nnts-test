import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';

export const WorklistView: React.FC = () => {
  const [, setLocation] = useLocation();
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TIER_1' | 'TIER_2'>('ALL');

  return (
    <div className="p-4 space-y-4">
      {/* Header & Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Worklist Triase Rujukan Stunting</h2>
          <p className="text-xs text-slate-500">Puskesmas Tegalrejo - FKTP Pembina</p>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setTierFilter('ALL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
              tierFilter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setTierFilter('TIER_1')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all ${
              tierFilter === 'TIER_1' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Tier-1 Merah
          </button>
        </div>
      </div>

      {/* Patient Referral Cards */}
      <div className="space-y-3">
        <GlassCard className="p-4 border-l-4 border-l-rose-500 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Gilang Ramadhan</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
                Tier-1 Merah (Latent Iron Deficiency)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Posyandu Melati 03 • BB: 9.8 kg • RT: 485 ms • Inhibisi: 65%
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => setLocation('/doctor/cdss/T-01')}
          >
            Analisis CDSS
          </Button>
        </GlassCard>

        <GlassCard className="p-4 border-l-4 border-l-amber-500 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Rian Pratama</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                Tier-2 Kuning (Risiko Seng / B12)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Posyandu Melati 03 • BB: 11.2 kg • RT: 340 ms • Inhibisi: 80%
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => setLocation('/doctor/cdss/T-02')}
          >
            Analisis CDSS
          </Button>
        </GlassCard>
      </div>
    </div>
  );
};
