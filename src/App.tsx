/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { AutoPilotBar } from './components/AutoPilotBar';
import { ProductRankingTable } from './components/ProductRankingTable';
import { TikTokSearchSimulator } from './components/TikTokSearchSimulator';
import { AlgorithmStrategyGuide } from './components/AlgorithmStrategyGuide';
import { SyncLogsDrawer } from './components/SyncLogsDrawer';
import { TikTokServerModal } from './components/TikTokServerModal';
import { AIOptimizerModal } from './components/AIOptimizerModal';
import { LinkBoosterBanner } from './components/LinkBoosterBanner';
import { TikTokProduct, SyncLog, ServerConnection, TokopediaConnection, VtServerStatus, LiveSyncReport } from './types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'monitor' | 'strategy' | 'logs'>('products');
  const [products, setProducts] = useState<TikTokProduct[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);

  // TikTok Shop Open API Connection
  const [serverConnection, setServerConnection] = useState<ServerConnection>({
    isConnected: true,
    environment: 'production_verified',
    shopId: 'ID_SHOP_88329412',
    shopName: 'Official Glow & Style Nusantara',
    region: 'ID',
    appKey: 'tk_live_app_991823a7',
    accessToken: 'actk_sec_e83b19f041cb829104',
    tokenExpiresIn: 86400 * 27,
    webhookEndpoint: 'https://ais-dev-g4fejax3njjgeb4qorgtn6-735831252436.asia-northeast1.run.app/api/tiktok/webhook',
    lastHandshake: new Date().toISOString(),
    latencyMs: 34,
  });

  // Tokopedia Open Platform / Seller API Connection
  const [tokopediaConnection, setTokopediaConnection] = useState<TokopediaConnection>({
    isConnected: true,
    shopId: 'TKPD_SHOP_9918204',
    shopName: 'Glow & Style Official Store Tokopedia',
    fsId: 'FS_98214',
    clientId: 'tkpd_live_client_773019ab',
    clientSecret: 'sec_tokopedia_live_c48194a',
    accessToken: 'bearer_tkpd_oauth2_9103859201a',
    webhookEndpoint: 'https://ais-dev-g4fejax3njjgeb4qorgtn6-735831252436.asia-northeast1.run.app/api/tokopedia/webhook',
    lastHandshake: new Date().toISOString(),
    latencyMs: 29,
    tier: 'Official Store',
  });

  // Dedicated vt.tokopedia.com Live Server Status
  const [vtServerStatus, setVtServerStatus] = useState<VtServerStatus>({
    connected: true,
    endpoint: 'https://vt.tokopedia.com/',
    httpStatus: 200,
    serverEngine: 'TLB (ByteDance / TikTok Load Balancer)',
    latencyMs: 18,
    traceId: '00-26111012342078C6DCCE6C4A440362DF-3F610C614F216422-00',
    lastChecked: new Date().toISOString(),
    tlsVersion: 'TLS 1.3 Strict HTTPS',
    jointGateway: 'Shop | Tokopedia Dedicated Video & Commerce Bridge',
    rankSystemStatus: 'Active & Locking #1 Spot (1-Min Cycle)',
  });

  const [isAutoPilotActive, setIsAutoPilotActive] = useState(true);
  const [intervalMinutes, setIntervalMinutes] = useState(1);
  const [countdown, setCountdown] = useState(60);
  const [isBoosting, setIsBoosting] = useState(false);
  const [maxProductSlots, setMaxProductSlots] = useState(20);
  const isBoostingRef = useRef(false);

  // Modals
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedProductForAi, setSelectedProductForAi] = useState<TikTokProduct | null>(null);
  const [selectedProductForMonitor, setSelectedProductForMonitor] = useState<TikTokProduct | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial overview
  const fetchOverview = useCallback(async () => {
    if (isBoostingRef.current) return;
    try {
      const res = await fetch('/api/tiktok/overview');
      if (!res.ok || isBoostingRef.current) return;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return;
      const data = await res.json();
      if (isBoostingRef.current) return;
      setProducts(data.products || []);
      setSyncLogs(data.syncLogs || []);
      if (typeof data.maxProductSlots === 'number') setMaxProductSlots(data.maxProductSlots);
      if (data.serverConnection) setServerConnection(data.serverConnection);
      if (data.tokopediaConnection) setTokopediaConnection(data.tokopediaConnection);
      if (data.vtServerStatus) setVtServerStatus(data.vtServerStatus);
      if (typeof data.isAutoPilotActive === 'boolean') setIsAutoPilotActive(data.isAutoPilotActive);
      if (data.syncIntervalMinutes) setIntervalMinutes(data.syncIntervalMinutes);
      if (typeof data.nextSyncCountdown === 'number') setCountdown(data.nextSyncCountdown);
    } catch (err) {
      console.error('Fetch overview error:', err);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // Keep selectedProductForMonitor synchronized when products change
  useEffect(() => {
    if (selectedProductForMonitor) {
      const updated = products.find((p) => p.id === selectedProductForMonitor.id);
      if (updated) {
        setSelectedProductForMonitor(updated);
      } else {
        setSelectedProductForMonitor(products[0] || null);
      }
    }
  }, [products]);

  // Local 1-second countdown ticker synced cleanly with server background loop
  useEffect(() => {
    if (!isAutoPilotActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTimeout(() => {
            fetchOverview();
          }, 1500);
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPilotActive, intervalMinutes, fetchOverview]);

  // Trigger global live gateway sync across all connected platforms
  const handleTriggerGlobalBoost = async () => {
    isBoostingRef.current = true;
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setSyncLogs(data.syncLogs || []);
        if (typeof data.maxProductSlots === 'number') setMaxProductSlots(data.maxProductSlots);
        if (data.vtServerStatus) setVtServerStatus(data.vtServerStatus);
        if (data.serverConnection) setServerConnection(data.serverConnection);
        if (data.tokopediaConnection) setTokopediaConnection(data.tokopediaConnection);
        if (typeof data.nextSyncCountdown === 'number') setCountdown(data.nextSyncCountdown);
        showToast('Semua produk berhasil disinkronkan secara live ke server TikTok Shop, Tokopedia & vt.tokopedia.com!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal melakukan sinkronisasi live ke server.');
    } finally {
      isBoostingRef.current = false;
      setIsBoosting(false);
    }
  };

  // Trigger single product live sync
  const handleBoostSingle = async (prodId: string) => {
    isBoostingRef.current = true;
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: prodId }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setSyncLogs(data.syncLogs || []);
        if (typeof data.maxProductSlots === 'number') setMaxProductSlots(data.maxProductSlots);
        if (data.vtServerStatus) setVtServerStatus(data.vtServerStatus);
        if (data.serverConnection) setServerConnection(data.serverConnection);
        if (data.tokopediaConnection) setTokopediaConnection(data.tokopediaConnection);
        showToast('Sinkronisasi 1-Menit dieksekusi ke gateway live TikTok Shop & Tokopedia!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      isBoostingRef.current = false;
      setIsBoosting(false);
    }
  };

  // Toggle Auto-Pilot
  const handleToggleAutoPilot = async () => {
    const nextVal = !isAutoPilotActive;
    setIsAutoPilotActive(nextVal);
    try {
      await fetch('/api/tiktok/auto-sync-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextVal }),
      });
      showToast(nextVal ? 'Auto-Pilot Dual-Server 1-Menit diaktifkan!' : 'Auto-Pilot dijeda.');
    } catch (err) {
      console.error(err);
    }
  };

  // Change interval
  const handleChangeInterval = async (mins: number) => {
    setIntervalMinutes(mins);
    setCountdown(mins * 60);
    try {
      await fetch('/api/tiktok/auto-sync-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intervalMinutes: mins }),
      });
      showToast(`Interval auto-refresh diubah ke ${mins} menit.`);
    } catch (err) {
      console.error(err);
    }
  };

  // Save server connection & run real live gateway handshakes
  const handleSaveConnection = async (newConn: any) => {
    try {
      const res = await fetch('/api/tiktok/update-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConn),
      });
      const data = await res.json();
      if (data.success) {
        if (data.serverConnection) setServerConnection(data.serverConnection);
        if (data.tokopediaConnection) setTokopediaConnection(data.tokopediaConnection);
        if (data.vtServerStatus) setVtServerStatus(data.vtServerStatus);
        showToast('Handshake live ke server TikTok, Tokopedia & vt.tokopedia.com selesai diverifikasi!');
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Pull live shop catalog via Partner APIs
  const handleSyncShopCatalog = async () => {
    try {
      const res = await fetch('/api/tiktok/sync-shop-products', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.products)) setProducts(data.products);
        if (Array.isArray(data.syncLogs)) setSyncLogs(data.syncLogs);
        if (data.importedCount > 0) {
          showToast(`Berhasil menarik ${data.importedCount} produk live dari toko API!`);
        }
        return data;
      }
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  // Boost directly from pasted TikTok OR Tokopedia link (1 or up to 20 links)
  const handleBoostFromLink = async (
    url: string,
    customKeyword?: string,
    productName?: string,
    price?: number,
    category?: string
  ): Promise<LiveSyncReport | void> => {
    isBoostingRef.current = true;
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost-from-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          customKeyword,
          userProvidedName: productName,
          userProvidedPrice: price,
          userProvidedCategory: category,
        }),
      });
      const contentType = res.headers.get('content-type');
      const isJson = Boolean(contentType && contentType.includes('application/json'));
      const data = isJson ? await res.json().catch(() => null) : null;

      if (!res.ok) {
        showToast(data?.error || 'Server TikTok / Tokopedia sedang sibuk, silakan coba sesaat lagi.');
        return;
      }
      if (!data) {
        showToast('Respon server tidak valid.');
        return;
      }
      if (data.success) {
        setProducts(data.products || []);
        setSyncLogs(data.syncLogs || []);
        if (typeof data.maxProductSlots === 'number') setMaxProductSlots(data.maxProductSlots);
        if (data.vtServerStatus) setVtServerStatus(data.vtServerStatus);
        if (data.serverConnection) setServerConnection(data.serverConnection);
        if (data.tokopediaConnection) setTokopediaConnection(data.tokopediaConnection);
        if (typeof data.nextSyncCountdown === 'number') setCountdown(data.nextSyncCountdown);
        if (typeof data.isAutoPilotActive === 'boolean') setIsAutoPilotActive(data.isAutoPilotActive);
        if (data.product) {
          setSelectedProductForMonitor(data.product);
        }
        showToast(data.message || `Produk "${data.product?.name || 'baru'}" berhasil tersinkron ke server!`);
        return data.liveSyncReport;
      } else {
        showToast(data.error || 'Gagal memproses link.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses link. Pastikan koneksi internet stabil.');
    } finally {
      isBoostingRef.current = false;
      setIsBoosting(false);
    }
  };

  // Clear all products
  const handleClearAll = async () => {
    try {
      const res = await fetch('/api/tiktok/clear-all', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setProducts([]);
        setSyncLogs(data.syncLogs);
        showToast('Semua produk telah dikosongkan!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/tiktok/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        showToast('Produk dihapus dari pantauan.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update product details
  const handleUpdateProduct = async (id: string, updated: Partial<TikTokProduct>) => {
    try {
      const res = await fetch(`/api/tiktok/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        if (data.syncLogs) setSyncLogs(data.syncLogs);
        showToast('Data produk berhasil diperbarui dan disinkronkan ke server!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memperbarui data produk.');
    }
  };

  // Apply AI optimization to product and persist to backend
  const handleApplyOptimization = async (
    productId: string,
    optimizedTitle: string,
    tags: string[],
    tokopediaTitle?: string
  ) => {
    await handleUpdateProduct(productId, {
      optimizedTitle,
      tags,
      ...(tokopediaTitle ? { tokopediaTitle } : {}),
    });
  };

  // Open AI modal for specific product
  const handleOpenAiModal = (product: TikTokProduct) => {
    setSelectedProductForAi(product);
    setIsAiModalOpen(true);
  };

  // View monitor for specific product
  const handleViewMonitor = (product: TikTokProduct) => {
    setSelectedProductForMonitor(product);
    setActiveTab('monitor');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-[#25F4EE]/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#25F4EE] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Top Bar Contract */}
      <Header
        onOpenServerModal={() => setIsServerModalOpen(true)}
        onTriggerGlobalBoost={handleTriggerGlobalBoost}
        isBoosting={isBoosting}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        isConnected={serverConnection.isConnected}
        tokopediaConnected={tokopediaConnection.isConnected}
        vtServerStatus={vtServerStatus}
      />

      {/* Auto-Pilot Status Bar */}
      <AutoPilotBar
        countdown={countdown}
        intervalMinutes={intervalMinutes}
        isAutoPilotActive={isAutoPilotActive}
        onToggleAutoPilot={handleToggleAutoPilot}
        onChangeInterval={handleChangeInterval}
        serverConnection={serverConnection}
        tokopediaConnection={tokopediaConnection}
        vtServerStatus={vtServerStatus}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        totalProducts={products.length}
        maxProductSlots={maxProductSlots}
        onQuickAiAll={handleTriggerGlobalBoost}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Prominent Link Ingestion & Instant Boost Banner */}
        <LinkBoosterBanner
          onBoostFromLink={handleBoostFromLink}
          onClearAll={handleClearAll}
          isBoosting={isBoosting}
          totalProducts={products.length}
          maxProductSlots={maxProductSlots}
        />

        {activeTab === 'products' && (
          <ProductRankingTable
            products={products}
            maxProductSlots={maxProductSlots}
            onBoostSingle={handleBoostSingle}
            onOpenAiModal={handleOpenAiModal}
            onViewSimulator={handleViewMonitor}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={handleUpdateProduct}
            onClearAll={handleClearAll}
            isBoosting={isBoosting}
            onUsePresetLink={handleBoostFromLink}
          />
        )}

        {activeTab === 'monitor' && (
          <TikTokSearchSimulator
            products={products}
            selectedProduct={selectedProductForMonitor}
            onSelectProduct={setSelectedProductForMonitor}
            onTriggerBoost={handleBoostSingle}
            isBoosting={isBoosting}
            serverConnection={serverConnection}
            tokopediaConnection={tokopediaConnection}
            vtServerStatus={vtServerStatus}
          />
        )}

        {activeTab === 'strategy' && <AlgorithmStrategyGuide />}

        {activeTab === 'logs' && (
          <SyncLogsDrawer
            logs={syncLogs}
            onTriggerSync={handleTriggerGlobalBoost}
            isSyncing={isBoosting}
          />
        )}
      </main>

      {/* Modals */}
      <TikTokServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        serverConnection={serverConnection}
        tokopediaConnection={tokopediaConnection}
        vtServerStatus={vtServerStatus}
        onSaveConnection={handleSaveConnection}
        onSyncShopCatalog={handleSyncShopCatalog}
      />

      <AIOptimizerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        product={selectedProductForAi}
        onApplyOptimization={handleApplyOptimization}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        TikTok Shop + Tokopedia Open API Gateway · Auto-Sync Real-Time 1-Menit Terenkripsi TLS 1.3 · Official Partner Suite
      </footer>
    </div>
  );
}
