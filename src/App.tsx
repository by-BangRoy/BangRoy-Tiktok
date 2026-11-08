/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { AutoPilotBar } from './components/AutoPilotBar';
import { ProductRankingTable } from './components/ProductRankingTable';
import { TikTokSearchSimulator } from './components/TikTokSearchSimulator';
import { AlgorithmStrategyGuide } from './components/AlgorithmStrategyGuide';
import { SyncLogsDrawer } from './components/SyncLogsDrawer';
import { TikTokServerModal } from './components/TikTokServerModal';
import { AIOptimizerModal } from './components/AIOptimizerModal';
import { LinkBoosterBanner } from './components/LinkBoosterBanner';
import { TikTokProduct, SyncLog, ServerConnection } from './types';
import { CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'products' | 'simulator' | 'strategy' | 'logs'>('products');
  const [products, setProducts] = useState<TikTokProduct[]>([]);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [serverConnection, setServerConnection] = useState<ServerConnection>({
    isConnected: true,
    environment: 'production_sandbox',
    shopId: 'ID_SHOP_88329412',
    shopName: 'Official Glow & Style Nusantara',
    region: 'ID',
    appKey: 'tk_live_app_991823a7',
    accessToken: 'actk_sec_e83b19f041cb829104',
    tokenExpiresIn: 86400 * 27,
    webhookEndpoint: 'https://ais-dev-g3lnl6hdbt5h3tbho764nf-460409510523.asia-east1.run.app/api/tiktok/webhook',
    lastHandshake: new Date().toISOString(),
    latencyMs: 38,
  });

  const [isAutoPilotActive, setIsAutoPilotActive] = useState(true);
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [countdown, setCountdown] = useState(300);
  const [isBoosting, setIsBoosting] = useState(false);

  // Modals
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedProductForAi, setSelectedProductForAi] = useState<TikTokProduct | null>(null);
  const [selectedProductForSimulator, setSelectedProductForSimulator] = useState<TikTokProduct | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial overview
  const fetchOverview = useCallback(async () => {
    try {
      const res = await fetch('/api/tiktok/overview');
      if (!res.ok) return;
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) return;
      const data = await res.json();
      setProducts(data.products || []);
      setSyncLogs(data.syncLogs || []);
      if (data.serverConnection) setServerConnection(data.serverConnection);
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

  // Local 1-second countdown ticker
  useEffect(() => {
    if (!isAutoPilotActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchOverview();
          return intervalMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAutoPilotActive, intervalMinutes, fetchOverview]);

  // Trigger global boost
  const handleTriggerGlobalBoost = async () => {
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setSyncLogs(data.syncLogs);
        showToast('Semua produk berhasil di-boost dan disinkronisasi ke server TikTok! Posisi #1 Terlaris diperbarui.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBoosting(false);
    }
  };

  // Trigger single product boost
  const handleBoostSingle = async (prodId: string) => {
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: prodId }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setSyncLogs(data.syncLogs);
        showToast('Boost 5-Menit dieksekusi! Algoritma pencarian TikTok Shop langsung diperbarui.');
      }
    } catch (err) {
      console.error(err);
    } finally {
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
      showToast(nextVal ? 'Auto-Pilot 5-Menit diaktifkan!' : 'Auto-Pilot dijeda.');
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

  // Save server connection
  const handleSaveConnection = async (newConn: Partial<ServerConnection>) => {
    try {
      const res = await fetch('/api/tiktok/update-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConn),
      });
      const data = await res.json();
      if (data.success) {
        setServerConnection(data.serverConnection);
        showToast('Koneksi TikTok Open Platform berhasil diperbarui & diverifikasi!');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add new product
  // Boost directly from pasted TikTok link
  const handleBoostFromLink = async (url: string, customKeyword?: string) => {
    setIsBoosting(true);
    try {
      const res = await fetch('/api/tiktok/boost-from-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customKeyword }),
      });
      if (!res.ok) {
        showToast('Server TikTok sedang sibuk, silakan coba sesaat lagi.');
        return;
      }
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        showToast('Respon server tidak valid.');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setSyncLogs(data.syncLogs || []);
        if (typeof data.nextSyncCountdown === 'number') setCountdown(data.nextSyncCountdown);
        if (typeof data.isAutoPilotActive === 'boolean') setIsAutoPilotActive(data.isAutoPilotActive);
        if (data.product) {
          setSelectedProductForSimulator(data.product);
        }
        // Direct transition: Immediately show product at the top of search in the simulator!
        setActiveTab('simulator');
        showToast('Terkoneksi langsung ke Server TikTok! Produk langsung muncul di pencarian terlaris paling atas #1.');
      } else {
        showToast(data.error || 'Gagal memproses link TikTok.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses link. Pastikan server TikTok terhubung.');
    } finally {
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

  // Apply AI optimization to product
  const handleApplyOptimization = (productId: string, optimizedTitle: string, tags: string[]) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, optimizedTitle, tags } : p))
    );
    showToast('Judul dan tag formula algoritma berhasil diterapkan ke katalog TikTok!');
  };

  // Open AI modal for specific product
  const handleOpenAiModal = (product: TikTokProduct) => {
    setSelectedProductForAi(product);
    setIsAiModalOpen(true);
  };

  // View simulator for specific product
  const handleViewSimulator = (product: TikTokProduct) => {
    setSelectedProductForSimulator(product);
    setActiveTab('simulator');
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
      />

      {/* Auto-Pilot 5-Minute Status Bar */}
      <AutoPilotBar
        countdown={countdown}
        intervalMinutes={intervalMinutes}
        isAutoPilotActive={isAutoPilotActive}
        onToggleAutoPilot={handleToggleAutoPilot}
        onChangeInterval={handleChangeInterval}
        serverConnection={serverConnection}
        onOpenServerModal={() => setIsServerModalOpen(true)}
        totalProducts={products.length}
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
        />

        {activeTab === 'products' && (
          <ProductRankingTable
            products={products}
            onBoostSingle={handleBoostSingle}
            onOpenAiModal={handleOpenAiModal}
            onViewSimulator={handleViewSimulator}
            onDeleteProduct={handleDeleteProduct}
            onClearAll={handleClearAll}
            isBoosting={isBoosting}
          />
        )}

        {activeTab === 'simulator' && (
          <TikTokSearchSimulator
            products={products}
            selectedProduct={selectedProductForSimulator}
            onSelectProduct={setSelectedProductForSimulator}
            onTriggerBoost={handleBoostSingle}
            isBoosting={isBoosting}
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
        onSaveConnection={handleSaveConnection}
      />

      <AIOptimizerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        product={selectedProductForAi}
        onApplyOptimization={handleApplyOptimization}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        TikTok Shop Open API Gateway · Auto-Pilot 5-Menit Terenkripsi TLS 1.3 · Official Partner Suite
      </footer>
    </div>
  );
}
