import React, { useState } from 'react';
import { Terminal, Download, CheckCircle2, AlertCircle, RefreshCw, Clock, Filter, Lock } from 'lucide-react';
import { SyncLog } from '../types';

interface SyncLogsDrawerProps {
  logs: SyncLog[];
  onTriggerSync: () => void;
  isSyncing: boolean;
}

export const SyncLogsDrawer: React.FC<SyncLogsDrawerProps> = ({
  logs,
  onTriggerSync,
  isSyncing,
}) => {
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'tokopedia'>('all');

  const filteredLogs = logs.filter((log) => {
    if (platformFilter === 'all') return true;
    if (platformFilter === 'tiktok') return log.platform === 'tiktok' || log.platform === 'both';
    if (platformFilter === 'tokopedia') return log.platform === 'tokopedia' || log.platform === 'both';
    return true;
  });

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dual_sync_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCsv = () => {
    const headers = 'ID,Platform,Timestamp,Product,Action,Status,RankChange,Latency(ms)\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.platform || 'both'}","${l.timestamp}","${l.productName}","${l.action}","${l.status}","${l.rankChange}",${l.apiLatencyMs}`
      )
      .join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `dual_sync_logs_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4">
      {/* Action and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-lg text-[#25F4EE]">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Audit Log Sinkronisasi Otomatis Real-Time 1-Menit (Dual Gateway)</span>
              <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60">
                TLS 1.3 Verified
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Riwayat telemetri panggilan Open API TikTok Shop dan Tokopedia secara real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Platform filter tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                platformFilter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Log ({logs.length})
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                platformFilter === 'tiktok' ? 'bg-[#FE2C55] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>TikTok API</span>
            </button>
            <button
              onClick={() => setPlatformFilter('tokopedia')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                platformFilter === 'tokopedia' ? 'bg-[#03AC0E] text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Tokopedia API</span>
            </button>
          </div>

          <button
            onClick={exportAsCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={exportAsJson}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono">
                <th className="py-3 px-4 font-medium">Gateway</th>
                <th className="py-3 px-4 font-medium">Waktu</th>
                <th className="py-3 px-4 font-medium">Produk / Target</th>
                <th className="py-3 px-4 font-medium">Aksi Algoritma</th>
                <th className="py-3 px-4 font-medium">Status & Peringkat</th>
                <th className="py-3 px-4 font-medium text-right">Latensi Server</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => {
                const isTikTok = log.platform === 'tiktok';
                const isTokopedia = log.platform === 'tokopedia';

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isTikTok ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FE2C55]/15 text-[#FE2C55] border border-[#FE2C55]/30">
                          TikTok Shop
                        </span>
                      ) : isTokopedia ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#03AC0E]/15 text-[#03AC0E] border border-[#03AC0E]/30">
                          Tokopedia
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#25F4EE]/15 text-[#25F4EE] border border-[#25F4EE]/30">
                          Dual Engine
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white block truncate max-w-xs">
                        {log.productName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.productId}</span>
                    </td>
                    <td className="py-3 px-4 max-w-md">
                      <span className="text-slate-300 block font-medium">{log.action}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5 line-clamp-1">
                        {log.details}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {log.rankChange}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                      {log.apiLatencyMs}ms
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
