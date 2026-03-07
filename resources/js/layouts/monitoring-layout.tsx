import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState, useEffect } from 'react';
import { Activity, Home, Package, ShoppingCart, BarChart2, Settings, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { Head } from '@inertiajs/react';

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

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-full w-16 flex-col items-center bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-[#00FF00]/20 shadow-sm dark:shadow-xl lg:w-56 flex transition-colors duration-200">
                {/* Logo */}
                <div className="flex h-16 w-full items-center justify-between border-b border-gray-100 dark:border-[#00FF00]/20 px-2 lg:px-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#00FF00] shadow-sm dark:shadow-lg dark:shadow-[#00FF00]/20">
                            <Activity className="h-4 w-4 text-black" strokeWidth={3} />
                        </div>
                        <span className="hidden text-sm font-extrabold text-slate-800 dark:text-white tracking-wide lg:block transition-colors">IoT Monitor</span>
                    </div>
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
                <div className="sticky top-0 z-30 flex items-center justify-end px-6 py-3 bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-transparent">
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
