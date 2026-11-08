import React, { useState } from 'react';
import { Terminal, Download, CheckCircle2, AlertCircle, RefreshCw, Clock } from 'lucide-react';
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
  const [filter, setFilter] = useState<'all' | 'success'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filter === 'success') return log.status === 'success';
    return true;
  });

  const exportAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tiktok_sync_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsCsv = () => {
    const headers = 'ID,Timestamp,Product,Action,Status,RankChange,Latency(ms)\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.productName}","${l.action}","${l.status}","${l.rankChange}",${l.apiLatencyMs}`
      )
      .join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tiktok_sync_logs_${Date.now()}.csv`);
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
            <h3 className="text-sm font-semibold text-white">
              Audit Log Sinkronisasi Otomatis 5-Menit
            </h3>
            <p className="text-xs text-slate-400">
              Riwayat panggilan API dan re-indexing server TikTok Shop secara real-time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'all' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Log ({logs.length})
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filter === 'success' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Berhasil 200 OK
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
                <th className="py-3 px-4 font-medium">Waktu</th>
                <th className="py-3 px-4 font-medium">Produk / Endpoint</th>
                <th className="py-3 px-4 font-medium">Aksi Algoritma</th>
                <th className="py-3 px-4 font-medium">Perubahan Rank</th>
                <th className="py-3 px-4 font-medium text-right">Latensi API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
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
                      <CheckCircle2 className="w-3 h-3" />
                      {log.rankChange}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300 tabular-nums">
                    {log.apiLatencyMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
