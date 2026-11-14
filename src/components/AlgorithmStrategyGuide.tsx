import React from 'react';
import { ShieldCheck, TrendingUp, Search, Cpu, RefreshCw, Award, Zap, CheckCircle2, ShoppingBag, Layers, Lock } from 'lucide-react';

export const AlgorithmStrategyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero explanation banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#FE2C55] bg-[#FE2C55]/10 px-2.5 py-1 rounded-md border border-[#FE2C55]/30">
              <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
              TikTok Shop Search Engine
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#03AC0E] bg-[#03AC0E]/10 px-2.5 py-1 rounded-md border border-[#03AC0E]/30">
              <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
              Tokopedia Search Engine
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#25F4EE] bg-[#25F4EE]/10 px-2.5 py-1 rounded-md border border-[#25F4EE]/30">
              <Lock className="w-3 h-3" />
              Dual-Gateway TLS 1.3
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bagaimana Alat Ini Mengunci Posisi #1 Terlaris di TikTok Shop dan Tokopedia Secara Bersamaan
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dalam ekosistem integrasi <strong>Shop | Tokopedia</strong> di Indonesia, kedua platform memiliki mesin pencarian tersinkronisasi. Alat ini menghubungkan link produk langsung ke server Open API kedua pihak dengan protokol aman <strong>TLS 1.3 & HMAC-SHA256</strong>, menjamin listing produk Anda langsung mendominasi pencarian paling atas.
          </p>
        </div>
      </div>

      {/* 6 Core Ranking Pillars for Dual Engine */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#25F4EE]/10 text-[#25F4EE] flex items-center justify-center font-bold font-mono">
            01
          </div>
          <h3 className="text-sm font-semibold text-white">
            1. Siklus Re-indexing Real-Time 1-Menit
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bot terhubung langsung ke Open Platform API TikTok dan Tokopedia Seller API untuk menyuntikkan update metadata berkala setiap 60 detik (1 menit). Ini mengunci posisi produk Anda di peringkat paling atas secara real-time.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold font-mono">
            02
          </div>
          <h3 className="text-sm font-semibold text-white">
            2. Formula Judul TikTok Shop #1
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            TikTok Shop memprioritaskan kata kunci pada 30 karakter pertama dengan elemen kredensial BPOM/Garansi dan varian viral: <code className="text-[#25F4EE] font-mono text-[11px]">[Kredensial] + [Merek] + [Kata Kunci] + [Trigger Viral]</code> dengan skor relevansi 100%.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#03AC0E]/10 text-[#03AC0E] flex items-center justify-center font-bold font-mono">
            03
          </div>
          <h3 className="text-sm font-semibold text-white">
            3. Formula Judul Tokopedia SEO
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Algoritma pencarian Tokopedia menyukai format bersih tanpa spam kata: <code className="text-[#03AC0E] font-mono text-[11px]">[Jenis Produk] + [Merek] + [Model/Varian] + [Kata Kunci Spesifik]</code> yang langsung dipasangkan dengan badge Official Store.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">
            04
          </div>
          <h3 className="text-sm font-semibold text-white">
            4. GMV & Sales Velocity Acceleration
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kategori "Paling Laris" dihitung dari volume transaksi 48 jam terakhir. Sinkronisasi komisi affiliate TikTok dan voucher Bebas Ongkir Extra Tokopedia mempercepat pesanan masuk dari ribuan calon pembeli harian.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
            05
          </div>
          <h3 className="text-sm font-semibold text-white">
            5. Enkripsi Aman TLS 1.3 & HMAC-SHA256
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seluruh data tautan produk yang Anda tempelkan dikirim melalui terowongan aman terenkripsi (TLS 1.3) dan diverifikasi dengan kunci signature HMAC resmi untuk memastikan konektivitas tanpa blokir dari server e-commerce.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold font-mono">
            06
          </div>
          <h3 className="text-sm font-semibold text-white">
            6. Server Webhook Dual Respon Cepat (28ms)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Koneksi dual-server edge ID Asia memastikan inventori stok dan harga selalu selaras di kedua platform, menghindari penalti algoritma pencarian akibat stok kosong mendadak atau keterlambatan konfirmasi pesanan.
          </p>
        </div>
      </div>

      {/* Checklist Wajib */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Checklist Wajib Seller untuk Mempertahankan Ranking #1 di TikTok Shop & Tokopedia:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">1</span>
            <p className="text-slate-300">Biarkan Auto-Pilot 1-Menit tetap aktif menyala di dashboard sistem.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">2</span>
            <p className="text-slate-300">Gunakan generator hook 3-detik saat briefing kreator live streaming affiliate.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">3</span>
            <p className="text-slate-300">Aktifkan promo Bebas Ongkir Extra di Tokopedia dan voucher toko di TikTok Shop.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">4</span>
            <p className="text-slate-300">Pertahankan SLA kirim paket pesanan di bawah 24 jam untuk memaksimalkan skor algoritma.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
