import React from 'react';
import { Timer, Play, Pause, Sparkles, Lock } from 'lucide-react';
import { ServerConnection, TokopediaConnection, VtServerStatus } from '../types';

interface AutoPilotBarProps {
  countdown: number;
  intervalMinutes: number;
  isAutoPilotActive: boolean;
  onToggleAutoPilot: () => void;
  onChangeInterval: (mins: number) => void;
  serverConnection: ServerConnection;
  tokopediaConnection: TokopediaConnection;
  vtServerStatus?: VtServerStatus;
  onOpenServerModal: () => void;
  totalProducts: number;
  maxProductSlots?: number;
  onQuickAiAll: () => void;
}

export const AutoPilotBar: React.FC<AutoPilotBarProps> = ({
  countdown,
  intervalMinutes,
  isAutoPilotActive,
  onToggleAutoPilot,
  onChangeInterval,
  serverConnection,
  tokopediaConnection,
  vtServerStatus,
  onOpenServerModal,
  totalProducts,
  maxProductSlots = 20,
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
        {/* Left: Auto-Pilot Countdown Status */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-800 rounded-lg text-[#25F4EE] border border-slate-700/60 shadow-sm">
              <Timer className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Auto-Sync Dual Server Real-Time
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[11px] font-mono text-[#25F4EE] bg-[#25F4EE]/10 px-1.5 py-0.2 rounded border border-[#25F4EE]/30">
                  Setiap {intervalMinutes} Menit Sekali (#1 Spot Lock)
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono text-white tabular-nums tracking-tight">
                  {formattedTime}
                </span>
                <span className="text-xs text-slate-400">menuju sinkronisasi otomatis ke server TikTok & Tokopedia</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="hidden sm:block w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/40">
            <div
              className="h-full bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#03AC0E] transition-all duration-1000 ease-linear rounded-full"
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
                <span>Auto-Pilot 1-Mnt Aktif</span>
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
            {[1, 2, 3, 5].map((mins) => (
              <button
                key={mins}
                onClick={() => onChangeInterval(mins)}
                className={`px-2.5 py-1 rounded-md font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                  intervalMinutes === mins
                    ? 'bg-gradient-to-r from-[#FE2C55] to-[#03AC0E] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={mins === 1 ? '1 Menit Sekali (Rekomendasi Utama Peringkat Teratas)' : `Setiap ${mins} Menit`}
              >
                {mins === 1 ? '⚡ 1m (Real-Time)' : `${mins}m`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Live Server Telemetry for TikTok, Tokopedia & vt.tokopedia.com */}
        <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
          <div
            onClick={onOpenServerModal}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-[#FE2C55]/30 cursor-pointer transition-colors"
            title={serverConnection.lastApiMessage || 'TikTok Shop Open Platform Gateway'}
          >
            <span className={`w-2 h-2 rounded-full ${serverConnection.isConnected ? 'bg-[#FE2C55]' : 'bg-amber-400'}`} />
            <span className="font-mono text-slate-300">
              TikTok ({serverConnection.authMode === 'partner_api' ? 'OAuth' : 'Bridge'})
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">
              {serverConnection.latencyMs ? `${serverConnection.latencyMs}ms` : '...'}
            </span>
          </div>

          <div
            onClick={onOpenServerModal}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-[#03AC0E]/30 cursor-pointer transition-colors"
            title={tokopediaConnection.lastApiMessage || 'Tokopedia Seller API Gateway'}
          >
            <span className={`w-2 h-2 rounded-full ${tokopediaConnection.isConnected ? 'bg-[#03AC0E]' : 'bg-amber-400'}`} />
            <span className="font-mono text-slate-300">
              Tokopedia ({tokopediaConnection.authMode === 'partner_api' ? 'OAuth' : 'Bridge'})
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">
              {tokopediaConnection.latencyMs ? `${tokopediaConnection.latencyMs}ms` : '...'}
            </span>
          </div>

          <div
            onClick={onOpenServerModal}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-[#25F4EE]/30 cursor-pointer transition-colors"
            title={`Endpoint: https://vt.tokopedia.com/ | TraceID: ${vtServerStatus?.traceId || '-'}`}
          >
            <span className={`w-2 h-2 rounded-full ${vtServerStatus?.connected ? 'bg-[#25F4EE] animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-mono text-slate-300">vt.tokopedia.com</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">
              {vtServerStatus?.latencyMs ? `${vtServerStatus.latencyMs}ms` : '...'} (HTTP {vtServerStatus?.httpStatus || '...'})
            </span>
          </div>

          <div className="hidden xl:flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">TLS 1.3 Terenkripsi</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">
              {totalProducts}/{maxProductSlots} Produk Aktif
            </span>
          </div>

          <button
            onClick={onQuickAiAll}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#25F4EE]" />
            <span>Re-Sync Live Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
