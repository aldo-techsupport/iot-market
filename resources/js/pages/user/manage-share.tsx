import { Head, Link, router } from '@inertiajs/react';
import MonitoringLayout from '@/layouts/monitoring-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Copy,
    Cpu,
    RefreshCw,
    Share2,
    Trash2,
    Users,
    ArrowLeft
} from 'lucide-react';
import { useState } from 'react';

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
}

interface Share {
    id: number;
    user_id: number;
    user: User | null;
    status: string;
}

interface Device {
    id: number;
    name: string;
    device_code: string;
    location: string;
    shares?: Share[];
}

export default function ManageShare({
    device,
}: {
    device: Device;
}) {
    const [removingShareId, setRemovingShareId] = useState<number | null>(null);

    // Invite User Form States
    const [inviteUserId, setInviteUserId] = useState('');
    const [inviteRes, setInviteRes] = useState<{success?: boolean; message?: string} | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);
    
    // OTP states
    const [pendingShareId, setPendingShareId] = useState<number | null>(null);
    const [otpCode, setOtpCode] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    // Remove Share Action
    const handleRemoveShare = (shareId: number) => {
        setRemovingShareId(shareId);
        router.delete(`/devices/${shareId}/share/remove`, {
            preserveScroll: true,
            onFinish: () => setRemovingShareId(null),
        });
    };

    // Invite Action
    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteUserId.length !== 9) {
            setInviteRes({ success: false, message: 'Unique ID harus 9 karakter.' });
            return;
        }

        setInviteLoading(true); setInviteRes(null);
        try {
            const res = await fetch(`/dashboard/devices/${device.id}/invite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ unique_id: inviteUserId }),
            });
            const data = await res.json();
            setInviteRes({ success: data.success, message: data.message });
            if (data.success && data.share_id) {
                setPendingShareId(data.share_id);
            }
        } catch (error) {
            console.error(error);
            setInviteRes({ success: false, message: 'Gagal mengirim undangan. Terjadi kesalahan jaringan.' });
        } finally {
            setInviteLoading(false);
        }
    };

    // Verify OTP Action
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otpCode.length !== 6 || !pendingShareId) return;

        setOtpLoading(true); setInviteRes(null);
        try {
            const res = await fetch('/devices/share/accept', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({ share_id: pendingShareId, token: otpCode }),
            });
            const data = await res.json();
            setInviteRes({ success: data.success, message: data.message });
            if (data.success) {
                setPendingShareId(null);
                setOtpCode('');
                setInviteUserId('');
                router.reload(); // reload the page to get the updated devices list
            }
        } catch (error) {
            console.error(error);
            setInviteRes({ success: false, message: 'Gagal verifikasi OTP. Terjadi kesalahan jaringan.' });
        } finally {
            setOtpLoading(false);
        }
    };

    return (
        <MonitoringLayout title={`Kelola Sharing - ${device.name}`}>
            <Head title={`Kelola Sharing - ${device.name}`} />

            <div className="flex flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kelola Sharing Perangkat</h1>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
                            Atur pengguna mana saja yang bisa memantau alat Anda.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Daftar User Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                    Daftar Pengguna
                                </CardTitle>
                                <CardDescription>
                                    Pengguna di bawah ini memiliki akses untuk memantau data sensor dari <span className="font-semibold text-gray-300">{device.name}</span>.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {device.shares && device.shares.length > 0 ? (
                                    <div className="space-y-3">
                                        {device.shares.map((share) => (
                                            <div key={share.id} className="flex gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                            {share.user?.name?.charAt(0).toUpperCase() || 'U'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                            {share.user?.name || `User ID: ${share.user_id}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {share.user?.email || 'Email disembunyikan'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveShare(share.id)}
                                                    disabled={removingShareId === share.id}
                                                    className="text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40"
                                                >
                                                    {removingShareId === share.id ? (
                                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                    )}
                                                    Hapus Akses
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Share2 className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">Belum ada pengguna yang di-share.</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                            Gunakan form di samping untuk mulai membagikan akses alat ini.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Invite Section */}
                    <div className="space-y-6">
                        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-lg">Invite Pengguna</CardTitle>
                                <CardDescription>Masukkan 9 digit Unique ID pengguna lain untuk memberi akses.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!pendingShareId ? (
                                    <form onSubmit={handleInviteUser} className="space-y-4">
                                        <div>
                                            <Label htmlFor="unique_id" className="text-gray-700 dark:text-gray-300">
                                                Unique ID Pengguna
                                            </Label>
                                            <div className="mt-1">
                                                <Input
                                                    id="unique_id"
                                                    type="text"
                                                    placeholder="Contoh: 123456789"
                                                    value={inviteUserId}
                                                    onChange={(e) => setInviteUserId(e.target.value)}
                                                    maxLength={9}
                                                    className="bg-gray-50 dark:bg-gray-950 font-mono tracking-widest text-lg py-6"
                                                />
                                            </div>
                                        </div>

                                        {inviteRes && (
                                            <div className={`text-sm px-4 py-3 rounded-lg border font-medium flex items-start gap-2 ${inviteRes.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'}`}>
                                                {inviteRes.success ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
                                                <span>{inviteRes.message}</span>
                                            </div>
                                        )}

                                        <Button
                                            type="submit"
                                            disabled={inviteLoading || inviteUserId.length !== 9}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                                        >
                                            {inviteLoading ? (
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Share2 className="h-4 w-4 mr-2" />
                                            )}
                                            Kirim Invite
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                                        <div>
                                            <Label htmlFor="otp_code" className="text-gray-700 dark:text-gray-300">
                                                Kode OTP (6 Digit)
                                            </Label>
                                            <div className="mt-1">
                                                <Input
                                                    id="otp_code"
                                                    type="text"
                                                    placeholder="Contoh: 123456"
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value)}
                                                    maxLength={6}
                                                    className="bg-gray-50 dark:bg-gray-950 font-mono tracking-widest text-lg py-6"
                                                />
                                            </div>
                                        </div>

                                        {inviteRes && (
                                            <div className={`text-sm px-4 py-3 rounded-lg border font-medium flex items-start gap-2 ${inviteRes.success ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30'}`}>
                                                {inviteRes.success ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
                                                <span>{inviteRes.message}</span>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setPendingShareId(null);
                                                    setInviteRes(null);
                                                }}
                                                className="w-full"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={otpLoading || otpCode.length !== 6}
                                                className="w-full bg-green-600 hover:bg-green-500 text-white shadow-sm"
                                            >
                                                {otpLoading ? (
                                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                ) : (
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                )}
                                                Verifikasi OTP
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </MonitoringLayout>
    );
}
