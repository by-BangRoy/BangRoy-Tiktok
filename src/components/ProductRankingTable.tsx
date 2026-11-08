import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Sparkles,
  ExternalLink,
  Zap,
  CheckCircle2,
  Copy,
  Tag,
  ChevronRight,
  Shield,
  Percent,
  Trash2,
} from 'lucide-react';
import { TikTokProduct } from '../types';

interface ProductRankingTableProps {
  products: TikTokProduct[];
  onBoostSingle: (id: string) => void;
  onOpenAiModal: (product: TikTokProduct) => void;
  onViewSimulator: (product: TikTokProduct) => void;
  onDeleteProduct: (id: string) => void;
  onClearAll: () => Promise<void>;
  isBoosting: boolean;
}

export const ProductRankingTable: React.FC<ProductRankingTableProps> = ({
  products,
  onBoostSingle,
  onOpenAiModal,
  onViewSimulator,
  onDeleteProduct,
  onClearAll,
  isBoosting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyTitle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalSold = products.reduce((acc, p) => acc + p.soldCount, 0);
  const avgCtr = products.length ? (products.reduce((acc, p) => acc + p.ctr, 0) / products.length).toFixed(1) : '0';
  const totalOutranked = products.reduce((acc, p) => acc + p.competitorsOutranked, 0);

  return (
    <div className="space-y-6">
      {/* 4-Column Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Peringkat Terlaris Terkunci</span>
            <span className="text-amber-400 font-mono">100% #1</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">#1 SPOT</span>
            <span className="text-xs text-emerald-400 font-medium">Semua Produk Teratas</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Garansi algoritma TikTok Shop ID</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Produk Terjual (GMV)</span>
            <span className="text-[#25F4EE] font-mono">Velocity +18%/hr</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalSold.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400">unit</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Penjualan aktif terhubung server TikTok
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rata-Rata CTR Pencarian</span>
            <span className="text-emerald-400 font-mono">Industry Avg: 3.2%</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{avgCtr}%</span>
            <span className="text-xs text-slate-400">CTR organik</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Dinaikkan via optimasi cover & judul SEO
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Kompetitor Dilompati</span>
            <span className="text-rose-400 font-mono">Top Rank Defense</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalOutranked}</span>
            <span className="text-xs text-slate-400">toko saingan</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Digeser ke peringkat #2 dan ke bawah
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dalam daftar produk yang di-boost berdasarkan nama, kata kunci, atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#25F4EE] transition-colors"
          />
        </div>
        <div className="text-xs text-slate-400 font-mono px-2 shrink-0">
          <span>{filteredProducts.length} Produk Terdaftar</span>
        </div>
      </div>

      {/* Product List Cards */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 sm:p-14 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FE2C55]/10 border border-[#FE2C55]/20 flex items-center justify-center text-[#FE2C55]">
              <Zap className="w-7 h-7 fill-current" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              {products.length === 0
                ? 'Katalog Kosong · Siap Menerima Link Produk TikTok'
                : 'Tidak ada produk yang cocok dengan pencarian'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {products.length === 0
                ? 'Semua produk telah dikosongkan. Tempelkan link produk TikTok Shop Anda pada kotak input di atas untuk langsung mem-boost ke posisi #1 Terlaris dan mengaktifkan auto-refresh 5 menit.'
                : 'Coba sesuaikan kata kunci pencarian Anda atau tambahkan produk baru.'}
            </p>
            {products.length === 0 && (
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Mendukung link: vt.tiktok.com · shop.tiktok.com · www.tiktok.com
              </div>
            )}
          </div>
        ) : (
          filteredProducts.map((product, pIdx) => (
            <div
              key={`${product.id}_${pIdx}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                {/* Product thumbnail & core identity */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/70 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow font-mono">
                      #1 TERLARIS
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-200 font-medium">{product.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{product.sku}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400 font-semibold">★ {product.rating}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300 tabular-nums">
                        {product.soldCount.toLocaleString('id-ID')} Terjual
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                      {product.name}
                    </h3>

                    {/* Target Keyword Banner */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-0.5">
                      <span className="text-slate-400">Target Pencarian TikTok:</span>
                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[#25F4EE] font-mono text-[11px] font-medium">
                        "{product.targetKeyword}"
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        ({product.searchVolume.toLocaleString('id-ID')} pencarian/bln)
                      </span>
                    </div>

                    {/* Algorithmic Optimized Title Snippet */}
                    <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/90 text-xs">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] text-[#25F4EE] font-semibold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Formula Judul Algoritma TikTok (Terindeks Prioritas #1)
                        </span>
                        <button
                          onClick={() => handleCopyTitle(product.id, product.optimizedTitle)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedId === product.id ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin Judul</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-2">
                        {product.optimizedTitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics & Boost Action Box */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className="text-xs text-slate-400">Harga Jual & Diskon TikTok</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white font-mono tabular-nums">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-mono">
                      Komisi Affiliate: {product.affiliateCommission}% (Boost Penjualan Cepat)
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => onViewSimulator(product)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      title="Lihat tampilan peringkat produk di simulasi pencarian aplikasi TikTok"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#25F4EE]" />
                      <span>Cek di TikTok Search</span>
                    </button>

                    <button
                      onClick={() => onOpenAiModal(product)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI SEO & Hook</span>
                    </button>

                    <button
                      onClick={() => onBoostSingle(product.id)}
                      disabled={isBoosting}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#FE2C55] to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Boost 5-Menit</span>
                    </button>

                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Hapus produk dari pantauan boost"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub-bar tags & sync status */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500">Kata Kunci Viral Terinjeksi:</span>
                  {product.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800 text-[11px] font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span>CTR: <strong className="text-emerald-400">{product.ctr}%</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>CVR: <strong className="text-slate-200">{product.conversionRate}%</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Sinkronisasi Terakhir:{' '}
                    <span className="text-slate-300">
                      {new Date(product.lastBoosted).toLocaleTimeString('id-ID')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
