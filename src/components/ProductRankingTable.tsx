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
  Shield,
  Trash2,
  Lock,
  Globe,
  Award,
  LayoutGrid,
  Table as TableIcon,
  ShoppingBag,
  Package,
  Pencil,
  X,
  Sliders,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { TikTokProduct } from '../types';

interface ProductRankingTableProps {
  products: TikTokProduct[];
  maxProductSlots?: number;
  onBoostSingle: (id: string) => void;
  onOpenAiModal: (product: TikTokProduct) => void;
  onViewSimulator: (product: TikTokProduct) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct?: (id: string, updated: Partial<TikTokProduct>) => Promise<void>;
  onClearAll: () => Promise<void>;
  isBoosting: boolean;
  onUsePresetLink?: (url: string, keyword: string) => void;
}

export const ProductRankingTable: React.FC<ProductRankingTableProps> = ({
  products,
  maxProductSlots = 20,
  onBoostSingle,
  onOpenAiModal,
  onViewSimulator,
  onDeleteProduct,
  onUpdateProduct,
  onClearAll,
  isBoosting,
  onUsePresetLink,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'tokopedia'>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<TikTokProduct | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    targetKeyword: string;
    category: string;
    price: number;
    originalPrice: number;
    platform: 'both' | 'tiktok' | 'tokopedia';
    optimizedTitle: string;
    tokopediaTitle: string;
  }>({
    name: '',
    targetKeyword: '',
    category: '',
    price: 99000,
    originalPrice: 169000,
    platform: 'both',
    optimizedTitle: '',
    tokopediaTitle: '',
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (platformFilter === 'all') return true;
    if (platformFilter === 'tiktok') return p.platform === 'tiktok' || p.platform === 'both';
    if (platformFilter === 'tokopedia') return p.platform === 'tokopedia' || p.platform === 'both';
    return true;
  });

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartEdit = (product: TikTokProduct) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      targetKeyword: product.targetKeyword,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      platform: product.platform,
      optimizedTitle: product.optimizedTitle,
      tokopediaTitle: product.tokopediaTitle || `${product.name} - ${product.targetKeyword} Original Tokopedia Official Store`,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !onUpdateProduct) return;
    setIsSavingEdit(true);
    try {
      await onUpdateProduct(editingProduct.id, {
        name: editForm.name.trim(),
        targetKeyword: editForm.targetKeyword.trim(),
        category: editForm.category.trim(),
        price: Number(editForm.price),
        originalPrice: Number(editForm.originalPrice),
        platform: editForm.platform,
        optimizedTitle: editForm.optimizedTitle.trim(),
        tokopediaTitle: editForm.tokopediaTitle.trim(),
      });
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const totalSold = products.reduce((acc, p) => acc + p.soldCount, 0);
  const avgCtr = products.length ? (products.reduce((acc, p) => acc + p.ctr, 0) / products.length).toFixed(1) : '0';
  const totalOutranked = products.reduce((acc, p) => acc + p.competitorsOutranked, 0);

  return (
    <div className="space-y-6">
      {/* 4-Column Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Peringkat Terkunci (Dual Server)</span>
            <span className="text-amber-400 font-mono font-semibold">
              {products.length > 0 ? `Slot ${products.length}/${maxProductSlots} · #1` : `0/${maxProductSlots} Slot`}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {products.length > 0 ? `${products.length}/${maxProductSlots} Produk` : '0 Produk'}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {products.length > 0 ? 'Semua #1 TikTok + Tokopedia' : 'Menunggu Link'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {products.length > 0 ? `Kapasitas aktif ${products.length} dari ${maxProductSlots} slot` : `Siap boost hingga ${maxProductSlots} produk sekaligus`}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Produk Terjual (GMV)</span>
            <span className="text-[#25F4EE] font-mono">
              {products.length > 0 ? 'Velocity +21%/hr' : '0/hr'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {totalSold.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400">unit terjual</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {products.length > 0 ? 'Penjualan sinkron ke TikTok & Tokopedia' : 'Belum ada transaksi dalam antrean'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rata-Rata CTR Pencarian</span>
            <span className="text-emerald-400 font-mono">
              {products.length > 0 ? 'Top 1% Indonesia' : 'Standby'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{avgCtr}%</span>
            <span className="text-xs text-slate-400">rasio klik</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {products.length > 0 ? 'Dioptimalkan lewat judul SEO & keyword exact' : 'Otomatis dihitung saat link ditempel'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Kompetitor Dilompati</span>
            <span className="text-rose-400 font-mono">Dual Defense</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">{totalOutranked}</span>
            <span className="text-xs text-slate-400">toko saingan</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {products.length > 0 ? 'Digeser dari posisi pencarian teratas' : 'Otomatis outrank toko saingan'}
          </div>
        </div>
      </div>

      {/* Control Bar: Search, View Mode Switcher, & Platform Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dalam daftar produk (nama produk, kata kunci, kategori, atau SKU)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#25F4EE] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle: Kolom Tabel vs Kartu */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table' ? 'bg-slate-800 text-[#25F4EE] font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kolom Tabel Terstruktur"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Kolom Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards' ? 'bg-slate-800 text-[#25F4EE] font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Kartu Produk Responsif"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kartu</span>
            </button>
          </div>

          {/* Platform filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                platformFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({products.length}/{maxProductSlots})
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                platformFilter === 'tiktok' ? 'bg-[#FE2C55] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>TikTok</span>
            </button>
            <button
              onClick={() => setPlatformFilter('tokopedia')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                platformFilter === 'tokopedia' ? 'bg-[#03AC0E] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Tokopedia</span>
            </button>
          </div>

          {/* Clear all products button */}
          {products.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-2.5 py-1.5 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
              title="Kosongkan semua produk dalam katalog"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Product Container */}
      {filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-14 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#FE2C55]/15 via-slate-800 to-[#03AC0E]/15 border border-slate-700 flex items-center justify-center text-white">
            <Package className="w-8 h-8 text-[#25F4EE]" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-white">
              {products.length === 0
                ? 'Katalog Produk Kosong · Siap Menerima Link Produk'
                : 'Tidak ada produk yang cocok dengan pencarian'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              {products.length === 0
                ? 'Cukup tempelkan link produk TikTok Shop atau Tokopedia pada kotak input di atas (Ctrl+V). Sistem akan otomatis mengenali nama produk yang sebenarnya, kategori, harga, dan mengisi formula judul sesuai link yang ditempelkan.'
                : 'Coba ubah kata kunci pencarian Anda atau kembalikan filter platform ke Semua.'}
            </p>
          </div>

          {products.length === 0 && (
            <div className="pt-3 border-t border-slate-800/80 max-w-2xl mx-auto space-y-2.5">
              <span className="text-xs text-slate-400 block font-medium">
                Atau uji coba otomatis dengan contoh link berikut:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUsePresetLink
                      ? onUsePresetLink(
                          'https://vt.tokopedia.com/t/ZS2k91aL/sepatu-sneakers-pria-running',
                          'sepatu sneakers pria viral vt tokopedia'
                        )
                      : null
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] rounded-lg text-xs font-mono transition-colors border border-[#25F4EE]/50 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
                  <span>⚡ vt.tokopedia.com: Sepatu Viral</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUsePresetLink
                      ? onUsePresetLink(
                          'https://www.tokopedia.com/aerostreet/aerostreet-sepatu-sneakers-pria-running-casual',
                          'sepatu sneakers pria terlaris viral'
                        )
                      : null
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
                  <span>👟 Sepatu Sneakers (Tokopedia)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUsePresetLink
                      ? onUsePresetLink(
                          'https://www.tokopedia.com/official/tas-ransel-laptop-waterproof-pria-anti-air',
                          'tas ransel laptop pria anti air'
                        )
                      : null
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
                  <span>🎒 Tas Ransel Laptop (Tokopedia)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUsePresetLink
                      ? onUsePresetLink(
                          'https://tokopedia.link/soundpods-x9-bass-bluetooth',
                          'tws earphone bluetooth bass murah'
                        )
                      : null
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#25F4EE]" />
                  <span>🎧 TWS Earbuds (Tokopedia/TikTok)</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUsePresetLink
                      ? onUsePresetLink(
                          'https://vt.tiktok.com/ZSj9821aL/product/lumina-serum-glowing-pencerah',
                          'serum pencerah viral bpom'
                        )
                      : null
                  }
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
                  <span>✨ Skincare Serum (TikTok Shop)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* ================= STRUCTURED DATA COLUMNS TABLE (NO PHOTOS) ================= */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-400 font-mono">
                  <th className="py-3 px-4 font-semibold w-80">Kolom Produk</th>
                  <th className="py-3 px-4 font-semibold w-48">Target Pencarian</th>
                  <th className="py-3 px-4 font-semibold w-44">Peringkat Server</th>
                  <th className="py-3 px-4 font-semibold w-40">Harga & Terjual</th>
                  <th className="py-3 px-4 font-semibold min-w-[280px]">Formula Judul SEO (Copy)</th>
                  <th className="py-3 px-4 font-semibold text-right w-48">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((product, pIdx) => (
                  <tr key={`${product.id}_${pIdx}`} className="hover:bg-slate-800/40 transition-colors">
                    {/* Kolom 1: Produk (Tanpa Foto) */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-start gap-3">
                        {/* Branded Category Icon Badge instead of image */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700/80 flex flex-col items-center justify-center shrink-0 text-slate-300 shadow-inner">
                          <Package className="w-5 h-5 text-[#25F4EE]" />
                          <span className="text-[8px] font-black text-amber-400 font-mono leading-none mt-0.5">
                            #1
                          </span>
                        </div>

                        <div className="min-w-0 space-y-1.5 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-white leading-snug text-xs sm:text-sm">
                              {product.name}
                            </p>
                            <button
                              onClick={() => handleStartEdit(product)}
                              className="p-1 text-slate-400 hover:text-[#25F4EE] hover:bg-slate-800 rounded transition-colors shrink-0"
                              title="Edit Data Produk Ini"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="px-2 py-0.5 bg-slate-800 text-[#25F4EE] rounded border border-slate-700 font-mono font-semibold text-[10px]">
                              Slot #{pIdx + 1}/{maxProductSlots}
                            </span>
                            <span className="px-2 py-0.5 bg-slate-950 text-slate-300 rounded border border-slate-800 font-medium">
                              {product.category}
                            </span>
                            <span className="font-mono text-slate-400">{product.sku}</span>
                            {product.sellerHandle && (
                              <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 rounded border border-amber-800/60 font-mono text-[10px]">
                                Toko: {product.sellerHandle}
                              </span>
                            )}
                            {product.externalProductId && (
                              <span className="font-mono text-slate-400 text-[10px]">
                                ID: {product.externalProductId}
                              </span>
                            )}
                            {(product.sourceUrl?.includes('vt.tokopedia.com') || product.sku.startsWith('VT-')) && (
                              <span className="px-2 py-0.5 bg-[#25F4EE]/10 text-[#25F4EE] rounded border border-[#25F4EE]/30 font-mono font-medium text-[10px]">
                                Shop | Tokopedia (vt.tokopedia.com)
                              </span>
                            )}
                            <span className="text-slate-600">·</span>
                            <span className="text-emerald-400 font-semibold font-mono">
                              ★ {product.rating}
                            </span>
                          </div>

                          {product.sourceUrl && (
                            <div className="text-[10px] text-slate-500 font-mono truncate max-w-[260px] flex items-center gap-1">
                              <Globe className="w-3 h-3 shrink-0 text-slate-400" />
                              <span className="truncate">{product.sourceUrl}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Target Pencarian */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1.5">
                        <span className="inline-block px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-md text-[#25F4EE] font-mono font-medium text-[11px]">
                          "{product.targetKeyword}"
                        </span>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {product.searchVolume.toLocaleString('id-ID')} pencarian/bln
                        </div>
                        <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Exact Match 100%</span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 3: Peringkat Server */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1.5">
                        {(product.sourceUrl?.includes('vt.tokopedia.com') || product.sku.startsWith('VT-')) && (
                          <div className="flex items-center gap-1 text-[11px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-[#25F4EE]/15 text-[#25F4EE] border border-[#25F4EE]/30 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE] animate-pulse" />
                              vt.tokopedia.com #1 Video
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-[#FE2C55]/15 text-[#FE2C55] border border-[#FE2C55]/30 font-semibold">
                            TikTok #1 Paling Laris
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-[#03AC0E]/15 text-[#03AC0E] border border-[#03AC0E]/30 font-semibold">
                            Tokopedia #1 Terlaris
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-400" />
                          <span>TLS 1.3 Terkunci</span>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 4: Harga & Terjual */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <div className="font-mono font-bold text-white text-sm">
                          Rp {product.price.toLocaleString('id-ID')}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-medium">
                          {product.soldCount.toLocaleString('id-ID')} unit terjual
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Komisi: {product.affiliateCommission}%
                        </div>
                      </div>
                    </td>

                    {/* Kolom 5: Formula Judul SEO */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-2">
                        {/* TikTok formula */}
                        <div className="p-2.5 bg-slate-950/90 rounded-lg border border-slate-800">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-semibold text-[#FE2C55] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                              TikTok Shop Formula
                            </span>
                            <button
                              onClick={() => handleCopyText(`tbl_tk_${product.id}`, product.optimizedTitle)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                            >
                              {copiedId === `tbl_tk_${product.id}` ? (
                                <span className="text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Tersalin!
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <Copy className="w-3 h-3" /> Salin
                                </span>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-2">
                            {product.optimizedTitle}
                          </p>
                        </div>

                        {/* Tokopedia formula */}
                        <div className="p-2.5 bg-slate-950/90 rounded-lg border border-slate-800">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-semibold text-[#03AC0E] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#03AC0E]" />
                              Tokopedia Official SEO
                            </span>
                            <button
                              onClick={() => handleCopyText(`tbl_tkpd_${product.id}`, product.tokopediaTitle || product.name)}
                              className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                            >
                              {copiedId === `tbl_tkpd_${product.id}` ? (
                                <span className="text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle2 className="w-3 h-3" /> Tersalin!
                                </span>
                              ) : (
                                <span className="flex items-center gap-0.5">
                                  <Copy className="w-3 h-3" /> Salin
                                </span>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-300 font-mono text-[11px] leading-relaxed line-clamp-2">
                            {product.tokopediaTitle || `${product.name} - ${product.targetKeyword} Garansi Resmi 100% Original Tokopedia Official Store`}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 6: Aksi */}
                    <td className="py-3.5 px-4 align-top text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(product)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                        >
                          <Pencil className="w-3.5 h-3.5 text-[#25F4EE]" />
                          <span>Edit Produk</span>
                        </button>
                        <button
                          onClick={() => onViewSimulator(product)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          title="Lihat live monitor pencarian di server TikTok & Tokopedia"
                        >
                          <ExternalLink className="w-3 h-3 text-[#25F4EE]" />
                          <span>Live Monitor</span>
                        </button>
                        <button
                          onClick={() => onOpenAiModal(product)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] text-xs rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI SEO</span>
                        </button>
                        <button
                          onClick={() => onBoostSingle(product.id)}
                          disabled={isBoosting}
                          className="px-2.5 py-1 bg-gradient-to-r from-[#FE2C55] to-[#03AC0E] hover:opacity-90 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap disabled:opacity-50"
                        >
                          <Zap className="w-3 h-3 fill-current" />
                          <span>Boost 1-Mnt</span>
                        </button>
                        <button
                          onClick={() => onDeleteProduct(product.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded transition-colors cursor-pointer"
                          title="Hapus produk"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ================= RESPONSIVE BALANCED CARDS VIEW (NO PHOTOS) ================= */
        <div className="space-y-4">
          {filteredProducts.map((product, pIdx) => (
            <div
              key={`${product.id}_${pIdx}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 transition-all shadow-sm space-y-4"
            >
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* Left Column: Details without Photo (Columns 1-8) */}
                <div className="xl:col-span-8 flex flex-col sm:flex-row items-start gap-4">
                  {/* Category & Rank Badge Icon instead of image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex flex-col items-center justify-center shrink-0 text-slate-300 shadow-inner">
                    <Package className="w-7 h-7 text-[#25F4EE]" />
                    <span className="text-[10px] font-black text-amber-400 font-mono leading-none mt-1">
                      #1 SPOT
                    </span>
                  </div>

                  <div className="space-y-2 flex-1 min-w-0">
                    {/* Channel Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="px-2 py-0.5 bg-slate-800 text-[#25F4EE] border border-slate-700 rounded text-[10px] font-mono font-semibold">
                        Slot #{pIdx + 1}/{maxProductSlots}
                      </span>
                      {(product.sourceUrl?.includes('vt.tokopedia.com') || product.sku.startsWith('VT-')) && (
                        <span className="px-2 py-0.5 bg-[#25F4EE]/15 text-[#25F4EE] border border-[#25F4EE]/30 rounded text-[10px] font-mono font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE] animate-pulse" />
                          vt.tokopedia.com: #1 Video & Search
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-[#FE2C55]/15 text-[#FE2C55] border border-[#FE2C55]/30 rounded text-[10px] font-mono font-semibold">
                        TikTok: #1 Paling Laris
                      </span>
                      <span className="px-2 py-0.5 bg-[#03AC0E]/15 text-[#03AC0E] border border-[#03AC0E]/30 rounded text-[10px] font-mono font-semibold">
                        Tokopedia: #1 Terlaris ({product.tokopediaBadge || 'Official Store'})
                      </span>
                      {product.sellerHandle && (
                        <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 border border-amber-800/60 rounded text-[10px] font-mono">
                          Toko: {product.sellerHandle}
                        </span>
                      )}
                      {product.externalProductId && (
                        <span className="font-mono text-slate-400 text-[10px]">
                          ID: {product.externalProductId}
                        </span>
                      )}
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="font-mono text-slate-400 text-xs">{product.sku}</span>
                      <span className="text-slate-500 text-xs">·</span>
                      <span className="text-emerald-400 font-semibold text-xs">★ {product.rating}</span>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {product.name}
                      </h3>
                      <button
                        onClick={() => handleStartEdit(product)}
                        className="p-1.5 text-slate-400 hover:text-[#25F4EE] hover:bg-slate-800 rounded-lg transition-colors shrink-0 flex items-center gap-1 text-xs"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    {/* Target Keyword Banner */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-slate-400">Kata Kunci Pencarian:</span>
                      <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[#25F4EE] font-mono text-[11px] font-medium">
                        "{product.targetKeyword}"
                      </span>
                      <span className="text-slate-500 text-[11px] font-mono">
                        ({product.searchVolume.toLocaleString('id-ID')} pencarian/bln)
                      </span>
                    </div>

                    {/* Dual Titles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] text-[#FE2C55] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                            Formula TikTok Shop #1
                          </span>
                          <button
                            onClick={() => handleCopyText(`c_tk_${product.id}`, product.optimizedTitle)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                          >
                            {copiedId === `c_tk_${product.id}` ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Tersalin!
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <Copy className="w-3 h-3" /> Salin
                              </span>
                            )}
                          </button>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px] line-clamp-2">
                          {product.optimizedTitle}
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] text-[#03AC0E] font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#03AC0E]" />
                            Formula Tokopedia SEO #1
                          </span>
                          <button
                            onClick={() => handleCopyText(`c_tkpd_${product.id}`, product.tokopediaTitle || product.name)}
                            className="text-[10px] text-slate-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                          >
                            {copiedId === `c_tkpd_${product.id}` ? (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> Tersalin!
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5">
                                <Copy className="w-3 h-3" /> Salin
                              </span>
                            )}
                          </button>
                        </div>
                        <p className="text-slate-300 font-mono text-[11px] line-clamp-2">
                          {product.tokopediaTitle || `${product.name} - ${product.targetKeyword} Original Tokopedia Official Store`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Pricing & Fast Actions (Columns 9-12) */}
                <div className="xl:col-span-4 flex flex-row xl:flex-col items-center xl:items-end justify-between gap-4 p-3.5 bg-slate-950/50 rounded-xl border border-slate-800/80">
                  <div className="text-left xl:text-right space-y-0.5">
                    <div className="text-xs text-slate-400">Harga Jual TikTok & Tokopedia</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white font-mono tabular-nums">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-500 line-through font-mono">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      {product.soldCount.toLocaleString('id-ID')} unit terjual · Komisi {product.affiliateCommission}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => handleStartEdit(product)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Pencil className="w-3.5 h-3.5 text-[#25F4EE]" />
                      <span>Edit Produk</span>
                    </button>
                    <button
                      onClick={() => onViewSimulator(product)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      title="Lihat live monitor pencarian di server TikTok & Tokopedia"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#25F4EE]" />
                      <span>Live Monitor</span>
                    </button>
                    <button
                      onClick={() => onOpenAiModal(product)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI SEO</span>
                    </button>
                    <button
                      onClick={() => onBoostSingle(product.id)}
                      disabled={isBoosting}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] hover:from-rose-500 hover:to-emerald-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-sm cursor-pointer whitespace-nowrap disabled:opacity-50"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Boost 1-Menit</span>
                    </button>
                    <button
                      onClick={() => onDeleteProduct(product.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Hapus produk"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer: Tags & Sync Security */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500">Kata Kunci Terindeks:</span>
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
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Lock className="w-3 h-3" />
                    <span>TLS 1.3 Terenkripsi</span>
                  </span>
                  <span>·</span>
                  <span>CTR: <strong className="text-emerald-400">{product.ctr}%</strong></span>
                  <span>·</span>
                  <span>
                    Sinkronisasi Terakhir:{' '}
                    <span className="text-slate-300">
                      {new Date(product.lastBoosted).toLocaleTimeString('id-ID')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT PRODUCT MODAL ================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-800 text-[#25F4EE] rounded-lg">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Data Kolom Produk</h3>
                  <p className="text-xs text-slate-400">
                    Koreksi atau sesuaikan nama produk, kata kunci, dan harga agar 100% valid.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1">
                  <span>Nama Lengkap Produk</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Contoh: Aerostreet Sepatu Sneakers Pria Running Casual"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Target Search Keyword */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1">
                  <span>Kata Kunci Target Pencarian Terlaris</span>
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.targetKeyword}
                  onChange={(e) => setEditForm({ ...editForm, targetKeyword: e.target.value })}
                  placeholder="Contoh: sepatu sneakers pria terlaris viral"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-[#25F4EE] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Category & Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Kategori Produk</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="Contoh: Sepatu & Alas Kaki"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Target Server Platform</label>
                  <select
                    value={editForm.platform}
                    onChange={(e) => setEditForm({ ...editForm, platform: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#25F4EE]"
                  >
                    <option value="both">TikTok Shop & Tokopedia (Dual Boost #1)</option>
                    <option value="tiktok">Khusus TikTok Shop</option>
                    <option value="tokopedia">Khusus Tokopedia Official Store</option>
                  </select>
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Harga Jual Diskon (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Harga Asli Coret (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={editForm.originalPrice}
                    onChange={(e) => setEditForm({ ...editForm, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#25F4EE]"
                  />
                </div>
              </div>

              {/* TikTok Formula Title */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
                  <span>Formula Judul TikTok Shop #1</span>
                </label>
                <textarea
                  rows={2}
                  value={editForm.optimizedTitle}
                  onChange={(e) => setEditForm({ ...editForm, optimizedTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Tokopedia Formula Title */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
                  <span>Formula Judul Tokopedia Official SEO #1</span>
                </label>
                <textarea
                  rows={2}
                  value={editForm.tokopediaTitle}
                  onChange={(e) => setEditForm({ ...editForm, tokopediaTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] hover:from-rose-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingEdit ? 'Menyimpan...' : 'Simpan & Sinkronkan ke Server'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
