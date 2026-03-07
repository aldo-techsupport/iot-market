import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import MonitoringLayout from '@/layouts/monitoring-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
interface Sensor {
  id: number;
  pivot: {
    variable_name: string;
    custom_name: string;
    unit: string | null;
  };
}

interface Device {
  id: number;
  name: string;
  device_code: string;
}

interface Props {
  device: Device;
  sensors: Sensor[];
}

/* ═══════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════ */
const formatTs = (ts: string | undefined) => {
  if (!ts) return 'N/A';
  let t = ts;
  if (typeof t === 'string' && t.includes(' ') && !t.includes('T')) t = t.replace(' ', 'T');
  const d = new Date(t);
  if (!isNaN(d.getTime())) {
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  }
  return ts;
};

function extractItems(raw: any): any[] {
  if (!raw?.success) return [];
  const d = raw.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  return [];
}

/* ═══════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
export default function MonitoringLog({ device, sensors }: Props) {
  const [logs, setLogs] = useState<any[]>([]);
  const [historyRange, setHistoryRange] = useState<20 | 50 | 100>(50);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/sensor-history?device_id=${device.id}&per_page=${historyRange}`);
      const json = await res.json();
      const items = extractItems(json);
      setLogs(items);
    } catch (e) {
      console.error('Fetch history failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [device.id, historyRange]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const fetchLatestChunk = useCallback(async () => {
    try {
      const res = await fetch(`/api/sensor-history?device_id=${device.id}&per_page=10`);
      const json = await res.json();
      const items = extractItems(json);
      setLogs(prev => {
        const existingTs = new Set(prev.map(l => l.timestamp || l.created_at));
        const newItems = items.filter(l => !existingTs.has(l.timestamp || l.created_at));
        if (newItems.length === 0) return prev;
        return [...newItems, ...prev].slice(0, historyRange);
      });
    } catch (e) {
      console.error('Fetch latest failed:', e);
    }
  }, [device.id, historyRange]);

  useEffect(() => {
    if (!autoRefresh) return;
    const intervalId = setInterval(fetchLatestChunk, 5000);
    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchLatestChunk]);

  return (
    <MonitoringLayout title={`Log Telemetry — ${device.name}`}>
      <Head title={`Log Telemetry — ${device.name}`} />

      <div className="space-y-6 p-6 lg:p-8">
        <div className="relative overflow-hidden flex items-start justify-between gap-4 flex-wrap p-5 lg:p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-[#00FF00]/30 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-4 relative z-10">
            <Link href={`/dashboard/monitoring/${device.id}`}>
              <Button variant="outline" size="icon" className="text-slate-600 dark:text-gray-300">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Log Telemetry</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-[#00FF00]/70 mt-1">{device.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap relative z-10">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(v => !v)}
                className={`font-medium backdrop-blur-sm transition-all ${autoRefresh
                  ? 'border-green-600 dark:border-[#00FF00] text-green-700 dark:text-[#00FF00] bg-green-50 dark:bg-[#00FF00]/10 hover:bg-green-100 dark:hover:bg-[#00FF00]/20'
                  : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-900'}`}
              >
                {autoRefresh ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                Auto {autoRefresh ? 'ON' : 'OFF'}
              </Button>

            <Button
              onClick={fetchHistory}
              disabled={isRefreshing}
              size="sm"
              className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-bold shadow-lg shadow-[#00FF00]/20 border border-[#00FF00]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div>
          <Card className="bg-white dark:bg-gray-950 shadow-sm border-slate-200 dark:border-gray-800 transition-colors">
             <CardHeader className="pb-4 border-b border-slate-100 dark:border-gray-800 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-extrabold text-slate-800 dark:text-gray-100">Record Data Log</CardTitle>
                 <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mt-1">
                  ({logs.length} record)
                </p>
              </div>
              <div className="flex bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-1 shadow-sm gap-1">
                {([20, 50, 100] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setHistoryRange(n)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${historyRange === n
                      ? 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-100 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto rounded-b-xl">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs font-bold text-slate-500 bg-slate-50/80 dark:bg-gray-900/80 dark:text-gray-400 uppercase tracking-wider backdrop-blur-sm sticky top-0 border-b border-slate-200 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Timestamp</th>
                      {sensors.map(s => (
                        <th key={s.id} className="px-6 py-4 whitespace-nowrap text-right">
                          {s.pivot.custom_name}
                          <span className="block text-[10px] text-slate-400 font-medium normal-case mt-0.5">{s.pivot.unit || '-'}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-gray-800/50">
                     {logs.length > 0 ? (
                      logs.map((log, idx) => (
                        <tr key={idx} className="bg-white dark:bg-gray-950 hover:bg-slate-50/50 dark:hover:bg-gray-900/50 transition-colors">
                          <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs text-slate-600 dark:text-gray-300">
                            {formatTs(log.timestamp || log.created_at)}
                          </td>
                          {sensors.map(s => {
                            const k = s.pivot.variable_name;
                            const val = log[k] ?? log[k.toLowerCase()];
                            return (
                               <td key={s.id} className="px-6 py-3.5 whitespace-nowrap text-right font-medium text-slate-800 dark:text-gray-200">
                                {val !== undefined && val !== null ? Number(val).toFixed(2) : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={sensors.length + 1} className="px-6 py-12 text-center text-slate-500 dark:text-gray-400">
                          Belum ada log data.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MonitoringLayout>
  );
}
