import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    created_at: string;
    device_id: number | null;
    device_name: string | null;
    sensors: Array<{
        id: number;
        name: string;
        price: number;
        pivot?: {
            variable_name: string;
            custom_name: string;
            unit: string;
        };
    }>;
    package?: {
        id: number;
        name: string;
        max_sensors: number;
    };
}

interface Props {
    order: Order;
}

export default function OrderDetail({ order }: Props) {
    const { flash } = usePage<any>().props;
    const [showApiModal, setShowApiModal] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);

    useEffect(() => {
        if (flash?.new_device) {
            setShowApiModal(true);
        }
    }, [flash]);

    const handleCopy = (text: string, type: 'key' | 'curl') => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        if (type === 'key') {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        } else {
            setCopiedCurl(true);
            setTimeout(() => setCopiedCurl(false), 2000);
        }
    };
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const statusText = {
        pending: 'Menunggu Verifikasi',
        approved: 'Disetujui',
        rejected: 'Ditolak',
    };

    return (
        <>
            <Head title={`Order ${order.order_number}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/memberarea" className="text-blue-600 hover:text-blue-700">
                                ← Kembali ke Member Area
                            </Link>
                            <Link href="/memberarea/orders">
                                <Button variant="outline" size="sm">Lihat Semua Order</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-6 py-12 max-w-4xl">
                    <div className="text-center mb-8">
                        <div className="inline-block mb-4">
                            <span className="text-6xl">✅</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Order Berhasil Dibuat!</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Order Number: <span className="font-mono font-bold">{order.order_number}</span>
                        </p>
                    </div>

                    <Card className="p-8 mb-6">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b">
                            <div>
                                <h2 className="text-2xl font-bold">Status Order</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Dibuat pada {new Date(order.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <span className={`px-6 py-3 rounded-full font-semibold ${statusColors[order.status as keyof typeof statusColors]}`}>
                                {statusText[order.status as keyof typeof statusText]}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-3">Sensor Dipilih ({order.sensors.length})</h3>
                                {order.sensors.length > 0 ? (
                                    <div className="space-y-2">
                                        {order.sensors.map((sensor) => (
                                            <div key={sensor.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                                <div>
                                                    <span className="font-medium">{sensor.pivot?.custom_name || sensor.name}</span>
                                                    {sensor.pivot?.variable_name && (
                                                        <span className="ml-2 text-sm text-gray-500">({sensor.pivot.variable_name})</span>
                                                    )}
                                                    {sensor.pivot?.unit && (
                                                        <span className="ml-2 text-sm text-gray-500">[{sensor.pivot.unit}]</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            Belum ada sensor dikonfigurasi. Silakan setup device setelah order disetujui.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t">
                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span>Total Pembayaran</span>
                                    <span className="text-blue-600">
                                        Rp {(order.total_amount / 1000).toFixed(0)}K/bulan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {order.status === 'pending' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-2">⏳ Menunggu Verifikasi Admin</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Order Anda sedang dalam proses verifikasi oleh admin. Proses ini biasanya memakan waktu maksimal 1x24 jam.
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Anda akan menerima notifikasi email setelah order disetujui. Setelah disetujui, Anda akan mendapatkan akses ke Dashboard Monitoring dan API Key untuk perangkat IoT Anda.
                            </p>
                        </div>
                    )}

                    {order.status === 'approved' && !order.device_id && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <h3 className="font-bold text-lg mb-2">🎉 Order Disetujui!</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Selamat! Order Anda telah disetujui. Anda sekarang dapat melakukan setup device dan sensor.
                            </p>
                            <Link href={`/memberarea/device-setup?order_id=${order.id}`}>
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                    Setup Device & Sensor
                                </Button>
                            </Link>
                        </div>
                    )}

                    {order.status === 'approved' && order.device_id && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
                            <h3 className="font-bold text-lg mb-2">🎉 Order Disetujui!</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Selamat! Order Anda telah disetujui. Anda sekarang dapat mengakses Dashboard Monitoring.
                            </p>
                            <Link href="/dashboard/monitoring">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                                    Buka Dashboard Monitoring
                                </Button>
                            </Link>
                        </div>
                    )}

                    {order.status === 'rejected' && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                            <h3 className="font-bold text-lg mb-2">❌ Order Ditolak</h3>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                Maaf, order Anda ditolak oleh admin. Silakan hubungi admin untuk informasi lebih lanjut atau buat order baru.
                            </p>
                            <Link href="/memberarea">
                                <Button variant="outline">Buat Order Baru</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showApiModal} onOpenChange={setShowApiModal}>
                <DialogContent className="sm:max-w-2xl bg-[#0f1115] border-gray-800 text-white p-0 overflow-hidden shadow-2xl">
                    <DialogHeader className="p-6 border-b border-gray-800">
                        <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-green-500">
                            <CheckCircle2 className="w-6 h-6" /> Device Created!
                        </DialogTitle>
                        <p className="text-gray-400 mt-1">{flash?.new_device?.name}</p>
                    </DialogHeader>

                    <div className="p-6 space-y-6">
                        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 flex gap-3 text-yellow-500">
                            <AlertTriangle className="w-5 h-5 shrink-0" />
                            <p className="font-medium text-sm">Save this API Key! It won't be shown again.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-200">Device API Key</label>
                                <div className="flex bg-[#1a1d24] border border-gray-800 rounded-lg p-1 items-center">
                                    <code className="flex-1 px-3 py-2 text-sm text-gray-300 truncate">{flash?.new_device?.api_key}</code>
                                    <Button size="icon" variant="ghost" className="shrink-0 hover:bg-gray-800 hover:text-white" onClick={() => handleCopy(flash?.new_device?.api_key, 'key')}>
                                        {copiedKey ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-200">API Endpoint</label>
                                <div className="bg-[#1a1d24] border border-gray-800 rounded-lg px-4 py-3">
                                    <code className="text-sm text-gray-300 break-all">{flash?.new_device?.endpoint}</code>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-200">Example cURL</label>
                                    <button className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors" onClick={() => handleCopy(flash?.new_device?.curl, 'curl')}>
                                        {copiedCurl ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />} {copiedCurl ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-[#1a1d24] border border-gray-800 rounded-lg p-4 overflow-x-auto">
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all"><code>{flash?.new_device?.curl}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-6 border-t border-gray-800 flex justify-end">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full" onClick={() => setShowApiModal(false)}>
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
