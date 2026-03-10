import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search, Cpu, Eye, Trash2, RefreshCw, CalendarClock, ShieldAlert, User,
} from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

interface SubscriptionInfo {
    id: number;
    status: string;
    start_date: string | null;
    end_date: string | null;
    days_remaining: number;
    expiry_status: 'active' | 'warning' | 'critical' | 'expired';
    is_expired: boolean;
}

interface Device {
    id: number;
    name: string;
    device_code: string;
    location: string;
    status: string;
    activated_at: string | null;
    subscription_info: SubscriptionInfo | null;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface PaginatedDevices {
    data: Device[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    devices: PaginatedDevices;
    search: string;
}

export default function AdminDevicesIndex({ devices, search }: Props) {
    const [searchQuery, setSearchQuery] = useState(search ?? '');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteDevice, setDeleteDevice] = useState<Device | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/devices', { search: searchQuery }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleteDevice) return;
        setDeleteLoading(true);
        router.delete(`/admin/devices/${deleteDevice.id}`, {
            onFinish: () => { setDeleteLoading(false); setDeleteOpen(false); },
        });
    };

    const getExpiryBadge = (sub: SubscriptionInfo | null) => {
        if (!sub) return <span className="text-xs text-muted-foreground">—</span>;
        if (sub.is_expired) return (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                <ShieldAlert className="h-3 w-3" /> Expired
            </span>
        );
        const cfg: Record<string, { cls: string; label: string }> = {
            critical: { cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400', label: `${sub.days_remaining}h` },
            warning:  { cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400', label: `${sub.days_remaining}h` },
            active:   { cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400', label: `${sub.days_remaining}h` },
        };
        const c = cfg[sub.expiry_status] ?? cfg.active;
        return (
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${c.cls}`}>
                <CalendarClock className="h-3 w-3" /> {c.label} lagi
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Kelola Devices — Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Cpu className="h-6 w-6 text-green-500" />
                            Kelola Devices
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Total {devices.total} perangkat terdaftar
                        </p>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari nama / kode / lokasi / user..."
                                className="pl-9 w-72"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="sm">Cari</Button>
                        {search && (
                            <Button type="button" variant="ghost" size="sm"
                                onClick={() => { setSearchQuery(''); router.get('/admin/devices'); }}>
                                Reset
                            </Button>
                        )}
                    </form>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Perangkat</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Device Code</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Pemilik</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lokasi</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Masa Aktif</th>
                                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {devices.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                Tidak ada device ditemukan
                                            </td>
                                        </tr>
                                    ) : devices.data.map(device => (
                                        <tr key={device.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                        <Cpu className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{device.name}</p>
                                                        {device.activated_at && (
                                                            <p className="text-xs text-muted-foreground">
                                                                Aktif: {new Date(device.activated_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{device.device_code}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/admin/users/${device.user.id}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span className="text-sm">{device.user.name}</span>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-sm">{device.location || '—'}</td>
                                            <td className="px-4 py-3">{getExpiryBadge(device.subscription_info)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/devices/${device.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 gap-1.5">
                                                            <Eye className="h-3.5 w-3.5" /> Detail
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                                                        onClick={() => { setDeleteDevice(device); setDeleteOpen(true); }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {devices.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t">
                                <p className="text-xs text-muted-foreground">
                                    Menampilkan {devices.from}–{devices.to} dari {devices.total} device
                                </p>
                                <div className="flex gap-1">
                                    {devices.links.map((link, i) => (
                                        link.url ? (
                                            <Link key={i} href={link.url}
                                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span key={i} className="px-3 py-1.5 rounded text-xs text-muted-foreground opacity-50"
                                                dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus Perangkat</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus perangkat <strong>{deleteDevice?.name}</strong>? 
                            Subscription terkait juga akan dihapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
