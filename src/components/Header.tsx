import React from 'react';
import { Zap, RefreshCw, Radio } from 'lucide-react';
import { VtServerStatus } from '../types';

interface HeaderProps {
  onOpenServerModal: () => void;
  onTriggerGlobalBoost: () => void;
  isBoosting: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
  tokopediaConnected: boolean;
  vtServerStatus?: VtServerStatus;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenServerModal,
  onTriggerGlobalBoost,
  isBoosting,
  activeTab,
  setActiveTab,
  isConnected,
  tokopediaConnected,
  vtServerStatus,
}) => {
  const vtLatency = vtServerStatus?.latencyMs ? `${vtServerStatus.latencyMs}ms` : 'Connecting...';
  const vtStatusText = vtServerStatus?.httpStatus ? `HTTP ${vtServerStatus.httpStatus}` : 'Probing...';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FE2C55] via-slate-900 to-[#03AC0E] flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#25F4EE]" />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              TikTok & Tokopedia Boost
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 border border-slate-700 text-slate-300 rounded">
              by BangRoy
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isConnected && tokopediaConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>Server vt.tokopedia.com + TikTok Open API · Live Engine</span>
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('products')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 ${
            activeTab === 'products' ? 'border-[#FE2C55] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Katalog & Peringkat #1
        </button>
        <button
          onClick={() => setActiveTab('monitor')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 flex items-center gap-1.5 ${
            activeTab === 'monitor' ? 'border-[#03AC0E] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
          <span>Live Monitor Pencarian Real-Time</span>
        </button>
        <button
          onClick={() => setActiveTab('strategy')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 ${
            activeTab === 'strategy' ? 'border-[#FE2C55] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Algoritma & Strategi Terlaris
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 ${
            activeTab === 'logs' ? 'border-[#03AC0E] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Audit Log Server 1-Menit
        </button>
        <button
          onClick={onOpenServerModal}
          className="text-slate-300 hover:text-[#25F4EE] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer"
        >
          <Radio className={`w-3.5 h-3.5 ${vtServerStatus?.connected ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>
            vt.tokopedia.com ({vtStatusText} · {vtLatency})
          </span>
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTriggerGlobalBoost}
          disabled={isBoosting}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] rounded-lg hover:from-rose-500 hover:to-emerald-500 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isBoosting ? 'animate-spin' : ''}`} />
          <span>{isBoosting ? 'Menyinkronkan Server...' : 'Sinkronkan Server Sekarang'}</span>
        </button>
      </div>
    </header>
  );
};
