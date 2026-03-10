import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import MonitoringLayout from '@/layouts/monitoring-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  Activity, Thermometer, Droplets, Wind, Gauge, Zap,
  RefreshCw, TrendingUp, TrendingDown, Minus,
  AlertCircle, CheckCircle2, Clock, MapPin, Cpu,
  ArrowLeft, WifiOff, BarChart2, AreaChart, LineChartIcon,
  Palette, CalendarClock, ShieldAlert,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
interface Sensor {
  id: number;
  pivot: {
    variable_name: string;
    custom_name: string;
    unit: string | null;
    price: number;
  };
}

interface Device {
  id: number;
  name: string;
  device_code: string;
  location: string;
  description: string | null;
  status: string;
}

interface Order {
  id: number;
  order_number: string;
  device_name: string;
  status: string;
  sensors: Sensor[];
}

interface SensorData {
  [key: string]: number | string | undefined;
  timestamp?: string;
}

interface Statistics {
  total_records: number;
  first_record: string;
  last_record: string;
  variables: {
    [key: string]: { count: number; min: number; max: number; avg: number; latest: number };
  };
}

interface Props {
  device: Device;
  order: Order;
  sensors: Sensor[];
  latestData: SensorData | null;
  statistics: Statistics | null;
  subscription?: {
    id: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
    days_remaining: number;
    expiry_status: 'active' | 'warning' | 'critical' | 'expired';
    is_expired: boolean;
  } | null;
}

/* ═══════════════════════════════════════════════════
   Chart Themes
══════════════════════════════════════════════════════ */
const CHART_THEMES = {
  emerald: { name: 'Emerald', swatch: '#10b981', colors: ['#10b981', '#0ea5e9', '#6366f1', '#f59e0b', '#ec4899'] },
  ocean: { name: 'Ocean', swatch: '#06b6d4', colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#22d3ee', '#60a5fa'] },
  sunset: { name: 'Sunset', swatch: '#f97316', colors: ['#f97316', '#ec4899', '#fbbf24', '#fb923c', '#f472b6'] },
  forest: { name: 'Forest', swatch: '#22c55e', colors: ['#22c55e', '#84cc16', '#06b6d4', '#34d399', '#a3e635'] },
  aurora: { name: 'Aurora', swatch: '#a855f7', colors: ['#a855f7', '#ec4899', '#06b6d4', '#c084fc', '#f472b6'] },
  mono: { name: 'Mono', swatch: '#64748b', colors: ['#64748b', '#94a3b8', '#cbd5e1', '#475569', '#334155'] },
} as const;

type ThemeKey = keyof typeof CHART_THEMES;

/* ═══════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════ */
const getSensorIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('temp') || n.includes('suhu')) return Thermometer;
  if (n.includes('humid') || n.includes('kelembaban')) return Droplets;
  if (n.includes('wind') || n.includes('angin')) return Wind;
  if (n.includes('pressure') || n.includes('tekanan')) return Gauge;
  if (n.includes('volt') || n.includes('power')) return Zap;
  return Activity;
};

const GRADIENT_COLORS = [
  'from-green-500 to-emerald-500',
  'from-blue-500 to-cyan-500',
  'from-orange-500 to-red-500',
  'from-purple-500 to-pink-500',
  'from-indigo-500 to-blue-500',
  'from-yellow-500 to-orange-500',
];

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

const formatTsShort = (ts: string) => {
  try {
    let t = ts;
    if (typeof t === 'string' && t.includes(' ') && !t.includes('T')) t = t.replace(' ', 'T');
    const d = new Date(t);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return ts;
  } catch { return ts; }
};

const getTrend = (current: number, avg: number) => {
  const diff = ((current - avg) / avg) * 100;
  if (Math.abs(diff) < 5) return { icon: Minus, color: 'text-slate-400', text: 'Stabil' };
  if (diff > 0) return { icon: TrendingUp, color: 'text-green-500', text: `+${diff.toFixed(1)}%` };
  return { icon: TrendingDown, color: 'text-red-500', text: `${diff.toFixed(1)}%` };
};

function computeStatus(ts?: string): 'online' | 'idle' | 'offline' {
  if (!ts) return 'offline';
  let t = ts;
  if (typeof t === 'string' && t.includes(' ') && !t.includes('T')) t = t.replace(' ', 'T');
  const d = new Date(t);
  if (isNaN(d.getTime())) return 'offline';

  const mins = (Date.now() - d.getTime()) / 60000;
  if (mins <= 1) return 'online';
  if (mins <= 5) return 'idle';
  return 'offline';
}

