import { Head, Link, router } from '@inertiajs/react';
import MonitoringLayout from '@/layouts/monitoring-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Activity,
    MoreVertical,
    Pencil,
    Trash2,
    Key,
    RefreshCw,
    Cpu,
    Wifi,
    WifiOff,
    Clock,
    Copy,
    Check,
    Eye,
    EyeOff,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

interface Device {
    id: number;
    name: string;
    device_code: string;
    location: string;
    description: string | null;
    status: string;
    api_key: string | null;
    activated_at: string | null;
    last_seen?: string | null;
    sensors_count?: number;
}

interface PendingSetupOrder {
    id: number;
    order_number: string;
    package_name: string;
    sensors_count: number;
    created_at: string;
}

interface Stats {
    total: number;
    online: number;
    idle: number;
    offline: number;
}

interface Props {
    hasActiveOrder?: boolean;
    orderInfo?: {
        order_number: string;
        device_name: string;
        status: string;
        sensors_count: number;
    };
    devices?: Device[];
    stats?: Stats;
    pendingSetupOrders?: PendingSetupOrder[];
}

export default function UserDashboard({ hasActiveOrder = false, orderInfo, devices = [], stats, pendingSetupOrders = [] }: Props) {
    // --- State: Edit Modal ---
    const [editOpen, setEditOpen] = useState(false);
    const [editDevice, setEditDevice] = useState<Device | null>(null);
    const [editForm, setEditForm] = useState({ name: '', location: '', description: '' });
    const [editLoading, setEditLoading] = useState(false);

    // --- State: Delete Modal ---
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDevice, setDeleteDevice] = useState<Device | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    // --- State: API Key Modal ---
    const [apiKeyOpen, setApiKeyOpen] = useState(false);
    const [apiKeyDevice, setApiKeyDevice] = useState<Device | null>(null);
    const [showApiKey, setShowApiKey] = useState(false);
    const [copied, setCopied] = useState(false);

    // ---- Handlers: Edit ----
    const openEdit = (device: Device) => {
        setEditDevice(device);
        setEditForm({
            name: device.name,
            location: device.location,
            description: device.description || '',
        });
        setEditOpen(true);
    };

    const handleEdit = () => {
        if (!editDevice) return;
        setEditLoading(true);
        router.put(
            `/dashboard/devices/${editDevice.id}`,
            {
                name: editForm.name,
                location: editForm.location,
                description: editForm.description,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setEditLoading(false);
                    setEditOpen(false);
                },
            }
        );
    };

    // ---- Handlers: Delete ----
    const openDelete = (device: Device) => {
        setDeleteDevice(device);
        setDeleteConfirmText('');
        setDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!deleteDevice) return;
        setDeleteLoading(true);
        router.delete(`/dashboard/devices/${deleteDevice.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleteLoading(false);
                setDeleteOpen(false);
            },
        });
    };

    // ---- Handlers: API Key ----
    const openApiKey = (device: Device) => {
        setApiKeyDevice(device);
        setShowApiKey(false);
        setCopied(false);
        setApiKeyOpen(true);
    };

    const copyApiKey = () => {
        if (apiKeyDevice?.api_key) {
            navigator.clipboard.writeText(apiKeyDevice.api_key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // ---- Status helpers ----
    const getStatusBadge = (status: string) => {
        if (status === 'active' || status === 'online') {
            return (
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs font-medium text-green-400">Online</span>
                </span>
            );
        }
        if (status === 'idle') {
            return (
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-400" />
                    <span className="text-xs font-medium text-yellow-400">Idle</span>
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-400">Offline</span>
            </span>
        );
    };

    const defaultStats = stats ?? {
        total: devices.length,
        online: devices.filter(d => d.status === 'active' || d.status === 'online').length,
        idle: devices.filter(d => d.status === 'idle').length,
        offline: devices.filter(d => d.status !== 'active' && d.status !== 'online' && d.status !== 'idle').length,
    };

    return (
        <MonitoringLayout title="IoT Monitoring">
            <Head title="IoT Monitoring" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">IoT Monitoring</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your IoT devices in real-time</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.reload()}
                        className="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                            <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Devices</CardTitle>
                            <Activity className="h-4 w-4 text-gray-500" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{defaultStats.total}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                            <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">Online</CardTitle>
                            <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-3xl font-bold text-green-400">{defaultStats.online}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                            <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">Idle</CardTitle>
                            <span className="h-3 w-3 rounded-full bg-yellow-400" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-3xl font-bold text-yellow-400">{defaultStats.idle}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                            <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">Offline</CardTitle>
                            <span className="h-3 w-3 rounded-full bg-red-500" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="text-3xl font-bold text-red-400">{defaultStats.offline}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Pending Setup Orders */}
                {pendingSetupOrders.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Order Perlu Setup</h2>
                        <div className="grid grid-cols-1 gap-3">
                            {pendingSetupOrders.map((order) => (
                                <Card
                                    key={order.id}
                                    className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                                        Approved
                                                    </span>
                                                    <span className="text-xs text-gray-500">{order.created_at}</span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                    Order #{order.order_number}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    {order.package_name} • {order.sensors_count} sensor
                                                </p>
                                            </div>
                                            <Link href={`/memberarea/device-setup?order_id=${order.id}`}>
                                                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                                                    Setup Device
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Device Cards Grid */}
                {devices.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {devices.map((device) => (
                            <Card
                                key={device.id}
                                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        {/* Device name + status */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide truncate">
                                                    {device.name}
                                                </span>
                                                {getStatusBadge(device.status)}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{device.location}</p>
                                        </div>

                                        {/* Three-dot Menu */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 flex-shrink-0 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="w-48 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => openEdit(device)}
                                                    className="gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:bg-gray-100 dark:focus:bg-gray-800 cursor-pointer"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit Perangkat
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => openApiKey(device)}
                                                    className="gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:text-gray-900 dark:focus:text-white focus:bg-gray-100 dark:focus:bg-gray-800 cursor-pointer"
                                                >
                                                    <Key className="h-4 w-4" />
                                                    Lihat API Key
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                                                <DropdownMenuItem
                                                    onClick={() => openDelete(device)}
                                                    className="gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:text-red-700 dark:focus:text-red-300 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Hapus Perangkat
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    {/* Device Code */}
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <Cpu className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                                        <span className="font-mono text-gray-700 dark:text-gray-300">{device.device_code}</span>
                                    </div>

                                    {/* Sensors count */}
                                    {device.sensors_count !== undefined && (
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Activity className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                                            <span>{device.sensors_count} Sensor terpasang</span>
                                        </div>
                                    )}

                                    {/* Last seen */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span>{device.last_seen ? `Last seen: ${device.last_seen}` : 'Belum pernah mengirim data'}</span>
                                    </div>

                                    {/* Monitor Button */}
                                    <Link href={`/dashboard/monitoring/${device.id}`}>
                                        <Button
                                            size="sm"
                                            className="w-full mt-1 bg-blue-600 hover:bg-blue-500 text-white text-xs"
                                        >
                                            <Activity className="h-3.5 w-3.5 mr-1.5" />
                                            Lihat Monitoring
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    /* No Device State */
                    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <WifiOff className="h-8 w-8 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum Ada Perangkat</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                                Anda belum memiliki perangkat aktif. Silakan order perangkat melalui Member Area dan setup setelah diapprove admin.
                            </p>
                            <div className="flex gap-3">
                                <Link href="/memberarea">
                                    <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                                        Buka Member Area
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Links */}
                {hasActiveOrder && (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 text-sm">
                        <Link href="/memberarea">
                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <div className="h-9 w-9 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">🛒</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Member Area</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Kelola subscription & pembelian</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/memberarea/orders">
                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                                <div className="h-9 w-9 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg">📋</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Riwayat Order</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Lihat semua order Anda</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}
            </div>

            {/* ============================
                MODAL: Edit Perangkat
            ============================= */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-blue-400" />
                            Edit Perangkat
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Ubah informasi perangkat <span className="font-semibold text-gray-300">{editDevice?.name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-gray-300">Nama Perangkat</Label>
                            <Input
                                value={editForm.name}
                                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                                placeholder="Nama perangkat"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-300">Lokasi</Label>
                            <Input
                                value={editForm.location}
                                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                                placeholder="Lokasi perangkat"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-gray-300">Deskripsi <span className="text-gray-500">(opsional)</span></Label>
                            <Input
                                value={editForm.description}
                                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                                placeholder="Deskripsi singkat"
                            />
                        </div>

                        {/* Device Code (readonly) */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-500 text-xs">Device Code (tidak bisa diubah)</Label>
                            <Input
                                value={editDevice?.device_code ?? ''}
                                readOnly
                                className="bg-gray-800/50 border-gray-800 text-gray-500 font-mono text-sm cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setEditOpen(false)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleEdit}
                            disabled={editLoading || !editForm.name || !editForm.location}
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            {editLoading ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 mr-2" />
                            )}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ============================
                MODAL: Hapus Perangkat
            ============================= */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-400">
                            <AlertTriangle className="h-5 w-5" />
                            Hapus Perangkat
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Tindakan ini tidak dapat dibatalkan. Seluruh data perangkat dan riwayat sensor akan dihapus permanen.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Device info */}
                        <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 space-y-1.5">
                            <p className="text-sm font-semibold text-white">{deleteDevice?.name}</p>
                            <p className="text-xs text-gray-400">{deleteDevice?.location}</p>
                            <p className="text-xs font-mono text-gray-500">{deleteDevice?.device_code}</p>
                        </div>

                        {/* Confirm by typing name */}
                        <div className="space-y-1.5">
                            <Label className="text-gray-300 text-sm">
                                Ketik <span className="font-mono font-semibold text-red-400">{deleteDevice?.name}</span> untuk konfirmasi:
                            </Label>
                            <Input
                                value={deleteConfirmText}
                                onChange={e => setDeleteConfirmText(e.target.value)}
                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-500"
                                placeholder={deleteDevice?.name}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteOpen(false)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleteLoading || deleteConfirmText !== deleteDevice?.name}
                            className="bg-red-600 hover:bg-red-500 text-white disabled:opacity-40"
                        >
                            {deleteLoading ? (
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            Hapus Perangkat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ============================
                MODAL: API Key
            ============================= */}
            <Dialog open={apiKeyOpen} onOpenChange={setApiKeyOpen}>
                <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-yellow-400" />
                            API Key Perangkat
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Gunakan API Key ini untuk mengirim data dari perangkat{' '}
                            <span className="font-semibold text-gray-300">{apiKeyDevice?.name}</span> ke server.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Device info */}
                        <div className="flex items-center gap-3 rounded-lg bg-gray-800 border border-gray-700 p-3">
                            <div className="h-9 w-9 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                                <Cpu className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{apiKeyDevice?.name}</p>
                                <p className="text-xs font-mono text-gray-400 truncate">{apiKeyDevice?.device_code}</p>
                            </div>
                        </div>

                        {/* API Key display */}
                        <div className="space-y-2">
                            <Label className="text-gray-300 text-sm flex items-center gap-2">
                                <Key className="h-3.5 w-3.5 text-yellow-400" />
                                API Key
                            </Label>
                            <div className="relative">
                                <Input
                                    value={apiKeyDevice?.api_key ?? 'Tidak ada API Key'}
                                    readOnly
                                    type={showApiKey ? 'text' : 'password'}
                                    className="bg-gray-800 border-gray-700 text-yellow-300 font-mono text-sm pr-24 cursor-text select-all"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-gray-400 hover:text-white"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-gray-400 hover:text-white"
                                        onClick={copyApiKey}
                                    >
                                        {copied ? (
                                            <Check className="h-3.5 w-3.5 text-green-400" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                            {copied && (
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> API Key berhasil disalin!
                                </p>
                            )}
                        </div>

                        {/* Usage example */}
                        <div className="space-y-2">
                            <Label className="text-gray-400 text-xs uppercase tracking-wider">Contoh penggunaan</Label>
                            <div className="rounded-lg bg-gray-950 border border-gray-800 p-3 font-mono text-xs text-green-400 overflow-x-auto">
                                <div className="text-gray-500"># Kirim data sensor via HTTP POST</div>
                                <div className="mt-1 text-gray-300">curl -X POST \</div>
                                <div className="text-gray-300 pl-2">{'  '}<span className="text-blue-400">https://api.iot.example.com/api/iot/data</span> \</div>
                                <div className="text-gray-300 pl-2">{'  '}-H <span className="text-yellow-300">"X-Device-Key: {showApiKey ? (apiKeyDevice?.api_key ?? '***') : '***'}"</span> \</div>
                                <div className="text-gray-300 pl-2">{'  '}-d <span className="text-green-300">'{'{'}"{apiKeyDevice?.device_code ?? 'DEVICE_CODE'}": "value"{'}'}'</span></div>
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="flex gap-2 rounded-lg bg-yellow-900/20 border border-yellow-800/50 p-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-300">
                                Jangan bagikan API Key ini kepada orang lain. API Key berfungsi sebagai autentikasi perangkat Anda.
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => setApiKeyOpen(false)}
                            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                        >
                            Tutup
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </MonitoringLayout>
    );
}
