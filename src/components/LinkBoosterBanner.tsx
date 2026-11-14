import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  Zap,
  Sparkles,
  Trash2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Server,
  Activity,
  Globe,
  Lock,
  Clipboard,
  RefreshCw,
} from 'lucide-react';

import { LiveSyncReport } from '../types';

interface LinkBoosterBannerProps {
  onBoostFromLink: (
    url: string,
    customKeyword?: string,
    productName?: string,
    price?: number,
    category?: string
  ) => Promise<LiveSyncReport | void>;
  onClearAll: () => Promise<void>;
  isBoosting: boolean;
  totalProducts: number;
  maxProductSlots?: number;
}

const extractUrlsFromPaste = (raw: string): string[] => {
  const matches = raw.match(/https?:\/\/[^\s,;"'<>]+/gi);
  if (!matches) return [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const m of matches) {
    const cleaned = m.replace(/[)\]}.,;]+$/, '').trim();
    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned);
      unique.push(cleaned);
    }
  }
  return unique;
};

export const LinkBoosterBanner: React.FC<LinkBoosterBannerProps> = ({
  onBoostFromLink,
  onClearAll,
  isBoosting,
  totalProducts,
  maxProductSlots = 20,
}) => {
  const [url, setUrl] = useState('');
  const [customKeyword, setCustomKeyword] = useState('');
  const [productName, setProductName] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAdvancedSync, setShowAdvancedSync] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<string | null>(null);
  const [lastReport, setLastReport] = useState<LiveSyncReport | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url.trim()) return;

    await executeBoost(
      url.trim(),
      customKeyword.trim() || undefined,
      productName.trim() || undefined,
      priceInput ? parseInt(priceInput.replace(/\D/g, ''), 10) : undefined,
      selectedCategory.trim() || undefined
    );
  };

  const executeBoost = async (
    linkUrl: string,
    keyword?: string,
    prodName?: string,
    price?: number,
    category?: string
  ) => {
    if (!linkUrl.trim() || isSubmitting) return;

    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }

    const detectedUrls = extractUrlsFromPaste(linkUrl);
    const batchQty = Math.min(detectedUrls.length, maxProductSlots);
    const payloadUrl = batchQty >= 2 ? detectedUrls.slice(0, maxProductSlots).join('\n') : linkUrl.trim();
    const isVt = payloadUrl.includes('vt.tokopedia.com');

    setIsSubmitting(true);
    setLastReport(null);
    setConnectionStep(
      batchQty >= 2
        ? `Menghubungkan ${batchQty} link produk sekaligus secara live ke server TikTok Shop, Tokopedia & vt.tokopedia.com...`
        : isVt
        ? 'Menghubungi https://vt.tokopedia.com/, TikTok Open API & Tokopedia Gateway secara langsung...'
        : 'Melakukan resolve URL live & verifikasi handshake server TikTok Shop + Tokopedia...'
    );

    try {
      const report = await onBoostFromLink(payloadUrl, keyword, prodName, price, category);
      if (report) {
        setLastReport(report);
        const srcLabel =
          report.extractionSource === 'share_metadata'
            ? 'Metadata Resmi Link Server'
            : report.extractionSource === 'live_html'
            ? 'Halaman Produk Live'
            : report.extractionSource;
        setConnectionStep(
          report.batchCount && report.batchCount >= 2
            ? `${report.batchCount} Produk Tersinkron Live! HTTP ${report.httpStatus || 200} (${report.latencyMs}ms · LogID: ${report.logId || 'TLB'})`
            : `Tersinkron Live! HTTP ${report.httpStatus || 200} (${report.latencyMs}ms · LogID: ${report.logId || 'TLB'} · Sumber: ${srcLabel})`
        );
      } else {
        setConnectionStep('Sinkronisasi ke server selesai.');
      }
      clearTimerRef.current = setTimeout(() => {
        setUrl('');
        setCustomKeyword('');
        setProductName('');
        setPriceInput('');
        setSelectedCategory('');
        setConnectionStep(null);
        clearTimerRef.current = null;
      }, 2500);
    } catch {
      setConnectionStep(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant trigger when pasting directly into input (supports 1 or up to 20 links at once)
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim()) {
      e.preventDefault();
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
        clearTimerRef.current = null;
      }
      setUrl(pastedText.trim());
      await executeBoost(
        pastedText.trim(),
        customKeyword.trim() || undefined,
        productName.trim() || undefined,
        priceInput ? parseInt(priceInput.replace(/\D/g, ''), 10) : undefined,
        selectedCategory.trim() || undefined
      );
    }
  };

  // 1-Click Clipboard Reader Button
  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setUrl(text.trim());
          await executeBoost(
            text.trim(),
            customKeyword.trim() || undefined,
            productName.trim() || undefined,
            priceInput ? parseInt(priceInput.replace(/\D/g, ''), 10) : undefined,
            selectedCategory.trim() || undefined
          );
        }
      }
    } catch (err) {
      console.error('Clipboard access:', err);
    }
  };

  // Global window paste listener for instant friction-free paste anywhere on page
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      // If typing in another input (like search filter), don't hijack
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const pastedText = e.clipboardData?.getData('text');
      if (
        pastedText &&
        (pastedText.includes('http') ||
          pastedText.includes('vt.tokopedia') ||
          pastedText.includes('tokopedia') ||
          pastedText.includes('tiktok') ||
          pastedText.includes('vt.tiktok'))
      ) {
        e.preventDefault();
        setUrl(pastedText.trim());
        executeBoost(
          pastedText.trim(),
          customKeyword.trim() || undefined,
          productName.trim() || undefined,
          priceInput ? parseInt(priceInput.replace(/\D/g, ''), 10) : undefined,
          selectedCategory.trim() || undefined
        );
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [customKeyword, productName, priceInput, selectedCategory]);

  const handleUsePresetLink = async (
    presetUrl: string,
    keyword: string,
    name?: string,
    presetPrice?: number,
    cat?: string
  ) => {
    setUrl(presetUrl);
    setCustomKeyword(keyword);
    if (name) setProductName(name);
    if (presetPrice) setPriceInput(presetPrice.toString());
    if (cat) setSelectedCategory(cat);
    await executeBoost(presetUrl, keyword, name, presetPrice, cat);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background glow for TikTok + Tokopedia colors */}
      <div className="absolute -top-12 -right-12 w-52 h-52 bg-[#FE2C55]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-[#03AC0E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-[#25F4EE]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Banner Top Title & Badges */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FE2C55] bg-[#FE2C55]/10 px-2.5 py-0.5 rounded-full border border-[#FE2C55]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FE2C55] animate-ping" />
                <span>TikTok Shop API · Live</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#03AC0E] bg-[#03AC0E]/10 px-2.5 py-0.5 rounded-full border border-[#03AC0E]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#03AC0E] animate-ping" />
                <span>Tokopedia Open API · Live</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#25F4EE] bg-[#25F4EE]/10 px-2.5 py-0.5 rounded-full border border-[#25F4EE]/30 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
                <span>https://vt.tokopedia.com/ · Terhubung Langsung</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                <Activity className="w-3 h-3 text-amber-400 animate-spin" />
                <span>Auto-Sync 1-Menit</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                <span>Slot Produk: {totalProducts}/{maxProductSlots}</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 flex-wrap">
              <span>Tempelkan Link Produk untuk Terkoneksi Real-Time & Kunci Peringkat #1 Teratas</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Cukup tempelkan 1 atau hingga <strong>{maxProductSlots} link produk sekaligus</strong> (<strong>Ctrl+V</strong>) dari <strong>https://vt.tokopedia.com/</strong>, <strong>TikTok Shop</strong>, atau <strong>Tokopedia</strong>. Sistem akan <strong>langsung menghubungkannya secara aman ke server</strong>, mengunci posisi teratas #1 di hasil pencarian, dan menjalankan sinkronisasi berkala <strong>setiap 1 menit sekali</strong>.
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
              <span>Kosongkan Katalog ({totalProducts}/{maxProductSlots})</span>
            </button>
          )}
        </div>

        {/* Big Input Form with Auto-Paste Listener & 1-Click Clipboard */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                rows={1}
                required
                onPaste={handlePaste}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder={`Tempelkan 1 atau hingga ${maxProductSlots} link produk TikTok, Tokopedia, atau https://vt.tokopedia.com/ di sini (Ctrl+V)...`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-10 pr-28 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#25F4EE] transition-colors font-mono resize-none leading-snug"
              />
              {/* Direct 1-Click Paste Clipboard Button */}
              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-mono transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
                title="Tempel link dari papan klip (Clipboard)"
              >
                <Clipboard className="w-3.5 h-3.5 text-[#25F4EE]" />
                <span className="hidden md:inline">Tempel</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isBoosting || !url.trim()}
              className="px-6 py-3 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] hover:from-rose-500 hover:to-emerald-500 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              <Zap className={`w-4 h-4 fill-current ${isSubmitting ? 'animate-bounce' : ''}`} />
              <span>
                {isSubmitting ? 'Menghubungkan ke Server...' : 'Konek & Kunci #1 Teratas'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Connection Pipeline Notification */}
          {connectionStep && (
            <div className="p-3 bg-slate-950 border border-[#25F4EE]/50 rounded-xl flex items-center gap-2.5 text-xs text-[#25F4EE] animate-in fade-in duration-200 shadow-md">
              <Server className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''} text-[#25F4EE] shrink-0`} />
              <span className="font-mono font-medium">{connectionStep}</span>
            </div>
          )}

          {lastReport && !connectionStep && (
            <div className="p-3 bg-slate-950/90 border border-emerald-800/60 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  HTTP {lastReport.httpStatus || 200} · {lastReport.latencyMs}ms · LogID: {lastReport.logId || 'TLB'} · HMAC: {lastReport.hmacSignature}
                </span>
              </div>
              {lastReport.needsManualReview && (
                <span className="text-amber-300 font-sans">
                  Shortlink terproteksi — klik "Edit Produk" di tabel jika ingin menyesuaikan nama produk.
                </span>
              )}
            </div>
          )}

          {/* Optional custom keyword toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAdvancedSync(!showAdvancedSync)}
                className="text-slate-300 hover:text-[#25F4EE] transition-colors flex items-center gap-1.5 cursor-pointer font-medium bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#25F4EE]" />
                <span>{showAdvancedSync ? '− Sembunyikan' : '+ Sinkronkan'} Detail Produk & Kata Kunci Khusus</span>
              </button>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Auto-Paste Aktif: Langsung terhubung & auto-sync tiap 1 menit
              </span>
            </div>

            {/* Quick preset links to test with 1 click */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-500 text-[11px]">Uji Coba 1-Klik:</span>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://vt.tokopedia.com/t/ZS2k91aL/sepatu-sneakers-pria-running',
                    'sepatu sneakers pria viral vt tokopedia',
                    'Sepatu Sneakers Pria Running Casual VT',
                    189000,
                    'Sepatu & Fashion Pria'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-[#25F4EE]/50 flex items-center gap-1.5 shadow-sm"
                title="Uji coba link vt.tokopedia.com (Shop | Tokopedia Dedicated Video Bridge)"
              >
                <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
                <span>⚡ vt.tokopedia.com: Sepatu Viral</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://www.tokopedia.com/aerostreet/aerostreet-sepatu-sneakers-pria-running-casual',
                    'sepatu sneakers pria terlaris viral',
                    'Aerostreet Sepatu Sneakers Pria Running Casual',
                    159000,
                    'Sepatu & Fashion Pria'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-[#03AC0E]/40 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
                <span>👟 Tokopedia: Sepatu</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://tokopedia.link/soundpods-x9-bass-bluetooth',
                    'tws earphone bluetooth bass murah',
                    'SoundPods X9 ANC Wireless Earbuds Bluetooth 5.4',
                    145000,
                    'Elektronik & Gadget'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-[#25F4EE]/40 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#25F4EE]" />
                <span>🎧 TWS Earbuds</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePresetLink(
                    'https://vt.tiktok.com/ZSj9821aL/product/lumina-serum-glowing-pencerah',
                    'serum pencerah viral bpom',
                    'Lumina Radiance 10% Niacinamide Glowing Serum',
                    89000,
                    'Kecantikan & Perawatan'
                  )
                }
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-mono transition-colors cursor-pointer border border-[#FE2C55]/40 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
                <span>✨ TikTok: Serum</span>
              </button>
            </div>
          </div>

          {/* Collapsible Smart Product Verification & Sync Box */}
          {showAdvancedSync && (
            <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-semibold flex items-center gap-1.5 text-[#25F4EE]">
                  <Globe className="w-4 h-4" />
                  Smart Product Metadata Sync (Sinkronisasi Otomatis Kolom Produk)
                </span>
                <span className="text-[11px] text-slate-500">Opsional: Isi bila ingin menyesuaikan judul/kategori khusus</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Nama Produk Asli (Sinkronisasi)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Sepatu Sneakers Running Casual"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Kata Kunci Pencarian Target</label>
                  <input
                    type="text"
                    placeholder="Contoh: sepatu sneakers pria viral"
                    value={customKeyword}
                    onChange={(e) => setCustomKeyword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-[#25F4EE] font-mono text-xs focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-mono">Estimasi Harga (Rp)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 159000"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-emerald-400 font-mono text-xs focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              {/* 1-Click Category Badges */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[11px] text-slate-400">Pilih Kategori Cepat:</span>
                {[
                  'Sepatu & Fashion Pria',
                  'Fashion Wanita & Hijab',
                  'Elektronik & Gadget',
                  'Kecantikan & Skincare',
                  'Rumah Tangga & Dapur',
                  'Makanan & Minuman',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#25F4EE]/20 text-[#25F4EE] border-[#25F4EE]'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
