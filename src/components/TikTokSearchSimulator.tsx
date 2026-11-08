import React, { useState } from 'react';
import {
  Search,
  ArrowLeft,
  Share2,
  ShoppingCart,
  Star,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Shield,
  Award,
  Zap,
} from 'lucide-react';
import { TikTokProduct } from '../types';

interface TikTokSearchSimulatorProps {
  products: TikTokProduct[];
  selectedProduct: TikTokProduct | null;
  onSelectProduct: (p: TikTokProduct) => void;
  onTriggerBoost: (id: string) => void;
  isBoosting: boolean;
}

export const TikTokSearchSimulator: React.FC<TikTokSearchSimulatorProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onTriggerBoost,
  isBoosting,
}) => {
  const currentProduct = selectedProduct || products[0];
  const [activeSearchTab, setActiveSearchTab] = useState<'terlaris' | 'semua' | 'toko' | 'video'>('terlaris');

  if (!currentProduct) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FE2C55]/10 border border-[#FE2C55]/20 flex items-center justify-center text-[#FE2C55]">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-white">
          Belum Ada Produk yang Terhubung ke Server TikTok
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Tempelkan link produk TikTok Shop pada kotak input di atas. Sistem akan langsung menghubungkannya ke server dan menampilkan hasil penelusuran peringkat #1 di sini.
        </p>
      </div>
    );
  }

  // Simulated competitors in the same query
  const competitors = [
    {
      id: 'comp_1',
      name: `Produk Saingan Serupa (${currentProduct.targetKeyword})`,
      shop: 'Toko Sebelah Official Store',
      price: currentProduct.price + 15000,
      originalPrice: currentProduct.originalPrice,
      soldCount: Math.floor(currentProduct.soldCount * 0.62),
      rating: 4.6,
      rank: 2,
      reasonBehind: 'CTR lebih rendah (-2.5%), tidak mengoptimalkan formula judul SEO 5-menit TikTok Shop.',
    },
    {
      id: 'comp_2',
      name: `Alternatif Generic Import Murah`,
      shop: 'Grosir Nusantara Jaya',
      price: currentProduct.price - 8000,
      originalPrice: currentProduct.originalPrice,
      soldCount: Math.floor(currentProduct.soldCount * 0.38),
      rating: 4.4,
      rank: 3,
      reasonBehind: 'Rating ulasan lebih rendah (4.4), tingkat pembatalan pesanan tinggi, komisi affiliate minim.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header selector bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Simulator Pencarian Terlaris Aplikasi TikTok
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Melihat langsung bagaimana calon pembeli di Indonesia melihat produk Anda di peringkat teratas #1.
          </p>
        </div>

        {/* Product switcher */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-xs text-slate-400 whitespace-nowrap">Pilih Produk:</span>
          {products.map((p, idx) => (
            <button
              key={`${p.id}_${idx}`}
              onClick={() => onSelectProduct(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                p.id === currentProduct.id
                  ? 'bg-[#FE2C55] text-white border-[#FE2C55]'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {p.category.split('&')[0]} · #{p.currentRank}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: TikTok Mobile Frame vs Algorithm Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* TikTok Phone Viewport (Columns 1-7) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-[420px] bg-black rounded-3xl border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans">
            {/* Phone Top Notch / Status Bar */}
            <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
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

            {/* TikTok Search Tabs: Semua, Paling Laris, Toko, Video */}
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
                {activeSearchTab === 'semua' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FE2C55]" />
                )}
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

            {/* Feed of Search Results */}
            <div className="bg-slate-950 p-3 space-y-3 max-h-[640px] overflow-y-auto">
              {/* Product #1 SPOT (User's Boosted Product) */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 rounded-2xl border-2 border-amber-500/80 p-3 shadow-lg relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-full font-mono">
                    <Award className="w-3.5 h-3.5 fill-current" />
                    <span>#1 PALING LARIS</span>
                  </div>
                  <span className="text-[10px] text-[#25F4EE] font-mono">
                    Auto-Boosted Tiap 5-Mnt
                  </span>
                </div>

                <div className="flex gap-3">
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-sm text-white text-[9px] px-1 rounded font-mono">
                      Stok Ready
                    </div>
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
                  <span className="truncate">Official Glow & Style Nusantara</span>
                  <span className="text-emerald-400 font-medium">Bintang 5 TikTok Shop</span>
                </div>
              </div>

              {/* Competitors Listing #2 & #3 */}
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
                    <div className="w-20 h-20 rounded-lg bg-slate-800 shrink-0 flex items-center justify-center text-slate-600 text-xs font-mono">
                      Foto Saingan
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
        </div>

        {/* Algorithm Victory Matrix & Breakdown (Columns 8-12) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#25F4EE]" />
                Matrix Kemenangan Algoritma TikTok
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Score: 98.4/100
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Algoritma pencarian TikTok Shop memberi bobot prioritas tertinggi kepada produk dengan relevansi kata kunci judul 100%, velocity penjualan GMV 48 jam tercepat, dan refresh metadata berkala tiap 5 menit.
            </p>

            {/* Factor breakdown bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Relevansi Query Judul (Exact Match)</span>
                  <span className="text-[#25F4EE] font-mono font-bold">100% (Unggul)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-[#25F4EE] rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Sales Velocity (Kecepatan Pesanan Masuk)</span>
                  <span className="text-emerald-400 font-mono font-bold">+18% per Jam</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-emerald-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Predicted CTR Cover & Hook</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {currentProduct.ctr}% (Tinggi)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[88%] h-full bg-amber-400 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Kecepatan Respon Server Webhook</span>
                  <span className="text-white font-mono font-bold">38ms (Ultra Cepat)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-[99%] h-full bg-[#FE2C55] rounded-full" />
                </div>
              </div>
            </div>

            {/* Quick boost trigger */}
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => onTriggerBoost(currentProduct.id)}
                disabled={isBoosting}
                className="w-full py-2.5 bg-gradient-to-r from-[#FE2C55] to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Kunci Posisi #1 Sekarang (Paksa Re-index 5-Menit)</span>
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
              Sistem secara otomatis memperbarui cache penelusuran TikTok Shop setiap 5 menit agar mesin penelusuran tidak mendegradasi listing Anda saat kompetitor mengunggah varian baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
