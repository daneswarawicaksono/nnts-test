import React from 'react';
import { Star, Lock, Play, CheckCircle2, Trophy } from 'lucide-react';
import { soundSynth } from '../../../services/audio/synth';

interface AdventureTrailMapProps {
  childName: string;
  onLaunchGame: (gameId?: string) => void;
}

export const AdventureTrailMap: React.FC<AdventureTrailMapProps> = ({
  childName,
  onLaunchGame,
}) => {
  const levels = [
    {
      id: 'g1',
      title: 'Pulau Balon Kilat',
      desc: 'Skrining ketangkasan refleks visual & motorik cepat',
      status: 'completed' as const,
      stars: 3,
      score: 95,
      icon: '🎈',
    },
    {
      id: 'g2',
      title: 'Kebun Buah Ceria',
      desc: 'Skrining kognitif pengenalan warna & bentuk buah',
      status: 'active' as const,
      stars: 0,
      score: 0,
      icon: '🍎',
    },
    {
      id: 'g3',
      title: 'Lembah Jejak Hewan',
      desc: 'Skrining daya ingat kerja & asosiasi pola suara',
      status: 'locked' as const,
      stars: 0,
      score: 0,
      icon: '🐾',
    },
    {
      id: 'g4',
      title: 'Puncak Bintang Emas',
      desc: 'Skrining terpadu komprehensif & rapor tumbuh kembang',
      status: 'locked' as const,
      stars: 0,
      score: 0,
      icon: '⭐',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm text-center relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
            <Trophy className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Level 2 dari 4</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#2B8A44] text-xs font-black">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>3 Bintang Terkumpul</span>
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 mt-1">
          Petualangan Otak {childName}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Skrining tumbuh kembang ceria tanpa jarum suntik, langsung dari layar gawai.
        </p>

        {/* Mascot Kerro in Cheer Pose */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="relative">
            <img
              src="/mascot/kerro_pose2_laugh.png"
              alt="Kerro tertawa ceria"
              className="w-16 h-16 object-contain drop-shadow-sm select-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/mascot/kerro_pose1_smile.png';
              }}
            />
            <div className="w-14 h-2.5 rounded-full bg-slate-200/60 mx-auto -mt-1 blur-[1px]" />
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-3 py-2 text-left text-xs font-extrabold text-[#2B8A44]">
            "Yuk lanjut ke Kebun Buah Ceria!"
          </div>
        </div>
      </div>

      {/* Trail Map Nodes */}
      <div className="bg-white rounded-3xl border border-[#E5E5E5] p-5 shadow-sm space-y-5">
        <span className="text-[11px] font-extrabold text-[#34A853] uppercase tracking-wider block">
          Peta Jalur Petualangan
        </span>

        <div className="space-y-4">
          {levels.map((lvl, idx) => {
            const isCompleted = lvl.status === 'completed';
            const isActive = lvl.status === 'active';
            const isLocked = lvl.status === 'locked';

            return (
              <div
                key={lvl.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-emerald-50/70 border-[#34A853] shadow-md ring-2 ring-[#34A853]/20'
                    : isCompleted
                    ? 'bg-slate-50/90 border-slate-200'
                    : 'bg-white border-slate-200/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                        isActive
                          ? 'bg-[#34A853] text-white shadow-[0_3px_0_#2B8A44]'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {lvl.icon}
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                          Pos 0{idx + 1}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-extrabold text-[#2B8A44] flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Tuntas
                          </span>
                        )}
                        {isActive && (
                          <span className="text-[10px] font-extrabold text-[#2B8A44] bg-emerald-100 px-2 py-0.2 rounded-full">
                            Tantangan Saat Ini
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                        {lvl.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {lvl.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right Status / Action */}
                  <div className="shrink-0 pt-1">
                    {isCompleted ? (
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                        <Star className="w-4 h-4 fill-amber-400" />
                      </div>
                    ) : isLocked ? (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Active Level 3D Action Button */}
                {isActive && (
                  <div className="mt-3.5 pt-3 border-t border-emerald-200/60">
                    <button
                      type="button"
                      onClick={() => {
                        soundSynth.playChime();
                        onLaunchGame(lvl.id);
                      }}
                      className="w-full py-3 px-4 rounded-xl btn-3d-green text-xs font-black flex items-center justify-center gap-2 shadow-[0_4px_0_#2B8A44]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>MULAI MAIN POS 02 (KEBUN BUAH)</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
