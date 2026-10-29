import React, { useState } from 'react';
import type { PatientRecord } from '../../types';
import { DiceBearAvatar } from '../illustrations/DiceBearAvatar';
import { StorysetHealthyFood, StorysetPediatrician } from '../illustrations/StorysetIllustrations';
import { StickerBalloon, StickerFruitTree, StickerCat } from '../illustrations/IslandStickers';
import { soundFX } from '../../services/audioSynth';
import {
  Star,
  Calendar,
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Utensils,
  X,
  Printer,
  Bookmark,
  Award,
  Compass,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface FamilyReportViewProps {
  patient: PatientRecord;
}

export const FamilyReportView: React.FC<FamilyReportViewProps> = ({ patient }) => {
  const [isKiaModalOpen, setIsKiaModalOpen] = useState(false);

  // Map raw cognitive metrics to parent-friendly star ratings (1 to 5)
  const latency = patient.reactionTime.avgLatency;
  const reflexStars = latency <= 400 ? 5 : latency <= 440 ? 4 : latency <= 480 ? 3 : latency <= 520 ? 2 : 1;

  const accuracy = patient.goNoGo.accuracyRate;
  const focusStars = accuracy >= 85 ? 5 : accuracy >= 75 ? 4 : accuracy >= 65 ? 3 : accuracy >= 55 ? 2 : 1;

  const memoryStars = Math.max(1, Math.min(5, patient.memorySpan.spanScore));

  // Growth trajectory simulated over last 4 Posyandu visits against healthy band
  const growthData = [
    { bulan: 'Bln 42', bb: Number((patient.weight - 1.2).toFixed(1)), jalurBawah: 12.0, jalurAtas: 16.5 },
    { bulan: 'Bln 44', bb: Number((patient.weight - 0.7).toFixed(1)), jalurBawah: 12.5, jalurAtas: 17.0 },
    { bulan: 'Bln 46', bb: Number((patient.weight - 0.3).toFixed(1)), jalurBawah: 13.0, jalurAtas: 17.6 },
    { bulan: 'Bln 48 (Kini)', bb: patient.weight, jalurBawah: 13.5, jalurAtas: 18.2 },
  ];

  const getDailyTips = () => {
    if (patient.familyStatus === 'Tumbuh Kembang Baik') {
      return [
        {
          title: "Piring Bergizi Warna-Warni",
          desc: "Lanjutkan kebiasaan baik memberikan protein hewani (telur, ikan lokal, ayam) setiap kali makan untuk menjaga stamina dan keceriaan si kecil."
        },
        {
          title: "Bermain Lempar Tangkap Bola",
          desc: "Ajak anak bermain tangkap bola atau melompati garis tali 20 menit sehari agar refleks tangan dan koordinasi mata semakin terasah."
        }
      ];
    } else if (patient.familyStatus === 'Perlu Sedikit Perhatian') {
      return [
        {
          title: "Lauk Lezat Kaya Zat Besi & Seng",
          desc: "Tambahkan hati ayam cincang lezat, kuning telur, dan tempe lembut pada menu makan si kecil untuk menyuplai energi motoriknya."
        },
        {
          title: "Teka-Teki Tebak Gambar Sebelum Tidur",
          desc: "Luangkan 10 menit membacakan dongeng bergambar dan tanyakan kembali tokoh apa saja yang baru muncul untuk melatih memori otaknya."
        }
      ];
    } else {
      return [
        {
          title: "Nutrisi Tambahan Spesial Posyandu",
          desc: "Konsultasikan santai dengan petugas gizi Puskesmas tentang sirup vitamin tetes atau taburia MNP untuk memperkuat daya fokus si kecil."
        },
        {
          title: "Dampingi Main dengan Pelukan & Kesabaran",
          desc: "Jika si kecil mudah lelah saat bermain, berikan jeda istirahat teratur tanpa memaksa agar ia selalu merasa aman dan dihargai."
        }
      ];
    }
  };

  const statusConfig = {
    'Tumbuh Kembang Baik': {
      stempelColor: 'border-emerald-500 bg-emerald-50 text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-600" />,
      subtext: 'Bagus sekali! Pertumbuhan fisik dan kemampuan bermain si kecil berkembang selaras di jalur sehat.',
    },
    'Perlu Sedikit Perhatian': {
      stempelColor: 'border-amber-500 bg-amber-50 text-amber-900',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <HelpCircle className="w-8 h-8 text-amber-600" />,
      subtext: 'Ada beberapa kemampuan refleks dan memori yang butuh sedikit dorongan nutrisi lezat dan stimulasi bermain di rumah.',
    },
    'Perlu Kunjungan Lanjutan': {
      stempelColor: 'border-rose-500 bg-rose-50 text-rose-900',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      icon: <AlertCircle className="w-8 h-8 text-rose-600" />,
      subtext: 'Sangat dianjurkan untuk berkonsultasi ramah dengan dokter atau petugas gizi di Puskesmas pada jadwal berikut untuk evaluasi lanjutan.',
    },
  }[patient.familyStatus];

  return (
    <div className="bg-[#FAF7F0] min-h-[calc(100vh-80px)] p-4 sm:p-8 font-child text-slate-800 select-none">
      {/* Container Storybook Album Sheet (Warm Parchment Page) */}
      <article className="max-w-3xl mx-auto bg-[#FFFDF7] rounded-[2.75rem] border-4 border-amber-200/90 shadow-[0_16px_50px_-12px_rgba(180,83,9,0.15)] relative overflow-hidden p-6 sm:p-10 space-y-10">
        {/* Top Decorative Bookmark Ribbon */}
        <div className="absolute -top-1 left-10 flex flex-col items-center">
          <div className="bg-rose-500 text-white text-[11px] font-black px-4 py-2 rounded-b-xl shadow-md flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 fill-white" />
            <span>ALBUM POSYANDU</span>
          </div>
        </div>

        {/* BAB 1: Sampul Album & Sapaan Hangat */}
        <section className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-dashed border-amber-200/80 pb-8">
          <div className="flex items-center gap-5">
            {/* Big Child Avatar in Golden Ring Frame with DiceBear Adventurer API */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-400 via-rose-300 to-teal-400 shadow-md">
              <DiceBearAvatar seed={patient.name} gender={patient.gender} size={96} />
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-amber-950 p-1.5 rounded-full border-2 border-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider block">
                Catatan Tumbuh Kembang Buah Hati
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
                {patient.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-bold">
                Usia {patient.ageMonths} Bulan • Posyandu: {patient.posyandu}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
            <button
              onClick={() => {
                soundFX.playClick();
                setIsKiaModalOpen(true);
              }}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 text-white text-xs font-black shadow-md flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Cetak Kartu Buku KIA</span>
            </button>
            <span className="text-[11px] text-slate-400 font-semibold">Tgl Pemeriksaan: {patient.examDate}</span>
          </div>
        </section>

        {/* BAB 2: Status Tumbuh Kembang (Cap Stempel Ramah Posyandu) */}
        <section className={`rounded-3xl border-4 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm ${statusConfig.stempelColor}`}>
          <div className="p-3 bg-white rounded-2xl shadow-xs shrink-0 border-2 border-current">
            {statusConfig.icon}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Kesimpulan Posyandu Hari Ini:</span>
              <span className={`px-3.5 py-0.5 rounded-full text-xs font-black border ${statusConfig.badge}`}>
                {patient.familyStatus}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
              {statusConfig.subtext}
            </p>
          </div>
        </section>

        {/* BAB 3: Cerita Jalur Sehat (Pita Sungai Pertumbuhan Berat Badan) */}
        <section className="space-y-4 bg-emerald-50/50 rounded-3xl p-6 border-2 border-emerald-200/70">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-xl text-slate-800">Cerita Berat Badan & Jalur Sehat</h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Hamparan hijau adalah jalur pertumbuhan yang aman dan membahagiakan
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
              Tumbuh Sesuai Jalur 🌿
            </span>
          </div>

          {/* Area Chart: Soft Green Healthy River */}
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthyPathStoryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <YAxis domain={[10, 20]} unit="kg" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFDF7', borderRadius: '16px', border: '2px solid #FCD34D', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="jalurAtas"
                  stroke="none"
                  fill="url(#healthyPathStoryGradient)"
                  name="Jalur Sehat"
                />
                <Line
                  type="monotone"
                  dataKey="bb"
                  name="Berat Badan Anisa"
                  stroke="#F59E0B"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#F59E0B', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/80 rounded-2xl p-3.5 border border-emerald-200 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Berat Badan Sekarang: <strong className="text-emerald-800 text-sm">{patient.weight} kg</strong></span>
            <span>Tinggi Badan Sekarang: <strong className="text-emerald-800 text-sm">{patient.height} cm</strong></span>
          </div>
        </section>

        {/* BAB 4: Tiga Medali Bintang Kekuatan Si Kecil (Hero Medals) */}
        <section className="space-y-4">
          <div className="border-b-2 border-dashed border-amber-200/80 pb-3">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              Tiga Medali Kekuatan Bermain Si Kecil
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Diraih saat bermain petualangan game motorik dan memori bersama Si Cakra
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Medali 1: Refleks Balon */}
            <div className="bg-gradient-to-b from-amber-50 to-amber-100/70 p-5 rounded-3xl border-2 border-amber-300/80 flex flex-col items-center text-center space-y-2.5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-400 border-b-4 border-amber-600 flex items-center justify-center shadow-md">
                <StickerBalloon size={36} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">Medali Refleks Kilat</h4>
                <p className="text-[11px] text-slate-500 font-bold">Kecepatan tangan menyentuh balon</p>
              </div>
              <div className="flex gap-1 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < reflexStars ? 'fill-amber-400 stroke-amber-600' : 'fill-slate-200 stroke-slate-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Medali 2: Fokus Buah */}
            <div className="bg-gradient-to-b from-rose-50 to-rose-100/70 p-5 rounded-3xl border-2 border-rose-300/80 flex flex-col items-center text-center space-y-2.5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-rose-400 border-b-4 border-rose-600 flex items-center justify-center shadow-md">
                <StickerFruitTree size={36} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">Medali Fokus Teliti</h4>
                <p className="text-[11px] text-slate-500 font-bold">Memilih buah segar & menahan diri</p>
              </div>
              <div className="flex gap-1 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < focusStars ? 'fill-rose-400 stroke-rose-600' : 'fill-slate-200 stroke-slate-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Medali 3: Memori Hewan */}
            <div className="bg-gradient-to-b from-purple-50 to-purple-100/70 p-5 rounded-3xl border-2 border-purple-300/80 flex flex-col items-center text-center space-y-2.5 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-purple-400 border-b-4 border-purple-600 flex items-center justify-center shadow-md">
                <StickerCat size={36} />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-800">Medali Ingatan Hebat</h4>
                <p className="text-[11px] text-slate-500 font-bold">Mengingat urutan barisan hewan</p>
              </div>
              <div className="flex gap-1 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < memoryStars ? 'fill-purple-400 stroke-purple-600' : 'fill-slate-200 stroke-slate-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BAB 5: Resep Dapur Ceria Ibu & Ide Main 10 Menit */}
        <section className="bg-amber-100/40 rounded-3xl p-6 border-2 border-dashed border-amber-300 relative space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-700" />
              <h3 className="font-black text-lg text-amber-950">
                Catatan Dapur Ceria Ibu &amp; Ide Main 10 Menit
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-200/70 px-3 py-0.5 rounded-full">Menu Bergizi Lokal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 space-y-3">
              {getDailyTips().map((tip, idx) => (
                <div key={idx} className="bg-white/90 p-4 rounded-2xl border border-amber-200 shadow-xs flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-black text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-800 mb-0.5">{tip.title}</h4>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sm:col-span-4 flex items-center justify-center">
              <StorysetHealthyFood size={145} />
            </div>
          </div>
        </section>

        {/* BAB 6: Tiket Paspor Petualangan Posyandu Berikutnya (Boarding Pass Style - Fixed Overflow Bug) */}
        <section className="bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white rounded-[2rem] p-5 sm:p-7 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-stretch justify-between gap-6 border-4 border-teal-500/80">
          {/* Perforated ticket edge circular cutouts */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF7F0] border-r-2 border-teal-600/40" />
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#FAF7F0] border-l-2 border-teal-600/40" />

          {/* Left section: Ticket Details with Safe Padding */}
          <div className="space-y-3 pl-3 sm:pl-5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-xs font-black backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5 text-yellow-300" />
              <span className="tracking-wide">TIKET PETUALANGAN POSYANDU</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-yellow-300 leading-tight">
              28 Hari Lagi!
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 font-bold leading-relaxed max-w-md">
              Waktunya main lagi dengan Si Cakra dan timbang berat badan bersama teman-teman di {patient.posyandu}.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[11px] text-teal-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                Nama: <strong className="text-white">{patient.name}</strong>
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                Posyandu: <strong className="text-white">{patient.posyandu}</strong>
              </span>
            </div>
          </div>

          {/* Perforated Dashed Divider */}
          <div className="hidden md:block w-px border-l-2 border-dashed border-teal-400/40 self-stretch my-1" />

          {/* Right section: Ticket Stub with Storyset Doctor & Full Schedule (Never Clipped) */}
          <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 pr-3 sm:pr-5 shrink-0 pt-3 md:pt-0 border-t-2 md:border-t-0 border-dashed border-teal-400/40">
            <div className="shrink-0 hidden sm:block">
              <StorysetPediatrician size={100} />
            </div>
            <div className="bg-white/15 backdrop-blur-xs p-4 rounded-2xl border border-white/25 text-center md:text-right space-y-1.5 shrink-0 min-w-[200px] w-full sm:w-auto">
              <span className="text-teal-200 block text-[10px] sm:text-[11px] uppercase font-bold tracking-wider">
                Jadwal Kunjungan:
              </span>
              <span className="text-base sm:text-lg font-black text-white block whitespace-nowrap">
                18 Oktober 2026
              </span>
              <span className="text-[11px] text-yellow-300 font-bold block whitespace-nowrap">
                Bawa Buku KIA &amp; Senyum Ceria
              </span>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <footer className="pt-2 text-center text-xs text-slate-400 font-bold">
          Diterbitkan oleh Puskesmas FKTP & Posyandu Melati • Layanan Kesehatan Tumbuh Kembang Anak Indonesia
        </footer>
      </article>

      {/* Modal Cetak Buku KIA */}
      {isKiaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-300 overflow-hidden p-6 space-y-5 font-child">
            <div className="flex justify-between items-center border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  KIA
                </div>
                <h3 className="font-black text-lg text-slate-800">Kartu Tumbuh Kembang KIA</h3>
              </div>
              <button
                onClick={() => setIsKiaModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3 text-center">
              <DiceBearAvatar seed={patient.name} gender={patient.gender} size={72} className="mx-auto" />
              <div>
                <h4 className="font-black text-2xl text-slate-800">{patient.name}</h4>
                <p className="text-xs text-slate-500 font-bold">Usia {patient.ageMonths} Bulan • {patient.posyandu}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs text-left bg-white p-3.5 rounded-2xl border border-amber-200">
                <div>
                  <span className="text-slate-400 font-bold block">Berat Badan:</span>
                  <span className="font-black text-slate-800 text-sm">{patient.weight} kg</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Tinggi Badan:</span>
                  <span className="font-black text-slate-800 text-sm">{patient.height} cm</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-100">
                  <span className="text-slate-400 font-bold block">Status Posyandu:</span>
                  <span className="font-black text-emerald-700 text-sm">{patient.familyStatus}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 flex justify-center gap-4 pt-1 font-bold">
                <span>Refleks: <strong className="text-amber-600">{reflexStars} ★</strong></span>
                <span>Fokus: <strong className="text-rose-600">{focusStars} ★</strong></span>
                <span>Memori: <strong className="text-purple-600">{memoryStars} ★</strong></span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  soundFX.playClick();
                  window.print();
                }}
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" /> Cetak Lembar KIA
              </button>
              <button
                onClick={() => setIsKiaModalOpen(false)}
                className="px-5 py-3.5 border border-slate-300 text-slate-700 font-bold rounded-2xl text-xs hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
