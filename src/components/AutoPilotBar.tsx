import React from 'react';
import { Timer, Play, Pause, Server, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import { ServerConnection } from '../types';

interface AutoPilotBarProps {
  countdown: number;
  intervalMinutes: number;
  isAutoPilotActive: boolean;
  onToggleAutoPilot: () => void;
  onChangeInterval: (mins: number) => void;
  serverConnection: ServerConnection;
  onOpenServerModal: () => void;
  totalProducts: number;
  onQuickAiAll: () => void;
}

export const AutoPilotBar: React.FC<AutoPilotBarProps> = ({
  countdown,
  intervalMinutes,
  isAutoPilotActive,
  onToggleAutoPilot,
  onChangeInterval,
  serverConnection,
  onOpenServerModal,
  totalProducts,
  onQuickAiAll,
}) => {
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = intervalMinutes * 60;
  const progressPercent = Math.max(0, Math.min(100, ((totalSeconds - countdown) / totalSeconds) * 100));

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: 5-Minute Auto-Pilot Countdown Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-lg text-[#25F4EE] border border-slate-700/60">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-medium text-slate-200">Auto-Refresh Server 5-Menit</span>
                <span aria-hidden="true">·</span>
                <span className="text-[11px] font-mono">Setiap {intervalMinutes} Menit</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white tabular-nums tracking-tight">
                  {formattedTime}
                </span>
                <span className="text-xs text-slate-400">menuju refresh algoritma berikutnya</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="hidden sm:block w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
            <div
              className="h-full bg-gradient-to-r from-[#25F4EE] to-[#FE2C55] transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Start/Pause Auto-Pilot button */}
          <button
            onClick={onToggleAutoPilot}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              isAutoPilotActive
                ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isAutoPilotActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Auto-Pilot Aktif</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Mulai Auto-Pilot</span>
              </>
            )}
          </button>

          {/* Interval selector */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-800/90 rounded-lg border border-slate-700/60 text-xs">
            {[1, 3, 5, 10].map((mins) => (
              <button
                key={mins}
                onClick={() => onChangeInterval(mins)}
                className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer ${
                  intervalMinutes === mins
                    ? 'bg-[#FE2C55] text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Right: Server Telemetry & Quick Action */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div
            onClick={onOpenServerModal}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 cursor-pointer transition-colors"
            title="Klik untuk konfigurasi kredensial TikTok Open Platform"
          >
            <Server className="w-3.5 h-3.5 text-[#25F4EE]" />
            <span className="font-mono text-slate-300">{serverConnection.shopId}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">{serverConnection.latencyMs}ms</span>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">Garansi Peringkat #1 Terlaris</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">{totalProducts} Produk Aktif</span>
          </div>

          <button
            onClick={onQuickAiAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#25F4EE]" />
            <span>AI Bulk Keyword Re-index</span>
          </button>
        </div>
      </div>
    </div>
  );
};
