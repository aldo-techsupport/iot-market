import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft, User, Cpu, CalendarClock, ShieldAlert,
    Save, RefreshCw, ExternalLink, Smartphone, ShoppingCart,
} from 'lucide-react';

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
    subscription: SubscriptionInfo | null;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
}

interface UserDetail {
    id: number;
    name: string;
    email: string;
    created_at: string;
    devices_count: number;
    orders_count: number;
}

interface Props {
    user: UserDetail;
    devices: Device[];
    orders: Order[];
}

const statusColors: Record<string, string> = {
    pending:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    active:   'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    expired:  'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export default function AdminUserShow({ user, devices, orders }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        password: '',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const getExpiryBadge = (sub: SubscriptionInfo | null) => {
        if (!sub) return <span className="text-xs text-muted-foreground">—</span>;
        if (sub.is_expired) return (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                <ShieldAlert className="h-3 w-3" /> Expired
            </span>
        );
        const colors: Record<string, string> = {
            active: 'text-emerald-600 dark:text-emerald-400',
            warning: 'text-yellow-600 dark:text-yellow-400',
            critical: 'text-orange-600 dark:text-orange-400',
        };
        return (
            <span className={`flex items-center gap-1 text-xs font-medium ${colors[sub.expiry_status] ?? 'text-muted-foreground'}`}>
                <CalendarClock className="h-3 w-3" />
                {sub.days_remaining} hari ({sub.end_date
                    ? new Date(sub.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '-'})
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title={`User: ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button variant="outline" size="icon" className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <User className="h-6 w-6 text-blue-500" />
                            {user.name}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-0.5">
                            {user.email} · Daftar {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="ml-auto flex gap-3">
                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5">
                            <Smartphone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{user.devices_count} device</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg px-3 py-1.5">
                            <ShoppingCart className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">{user.orders_count} order</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Edit Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-base">Edit Data User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Nama lengkap"
                                    />
                                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Password Baru <span className="text-muted-foreground">(kosongkan jika tidak ubah)</span></Label>
                                    <Input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Password baru"
                                        autoComplete="new-password"
                                    />
                                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Right: Devices + Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Devices */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Cpu className="h-4 w-4 text-blue-500" />
                                        Perangkat ({devices.length})
                                    </CardTitle>
                                    <Link href="/admin/devices">
                                        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                                            Semua Device <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {devices.length === 0 ? (
                                    <p className="text-center py-8 text-muted-foreground text-sm">Belum ada device</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-t bg-muted/30">
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Nama</th>
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Kode</th>
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Masa Aktif</th>
                                                <th className="text-center px-4 py-2.5 font-medium text-muted-foreground text-xs">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {devices.map(device => (
                                                <tr key={device.id} className="border-b last:border-0 hover:bg-muted/20">
                                                    <td className="px-4 py-2.5 font-medium">{device.name}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{device.device_code}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5">{getExpiryBadge(device.subscription)}</td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <Link href={`/admin/devices/${device.id}`}>
                                                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                                                <ExternalLink className="h-3 w-3" /> Edit
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </CardContent>
                        </Card>

                        {/* Orders */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4 text-purple-500" />
                                    Riwayat Order ({orders.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {orders.length === 0 ? (
                                    <p className="text-center py-8 text-muted-foreground text-sm">Belum ada order</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-t bg-muted/30">
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Order #</th>
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Total</th>
                                                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Tanggal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id} className="border-b last:border-0 hover:bg-muted/20">
                                                    <td className="px-4 py-2.5 font-mono text-xs">{order.order_number}</td>
                                                    <td className="px-4 py-2.5">
                                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[order.status] ?? ''}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-sm font-semibold">
                                                        Rp {(order.total_amount / 1000).toFixed(0)}K
                                                    </td>
                                                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                                                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric', month: 'short', year: 'numeric'
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
