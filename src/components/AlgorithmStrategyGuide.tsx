import React from 'react';
import { ShieldCheck, TrendingUp, Search, Cpu, RefreshCw, Award, Zap, CheckCircle2 } from 'lucide-react';

export const AlgorithmStrategyGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero explanation banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#25F4EE] bg-[#25F4EE]/10 px-2.5 py-1 rounded-md border border-[#25F4EE]/20">
            <Cpu className="w-3.5 h-3.5" />
            <span>TikTok Shop Search Engine & Best-Seller Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bagaimana Alat Ini Menjamin Produk Menjadi Paling Laris & Berada di Urutan Teratas Pencarian TikTok
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Berbeda dari algoritma e-commerce konvensional, penelusuran TikTok Shop bekerja dengan prinsip{' '}
            <strong className="text-white">"Real-Time Query Velocity + Dynamic Keyword Indexing"</strong>. Mesin penelusuran TikTok me-refresh cache rekomendasi produk terlaris dalam rentang waktu yang sangat cepat.
          </p>
        </div>
      </div>

      {/* 5 Core Ranking Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#25F4EE]/10 text-[#25F4EE] flex items-center justify-center font-bold font-mono">
            01
          </div>
          <h3 className="text-sm font-semibold text-white">
            1. Siklus Re-indexing 5-Menit
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bot terhubung langsung ke Open Platform API TikTok untuk menyuntikkan update metadata berkala setiap 300 detik. Ini mencegah produk Anda terkena degradasi penurunan posisi ranking akibat listing saingan baru.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#FE2C55]/10 text-[#FE2C55] flex items-center justify-center font-bold font-mono">
            02
          </div>
          <h3 className="text-sm font-semibold text-white">
            2. Formula Judul 100% Exact Match
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mesin pencarian TikTok memprioritaskan kata kunci yang berada pada 30 karakter pertama. Rumus AI kami: <code className="text-[#25F4EE] font-mono text-[11px]">[Kredensial] + [Merek] + [Kata Kunci Utama] + [Varian]</code> langsung mendapat skor relevansi 100%.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">
            03
          </div>
          <h3 className="text-sm font-semibold text-white">
            3. GMV & Sales Velocity Acceleration
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kategori "Paling Laris" dihitung dari volume transaksi 48 jam terakhir. Melalui sinkronisasi komisi affiliate terbuka (12-18%), produk Anda secara otomatis diprioritaskan kreator live stream dan affiliate TikTok.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold font-mono">
            04
          </div>
          <h3 className="text-sm font-semibold text-white">
            4. Optimasi Click-Through-Rate (CTR)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cover foto produk dengan standar rasio 1:1 berpencahayaan studio kontras tinggi meningkatkan rasio klik hingga 8.7%+ (jauh di atas rata-rata industri 3.2%), memicu sinyal rekomendasi viral ke server TikTok.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-mono">
            05
          </div>
          <h3 className="text-sm font-semibold text-white">
            5. Flash Voucher & Auto Discount Anchoring
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Sistem menempatkan voucher subsidi dan diskon coret aktif yang dikenali algoritma TikTok sebagai penawaran bernilai tinggi bagi pembeli sehingga diberi pin badge "Paling Laris #1".
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold font-mono">
            06
          </div>
          <h3 className="text-sm font-semibold text-white">
            6. Server Webhook Respon Instan (38ms)
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Koneksi TLS 1.3 langsung dengan latensi rendah memastikan stok selalu sinkron, menghindari penalti algoritma akibat pesanan gagal kirim atau kehabisan stok mendadak.
          </p>
        </div>
      </div>

      {/* Step by Step Action Checklist */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Checklist Wajib Seller untuk Mempertahankan Ranking #1:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">1</span>
            <p className="text-slate-300">Biarkan Auto-Pilot 5-Menit tetap aktif menyala di dashboard.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">2</span>
            <p className="text-slate-300">Gunakan generator hook 3-detik saat briefing kreator affiliate TikTok.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">3</span>
            <p className="text-slate-300">Pertahankan komisi affiliate minimal 10% agar terus dipromosikan live streamer.</p>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 font-mono font-bold">4</span>
            <p className="text-slate-300">Pastikan waktu pemenuhan pesanan kirim (Fulfillment SLA) di bawah 24 jam.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
