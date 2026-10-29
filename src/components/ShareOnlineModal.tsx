import React, { useState } from 'react';
import { soundFX } from '../services/audioSynth';
import {
  Globe,
  X,
  Copy,
  Check,
  Smartphone,
  Cloud,
} from 'lucide-react';

interface ShareOnlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onlineUrl?: string;
}

export const ShareOnlineModal: React.FC<ShareOnlineModalProps> = ({
  isOpen,
  onClose,
  onlineUrl = 'https://recommendations-suggestion-prospect-minimum.trycloudflare.com',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = onlineUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    currentUrl
  )}`;

  const handleCopy = () => {
    soundFX.playClick();
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs font-clinical animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-700">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Akses Online &amp; Uji di HP</h3>
              <p className="text-xs text-blue-100 font-medium">
                Live Cloudflare Link untuk Presentasi Online
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* QR Code + Mobile Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 border border-slate-200/90 rounded-2xl p-4">
            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs shrink-0">
              <img
                src={qrCodeUrl}
                alt="QR Code Akses Aplikasi di HP"
                className="w-32 h-32 rounded-lg"
              />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-indigo-700 font-extrabold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>Scan dengan Kamera HP</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Arahkan kamera smartphone ke QR Code ini untuk membuka prototipe web langsung di HP Anda saat presentasi online!
              </p>
              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block font-semibold">
                ✓ Protokol Aman HTTPS Cloudflare
              </div>
            </div>
          </div>

          {/* Direct URL Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tautan Publik (Bisa Dishare ke Penguji / Audiens):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs text-slate-800 font-semibold truncate outline-none select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin'}</span>
              </button>
            </div>
          </div>

          {/* Cloudflare Pages Permanent Deploy Info */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Cloud className="w-4 h-4 text-blue-600" />
              <span>Ingin Deploy Permanen Gratis di Cloudflare Pages?</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Hasil build sudah siap di folder <code className="bg-white px-1.5 py-0.5 rounded text-blue-800 font-mono">dist/</code>.
              Anda bisa buka <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">dash.cloudflare.com</a>, pilih <b>Workers &amp; Pages &gt; Create Application &gt; Pages &gt; Upload assets</b>, dan drag folder <code className="bg-white px-1.5 py-0.5 rounded text-blue-800 font-mono">dist</code> untuk mendapatkan domain permanen gratis selamanya (misal: <code className="bg-white px-1 py-0.5 rounded text-slate-800 font-mono">nnts.pages.dev</code>).
            </p>
          </div>

          {/* Close button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                soundFX.playClick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
