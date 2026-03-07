import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface MonitoringPackage {
    id: number;
    name: string;
    description: string;
    base_price: number;
    max_sensors: number;
}

interface Props {
    package: MonitoringPackage;
}

export default function Checkout({ package: pkg }: Props) {
    const { data, setData, post, processing } = useForm({
        package_id: pkg.id,
        payment_method: 'bank_transfer',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/memberarea/create-order');
    };

    const getPackageColor = (name: string) => {
        const colors: Record<string, string> = {
            'Free': 'text-green-600',
            'Starter': 'text-blue-600',
            'Pro': 'text-purple-600',
            'Business': 'text-orange-600',
        };
        return colors[name] || 'text-blue-600';
    };

    return (
        <>
            <Head title="Checkout - IoT Monitoring" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/memberarea" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
                                <span>←</span> Kembali
                            </Link>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Konfirmasi Pembayaran
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-6 py-12 max-w-4xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">Checkout Paket</h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                            Konfirmasi pembelian paket monitoring Anda
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Package Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detail Paket</CardTitle>
                                    <CardDescription>
                                        Paket yang Anda pilih
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className={`text-3xl font-bold ${getPackageColor(pkg.name)}`}>
                                                {pkg.name}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                                {pkg.description}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t space-y-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                <span className="text-sm">1 Device</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                <span className="text-sm">{pkg.max_sensors} Sensor/device</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600">✓</span>
                                                <span className="text-sm">{pkg.max_sensors} Grafik/device</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={pkg.base_price > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {pkg.base_price > 0 ? '✓' : '✕'}
                                                </span>
                                                <span className={`text-sm ${pkg.base_price === 0 && 'text-gray-400'}`}>
                                                    Notifikasi WA/Telegram
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center text-2xl font-bold">
                                                <span>Total:</span>
                                                <span className={getPackageColor(pkg.name)}>
                                                    {pkg.base_price === 0 ? 'Gratis' : `Rp${(pkg.base_price / 1000).toFixed(0)}K`}
                                                </span>
                                            </div>
                                            {pkg.base_price > 0 && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    per bulan
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payment Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Pembayaran</CardTitle>
                                    <CardDescription>
                                        Metode pembayaran
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pkg.base_price > 0 ? (
                                            <>
                                                <div>
                                                    <Label>Metode Pembayaran</Label>
                                                    <select
                                                        value={data.payment_method}
                                                        onChange={(e) => setData('payment_method', e.target.value)}
                                                        className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                                    >
                                                        <option value="bank_transfer">Transfer Bank</option>
                                                        <option value="ewallet">E-Wallet</option>
                                                        <option value="credit_card">Kartu Kredit</option>
                                                    </select>
                                                </div>

                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <h4 className="font-semibold text-sm mb-2">📋 Instruksi Pembayaran:</h4>
                                                    <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                                                        <li>Klik tombol "Buat Order"</li>
                                                        <li>Admin akan mengirimkan detail pembayaran</li>
                                                        <li>Lakukan pembayaran sesuai instruksi</li>
                                                        <li>Tunggu verifikasi admin (1x24 jam)</li>
                                                        <li>Setelah approved, setup device Anda</li>
                                                    </ol>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <h4 className="font-semibold text-sm mb-2 text-green-600">🎉 Paket Gratis!</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Tidak perlu pembayaran. Klik "Buat Order" dan tunggu verifikasi admin, 
                                                    kemudian Anda bisa langsung setup device.
                                                </p>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            disabled={processing}
                                        >
                                            {processing ? 'Processing...' : 'Buat Order'}
                                        </Button>

                                        <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                                            Dengan melanjutkan, Anda menyetujui syarat dan ketentuan layanan kami
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
