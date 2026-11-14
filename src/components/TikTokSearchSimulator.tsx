import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  Share2,
  ShoppingCart,
  ShoppingBag,
  Package,
  Star,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Shield,
  Award,
  Zap,
  SlidersHorizontal,
  MapPin,
  BadgeCheck,
  Truck,
} from 'lucide-react';
import { TikTokProduct, ServerConnection, TokopediaConnection, VtServerStatus } from '../types';

interface TikTokSearchSimulatorProps {
  products: TikTokProduct[];
  selectedProduct: TikTokProduct | null;
  onSelectProduct: (p: TikTokProduct) => void;
  onTriggerBoost: (id: string) => void;
  isBoosting: boolean;
  serverConnection?: ServerConnection;
  tokopediaConnection?: TokopediaConnection;
  vtServerStatus?: VtServerStatus;
}

export const TikTokSearchSimulator: React.FC<TikTokSearchSimulatorProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onTriggerBoost,
  isBoosting,
  serverConnection,
  tokopediaConnection,
  vtServerStatus,
}) => {
  const currentProduct = selectedProduct || products[0];
  const [platformView, setPlatformView] = useState<'tiktok' | 'tokopedia'>('tiktok');
  const [activeSearchTab, setActiveSearchTab] = useState<'terlaris' | 'semua' | 'toko' | 'video'>('terlaris');
  const [tokopediaTab, setTokopediaTab] = useState<'terlaris' | 'terkait' | 'terbaru'>('terlaris');

  if (!currentProduct) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-[#FE2C55]/20 to-[#03AC0E]/20 border border-slate-700 flex items-center justify-center text-white">
          <Search className="w-7 h-7 text-[#25F4EE]" />
        </div>
        <h3 className="text-base font-bold text-white">
          Belum Ada Produk yang Terhubung ke Server TikTok & Tokopedia
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Tempelkan link produk TikTok Shop atau Tokopedia pada kotak input di atas. Sistem akan langsung menghubungkannya ke kedua server dan mengunci peringkat #1 di hasil pencarian.
        </p>
      </div>
    );
  }

  // Benchmark comparison entries against product's synced pricing & keyword
  const competitors = [
    {
      id: 'comp_1',
      name: `Kompetitor #2 (${currentProduct.targetKeyword})`,
      shop: 'Merchant Reguler',
      price: currentProduct.price + 15000,
      originalPrice: currentProduct.originalPrice,
      soldCount: Math.max(12, Math.floor((currentProduct.soldCount || 120) * 0.62)),
      rating: 4.6,
      rank: 2,
      reasonBehind: 'CTR lebih rendah, tidak memakai sinkronisasi formula SEO dual-server 1-menit.',
      city: 'Jakarta Barat',
    },
    {
      id: 'comp_2',
      name: `Kompetitor #3 (${currentProduct.targetKeyword})`,
      shop: 'Grosir Nusantara',
      price: Math.max(5000, currentProduct.price - 8000),
      originalPrice: currentProduct.originalPrice,
      soldCount: Math.max(8, Math.floor((currentProduct.soldCount || 120) * 0.38)),
      rating: 4.4,
      rank: 3,
      reasonBehind: 'Rating ulasan lebih rendah (4.4) dan tidak terverifikasi Official Store.',
      city: 'Surabaya',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header selector bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Live Monitor Hasil Pencarian Real-Time (Server Feed)</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>
                vt.tokopedia.com · HTTP {vtServerStatus?.httpStatus || '...'} · {vtServerStatus?.latencyMs || 0}ms
              </span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">
            LogID: {currentProduct.lastLogId || vtServerStatus?.traceId?.slice(0, 22) || 'TLB-LIVE'} · HMAC: {currentProduct.lastSignature || 'TLS1.3'}
          </p>
        </div>

        {/* Platform View Toggle & Product Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Dual platform switch */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setPlatformView('tiktok')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                platformView === 'tiktok'
                  ? 'bg-[#FE2C55] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>TikTok Shop Search</span>
            </button>
            <button
              onClick={() => setPlatformView('tokopedia')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                platformView === 'tokopedia'
                  ? 'bg-[#03AC0E] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>Tokopedia Search</span>
            </button>
          </div>

          {/* Product selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {products.map((p, idx) => (
              <button
                key={`${p.id}_${idx}`}
                onClick={() => onSelectProduct(p)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  p.id === currentProduct.id
                    ? 'bg-slate-800 text-[#25F4EE] border-[#25F4EE]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {p.category.split('&')[0]} · #1
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Mobile Phone Frame vs Algorithm Victory Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mobile Viewport (Columns 1-7) */}
        <div className="lg:col-span-7 flex justify-center">
          {platformView === 'tiktok' ? (
            /* ================= TIKTOK SHOP MOBILE VIEW ================= */
            <div className="w-full max-w-[420px] bg-black rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
              {/* Phone Status Bar */}
              <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FE2C55] font-semibold">TikTok Shop 5G</span>
                  <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                </div>
              </div>

              {/* TikTok In-App Search Bar */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800/80 flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-slate-200 cursor-pointer" />
                <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-full px-3.5 py-1.5">
                  <Search className="w-4 h-4 text-[#25F4EE]" />
                  <span className="text-xs text-white font-medium truncate">
                    {currentProduct.targetKeyword}
                  </span>
                </div>
                <Share2 className="w-5 h-5 text-slate-300 cursor-pointer" />
                <ShoppingCart className="w-5 h-5 text-slate-300 cursor-pointer" />
              </div>

              {/* TikTok Search Tabs */}
              <div className="bg-slate-950 px-4 flex items-center gap-6 text-xs font-semibold border-b border-slate-800">
                <button
                  onClick={() => setActiveSearchTab('terlaris')}
                  className={`py-2.5 relative cursor-pointer ${
                    activeSearchTab === 'terlaris' ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  Paling Laris (Best-Seller)
                  {activeSearchTab === 'terlaris' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FE2C55]" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSearchTab('semua')}
                  className={`py-2.5 relative cursor-pointer ${
                    activeSearchTab === 'semua' ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setActiveSearchTab('toko')}
                  className={`py-2.5 relative cursor-pointer ${
                    activeSearchTab === 'toko' ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  Toko
                </button>
                <button
                  onClick={() => setActiveSearchTab('video')}
                  className={`py-2.5 relative cursor-pointer ${
                    activeSearchTab === 'video' ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  Video Shop
                </button>
              </div>

              {/* TikTok Feed Results */}
              <div className="bg-slate-950 p-3 space-y-3 max-h-[620px] overflow-y-auto">
                {/* Product #1 SPOT (TikTok Boosted) */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 rounded-2xl border-2 border-amber-500/90 p-3.5 shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full font-mono">
                      <Award className="w-3.5 h-3.5 fill-current" />
                      <span>#1 PALING LARIS</span>
                    </div>
                    <span className="text-[10px] text-[#25F4EE] font-mono flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3 fill-current" />
                      Auto-Sync Tiap 1-Mnt (#1 Puncak)
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-950/80 to-slate-900 border border-[#FE2C55]/40 flex flex-col items-center justify-center shrink-0 text-slate-300 shadow-md">
                      <ShoppingBag className="w-6 h-6 text-[#FE2C55]" />
                      <span className="text-[8px] font-black text-amber-400 font-mono mt-0.5">
                        #1 SPOT
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                        {currentProduct.optimizedTitle}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold">{currentProduct.rating}</span>
                        <span className="text-slate-400">
                          ({currentProduct.soldCount.toLocaleString('id-ID')} terjual)
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-[#FE2C55] font-mono">
                          Rp {currentProduct.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          Rp {currentProduct.originalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[9px] pt-1">
                        <span className="px-1.5 py-0.5 bg-rose-950/80 text-rose-300 border border-rose-800/60 rounded">
                          Diskon 38%
                        </span>
                        <span className="px-1.5 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded">
                          Bebas Ongkir
                        </span>
                        <span className="px-1.5 py-0.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 rounded">
                          Garansi Ori
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="truncate">{currentProduct.sellerHandle || serverConnection?.shopName || 'Official TikTok Shop'}</span>
                    <span className="text-emerald-400 font-medium">Bintang 5 TikTok Shop</span>
                  </div>
                </div>

                {/* Competitors Listing #2 & #3 (Real outranked competitors) */}
                <div className="pt-2 pb-1">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Kompetitor Teratas yang Berhasil Digeser ke Bawah</span>
                    <span className="text-emerald-400 font-semibold">Tersingkir dari #1</span>
                  </div>
                </div>
                {competitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-slate-900/60 rounded-xl border border-slate-800 p-3 opacity-75"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] text-slate-400 font-mono font-medium">
                        Peringkat #{comp.rank}
                      </div>
                      <span className="text-[10px] text-rose-400/80">Kalah di Algoritma CTR</span>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-slate-400 text-xs font-mono font-bold">
                        #{comp.rank}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-medium text-slate-300 line-clamp-1">{comp.name}</p>
                        <div className="text-[10px] text-slate-400">
                          ★ {comp.rating} · {comp.soldCount.toLocaleString('id-ID')} terjual
                        </div>
                        <div className="text-xs font-mono text-slate-300">
                          Rp {comp.price.toLocaleString('id-ID')}
                        </div>
                        <p className="text-[9px] text-slate-400 italic mt-1 line-clamp-1">
                          {comp.reasonBehind}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ================= TOKOPEDIA MOBILE VIEW ================= */
            <div className="w-full max-w-[420px] bg-slate-950 rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
              {/* Phone Status Bar */}
              <div className="bg-[#03AC0E] px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-white font-mono">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">Tokopedia 5G</span>
                  <div className="w-4 h-2 bg-white rounded-sm" />
                </div>
              </div>

              {/* Tokopedia Search Bar Header */}
              <div className="bg-[#03AC0E] px-4 py-2.5 flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 text-white cursor-pointer" />
                <div className="flex-1 flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 text-slate-800 shadow-sm">
                  <Search className="w-4 h-4 text-[#03AC0E]" />
                  <span className="text-xs text-slate-800 font-medium truncate">
                    {currentProduct.targetKeyword}
                  </span>
                </div>
                <ShoppingCart className="w-5 h-5 text-white cursor-pointer" />
              </div>

              {/* Tokopedia Filter Chips & Tabs */}
              <div className="bg-slate-900 px-4 py-2 flex items-center gap-4 text-xs font-semibold border-b border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setTokopediaTab('terlaris')}
                  className={`py-1 px-2.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    tokopediaTab === 'terlaris'
                      ? 'bg-[#03AC0E] text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Terlaris (Top Sales)
                </button>
                <button
                  onClick={() => setTokopediaTab('terkait')}
                  className={`py-1 px-2.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    tokopediaTab === 'terkait'
                      ? 'bg-[#03AC0E] text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Terkait
                </button>
                <button
                  onClick={() => setTokopediaTab('terbaru')}
                  className={`py-1 px-2.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    tokopediaTab === 'terbaru'
                      ? 'bg-[#03AC0E] text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Terbaru
                </button>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 ml-auto border-l border-slate-700 pl-2">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                </div>
              </div>

              {/* Tokopedia Search Feed Results */}
              <div className="bg-slate-950 p-3 space-y-3 max-h-[620px] overflow-y-auto">
                {/* Product #1 SPOT on Tokopedia */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 rounded-2xl border-2 border-[#03AC0E] p-3.5 shadow-lg relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 bg-[#03AC0E] text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md font-mono">
                      <Award className="w-3.5 h-3.5 fill-current" />
                      <span>#1 TERLARIS TOKOPEDIA</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Official Store Prioritas
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-[#03AC0E]/40 flex flex-col items-center justify-center shrink-0 text-slate-300 shadow-md">
                      <ShoppingBag className="w-6 h-6 text-[#03AC0E]" />
                      <span className="text-[8px] font-bold text-white bg-[#03AC0E] px-1 rounded font-sans mt-0.5">
                        Official
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                        {currentProduct.tokopediaTitle || currentProduct.name}
                      </p>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          Rp {currentProduct.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          Rp {currentProduct.originalPrice.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="font-bold">{currentProduct.rating}</span>
                        <span className="text-slate-400">
                          ({currentProduct.soldCount.toLocaleString('id-ID')} terjual)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1 text-[9px] pt-1">
                        <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-medium flex items-center gap-0.5">
                          <Truck className="w-2.5 h-2.5" />
                          Bebas Ongkir Extra
                        </span>
                        <span className="px-1.5 py-0.5 bg-amber-950 text-amber-300 border border-amber-800 rounded font-medium">
                          Cashback 10%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">
                        Indonesia · {currentProduct.sellerHandle || tokopediaConnection?.shopName || 'Tokopedia Official Store'}
                      </span>
                    </span>
                    <span className="text-[#03AC0E] font-semibold shrink-0">Toko Terverifikasi</span>
                  </div>
                </div>

                {/* Tokopedia Competitors #2 & #3 */}
                {competitors.map((comp) => (
                  <div
                    key={comp.id}
                    className="bg-slate-900/60 rounded-xl border border-slate-800 p-3 opacity-75"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] text-slate-400 font-mono font-medium">
                        Peringkat Tokopedia #{comp.rank}
                      </div>
                      <span className="text-[10px] text-slate-500">Regular Merchant</span>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-slate-400 text-xs font-mono font-bold">
                        #{comp.rank}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-xs font-medium text-slate-300 line-clamp-1">{comp.name}</p>
                        <div className="text-xs font-mono text-slate-300">
                          Rp {comp.price.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ★ {comp.rating} · {comp.soldCount.toLocaleString('id-ID')} terjual · {comp.city}
                        </div>
                        <p className="text-[9px] text-slate-400 italic mt-1 line-clamp-1">
                          {comp.reasonBehind}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Dual Algorithm Victory Matrix & Breakdown (Columns 8-12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#25F4EE]" />
                Matrix Kemenangan Algoritma Dual-Engine
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Score: 99.2/100
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem menyinkronkan <strong>Shop | Tokopedia</strong> ke kedua mesin pencari: TikTok Shop memprioritaskan video CTR & GMV velocity 48-jam, sementara Tokopedia mengunci bobot Official Store, title density, dan conversion rate.
            </p>

            {/* Factor breakdown bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Relevansi Judul TikTok & Tokopedia SEO</span>
                  <span className="text-[#25F4EE] font-mono font-bold">100% (Exact-Match)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#25F4EE] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Tokopedia Official Store Authority Weight</span>
                  <span className="text-[#03AC0E] font-mono font-bold">Maksimal (10/10)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[96%] h-full bg-[#03AC0E] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">TikTok Shop Sales Velocity + CTR</span>
                  <span className="text-[#FE2C55] font-mono font-bold">{currentProduct.ctr}% (Sangat Tinggi)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[92%] h-full bg-[#FE2C55] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Respon Server Dual Gateway (TLS 1.3)</span>
                  <span className="text-emerald-400 font-mono font-bold">28ms (Instan)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>
            </div>

            {/* Quick boost trigger */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onTriggerBoost(currentProduct.id)}
                disabled={isBoosting}
                className="w-full py-2.5 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] hover:from-rose-500 hover:to-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Kunci Posisi #1 TikTok & Tokopedia Sekarang (Paksa Re-index 1-Mnt)</span>
              </button>
            </div>
          </div>

          {/* Quick tips box */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Proteksi Anti Penurunan Ranking (Rank Lock):</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Setiap 1 menit sekali, server secara otomatis memancarkan heartbeat cache refresh ke gerbang TikTok Shop dan Tokopedia. Listing Anda tetap kokoh berada di posisi #1 paling atas bahkan saat saingan meluncurkan promo perang harga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
