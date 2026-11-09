import React from 'react';
import { Printer, Share2, X, Star, ShieldCheck, QrCode } from 'lucide-react';
import { Button } from '../../../design-system/primitives/Button';
import { soundSynth } from '../../../services/audio/synth';

export interface PrintableKiaReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  childData: {
    name: string;
    ageMonths: number;
    gender: 'L' | 'P';
    parentName: string;
    posyandu: string;
    faskesName: string;
    screenedDate: string;
    weightKg: number;
    heightCm: number;
    muacCm: number;
    waz: number;
    haz: number;
    whz: number;
    feStars: number;
    znStars: number;
    b12Stars: number;
    doctorRecommendation: string;
  };
}

export const PrintableKiaReportModal: React.FC<PrintableKiaReportModalProps> = ({
  isOpen,
  onClose,
  childData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundSynth.playChime();
    window.print();
  };

  const handleShareWa = () => {
    soundSynth.playPop();
    const text = encodeURIComponent(
      `*RAPOR TUMBUH KEMBANG & GIZI BALITA (NNTS)*\n` +
      `Faskes: ${childData.faskesName} - ${childData.posyandu}\n` +
      `Tanggal: ${childData.screenedDate}\n\n` +
      `*Nama Balita:* ${childData.name} (${childData.ageMonths} Bulan)\n` +
      `*Orang Tua:* ${childData.parentName}\n\n` +
      `*HASIL ANTROPOMETRI:*\n` +
      `• Berat Badan: ${childData.weightKg} kg (WAZ: ${childData.waz})\n` +
      `• Tinggi Badan: ${childData.heightCm} cm (HAZ: ${childData.haz})\n` +
      `• Lingkar Lengan (LiLA): ${childData.muacCm} cm (${childData.muacCm >= 12.5 ? 'Hijau/Normal' : childData.muacCm >= 11.5 ? 'Kuning/Waspada' : 'Merah/Wasting'})\n\n` +
      `*CAPAIAN NEUROKOGNITIF:*\n` +
      `• Zat Besi (Kecepatan & Atensi): ${'⭐'.repeat(childData.feStars)}\n` +
      `• Seng (Fokus & Inhibisi): ${'⭐'.repeat(childData.znStars)}\n` +
      `• Vitamin B12 (Daya Ingat): ${'⭐'.repeat(childData.b12Stars)}\n\n` +
      `*Saran Dokter/Puskesmas:*\n` +
      `${childData.doctorRecommendation}\n\n` +
      `_Tersimpan pada rekam medis digital SATUSEHAT._`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-0.5 text-amber-500">
      {[1, 2, 3, 4, 5].map((idx) => (
        <Star
          key={idx}
          className={`w-3.5 h-3.5 ${
            idx <= count ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-fast">
      {/* Modal Card Container */}
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Bar (Screen Only) */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Rapor Tumbuh Kembang Format Buku KIA (A5)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-200/80 flex items-center justify-center transition-colors cursor-pointer min-h-[44px] min-w-[44px] active:scale-95"
            aria-label="Tutup pratinjau cetak"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* PRINTABLE A5 CANVAS AREA */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-slate-100 flex justify-center">
          <div
            id="printable-kia-sheet"
            className="w-full max-w-[500px] bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-900 font-sans space-y-4 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none"
          >
            {/* Header Kementerian / Puskesmas */}
            <div className="border-b-2 border-slate-800 pb-3 flex items-start justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-wider block">
                  KEMENTERIAN KESEHATAN RI • SATUSEHAT
                </span>
                <h1 className="text-base font-black tracking-tight text-slate-900 uppercase">
                  LEMBAR PANTAU TUMBUH KEMBANG &amp; GIZI
                </h1>
                <p className="text-[11px] text-slate-600">
                  {childData.faskesName} • {childData.posyandu}
                </p>
              </div>

              {/* Verified Badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-[10px] font-black font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>TERVALIDASI</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">
                  Tgl: {childData.screenedDate}
                </span>
              </div>
            </div>

            {/* Toddler Identity Table */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Nama Lengkap Balita:</span>
                <span className="font-extrabold text-slate-900">{childData.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Usia &amp; Jenis Kelamin:</span>
                <span className="font-bold text-slate-800">
                  {childData.ageMonths} Bulan ({childData.gender === 'L' ? 'Laki-laki' : 'Perempuan'})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Nama Ibu / Orang Tua:</span>
                <span className="font-bold text-slate-800">{childData.parentName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block">Status Pita LiLA:</span>
                <span className="font-black text-emerald-700">
                  {childData.muacCm >= 12.5 ? 'Hijau (Normal)' : childData.muacCm >= 11.5 ? 'Kuning (Waspada)' : 'Merah (Wasting)'}
                </span>
              </div>
            </div>

            {/* Anthropometry Somatic Measurements */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                1. Pengukuran Antropometri
              </span>
              <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] text-left">
                  <tr>
                    <th className="p-2">Indikator</th>
                    <th className="p-2">Hasil Ukur</th>
                    <th className="p-2">Z-Score (SD)</th>
                    <th className="p-2">Kategori WHO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  <tr>
                    <td className="p-2 font-medium">Berat Badan (BB)</td>
                    <td className="p-2 font-mono font-bold">{childData.weightKg} kg</td>
                    <td className="p-2 font-mono">{childData.waz}</td>
                    <td className="p-2 font-medium text-emerald-700">Gizi Baik</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Tinggi Badan (TB)</td>
                    <td className="p-2 font-mono font-bold">{childData.heightCm} cm</td>
                    <td className="p-2 font-mono">{childData.haz}</td>
                    <td className="p-2 font-medium text-emerald-700">Normal</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Lingkar Lengan (LiLA)</td>
                    <td className="p-2 font-mono font-bold">{childData.muacCm} cm</td>
                    <td className="p-2 font-mono">{childData.whz}</td>
                    <td className="p-2 font-medium text-emerald-700">Otot Optimal</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Neurocognitive 3 Domains */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                2. Capaian Neurokognitif &amp; Mikronutrien
              </span>
              <div className="border border-slate-200 rounded-xl p-2.5 space-y-2 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Zat Besi (Fe) : Kecepatan &amp; Atensi</span>
                    <span className="text-[10px] text-slate-500">Transmisi motorik dan kesiagaan visual</span>
                  </div>
                  {renderStars(childData.feStars)}
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Seng (Zn) : Fokus &amp; Kontrol Inhibisi</span>
                    <span className="text-[10px] text-slate-500">Kemampuan menahan impuls dan memilah objek</span>
                  </div>
                  {renderStars(childData.znStars)}
                </div>

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                  <div>
                    <span className="font-bold text-slate-900 block">Vitamin B12 : Daya Ingat Kerja</span>
                    <span className="text-[10px] text-slate-500">Penyimpanan urutan informasi dan plastisitas saraf</span>
                  </div>
                  {renderStars(childData.b12Stars)}
                </div>
              </div>
            </div>

            {/* Clinical Advice Box */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                3. Saran Dokter &amp; Rekomendasi Pangan Lokal:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                {childData.doctorRecommendation}
              </p>
            </div>

            {/* Verification QR & Signature Line */}
            <div className="pt-2 border-t border-slate-200 flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                  <QrCode className="w-9 h-9 text-slate-700" />
                </div>
                <div className="text-[9px] text-slate-500 leading-tight">
                  <span>Pindai QR untuk verifikasi</span><br />
                  <span>Sistem NNTS SATUSEHAT</span>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="text-[10px] text-slate-500 block">Pemeriksa:</span>
                <div className="w-32 border-b border-slate-400 mt-6 mb-1" />
                <span className="font-bold text-slate-800 text-[11px]">dr. Budi Santoso, Sp.A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions Bar (Screen Only) */}
        <div className="p-4 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            Format resmi siap cetak ukuran A5 (Buku KIA)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              icon={<Share2 className="w-4 h-4 text-emerald-600" />}
              onClick={handleShareWa}
            >
              Kirim ke WhatsApp
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Cetak Format Buku KIA (PDF)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
