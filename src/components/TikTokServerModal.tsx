import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Globe,
  Lock,
  DownloadCloud,
  AlertCircle,
} from 'lucide-react';
import { ServerConnection, TokopediaConnection, VtServerStatus } from '../types';

interface TikTokServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverConnection: ServerConnection;
  tokopediaConnection: TokopediaConnection;
  vtServerStatus?: VtServerStatus;
  onSaveConnection: (newConn: any) => Promise<any>;
  onSyncShopCatalog?: () => Promise<any>;
}

export const TikTokServerModal: React.FC<TikTokServerModalProps> = ({
  isOpen,
  onClose,
  serverConnection,
  tokopediaConnection,
  vtServerStatus,
  onSaveConnection,
  onSyncShopCatalog,
}) => {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'tokopedia' | 'vttokopedia' | 'security'>('tiktok');

  // TikTok state
  const [shopId, setShopId] = useState(serverConnection.shopId);
  const [shopName, setShopName] = useState(serverConnection.shopName);
  const [region, setRegion] = useState(serverConnection.region);
  const [appKey, setAppKey] = useState(serverConnection.appKey);
  const [appSecret, setAppSecret] = useState(serverConnection.appSecret || '');
  const [accessToken, setAccessToken] = useState(serverConnection.accessToken);

  // Tokopedia state
  const [tkpdShopId, setTkpdShopId] = useState(tokopediaConnection.shopId);
  const [tkpdShopName, setTkpdShopName] = useState(tokopediaConnection.shopName);
  const [tkpdFsId, setTkpdFsId] = useState(tokopediaConnection.fsId);
  const [tkpdClientId, setTkpdClientId] = useState(tokopediaConnection.clientId);
  const [tkpdClientSecret, setTkpdClientSecret] = useState(tokopediaConnection.clientSecret);
  const [tkpdAccessToken, setTkpdAccessToken] = useState(tokopediaConnection.accessToken);
  const [tkpdTier, setTkpdTier] = useState(tokopediaConnection.tier);

  const [isTesting, setIsTesting] = useState(false);
  const [isSyncingCatalog, setIsSyncingCatalog] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);
  const [catalogMsg, setCatalogMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setShopId(serverConnection.shopId);
      setShopName(serverConnection.shopName);
      setRegion(serverConnection.region);
      setAppKey(serverConnection.appKey);
      setAppSecret(serverConnection.appSecret || '');
      setAccessToken(serverConnection.accessToken);

      setTkpdShopId(tokopediaConnection.shopId);
      setTkpdShopName(tokopediaConnection.shopName);
      setTkpdFsId(tokopediaConnection.fsId);
      setTkpdClientId(tokopediaConnection.clientId);
      setTkpdClientSecret(tokopediaConnection.clientSecret);
      setTkpdAccessToken(tokopediaConnection.accessToken);
      setTkpdTier(tokopediaConnection.tier);
    }
  }, [isOpen, serverConnection, tokopediaConnection]);

  if (!isOpen) return null;

  const handleTestAndSave = async () => {
    setIsTesting(true);
    setTestResultMsg(null);
    try {
      const res = await onSaveConnection({
        shopId,
        shopName,
        region,
        appKey,
        appSecret,
        accessToken,
        tkpdShopId,
        tkpdShopName,
        tkpdFsId,
        tkpdClientId,
        tkpdClientSecret,
        tkpdAccessToken,
        tkpdTier,
      });
      const tkStatus = res?.handshakeDiagnostics?.tiktok?.httpStatus ?? serverConnection.lastHttpStatus;
      const tkLat = res?.handshakeDiagnostics?.tiktok?.latencyMs ?? serverConnection.latencyMs;
      const tkpdStatus = res?.handshakeDiagnostics?.tokopedia?.httpStatus ?? tokopediaConnection.lastHttpStatus;
      const tkpdLat = res?.handshakeDiagnostics?.tokopedia?.latencyMs ?? tokopediaConnection.latencyMs;
      const vtLat = res?.vtServerStatus?.latencyMs ?? vtServerStatus?.latencyMs;
      setTestResultMsg(
        `Handshake live selesai: TikTok API HTTP ${tkStatus} (${tkLat}ms) · Tokopedia API HTTP ${tkpdStatus} (${tkpdLat}ms) · vt.tokopedia.com (${vtLat}ms).`
      );
    } catch {
      setTestResultMsg('Gagal melakukan handshake ke server gateway.');
    } finally {
      setIsTesting(false);
    }
  };

  const handlePullCatalog = async () => {
    if (!onSyncShopCatalog) return;
    setIsSyncingCatalog(true);
    setCatalogMsg(null);
    try {
      const res = await onSyncShopCatalog();
      if (res?.importedCount > 0) {
        setCatalogMsg(`Berhasil menarik ${res.importedCount} produk live dari API toko!`);
      } else {
        const msg =
          res?.diagnostics?.tiktok?.message ||
          res?.diagnostics?.tokopedia?.message ||
          'Belum ada produk yang ditarik dari Partner API.';
        setCatalogMsg(msg);
      }
    } finally {
      setIsSyncingCatalog(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-[#FE2C55]/20 to-[#03AC0E]/20 rounded-xl text-white border border-slate-700">
              <Server className="w-5 h-5 text-[#25F4EE]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Konfigurasi Live Server: TikTok Shop & Tokopedia</span>
              </h3>
              <p className="text-xs text-slate-400">
                open-api.tiktokglobalshop.com · fs.tokopedia.net · vt.tokopedia.com (TLS 1.3 + HMAC-SHA256)
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

        {/* Tab switchers */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tiktok'
                ? 'border-[#FE2C55] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#FE2C55]" />
            <span>TikTok Open API</span>
            <span className="text-[10px] font-mono text-emerald-400">
              {serverConnection.latencyMs ? `${serverConnection.latencyMs}ms` : '...'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tokopedia')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'tokopedia'
                ? 'border-[#03AC0E] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#03AC0E]" />
            <span>Tokopedia Open API</span>
            <span className="text-[10px] font-mono text-emerald-400">
              {tokopediaConnection.latencyMs ? `${tokopediaConnection.latencyMs}ms` : '...'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vttokopedia')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'vttokopedia'
                ? 'border-[#25F4EE] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
            <span>vt.tokopedia.com</span>
            <span className="text-[10px] font-mono text-emerald-400">
              {vtServerStatus?.latencyMs ? `${vtServerStatus.latencyMs}ms` : '...'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'security'
                ? 'border-[#25F4EE] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#25F4EE]" />
            <span>Protokol Keamanan</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Tab 1: TikTok Form */}
          {activeTab === 'tiktok' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Status Gateway TikTok Shop Live:</span>
                  <span className="font-mono text-emerald-400">
                    HTTP {serverConnection.lastHttpStatus || '...'} · {serverConnection.latencyMs}ms ·{' '}
                    {serverConnection.authMode === 'partner_api' ? 'Partner OAuth Aktif' : 'Bridge Mode'}
                  </span>
                </div>
                {serverConnection.lastApiMessage && (
                  <p className="text-[11px] text-slate-300 font-mono">{serverConnection.lastApiMessage}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Toko TikTok Shop</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">TikTok Shop ID / Shop Cipher</label>
                  <input
                    type="text"
                    value={shopId}
                    onChange={(e) => setShopId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Region TikTok Shop</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  >
                    <option value="ID">Indonesia (ID - TikTok Shop Indonesia)</option>
                    <option value="MY">Malaysia (MY)</option>
                    <option value="VN">Vietnam (VN)</option>
                    <option value="TH">Thailand (TH)</option>
                    <option value="PH">Philippines (PH)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">App Key (TikTok Partner Center)</label>
                  <input
                    type="text"
                    value={appKey}
                    onChange={(e) => setAppKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    App Secret (Untuk HMAC-SHA256 Signing v2)
                  </label>
                  <input
                    type="password"
                    value={appSecret}
                    onChange={(e) => setAppSecret(e.target.value)}
                    placeholder="Masukkan App Secret dari TikTok Partner Center..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Access Token (x-tts-access-token)
                  </label>
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#FE2C55]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-semibold block">Endpoint Webhook TikTok (Aktif Menerima Push Event):</span>
                <p className="font-mono text-[11px] text-[#FE2C55] break-all">
                  {serverConnection.webhookEndpoint}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Tokopedia Form */}
          {activeTab === 'tokopedia' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Status Gateway fs.tokopedia.net Live:</span>
                  <span className="font-mono text-emerald-400">
                    HTTP {tokopediaConnection.lastHttpStatus || '...'} · {tokopediaConnection.latencyMs}ms ·{' '}
                    {tokopediaConnection.authMode === 'partner_api' ? 'OAuth Bearer Aktif' : 'Bridge Mode'}
                  </span>
                </div>
                {tokopediaConnection.lastApiMessage && (
                  <p className="text-[11px] text-slate-300 font-mono">{tokopediaConnection.lastApiMessage}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nama Toko Tokopedia</label>
                  <input
                    type="text"
                    value={tkpdShopName}
                    onChange={(e) => setTkpdShopName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tokopedia Shop ID</label>
                  <input
                    type="text"
                    value={tkpdShopId}
                    onChange={(e) => setTkpdShopId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Status Toko / Seller Tier</label>
                  <select
                    value={tkpdTier}
                    onChange={(e) => setTkpdTier(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  >
                    <option value="Official Store">Official Store (Prioritas Pencarian Tertinggi)</option>
                    <option value="Power Merchant PRO">Power Merchant PRO (Badge Unggul)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Fulfillment Service ID (FS ID)</label>
                  <input
                    type="text"
                    value={tkpdFsId}
                    onChange={(e) => setTkpdFsId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tokopedia Client ID</label>
                  <input
                    type="text"
                    value={tkpdClientId}
                    onChange={(e) => setTkpdClientId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">OAuth Bearer Access Token</label>
                  <input
                    type="password"
                    value={tkpdAccessToken}
                    onChange={(e) => setTkpdAccessToken(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-[#03AC0E]"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                <span className="text-slate-400 font-semibold block">Endpoint Webhook Tokopedia (Aktif Menerima Push Event):</span>
                <p className="font-mono text-[11px] text-[#03AC0E] break-all">
                  {tokopediaConnection.webhookEndpoint}
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: vt.tokopedia.com Live Edge Status */}
          {activeTab === 'vttokopedia' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-[#25F4EE]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <Globe className="w-4 h-4 text-[#25F4EE]" />
                    <span>vt.tokopedia.com Dedicated Gateway (Live Probe)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px] font-mono">
                    HTTP {vtServerStatus?.httpStatus || '...'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Server Engine:</span>
                    <span className="font-mono text-[#25F4EE] text-xs font-semibold block">
                      {vtServerStatus?.serverEngine || 'TLB (ByteDance Load Balancer)'}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Latensi Terukur Real-Time:</span>
                    <span className="font-mono text-emerald-400 text-xs font-semibold block">
                      {vtServerStatus?.latencyMs || 0}ms
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 text-[11px] block">Live ByteDance Trace ID (x-tt-trace-id):</span>
                    <span className="font-mono text-amber-300 text-[11px] break-all block">
                      {vtServerStatus?.traceId || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Security & Encryption */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enkripsi & Tanda Tangan API Kriptografis Nyata</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200 block">Protokol Jaringan:</span>
                    <span className="font-mono text-emerald-400 text-[11px]">TLS 1.3 Strict HTTPS</span>
                    <p className="text-[11px] text-slate-400">Koneksi langsung server-to-server menggunakan fetch Node TLS.</p>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                    <span className="font-semibold text-slate-200 block">Tanda Tangan API v2:</span>
                    <span className="font-mono text-[#25F4EE] text-[11px]">crypto.createHmac('sha256')</span>
                    <p className="text-[11px] text-slate-400">Menandatangani setiap request TikTok Open API dengan HMAC-SHA256.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Live Handshake & Catalog Pull Result */}
          {testResultMsg && (
            <div className="p-3.5 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testResultMsg}</span>
            </div>
          )}
          {catalogMsg && (
            <div className="p-3.5 bg-slate-950 border border-[#25F4EE]/50 rounded-xl text-xs text-slate-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#25F4EE] shrink-0 mt-0.5" />
              <span>{catalogMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            {onSyncShopCatalog && (
              <button
                type="button"
                onClick={handlePullCatalog}
                disabled={isSyncingCatalog}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-[#25F4EE] border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <DownloadCloud className={`w-3.5 h-3.5 ${isSyncingCatalog ? 'animate-bounce' : ''}`} />
                <span>{isSyncingCatalog ? 'Menarik Katalog...' : 'Tarik Katalog Toko (API)'}</span>
              </button>
            )}
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
              className="px-4 py-2 bg-gradient-to-r from-[#FE2C55] via-rose-600 to-[#03AC0E] hover:from-rose-500 hover:to-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Menguji Koneksi Live...' : 'Simpan & Uji Handshake Live'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