const STATUS_CFG = {
  online: { label: 'Online', dot: 'bg-green-500 animate-pulse', text: 'text-green-700 dark:text-[#00FF00]', ring: 'border-green-200 dark:border-[#00FF00]/30', bg: 'bg-green-50 dark:bg-[#00FF00]/10' },
  idle: { label: 'Idle', dot: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', ring: 'border-amber-200 dark:border-amber-500/30', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  offline: { label: 'Offline', dot: 'bg-red-500', text: 'text-red-700 dark:text-red-400', ring: 'border-red-200 dark:border-red-500/30', bg: 'bg-red-50 dark:bg-red-500/10' },
} as const;

const MAX_SPARK = 20;

function extractItems(raw: any): any[] {
  if (!raw?.success) return [];
  const d = raw.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.items)) return d.items;
  return [];
}

const computeStats = (values?: number[]) => {
  if (!values || values.length === 0) return undefined;
  const valid = values.filter(v => typeof v === 'number' && !isNaN(v));
  if (valid.length === 0) return undefined;
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length;
  return { min, max, avg };
};

/* ═══════════════════════════════════════════════════
   useContainerWidth — responsive sparkline
══════════════════════════════════════════════════════ */
function useContainerWidth(defaultWidth = 220) {
  const [width, setWidth] = useState(defaultWidth);
  const [node, setNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!node) return;
    const obs = new ResizeObserver(entries => {
      window.requestAnimationFrame(() => {
        if (entries[0].contentRect.width > 0) setWidth(entries[0].contentRect.width);
      });
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, [node]);
  return { ref: setNode, width };
}

/* ═══════════════════════════════════════════════════
   SparkCard — individual sensor card with sparkline
══════════════════════════════════════════════════════ */
function SparkCard({
  sensor, index, currentValue, stats, sparkData,
  themeColor, onDoubleClick,
}: {
  sensor: Sensor;
  index: number;
  currentValue: number | string | undefined;
  stats?: { min: number; max: number; avg: number };
  sparkData: number[];
  themeColor: string;
  onDoubleClick: () => void;
}) {
  const Icon = getSensorIcon(sensor.pivot.custom_name);
  const grad = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
  const trend = stats && currentValue !== undefined
    ? getTrend(Number(currentValue), stats.avg) : null;
  const TrendIcon = trend?.icon;
  const { ref: sparkRef, width: sparkWidth } = useContainerWidth();

  return (
    <Card
      className="bg-white dark:bg-gray-950 border-slate-200 dark:border-[#00FF00]/20 overflow-hidden hover:border-green-400 dark:hover:border-[#00FF00] cursor-pointer select-none transition-all duration-200 hover:shadow-xl hover:shadow-green-900/5 dark:hover:shadow-[#00FF00]/20"
      onDoubleClick={onDoubleClick}
      title="Double-click untuk melihat chart detail"
    >
      <div className={`h-1 bg-gradient-to-r ${grad}`} />

      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${grad} flex-shrink-0 shadow-sm border border-white/20`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm text-slate-800 dark:text-gray-100 font-bold leading-tight">{sensor.pivot.custom_name}</CardTitle>
              <p className="text-xs font-mono text-slate-500 dark:text-gray-400 mt-0.5">{sensor.pivot.variable_name}</p>
            </div>
          </div>
          {trend && TrendIcon && (
            <div className={`flex items-center gap-1 ${trend.color} text-xs font-medium flex-shrink-0`}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{trend.text}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Current value */}
        <div className="text-center py-3 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-[#00FF00]/10 rounded-xl">
          {currentValue !== undefined ? (
            <>
              <div className={`text-4xl font-extrabold bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>
                {Number(currentValue).toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium">{sensor.pivot.unit || 'unit'}</div>
            </>
          ) : (
            <div className="space-y-2 py-1">
              <Skeleton className="h-10 w-24 mx-auto bg-slate-200 dark:bg-gray-800" />
              <Skeleton className="h-3 w-12 mx-auto bg-slate-200 dark:bg-gray-800" />
            </div>
          )}
        </div>

        {/* Mini Sparkline */}
        <div ref={sparkRef} className="w-full">
          {sparkData.length >= 2 ? (
            <SparkLineChart
              data={sparkData}
              width={sparkWidth}
              height={52}
              color={themeColor}
              showHighlight
              showTooltip
              curve="monotoneX"
              sx={{ '& .MuiChartsAxis-root': { display: 'none' } }}
            />
          ) : (
            <div className="h-[52px] flex items-center justify-center">
              <Skeleton className="h-8 w-full bg-slate-100 dark:bg-gray-800 rounded" />
            </div>
          )}
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-[#00FF00]/10 rounded-lg">
              <div className="text-slate-500 dark:text-gray-400 mb-0.5">Min</div>
              <div className="font-semibold text-slate-700 dark:text-gray-200">{stats.min.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-[#00FF00]/10 rounded-lg">
              <div className="text-slate-500 dark:text-gray-400 mb-0.5">Avg</div>
              <div className="font-semibold text-slate-700 dark:text-gray-200">{stats.avg.toFixed(2)}</div>
            </div>
            <div className="text-center p-2 bg-slate-50 dark:bg-gray-900 border border-slate-100 dark:border-[#00FF00]/10 rounded-lg">
              <div className="text-slate-500 dark:text-gray-400 mb-0.5">Max</div>
              <div className="font-semibold text-slate-700 dark:text-gray-200">{stats.max.toFixed(2)}</div>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-slate-400 dark:text-gray-500 font-medium mt-1">Double-click untuk detail chart</p>
      </CardContent>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
export default function Monitoring({ device, order, sensors, latestData, statistics, subscription }: Props) {
  /* ── State ── */
  const [realtimeData, setRealtimeData] = useState<SensorData | null>(latestData);
  const [sparkHistory, setSparkHistory] = useState<Record<string, number[]>>({});
  const [fullHistory, setFullHistory] = useState<{ ts: string[]; vars: Record<string, number[]> } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Chart config
  const [chartTheme, setChartTheme] = useState<ThemeKey>('emerald');
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [chartOpen, setChartOpen] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');
  const [historyRange, setHistoryRange] = useState<20 | 50 | 100>(50);
  const [showThemePicker, setShowThemePicker] = useState(false);

  // Responsive width for the dialog chart
  const { ref: dialogChartRef, width: dialogChartWidth } = useContainerWidth();

  const theme = CHART_THEMES[chartTheme];

  /* ── Status derived from latest data ── */
  const liveStatus = useMemo(
    () => computeStatus((realtimeData?.timestamp || realtimeData?.created_at) as string | undefined),
    [realtimeData]
  );
  const statusCfg = STATUS_CFG[liveStatus];

  /* ── Init sparkline from latestData ── */
  useEffect(() => {
    if (!latestData) return;
    const init: Record<string, number[]> = {};
    sensors.forEach(s => {
      const k = s.pivot.variable_name;
      const v = latestData[k] ?? latestData[k.toLowerCase()];
      if (v !== undefined && !isNaN(Number(v))) init[k] = [Number(v)];
    });
    setSparkHistory(init);
  }, []);

  /* ── Fetch latest (live polling) ── */
  const fetchLatest = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/sensor-data?device_id=${device.id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setRealtimeData(json.data);

        setSparkHistory(prev => {
          const next = { ...prev };
          sensors.forEach(s => {
            const k = s.pivot.variable_name;
            const v = json.data[k] ?? json.data[k.toLowerCase()];
            if (v !== undefined && !isNaN(Number(v))) {
              const arr = [...(next[k] ?? []), Number(v)];
              next[k] = arr.slice(-MAX_SPARK);
            }
          });
          return next;
        });
      }
    } catch (e) {
      console.error('Fetch latest failed:', e);
    } finally {
      setIsRefreshing(false);
    }
  }, [device.id, sensors]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchLatest, 5000);
    return () => clearInterval(id);
  }, [autoRefresh, fetchLatest]);

  /* ── Fetch history ── */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`/api/sensor-history?device_id=${device.id}&per_page=${historyRange}`);
      const json = await res.json();
      const items = extractItems(json);
      if (items.length === 0) return;

      const ts: string[] = items.map((it: any) => it.timestamp ?? it.created_at ?? '');
      const vars: Record<string, number[]> = {};
      sensors.forEach(s => {
        const k = s.pivot.variable_name;
        vars[k] = items.map((it: any) => {
          const v = it[k.toLowerCase()] ?? it[k];
          return v !== null && v !== undefined ? Number(v) : Number.NaN;
        });
      });
      setFullHistory({ ts, vars });
    } catch (e) {
      console.error('Fetch history failed:', e);
    }
  }, [device.id, historyRange, sensors]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const openChart = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setChartOpen(true);
  };

  /* ── Chart dialog data ── */
  const dialogData = useMemo(() => {
    if (!selectedSensor) return null;
    const k = selectedSensor.pivot.variable_name;
    const source = fullHistory ?? (sparkHistory[k]?.length
      ? { ts: sparkHistory[k].map((_, i) => String(i)), vars: { [k]: sparkHistory[k] } }
      : null);
    if (!source) return null;
    const raw = source.vars[k] ?? [];
    const ts = source.ts;
    const pairs = raw.map((v, i) => ({ v, t: ts[i] ?? String(i) })).filter(p => !isNaN(p.v));
    pairs.reverse(); // Ensure left-to-right chronological order
    return { values: pairs.map(p => p.v), labels: pairs.map(p => formatTsShort(p.t)) };
  }, [selectedSensor, fullHistory, sparkHistory, chartTheme]);

  return (
    <MonitoringLayout title={`Monitoring — ${device.name}`}>
      <Head title={`Monitoring — ${device.name}`} />

      <div className="space-y-6 p-6 lg:p-8">

        {/* ─── Header ─────────────────────────────── */}
        <div className="relative overflow-hidden flex items-start justify-between gap-4 flex-wrap p-5 lg:p-6 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-[#00FF00]/5 border border-slate-200 dark:border-[#00FF00]/30 bg-white dark:bg-gray-950 transition-colors">
          {/* Header Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 dark:bg-[#00FF00]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 dark:bg-[#00FF00]/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none transition-colors"></div>

          {/* Left */}
          <div className="flex items-center gap-4 relative z-10">
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="text-slate-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-[#00FF00] hover:bg-green-50 dark:hover:bg-[#00FF00]/10 border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 backdrop-blur-sm transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white transition-colors">{device.name}</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-[#00FF00]/70 mt-1 transition-colors">Real-time monitoring perangkat</p>
            </div>
          </div>

          {/* Right — controls */}
          <div className="flex items-center gap-2.5 flex-wrap relative z-10">
            {/* Theme Picker */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowThemePicker(v => !v)}
                className="border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 bg-slate-50 dark:bg-gray-900/50 hover:bg-green-50 dark:hover:bg-[#00FF00]/10 hover:text-green-600 dark:hover:text-[#00FF00] hover:border-green-200 dark:hover:border-[#00FF00]/50 font-medium backdrop-blur-sm transition-all"
              >
                <Palette className="h-4 w-4 mr-2" />
                Tema Chart
                <span className="h-3 w-3 rounded-full inline-block ml-2 border border-black/10 dark:border-white/20 shadow-sm" style={{ background: theme.swatch }} />
              </Button>
              {showThemePicker && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-3 shadow-2xl min-w-[240px]">
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-3 font-semibold px-1">Pilih Tema Chart</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.entries(CHART_THEMES) as [ThemeKey, typeof CHART_THEMES[ThemeKey]][]).map(([key, t]) => (
                      <button
                        key={key}
                        onClick={() => { setChartTheme(key); setShowThemePicker(false); }}
                        className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${chartTheme === key
                          ? 'border-green-500 dark:border-[#00FF00] bg-green-50 dark:bg-[#00FF00]/10'
                          : 'border-slate-100 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-800'
                          }`}
                      >
                        <div className="flex gap-0.5">
                          {t.colors.slice(0, 3).map((c, i) => (
                            <span key={i} className="h-3.5 w-3.5 rounded-full border border-black/10 dark:border-white/10" style={{ background: c }} />
                          ))}
                        </div>
                        <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href={`/dashboard/monitoring/${device.id}/log`}>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-200 bg-slate-50 dark:bg-gray-900/50 hover:bg-slate-100 dark:hover:bg-gray-800 font-medium backdrop-blur-sm transition-all"
              >
                Log Data
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(v => !v)}
              className={`font-medium backdrop-blur-sm transition-all ${autoRefresh
                ? 'border-green-600 dark:border-[#00FF00] text-green-700 dark:text-black bg-green-100 dark:bg-[#00FF00] hover:bg-green-200 dark:hover:bg-[#00FF00]/80'
                : 'border-slate-200 dark:border-gray-700 text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-gray-900/50 hover:bg-slate-100 dark:hover:bg-gray-800'}`}
            >
              {autoRefresh
                ? <CheckCircle2 className="h-4 w-4 mr-2" />
                : <AlertCircle className="h-4 w-4 mr-2" />}
              Auto {autoRefresh ? 'ON' : 'OFF'}
            </Button>

            <Button
              onClick={fetchLatest}
              disabled={isRefreshing}
              size="sm"
              className="bg-[#00FF00] hover:bg-[#00FF00]/80 text-black font-bold shadow-lg shadow-[#00FF00]/20 border border-[#00FF00]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* ─── Device Info Card ─────────────────── */}
        <Card className={`bg-white dark:bg-gray-950 shadow-sm border ${statusCfg.ring} transition-colors`}>
          <CardHeader className="pb-4 border-b border-slate-100 dark:border-gray-800">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold ${statusCfg.bg} border ${statusCfg.ring}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${statusCfg.dot}`} />
                  <span className={statusCfg.text}>{statusCfg.label}</span>
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800 dark:text-gray-100 font-extrabold">{device.name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2 text-xs font-medium text-slate-500 dark:text-gray-400">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{device.location}</span>
                    <span className="flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5" /><span className="font-mono bg-slate-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-gray-300">{device.device_code}</span></span>
                    {/* Masa Aktif */}
                    {subscription && (
                      <span className={`flex items-center gap-1.5 font-semibold ${
                        subscription.is_expired
                          ? 'text-red-500 dark:text-red-400'
                          : subscription.expiry_status === 'critical'
                          ? 'text-orange-500 dark:text-orange-400'
                          : subscription.expiry_status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {subscription.is_expired
                          ? <ShieldAlert className="h-3.5 w-3.5" />
                          : <CalendarClock className="h-3.5 w-3.5" />}
                        {subscription.is_expired
                          ? 'Expired'
                          : `Aktif hingga ${subscription.end_date
                              ? new Date(subscription.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                              : '-'} (${subscription.days_remaining} hari)`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500 dark:text-gray-400">
                <div className="flex items-center justify-end gap-1.5 mb-1 font-medium"><Clock className="h-3.5 w-3.5" />Last Update</div>
                <span className="text-slate-800 dark:text-gray-200 font-bold bg-slate-100 dark:bg-gray-800 px-2.5 py-1 rounded-md">{formatTs(realtimeData?.timestamp as string)}</span>
              </div>
            </div>
          </CardHeader>
          {/* Expired banner inside card */}
          {subscription?.is_expired && (
            <div className="flex items-start gap-3 px-5 py-3.5 bg-red-950/40 border-b border-red-800/40">
              <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-300">Subscription Anda Sudah Expired</p>
                <p className="text-xs text-red-400/80 mt-0.5">
                  Masa aktif berakhir pada {subscription.end_date
                    ? new Date(subscription.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '-'}. Data monitoring masih dapat dilihat, namun Anda tidak dapat mengedit perangkat. Silakan perpanjang subscription Anda.
                </p>
              </div>
            </div>
          )}
          <CardContent className="pt-5 pb-5 bg-slate-50/50 dark:bg-gray-900/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1.5">Total Sensors</p>
                <p className="text-2xl font-black text-slate-800 dark:text-gray-100">{sensors.length}</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1.5">Total Records</p>
                <p className="text-2xl font-black text-slate-800 dark:text-gray-100">{statistics?.total_records ?? 0}</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-5 py-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-500 uppercase tracking-wider mb-1.5">Order</p>
                <p className="text-base font-mono font-bold text-slate-700 dark:text-gray-300 truncate">{order.order_number}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ─── Sensor Cards ─────────────────────── */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-gray-100">Sensor Variables</h2>
            <span className="text-xs font-medium bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-gray-700 flex items-center gap-2">
              <span className="hidden sm:inline">Tip:</span> Double-click sensor card untuk melihat detail chart
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sensors.map((sensor, index) => {
              const k = sensor.pivot.variable_name;
              const raw = realtimeData?.[k] ?? realtimeData?.[k.toLowerCase()];
              const sparkData = sparkHistory[k] ?? [];
              const stats = (statistics?.variables?.[k] ?? statistics?.variables?.[k.toLowerCase()] ?? computeStats(fullHistory?.vars[k] ?? sparkHistory[k])) || undefined;

              return (
                <SparkCard
                  key={sensor.id}
                  sensor={sensor}
                  index={index}
                  currentValue={raw}
                  stats={stats}
                  sparkData={sparkData}
                  themeColor={theme.colors[index % theme.colors.length]}
                  onDoubleClick={() => openChart(sensor)}
                />
              );
            })}
          </div>
        </div>

        {/* No Data */}
        {!realtimeData && (
          <Card className="bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 border-dashed shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <WifiOff className="h-8 w-8 text-slate-400 dark:text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-gray-200 mb-2">Belum Ada Data</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 max-w-md">
                Device <span className="font-bold text-slate-700 dark:text-gray-300">{device.name}</span> belum mengirim data ke server. Harap pastikan perangkat terhubung ke internet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          DIALOG: Detail Chart (Double-click)
      ════════════════════════════════════════════ */}
      <Dialog open={chartOpen} onOpenChange={setChartOpen}>
        <DialogContent
          className="w-full bg-white dark:bg-gray-950 border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-100 p-0 overflow-auto shadow-2xl dark:shadow-[#00FF00]/10"
          style={{
            maxWidth: '1200px',
            width: '85vw',
            minWidth: '500px',
            maxHeight: '85vh',
            minHeight: '400px',
            resize: 'both',
            overflow: 'auto',
          }}
        >
          {/* Dialog Header */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-4 text-slate-800 dark:text-gray-100">
                {selectedSensor && (() => {
                  const Icon = getSensorIcon(selectedSensor.pivot.custom_name);
                  const gradIdx = sensors.indexOf(selectedSensor) % GRADIENT_COLORS.length;
                  return (
                    <>
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[gradIdx]} shadow-md`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <span className="text-xl font-extrabold">{selectedSensor.pivot.custom_name}</span>
                        <div className="text-xs font-semibold text-slate-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <span className="font-mono bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 px-1.5 py-0.5 rounded">{selectedSensor.pivot.variable_name}</span>
                          <span>•</span>
                          <span>Satuan: {selectedSensor.pivot.unit || 'unit'}</span>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </DialogTitle>
            </DialogHeader>

            {/* Controls row */}
            <div className="flex items-center gap-3 mt-6 flex-wrap">
              {/* Chart Type */}
              <div className="flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-1 shadow-sm gap-1">
                {([
                  { id: 'area', icon: AreaChart, label: 'Area' },
                  { id: 'line', icon: LineChartIcon, label: 'Line' },
                  { id: 'bar', icon: BarChart2, label: 'Bar' },
                ] as const).map(({ id, icon: Ic, label }) => (
                  <button
                    key={id}
                    onClick={() => setChartType(id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${chartType === id
                      ? 'bg-[#00FF00] text-black shadow-sm dark:shadow-[#00FF00]/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <Ic className="h-4 w-4" /> {label}
                  </button>
                ))}
              </div>

              {/* History range */}
              <div className="flex bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg p-1 shadow-sm gap-1">
                {([20, 50, 100] as const).map(n => (
                  <button
                    key={n}
                    onClick={() => setHistoryRange(n)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${historyRange === n
                      ? 'bg-slate-800 dark:bg-gray-800 text-white shadow-sm ring-1 ring-[#00FF00]/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    {n} data
                  </button>
                ))}
              </div>

              {/* Theme swatch row */}
              <div className="flex gap-2 ml-auto bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-1.5 rounded-lg shadow-sm">
                {(Object.entries(CHART_THEMES) as [ThemeKey, typeof CHART_THEMES[ThemeKey]][]).map(([key, t]) => (
                  <button
                    key={key}
                    title={t.name}
                    onClick={() => setChartTheme(key)}
                    className={`h-6 w-6 rounded-full border-2 transition-all ${chartTheme === key ? 'border-slate-800 dark:border-white scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105 hover:shadow'
                      }`}
                    style={{ background: t.swatch }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Chart body */}
          <div className="p-6">
            {dialogData && dialogData.values.length >= 2 ? (
              <div className="flex flex-col h-full space-y-5">
                {/* Current + min/max/avg summary */}
                {selectedSensor && (() => {
                  const k = selectedSensor.pivot.variable_name;
                  const stats = (statistics?.variables?.[k] ?? statistics?.variables?.[k.toLowerCase()] ?? computeStats(fullHistory?.vars[k] ?? sparkHistory[k])) || undefined;
                  const cur = realtimeData?.[k] ?? realtimeData?.[k.toLowerCase()];
                  return (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
                      {[
                        { label: 'Saat ini', value: cur !== undefined ? Number(cur).toFixed(2) : '—', color: 'text-green-700 dark:text-[#00FF00]', bg: 'bg-green-50 dark:bg-[#00FF00]/10 border-green-200 dark:border-[#00FF00]/30', accent: theme.swatch },
                        { label: 'Min', value: stats ? stats.min.toFixed(2) : '—', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 shadow-sm' },
                        { label: 'Rata-rata', value: stats ? stats.avg.toFixed(2) : '—', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 shadow-sm' },
                        { label: 'Max', value: stats ? stats.max.toFixed(2) : '—', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 shadow-sm' },
                      ].map(({ label, value, color, bg, accent }) => (
                        <div key={label} className={`rounded-xl border px-5 py-4 relative overflow-hidden ${bg}`}>
                          {accent && <div className="absolute top-0 left-0 w-full h-1" style={{ background: accent }} />}
                          <p className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                          <p className={`text-2xl font-black ${color}`}>{value}</p>
                          <p className="text-[10px] font-semibold text-slate-400 dark:text-gray-500 mt-1 uppercase">{selectedSensor.pivot.unit || 'unit'}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* The Chart */}
                <div
                  ref={dialogChartRef}
                  className="rounded-xl bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 shadow-inner p-4 w-full h-full flex-grow min-h-[350px] relative [--chart-text:#64748b] dark:[--chart-text:#94a3b8] [--chart-axis:#cbd5e1] dark:[--chart-axis:#334155] [--chart-grid:#f1f5f9] dark:[--chart-grid:#1e293b]"
                >
                  <div className="absolute inset-0 p-4">
                    {chartType === 'bar' ? (
                      <BarChart
                        series={[{
                          data: dialogData.values,
                          label: selectedSensor?.pivot.custom_name,
                          color: theme.colors[sensors.indexOf(selectedSensor!) % theme.colors.length],
                        }]}
                        xAxis={[{ data: dialogData.labels, scaleType: 'band' }]}
                        width={dialogChartWidth > 0 ? dialogChartWidth - 32 : 600}
                        height={350}
                        sx={{
                          '& .MuiChartsAxis-tickLabel': { fill: 'var(--chart-text)', fontSize: '11px', fontWeight: 500 },
                          '& .MuiChartsAxis-line': { stroke: 'var(--chart-axis)' },
                          '& .MuiChartsAxis-tick': { stroke: 'var(--chart-axis)' },
                          '& .MuiChartsGrid-line': { stroke: 'var(--chart-grid)', strokeDasharray: '4 4' },
                          backgroundColor: 'transparent',
                        }}
                      />
                    ) : (
                      <LineChart
                        series={[{
                          data: dialogData.values,
                          label: selectedSensor?.pivot.custom_name,
                          color: theme.colors[sensors.indexOf(selectedSensor!) % theme.colors.length],
                          area: chartType === 'area',
                          curve: 'monotoneX',
                          showMark: dialogData.values.length <= 20,
                        }]}
                        xAxis={[{ data: dialogData.labels, scaleType: 'point' }]}
                        width={dialogChartWidth > 0 ? dialogChartWidth - 32 : 600}
                        height={350}
                        sx={{
                          '& .MuiChartsAxis-tickLabel': { fill: 'var(--chart-text)', fontSize: '11px', fontWeight: 500 },
                          '& .MuiChartsAxis-line': { stroke: 'var(--chart-axis)' },
                          '& .MuiChartsAxis-tick': { stroke: 'var(--chart-axis)' },
                          '& .MuiChartsGrid-line': { stroke: 'var(--chart-grid)', strokeDasharray: '4 4' },
                          '& .MuiAreaElement-root': { fillOpacity: 0.15 },
                          backgroundColor: 'transparent',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-gray-500 gap-3 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl bg-slate-50 dark:bg-gray-900">
                <div className="h-16 w-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                  <WifiOff className="h-8 w-8 text-slate-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-medium">Belum ada data historis yang cukup untuk sensor ini</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </MonitoringLayout>
  );
}
