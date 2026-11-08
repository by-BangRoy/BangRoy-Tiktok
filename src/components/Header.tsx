import React from 'react';
import { Zap, RefreshCw, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenServerModal: () => void;
  onTriggerGlobalBoost: () => void;
  isBoosting: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenServerModal,
  onTriggerGlobalBoost,
  isBoosting,
  activeTab,
  setActiveTab,
  isConnected,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FE2C55] via-slate-900 to-[#25F4EE] flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#25F4EE]" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            Tiktok Boost by BangRoy
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Open Platform API · v2.4 Live
          </span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('products')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 ${
            activeTab === 'products' ? 'border-[#FE2C55] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Katalog & Peringkat #1
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer pb-0.5 border-b-2 ${
            activeTab === 'simulator' ? 'border-[#FE2C55] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Simulator Pencarian Terlaris
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
            activeTab === 'logs' ? 'border-[#FE2C55] text-white' : 'border-transparent text-slate-400'
          }`}
        >
          Audit Log Server 5-Menit
        </button>
        <button
          onClick={onOpenServerModal}
          className="text-slate-400 hover:text-[#25F4EE] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs font-mono"
        >
          <Radio className={`w-3.5 h-3.5 ${isConnected ? 'text-[#25F4EE]' : 'text-amber-400'}`} />
          <span>{isConnected ? 'Server Terhubung' : 'Konfigurasi Server'}</span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTriggerGlobalBoost}
          disabled={isBoosting}
          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#FE2C55] to-rose-600 rounded-lg hover:from-rose-500 hover:to-rose-700 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap shrink-0 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isBoosting ? 'animate-spin' : ''}`} />
          <span>{isBoosting ? 'Menyinkronkan Server...' : 'Boost Algoritma Sekarang'}</span>
        </button>
      </div>
    </header>
  );
};
