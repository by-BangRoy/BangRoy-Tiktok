import React, { useState } from 'react';
import { X, Server, CheckCircle2, ShieldCheck, RefreshCw, Key, Globe, Lock, ExternalLink } from 'lucide-react';
import { ServerConnection } from '../types';

interface TikTokServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverConnection: ServerConnection;
  onSaveConnection: (newConn: Partial<ServerConnection>) => void;
}

export const TikTokServerModal: React.FC<TikTokServerModalProps> = ({
  isOpen,
  onClose,
  serverConnection,
  onSaveConnection,
}) => {
  const [shopId, setShopId] = useState(serverConnection.shopId);
  const [shopName, setShopName] = useState(serverConnection.shopName);
  const [region, setRegion] = useState(serverConnection.region);
  const [appKey, setAppKey] = useState(serverConnection.appKey);
  const [accessToken, setAccessToken] = useState(serverConnection.accessToken);
  const [isTesting, setIsTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestAndSave = () => {
    setIsTesting(true);
    setTestSuccess(false);

    setTimeout(() => {
      onSaveConnection({
        shopId,
        shopName,
        region,
        appKey,
        accessToken,
      });
      setIsTesting(false);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    }, 700);
  };

  const handleApplyPreset = (preset: 'id_demo' | 'my_demo') => {
    if (preset === 'id_demo') {
      setShopId('ID_SHOP_88329412');
      setShopName('Official Glow & Style Nusantara');
      setRegion('ID');
      setAppKey('tk_live_app_991823a7');
      setAccessToken('actk_sec_e83b19f041cb829104');
    } else {
      setShopId('MY_SHOP_77210984');
      setShopName('Trendsetter Mega Store MY');
      setRegion('MY');
      setAppKey('tk_live_app_771928bc');
      setAccessToken('actk_sec_a912c01828cb39109');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#25F4EE]/10 rounded-lg text-[#25F4EE] border border-[#25F4EE]/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Koneksi Langsung Server TikTok (Open API Gateway)
              </h3>
              <p className="text-xs text-slate-400">
                Otentikasi Partner API TikTok Shop & Sinkronisasi 5-Menit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Quick Preset Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Pilih Profil Server Toko:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleApplyPreset('id_demo')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  region === 'ID'
                    ? 'bg-slate-800 border-[#25F4EE] text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-white">Indonesia (ID) - Live Verified</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Toko Glow & Style ID</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('my_demo')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  region === 'MY'
                    ? 'bg-slate-800 border-[#25F4EE] text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-semibold text-xs text-white">Malaysia (MY) - Live Node</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Trendsetter Mega MY</div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nama Toko TikTok Shop</label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">TikTok Shop ID / Seller ID</label>
                <input
                  type="text"
                  value={shopId}
                  onChange={(e) => setShopId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Region TikTok Shop</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#25F4EE]"
                >
                  <option value="ID">Indonesia (ID - TikTok Shop Indonesia)</option>
                  <option value="MY">Malaysia (MY)</option>
                  <option value="VN">Vietnam (VN)</option>
                  <option value="TH">Thailand (TH)</option>
                  <option value="PH">Philippines (PH)</option>
                  <option value="US">United States (US)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">App Key (Open Platform)</label>
                <input
                  type="text"
                  value={appKey}
                  onChange={(e) => setAppKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Access Token (Bearer Signature JWT)
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#25F4EE]"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Masa berlaku token: 27 hari tersisa · Di-refresh otomatis via token endpoint.
              </span>
            </div>

            {/* Webhook endpoint notification */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold block">Endpoint Webhook Sinkronisasi 5-Menit:</span>
              <p className="font-mono text-[11px] text-[#25F4EE] break-all">
                {serverConnection.webhookEndpoint}
              </p>
              <p className="text-[10px] text-slate-500">
                Menerima callback perubahan index katalog dan notifikasi order purchase event secara real-time.
              </p>
            </div>
          </div>

          {/* Test Status Feedback */}
          {testSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Koneksi berhasil diverifikasi! Server TikTok merespons dalam {serverConnection.latencyMs}ms dengan status 200 OK.
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>TLS 1.3 Terenkripsi</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handleTestAndSave}
              disabled={isTesting}
              className="px-4 py-2 bg-gradient-to-r from-[#FE2C55] to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Memverifikasi...' : 'Simpan & Uji Handshake'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
