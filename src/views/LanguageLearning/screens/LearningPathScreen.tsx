import React, { useState } from 'react';
import {
  BookOpen,
  Star,
  Headphones,
  Mic,
  Gift,
  Trophy,
  Home,
  Shield,
  User,
  MoreHorizontal,
  Check,
} from 'lucide-react';
import { TopStatusBarHUD } from '../components/TopStatusBarHUD';
import { NutriSprout } from '../../../design-system/mascot/NutriSprout';
import { soundSynth } from '../../../services/audio/synth';

export interface LearningPathScreenProps {
  onSelectNode: (nodeId: number) => void;
  onExit?: () => void;
}

interface PathNode {
  id: number;
  label: string;
  icon: 'star' | 'headset' | 'mic' | 'chest' | 'trophy';
  status: 'completed' | 'active' | 'locked';
  offset: 'center' | 'left' | 'right';
}

const NODES_DATA: PathNode[] = [
  { id: 1, label: 'Pengenalan Kata', icon: 'star', status: 'completed', offset: 'center' },
  { id: 2, label: 'Sayur & Buah', icon: 'headset', status: 'completed', offset: 'right' },
  { id: 3, label: 'Zat Besi & Otak', icon: 'star', status: 'active', offset: 'center' },
  { id: 4, label: 'Tebak Suara', icon: 'mic', status: 'locked', offset: 'left' },
  { id: 5, label: 'Peti Rahasia', icon: 'chest', status: 'locked', offset: 'center' },
  { id: 6, label: 'Ujian Juara', icon: 'trophy', status: 'locked', offset: 'right' },
];

export const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  onSelectNode,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'chest' | 'leaderboard' | 'profile' | 'more'>('home');

  const handleNodeClick = (node: PathNode) => {
    if (node.status === 'locked') {
      soundSynth.playPop();
      return;
    }
    soundSynth.playChime();
    onSelectNode(node.id);
  };

  const renderNodeIcon = (node: PathNode) => {
    if (node.status === 'completed') {
      return <Check className="w-7 h-7 text-white stroke-[3.5]" />;
    }
    switch (node.icon) {
      case 'star':
        return <Star className="w-7 h-7 text-white fill-white" />;
      case 'headset':
        return <Headphones className="w-7 h-7 text-white stroke-[2.5]" />;
      case 'mic':
        return <Mic className="w-7 h-7 text-white stroke-[2.5]" />;
      case 'chest':
        return <Gift className="w-7 h-7 text-white stroke-[2.5]" />;
      case 'trophy':
        return <Trophy className="w-7 h-7 text-white fill-white" />;
    }
  };

  return (
    <div className="w-full h-full bg-[#FFFFFF] flex flex-col justify-between overflow-hidden select-none relative">
      {/* Persistent Top HUD Status Bar */}
      <TopStatusBarHUD streak={5} gems={240} hearts="inf" />

      {/* SCROLLABLE MAIN PATH CANVAS */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-6 flex flex-col items-center">
        {/* Top Header Unit Card (Sky Blue rounded card) */}
        <div className="w-full max-w-xs bg-[#1CB0F6] shadow-[0_4px_0_0_#1899D6] rounded-2xl p-4 text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold font-child uppercase tracking-wider text-sky-100">
              BAGIAN 1, UNIT 3
            </span>
            <h2 className="text-base font-black font-child tracking-tight">
              Gizi Tumbuh & Bahasa Sehat
            </h2>
          </div>
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all cursor-pointer min-h-[44px] min-w-[44px]"
            title="Buku Panduan Unit"
          >
            <BookOpen className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Sinusoidal Path Nodes */}
        <div className="w-full max-w-xs py-4 flex flex-col items-center space-y-6 relative">
          {/* Connector Winding Trail Line (SVG) */}
          <svg
            className="absolute top-8 left-1/2 -translate-x-1/2 w-48 h-full pointer-events-none opacity-25 z-0"
            viewBox="0 0 160 460"
            fill="none"
          >
            <path
              d="M 80,10 Q 130,70 80,140 T 30,220 T 80,300 T 130,380"
              stroke="#CBD5E1"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
          </svg>

          {NODES_DATA.map((node) => {
            const isCenter = node.offset === 'center';
            const isRight = node.offset === 'right';
            return (
              <div
                key={node.id}
                className={`w-full flex items-center z-10 ${
                  isCenter ? 'justify-center' : isRight ? 'justify-end pr-6' : 'justify-start pl-6'
                }`}
              >
                {/* Floating Mascot beside the active node */}
                {node.status === 'active' && isCenter && (
                  <div className="absolute -left-2 top-[32%] animate-float-breath pointer-events-none">
                    <NutriSprout size={64} mood="curious" showShadow={false} />
                  </div>
                )}

                {/* Circular 3D Node Button */}
                <div className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNodeClick(node)}
                    disabled={node.status === 'locked'}
                    className={`
                      w-18 h-18 rounded-full flex items-center justify-center transition-all duration-75 select-none
                      min-h-[48px] min-w-[48px] cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1CB0F6]
                      ${
                        node.status === 'completed'
                          ? 'bg-[#58CC02] border-b-6 border-[#46A302] active:border-b-2 active:translate-y-[4px] shadow-sm'
                          : node.status === 'active'
                          ? 'bg-[#58CC02] border-b-6 border-[#46A302] ring-8 ring-[#58CC02]/25 active:border-b-2 active:translate-y-[4px] shadow-md animate-pulse'
                          : 'bg-[#E5E5E5] border-b-6 border-[#CECECE] text-[#AFAFAF] cursor-not-allowed shadow-none'
                      }
                    `}
                    title={node.label}
                  >
                    {renderNodeIcon(node)}
                  </button>

                  <span className="text-[11px] font-extrabold font-child tracking-wide text-slate-600 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
                    {node.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* FIXED 5-TAB BOTTOM NAVIGATION BAR */}
      <footer className="w-full h-16 bg-white border-t-2 border-[#E5E5E5] flex items-center justify-around px-2 z-30 select-none">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'home' ? 'text-[#58CC02] bg-[#58CC02]/10' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Beranda Belajar"
        >
          <Home className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chest')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'chest' ? 'text-[#FF9600] bg-[#FF9600]/10' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Misi & Peti"
        >
          <Gift className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'leaderboard' ? 'text-[#1CB0F6] bg-[#1CB0F6]/10' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Peringkat"
        >
          <Shield className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'profile' ? 'text-teal-600 bg-teal-50' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Profil Anak"
        >
          <User className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('more')}
          className={`flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all cursor-pointer min-h-[44px] ${
            activeTab === 'more' ? 'text-slate-800 bg-slate-100' : 'text-slate-400 hover:text-slate-600'
          }`}
          title="Lainnya"
        >
          <MoreHorizontal className="w-6 h-6 stroke-[2.5]" />
        </button>
      </footer>
    </div>
  );
};
