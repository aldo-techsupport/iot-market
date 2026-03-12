import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import { Activity, Home, Package, ShoppingCart, BarChart2, Settings, LogOut, LayoutDashboard, Sun, Moon, Bell, X, CheckCircle2 } from 'lucide-react';
import { Head, router } from '@inertiajs/react';

interface Props {
    children: ReactNode;
    title?: string;
}

interface PageProps {
    auth: {
        user: {
            name: string;
            email: string;
            role: string;
            unique_id?: string;
            unreadNotifications?: any[];
            notifications?: any[];
        };
    };
}

const navItems = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Monitoring', href: '/dashboard/monitoring', icon: Activity },
    { title: 'Member Area', href: '/memberarea', icon: Package },
    { title: 'Orders', href: '/memberarea/orders', icon: ShoppingCart },
];

export default function MonitoringLayout({ children, title }: Props) {
    const { auth } = usePage().props as unknown as PageProps;
    const isAdmin = auth?.user?.role === 'admin';

    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [acceptTokens, setAcceptTokens] = useState<Record<string, string>>({});
    const [accepting, setAccepting] = useState<string | null>(null);
    const [expandedNotifs, setExpandedNotifs] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleDark = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const clearAllNotifications = async () => {
        try {
            await fetch(`/notifications/clear-all`, {
                method: 'DELETE',
                headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '', 'Content-Type': 'application/json' },
            });
            setShowNotifications(false);
            router.reload({ only: ['auth'] });
        } catch (e) {}
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/mark-read`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '', 'Content-Type': 'application/json' },
            });
            router.reload({ only: ['auth'] });
        } catch (e) {}
    };

    const handleAccept = async (shareId: string, notifId: string) => {
        setAccepting(notifId);
        try {
            const res = await fetch(`/devices/share/accept`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': getCookie('XSRF-TOKEN') || '', 'Content-Type': 'application/json' },
                body: JSON.stringify({ share_id: shareId, token: acceptTokens[notifId] || '' }),
            });
            const data = await res.json();
            if (data.success) {
                alert('Berhasil menerima undangan!');
                router.visit('/dashboard/monitoring'); // force reload
            } else {
                alert(data.message || 'Gagal, cek kode kembali');
            }
        } catch {
            alert('Kesalahan jaringan');
        } finally {
            setAccepting(null);
        }
    };

    // Helper for CSRF
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-full w-16 flex-col items-center bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-[#00FF00]/20 shadow-sm dark:shadow-xl lg:w-56 flex transition-colors duration-200">
                {/* Logo */}
                <div className="flex w-full flex-col border-b border-gray-100 dark:border-[#00FF00]/20 pb-2">
                    <div className="flex h-16 w-full items-center justify-between px-2 lg:px-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00FF00] shadow-sm dark:shadow-lg dark:shadow-[#00FF00]/20">
                                <Activity className="h-4 w-4 text-black" strokeWidth={3} />
                            </div>
                            <span className="hidden text-sm font-extrabold text-slate-800 dark:text-white tracking-wide lg:block transition-colors">IoT Monitor</span>
                        </div>
                    </div>
                    {auth?.user?.unique_id && (
                        <div className="hidden lg:flex px-4 items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-[#00FF00] bg-slate-100 dark:bg-[#00FF00]/10 px-2 py-1 rounded">
                                ID: {auth.user.unique_id}
                            </span>
                        </div>
                    )}
                </div>

                {/* Nav items */}
                <nav className="flex flex-1 flex-col gap-1 w-full p-2 pt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = typeof window !== 'undefined'
                            ? window.location.pathname === item.href
                            : false;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-all duration-200 lg:px-3 ${isActive
                                    ? 'bg-[#00FF00] text-black shadow-md dark:shadow-[#00FF00]/50 font-bold'
                                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-[#00FF00]/10 dark:hover:text-[#00FF00]'
                                    }`}
                            >
                                <Icon className="h-4 w-4 flex-shrink-0" />
                                <span className="hidden lg:block">{item.title}</span>
                            </Link>
                        );
                    })}

                    {/* Admin link - only show if user is admin */}
                    {isAdmin && (
                        <div className="mt-4 border-t border-gray-100 dark:border-[#00FF00]/20 pt-4 transition-colors">
                            <p className="mb-2 hidden px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#00FF00]/60 lg:block">
                                Admin
                            </p>
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:text-amber-500 dark:hover:bg-[#00FF00]/10 dark:hover:text-amber-400 transition-all lg:px-3"
                            >
                                <Settings className="h-4 w-4 flex-shrink-0" />
                                <span className="hidden lg:block">Admin Panel</span>
                            </Link>
                        </div>
                    )}
                </nav>

                {/* User info + logout */}
                <div className="w-full border-t border-gray-100 dark:border-[#00FF00]/20 p-2 lg:p-3 transition-colors">
                    <div className="hidden mb-2 rounded-lg bg-slate-50 dark:bg-[#00FF00]/10 p-2 lg:block border border-slate-100 dark:border-[#00FF00]/20 transition-colors">
                        <p className="truncate text-xs font-extrabold text-slate-800 dark:text-[#00FF00]">{auth?.user?.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-300">{auth?.user?.email}</p>
                    </div>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all lg:justify-start lg:px-3"
                    >
                        <LogOut className="h-4 w-4 flex-shrink-0" />
                        <span className="hidden lg:block">Logout</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-16 lg:ml-56 min-h-screen text-slate-800 dark:text-gray-100 flex flex-col transition-colors duration-200">
                {/* Navbar Top Mobile-like with Theme Toggle */}
                <div className="sticky top-0 z-30 flex items-center justify-end px-6 py-3 bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-transparent gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-full bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700 transition"
                            title="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {auth?.user?.unreadNotifications && auth.user.unreadNotifications.length > 0 && (
                                <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white dark:border-gray-900"></span>
                            )}
                        </button>
                        
                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-[340px] max-w-sm bg-white dark:bg-gray-950 border border-slate-200 dark:border-gray-800 shadow-xl rounded-xl z-50 flex flex-col overflow-hidden">
                                <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/50">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifikasi</h3>
                                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-gray-300">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                {(!auth?.user?.notifications || auth.user.notifications.length === 0) ? (
                                    <div className="p-4 text-center">
                                        <p className="text-xs text-slate-500">Belum ada notifikasi.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto overscroll-contain">
                                            {auth.user.notifications.map((n: any) => (
                                                <div key={n.id} className={`p-3 rounded-lg border text-sm ${n.read_at ? 'bg-slate-50 dark:bg-gray-900 border-transparent text-slate-500' : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 text-slate-800 dark:text-gray-200'}`}>
                                                    <div className="flex justify-between items-start gap-2">
                                                        <p className="font-medium mb-1">{n.data.message}</p>
                                                        {(n.type === 'App\\Notifications\\DeviceInviteNotification' || n.data.type === 'device_invite') && !n.read_at && (
                                                            <button 
                                                                onClick={() => setExpandedNotifs(prev => ({...prev, [n.id]: !prev[n.id]}))}
                                                                className="text-xs bg-white/50 dark:bg-gray-900/50 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-semibold whitespace-nowrap flex-shrink-0"
                                                            >
                                                                {expandedNotifs[n.id] ? 'Sembunyikan' : 'Lihat OTP'}
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    {(n.type === 'App\\Notifications\\DeviceInviteNotification' || n.data.type === 'device_invite') && !n.read_at && expandedNotifs[n.id] && (
                                                        <div className="mt-3 pt-3 border-t border-blue-200/50 dark:border-blue-800/50 space-y-2">
                                                            <div className="bg-white dark:bg-gray-950 p-2 rounded border border-blue-200 dark:border-blue-800 text-center">
                                                                <span className="text-[10px] text-slate-500 block mb-1 uppercase font-bold tracking-wider">KODE UNTUK PENGUNDANG</span>
                                                                <span className="font-mono text-xl font-black text-blue-600 dark:text-blue-400 tracking-widest">{n.data.token}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 dark:text-gray-400 text-center">Berikan kode verifikasi ini kepada pengundang untuk mengakses perangkat</p>
                                                            <div className="flex gap-2 pt-1">
                                                                <button 
                                                                    onClick={() => markAsRead(n.id)}
                                                                    className="flex-1 px-3 py-2 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                                                                >
                                                                    Tutup / Hapus Notifikasi Ini
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {n.read_at && (
                                                        <p className="text-[10px] text-slate-400 mt-1">Sudah dibaca</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 border-t border-slate-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900/80">
                                            <button 
                                                onClick={clearAllNotifications}
                                                className="w-full py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                Kelola / Hapus Semua Notifikasi
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleDark}
                        className="p-2 rounded-full bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-300 dark:hover:bg-gray-700 transition"
                        title="Toggle Light/Dark Mode"
                    >
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
