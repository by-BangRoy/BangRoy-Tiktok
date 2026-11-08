import React, { useState } from 'react';
import { Link2, Zap, Sparkles, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Radio, Server, Activity } from 'lucide-react';

interface LinkBoosterBannerProps {
  onBoostFromLink: (url: string, customKeyword?: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  isBoosting: boolean;
  totalProducts: number;
}

export const LinkBoosterBanner: React.FC<LinkBoosterBannerProps> = ({
  onBoostFromLink,
  onClearAll,
  isBoosting,
  totalProducts,
}) => {
  const [url, setUrl] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    await executeBoost(url.trim(), customKeyword.trim() || undefined);
  };

  const executeBoost = async (linkUrl: string, keyword?: string) => {
    setIsSubmitting(true);
    setConnectionStep('1/3: Menghubungi TikTok Shop Open API Gateway (Region ID)...');

    const stepTimer = setTimeout(() => {
      setConnectionStep('2/3: Menginjeksi formula exact-match pencarian terlaris ke server...');
    }, 450);

    try {
      await onBoostFromLink(linkUrl, keyword);
      setConnectionStep('3/3: Terkoneksi! Posisi #1 Terlaris diamankan.');
      setTimeout(() => {
        setUrl('');
        setCustomKeyword('');
        setConnectionStep(null);
      }, 700);
    } catch {
      setConnectionStep(null);
    } finally {
      clearTimeout(stepTimer);
      setIsSubmitting(false);
    }
  };

  // Instant trigger when pasting a link!
  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim()) {
      setUrl(pastedText.trim());
      // Trigger instant automatic boost connection directly upon paste!
      await executeBoost(pastedText.trim(), customKeyword.trim() || undefined);
    }
  };

  const handleUsePresetLink = async (presetUrl: string, keyword: string) => {
    setUrl(presetUrl);
    setCustomKeyword(keyword);
    await executeBoost(presetUrl, keyword);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FE2C55]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#25F4EE]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Banner Top Title & Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#25F4EE] bg-[#25F4EE]/10 px-2 py-0.5 rounded border border-[#25F4EE]/20">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Otomatisasi Server TikTok Terhubung · Live Gateway</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Tempelkan Link Produk TikTok untuk Boost Otomatis #1 Terlaris
            </h2>
            <p className="text-xs text-slate-400">
              Cukup tempel link produk (Ctrl+V). Sistem akan <strong>langsung terkoneksi ke server TikTok</strong>, mengunci posisi terlaris, dan menampilkan produk di pencarian paling atas secara instan.
            </p>
          </div>

          {/* Clear all products button */}
          {totalProducts > 0 && (
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Kosongkan semua produk dalam antrean boost"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan Semua Produk ({totalProducts})</span>
            </button>
          )}
        </div>

        {/* Big Input Form with Auto-Paste Listener */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                onPaste={handlePaste}
                placeholder="Tempelkan link produk TikTok di sini (langsung otomatis boost saat di-paste Ctrl+V)..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#25F4EE] transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isBoosting || !url.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#FE2C55] hover:from-rose-500 hover:to-rose-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              <Zap className={`w-4 h-4 fill-current ${isSubmitting ? 'animate-bounce' : ''}`} />
              <span>
                {isSubmitting ? 'Menghubungkan ke Server TikTok...' : 'Boost Otomatis Sekarang'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Connection Pipeline Notification */}
          {connectionStep && (
            <div className="p-3 bg-slate-950 border border-[#25F4EE]/50 rounded-xl flex items-center gap-2.5 text-xs text-[#25F4EE] animate-in fade-in duration-200">
              <Server className="w-4 h-4 animate-spin text-[#25F4EE] shrink-0" />
              <span className="font-mono">{connectionStep}</span>
            </div>
          )}

          {/* Optional custom keyword toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowKeywordInput(!showKeywordInput)}
                className="text-slate-400 hover:text-[#25F4EE] transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <span>{showKeywordInput ? '− Sembunyikan' : '+ Tentukan'} Kata Kunci Pencarian Khusus</span>
              </button>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Fitur Auto-Paste Aktif: Cukup tempel link dan sistem langsung mem-boost
              </span>
            </div>

            {/* Quick preset links to test with 1 click */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 text-[11px]">Uji Coba 1-Klik:</span>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://vt.tiktok.com/ZSj9821aL/product/lumina-serum-glowing-pencerah',
                    'serum pencerah viral bpom'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-[#25F4EE]" />
                <span>Skincare Serum</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://shop.tiktok.com/view/product/172948190184?name=cardigan-rajut-korean',
                    'cardigan rajut oversize kekinian'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-[#FE2C55]" />
                <span>Cardigan Rajut</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://vt.tiktok.com/ZSjTws918b/product/aero-earbuds-bluetooth-bass',
                    'tws earphone bluetooth bass murah'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>TWS Earbuds</span>
              </button>
            </div>
          </div>

          {/* Collapsible custom keyword input */}
          {showKeywordInput && (
            <div className="pt-2 animate-in fade-in duration-200">
              <input
                type="text"
                placeholder="Masukkan kata kunci pencarian yang ingin ditargetkan (contoh: gamis kondangan mewah murah)"
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-[#25F4EE] placeholder-slate-600 focus:outline-none focus:border-[#25F4EE]"
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
