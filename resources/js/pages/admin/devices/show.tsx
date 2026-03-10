import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    ArrowLeft, Cpu, User, CalendarClock, ShieldAlert, Save, RefreshCw,
    Activity, Pencil, X, Check, AlertTriangle,
} from 'lucide-react';

interface SubscriptionInfo {
    id: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
    days_remaining: number;
    expiry_status: 'active' | 'warning' | 'critical' | 'expired';
    is_expired: boolean;
    package: { id: number; name: string } | null;
}

interface SensorRow {
    id: number;
    variable_name: string;
    custom_name: string;
    unit: string | null;
    price: string;
}

interface DeviceDetail {
    id: number;
    name: string;
    device_code: string;
    location: string;
    description: string | null;
    status: string;
    api_key: string | null;
    activated_at: string | null;
    user: { id: number; name: string; email: string };
}

interface Props {
    device: DeviceDetail;
    subscription: SubscriptionInfo | null;
    sensors: SensorRow[];
    orderSensors: Array<{ id: number; name: string; pivot: { variable_name?: string; custom_name?: string; unit?: string } }>;
}

const VARIABLES = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10',
    'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20'];

export default function AdminDeviceShow({ device, subscription, sensors, orderSensors }: Props) {
    // ─── Device edit form ───────────────────────────────────────────
    const deviceForm = useForm({
        name: device.name,
        location: device.location,
        description: device.description ?? '',
    });

    const handleDeviceSave = (e: React.FormEvent) => {
        e.preventDefault();
        deviceForm.put(`/admin/devices/${device.id}`);
    };

    // ─── Subscription edit form ─────────────────────────────────────
    const subForm = useForm({
        end_date: subscription?.end_date ?? '',
        status: subscription?.status ?? 'active',
    });

    const handleSubSave = (e: React.FormEvent) => {
        e.preventDefault();
        subForm.put(`/admin/devices/${device.id}/subscription`);
    };

    // ─── Inline sensor editing ──────────────────────────────────────
    const [editingSensorId, setEditingSensorId] = useState<number | null>(null);
    const [sensorEdits, setSensorEdits] = useState<Record<number, { variable_name: string; custom_name: string; unit: string }>>({});
    const [sensorSaving, setSensorSaving] = useState<number | null>(null);

    const startEditSensor = (s: SensorRow) => {
        setEditingSensorId(s.id);
        setSensorEdits(prev => ({
            ...prev,
            [s.id]: { variable_name: s.variable_name, custom_name: s.custom_name, unit: s.unit ?? '' },
        }));
    };

    const saveSensor = (s: SensorRow) => {
        const edit = sensorEdits[s.id];
        if (!edit) return;
        setSensorSaving(s.id);
        router.put(`/admin/devices/${device.id}/sensors/${s.id}`, edit as Record<string, string>, {
            preserveScroll: true,
            onFinish: () => { setSensorSaving(null); setEditingSensorId(null); },
        });
    };

    // ─── Expiry UI helpers ──────────────────────────────────────────
    const expiryConfig = () => {
        if (!subscription) return null;
        if (subscription.is_expired) return {
            icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
            label: 'Expired',
            cls: 'text-red-600 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
        };
        if (subscription.expiry_status === 'critical') return {
            icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
            label: `${subscription.days_remaining} hari tersisa`,
            cls: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
        };
        if (subscription.expiry_status === 'warning') return {
            icon: <CalendarClock className="h-4 w-4 text-yellow-500" />,
            label: `${subscription.days_remaining} hari tersisa`,
            cls: 'text-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 border-yellow-200 dark:border-yellow-800',
        };
        return {
            icon: <CalendarClock className="h-4 w-4 text-emerald-500" />,
            label: `Aktif — ${subscription.days_remaining} hari`,
            cls: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        };
    };
    const expiry = expiryConfig();

    return (
        <AppLayout>
            <Head title={`Device: ${device.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/devices">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Cpu className="h-6 w-6 text-green-500" />
                            {device.name}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            <span className="font-mono">{device.device_code}</span>
                            {' '} · Milik{' '}
                            <Link href={`/admin/users/${device.user.id}`} className="text-blue-600 hover:underline">
                                {device.user.name}
                            </Link>
                        </p>
                    </div>

                    {expiry && (
                        <div className={`ml-auto flex items-center gap-2 border rounded-lg px-3 py-1.5 ${expiry.cls}`}>
                            {expiry.icon}
                            <span className="text-sm font-semibold">{expiry.label}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Device Edit */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Cpu className="h-4 w-4" /> Edit Perangkat
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDeviceSave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Perangkat</Label>
                                    <Input
                                        value={deviceForm.data.name}
                                        onChange={e => deviceForm.setData('name', e.target.value)}
                                    />
                                    {deviceForm.errors.name && <p className="text-xs text-red-500">{deviceForm.errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Lokasi</Label>
                                    <Input
                                        value={deviceForm.data.location}
                                        onChange={e => deviceForm.setData('location', e.target.value)}
                                    />
                                    {deviceForm.errors.location && <p className="text-xs text-red-500">{deviceForm.errors.location}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Deskripsi</Label>
                                    <Input
                                        value={deviceForm.data.description}
                                        onChange={e => deviceForm.setData('description', e.target.value)}
                                        placeholder="Opsional"
                                    />
                                </div>
                                <div className="rounded-lg bg-muted/40 px-3 py-2 space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Device Code</span>
                                        <span className="font-mono font-semibold">{device.device_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">API Key</span>
                                        <span className="font-mono">{device.api_key ? `${device.api_key.slice(0, 12)}...` : '—'}</span>
                                    </div>
                                    {device.activated_at && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Diaktifkan</span>
                                            <span>{new Date(device.activated_at).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    )}
                                </div>
                                <Button type="submit" className="w-full" disabled={deviceForm.processing}>
                                    {deviceForm.processing
                                        ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        : <Save className="h-4 w-4 mr-2" />}
                                    Simpan Perangkat
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Subscription / Durasi Edit */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarClock className="h-4 w-4" /> Kelola Durasi & Subscription
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!subscription ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <CalendarClock className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Belum ada subscription untuk device ini</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubSave} className="space-y-4">
                                    {/* Current info */}
                                    <div className="rounded-lg bg-muted/40 px-3 py-2 space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Paket</span>
                                            <span className="font-semibold">{subscription.package?.name ?? 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Mulai</span>
                                            <span>{subscription.start_date
                                                ? new Date(subscription.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                : '—'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Berakhir</span>
                                            <span className={subscription.is_expired ? 'text-red-600 font-semibold' : 'font-semibold'}>
                                                {subscription.end_date
                                                    ? new Date(subscription.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Sisa</span>
                                            <span className={subscription.is_expired ? 'text-red-500' : 'text-emerald-600 font-semibold'}>
                                                {subscription.is_expired ? 'Expired' : `${subscription.days_remaining} hari`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Tanggal Akhir Baru</Label>
                                        <Input
                                            type="date"
                                            value={subForm.data.end_date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => subForm.setData('end_date', e.target.value)}
                                        />
                                        {subForm.errors.end_date && <p className="text-xs text-red-500">{subForm.errors.end_date}</p>}
                                        <p className="text-xs text-muted-foreground">
                                            Perpanjang atau kurangi masa aktif subscription user
                                        </p>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Status Subscription</Label>
                                        <Select
                                            value={subForm.data.status}
                                            onValueChange={v => subForm.setData('status', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">✅ Active</SelectItem>
                                                <SelectItem value="expired">❌ Expired</SelectItem>
                                                <SelectItem value="cancelled">🚫 Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {subForm.errors.status && <p className="text-xs text-red-500">{subForm.errors.status}</p>}
                                    </div>

                                    {/* Quick extend buttons */}
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-muted-foreground">Perpanjang cepat</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {[1, 3, 6, 12].map(months => {
                                                const newDate = new Date();
                                                newDate.setMonth(newDate.getMonth() + months);
                                                return (
                                                    <Button
                                                        key={months}
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs"
                                                        onClick={() => {
                                                            subForm.setData('end_date', newDate.toISOString().split('T')[0]);
                                                            subForm.setData('status', 'active');
                                                        }}
                                                    >
                                                        +{months} bulan
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={subForm.processing}>
                                        {subForm.processing
                                            ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            : <CalendarClock className="h-4 w-4 mr-2" />}
                                        Simpan Durasi
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sensors Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            Kelola Sensor ({sensors.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {sensors.length === 0 && orderSensors.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Belum ada sensor terdaftar</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-t bg-muted/40">
                                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs w-28">Variable</th>
                                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Nama Sensor</th>
                                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs w-28">Unit</th>
                                        <th className="text-center px-4 py-2.5 font-medium text-muted-foreground text-xs w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sensors.map(sensor => {
                                        const isEditing = editingSensorId === sensor.id;
                                        const edit = sensorEdits[sensor.id] ?? {};
                                        const isSaving = sensorSaving === sensor.id;

                                        return (
                                            <tr key={sensor.id} className={`border-b last:border-0 transition-colors ${isEditing ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-muted/20'}`}>
                                                <td className="px-4 py-2">
                                                    {isEditing ? (
                                                        <Select
                                                            value={edit.variable_name ?? sensor.variable_name}
                                                            onValueChange={v => setSensorEdits(prev => ({
                                                                ...prev,
                                                                [sensor.id]: { ...prev[sensor.id], variable_name: v }
                                                            }))}
                                                        >
                                                            <SelectTrigger className="h-8 w-24">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {VARIABLES.map(v => (
                                                                    <SelectItem key={v} value={v}>{v}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <span className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded">
                                                            {sensor.variable_name}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-8 text-sm"
                                                            value={edit.custom_name ?? sensor.custom_name}
                                                            onChange={e => setSensorEdits(prev => ({
                                                                ...prev,
                                                                [sensor.id]: { ...prev[sensor.id], custom_name: e.target.value }
                                                            }))}
                                                        />
                                                    ) : (
                                                        <span className="font-medium">{sensor.custom_name}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {isEditing ? (
                                                        <Input
                                                            className="h-8 text-sm w-24"
                                                            placeholder="°C, %, ppm..."
                                                            value={edit.unit ?? sensor.unit ?? ''}
                                                            onChange={e => setSensorEdits(prev => ({
                                                                ...prev,
                                                                [sensor.id]: { ...prev[sensor.id], unit: e.target.value }
                                                            }))}
                                                        />
                                                    ) : (
                                                        <span className="text-muted-foreground">{sensor.unit || '—'}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <div className="flex items-center justify-center gap-1">
                                                        {isEditing ? (
                                                            <>
                                                                <Button
                                                                    size="icon"
                                                                    className="h-7 w-7 bg-green-600 hover:bg-green-700 text-white"
                                                                    onClick={() => saveSensor(sensor)}
                                                                    disabled={isSaving}
                                                                >
                                                                    {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="outline"
                                                                    className="h-7 w-7"
                                                                    onClick={() => setEditingSensorId(null)}
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="h-7 w-7"
                                                                onClick={() => startEditSensor(sensor)}
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
