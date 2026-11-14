import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, Copy, CheckCircle2, TrendingUp, Video, Tag, Lightbulb, RefreshCw, ShoppingBag } from 'lucide-react';
import { TikTokProduct } from '../types';

interface AIOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TikTokProduct | null;
  onApplyOptimization: (productId: string, optimizedTitle: string, tags: string[], tokopediaTitle?: string) => void;
}

export const AIOptimizerModal: React.FC<AIOptimizerModalProps> = ({
  isOpen,
  onClose,
  product,
  onApplyOptimization,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedTitle, setOptimizedTitle] = useState(product?.optimizedTitle || '');
  const [tokopediaTitle, setTokopediaTitle] = useState(product?.tokopediaTitle || '');
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [videoHooks, setVideoHooks] = useState<string[]>([]);
  const [searchStrategy, setSearchStrategy] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (product && isOpen) {
      setOptimizedTitle(product.optimizedTitle || '');
      setTokopediaTitle(product.tokopediaTitle || '');
      setTags(product.tags || []);
      setVideoHooks([]);
      setSearchStrategy('');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleGenerateAI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tiktok/ai-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          targetKeyword: product.targetKeyword,
          category: product.category,
          currentTitle: product.optimizedTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOptimizedTitle(data.optimizedTitle);
        if (data.tokopediaTitle) setTokopediaTitle(data.tokopediaTitle);
        setTags(data.trendingTags || []);
        setVideoHooks(data.videoHooks || []);
        setSearchStrategy(data.searchStrategy || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyHook = (idx: number, hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = () => {
    onApplyOptimization(product.id, optimizedTitle, tags, tokopediaTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-[#FE2C55]/20 to-[#03AC0E]/20 rounded-xl text-white border border-slate-700">
              <Sparkles className="w-5 h-5 text-[#25F4EE]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                AI SEO & Viral Hook Generator (TikTok Shop + Tokopedia)
              </h3>
              <p className="text-xs text-slate-400">
                Optimasi Formula Judul & Kata Kunci Terlaris untuk Kedua Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Target Query context */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Produk: </span>
              <strong className="text-white">{product.name}</strong>
            </div>
            <div>
              <span className="text-slate-400">Target Pencarian: </span>
              <span className="text-[#25F4EE] font-mono font-semibold">"{product.targetKeyword}"</span>
            </div>
            <button
              onClick={handleGenerateAI}
              disabled={isLoading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menganalisis Algoritma...' : 'Re-Generate Formula AI'}</span>
            </button>
          </div>

          {/* Dual Optimized Title Section */}
          <div className="space-y-4">
            {/* TikTok Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
                  <span>Formula Judul TikTok Shop #1 (Viral & BPOM/Garansi)</span>
                </label>
                <button
                  onClick={() => handleCopyText('tk_title', optimizedTitle)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'tk_title' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Tersalin!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Salin Judul TikTok
                    </span>
                  )}
                </button>
              </div>
              <textarea
                rows={2}
                value={optimizedTitle}
                onChange={(e) => setOptimizedTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FE2C55] leading-relaxed"
              />
            </div>

            {/* Tokopedia Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
                  <span>Formula Judul Tokopedia SEO (Official Store Standard)</span>
                </label>
                <button
                  onClick={() => handleCopyText('tkpd_title', tokopediaTitle)}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedKey === 'tkpd_title' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Tersalin!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Salin Judul Tokopedia
                    </span>
                  )}
                </button>
              </div>
              <textarea
                rows={2}
                value={tokopediaTitle}
                onChange={(e) => setTokopediaTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-[#03AC0E] leading-relaxed"
              />
            </div>
          </div>

          {/* Strategy Insight */}
          {searchStrategy && (
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>Taktik Peringkat Algoritma Dual Platform:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{searchStrategy}</p>
            </div>
          )}

          {/* Video Hooks */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#FE2C55]" />
              <span>3-Detik Video & Live Stream Hooks (Memicu Sales Velocity Cepat)</span>
            </label>
            <div className="space-y-2">
              {(videoHooks.length > 0
                ? videoHooks
                : [
                    `"Kalian masih beli yang mahal? Padahal ${product.targetKeyword} yang viral di pencarian TikTok & Tokopedia lagi banting harga!"`,
                    `"Jangan di-checkout dulu sebelum lihat ini! Kenapa produk ini nomor 1 terlaris di TikTok Shop dan Tokopedia..."`,
                    `"Spill ${product.targetKeyword} yang bikin heboh! Langsung klik keranjang kuning atau check out Tokopedia sebelum kehabisan."`,
                  ]
              ).map((hook, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/90 flex items-start justify-between gap-3 text-xs"
                >
                  <p className="text-slate-300 italic leading-relaxed">{hook}</p>
                  <button
                    onClick={() => handleCopyHook(idx, hook)}
                    className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer shrink-0"
                    title="Salin hook"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 block">
              Kata Kunci Pencarian Terlaris (Sinkron ke Kedua Mesin Pencari):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono flex items-center gap-1"
                >
                  <span>#{t}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-gradient-to-r from-[#25F4EE] via-emerald-400 to-[#03AC0E] hover:opacity-95 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Terapkan ke Listing TikTok & Tokopedia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
