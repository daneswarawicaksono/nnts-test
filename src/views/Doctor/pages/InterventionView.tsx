import React, { useState } from 'react';
import { Pill, FileDown } from 'lucide-react';
import { GlassCard } from '../../../design-system/primitives/GlassCard';
import { Button } from '../../../design-system/primitives/Button';

export const InterventionView: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);

  const handleDownloadFHIR = () => {
    const fhirBundle = {
      resourceType: 'Bundle',
      type: 'transaction',
      timestamp: new Date().toISOString(),
      entry: [
        {
          resource: {
            resourceType: 'Observation',
            code: { coding: [{ system: 'http://loinc.org', code: '56072-2', display: 'MUAC' }] },
            valueQuantity: { value: 11.2, unit: 'cm' },
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(fhirBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'satusehat-nnts-bundle.json';
    a.click();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-sm font-bold text-slate-900">Catatan Intervensi & Resep Medis</h2>

      <GlassCard className="p-4 border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Pill className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-bold text-slate-800">Protokol Resep Suplementasi Mikro</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-800">
            <input type="checkbox" defaultChecked className="rounded accent-teal-700" />
            Sirup Besi Elementer (Ferrous Fumarate) 3 mg/kg BB/hari (Durasi: 4 Minggu)
          </label>
          <label className="flex items-center gap-2 font-semibold text-slate-800">
            <input type="checkbox" defaultChecked className="rounded accent-teal-700" />
            Suplementasi Seng Sulfat 10 mg/hari selama 14 hari
          </label>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setIsSaved(true);
              setTimeout(() => setIsSaved(false), 2000);
            }}
          >
            {isSaved ? 'Resep Tersimpan!' : 'Simpan Intervensi Klinis'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<FileDown className="w-4 h-4" />}
            onClick={handleDownloadFHIR}
          >
            Unduh FHIR R4 Bundle (SATUSEHAT)
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
