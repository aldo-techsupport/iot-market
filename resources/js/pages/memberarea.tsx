import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Feature {
    label: string;
    included: boolean;
}

interface PricingPackage {
    id: number;
    name: string;
    slug: string;
    price: number;
    price_label: string;
    color: string;
    border_color: string;
    button_color: string;
    is_popular: boolean;
    sort_order: number;
    features: Feature[];
    button_text: string;
    is_active: boolean;
}

interface MemberAreaSettings {
    hero_badge_text?: string;
    hero_title?: string;
    hero_subtitle?: string;
    hero_cta_text?: string;
    features_title?: string;
    features_subtitle?: string;
    feature_1_title?: string;
    feature_1_desc?: string;
    feature_2_title?: string;
    feature_2_desc?: string;
    feature_3_title?: string;
    feature_3_desc?: string;
    pricing_title?: string;
    pricing_subtitle?: string;
    cta_title?: string;
    cta_subtitle?: string;
    cta_button_text?: string;
    footer_text?: string;
    show_features?: boolean;
    show_cta?: boolean;
}

interface Props {
    user: {
        name: string;
        email: string;
    };
    packages: PricingPackage[];
    settings?: MemberAreaSettings;
}

export default function MemberArea({ user, packages = [], settings = {} }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const scrollToPaket = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setSidebarOpen(false);
        const target = document.getElementById('paket');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const buttonGradient: Record<string, string> = {
        green: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
        blue: 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
        purple: 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
        orange: 'from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800',
    };

    const nameColor: Record<string, string> = {
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        orange: 'text-orange-600',
    };

    const activePackages = packages.filter(p => p.is_active);
    const gridCols = activePackages.length <= 2
        ? 'md:grid-cols-2 max-w-3xl mx-auto'
        : activePackages.length === 3
            ? 'md:grid-cols-3'
            : 'md:grid-cols-2 lg:grid-cols-4';

    return (
        <>
            <Head title="IoT Monitoring Service" />

            {/* Full Page Landing Style */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

                {/* Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">IoT</span>
                                </div>
                                <span className="font-bold text-sm">Menu</span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="space-y-2">
                            <a
                                href="#paket"
                                onClick={scrollToPaket}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <span className="text-xl">📦</span>
                                <span className="font-medium">Paket</span>
                            </a>
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition"
                            >
                                <span className="text-xl">🔧</span>
                                <span className="font-medium">Kelola Perangkat</span>
                            </Link>
                        </nav>

                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Logged in as</p>
                                <p className="font-semibold text-sm truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Header */}
                <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Burger Menu Button */}
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                    aria-label="Open menu"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">IoT</span>
                                    </div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Monitoring Platform
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                                    Hi, {user.name}
                                </span>
                                <Link href="/logout" method="post" as="button">
                                    <Button variant="outline" size="sm">Logout</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-6">
                    <div className="container mx-auto max-w-6xl text-center">
                        <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">
                                {settings?.hero_badge_text || '🚀 Mulai Monitoring IoT Anda Sekarang'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {settings?.hero_title ? (
                                settings.hero_title
                            ) : (
                                <>
                                    Monitor Perangkat IoT Anda
                                    <br />
                                    Secara Real-Time
                                </>
                            )}
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                            {settings?.hero_subtitle || 'Platform monitoring IoT terlengkap dengan 36+ sensor, real-time data, dan dashboard interaktif. Pantau suhu, kelembaban, listrik, mesin, dan banyak lagi dari mana saja!'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#paket" onClick={scrollToPaket}>
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    {settings?.hero_cta_text || 'Lihat Paket'}
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                {settings?.show_features !== false && (
                    <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/50">
                        <div className="container mx-auto max-w-6xl">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold mb-4">{settings?.features_title || 'Kenapa Pilih Kami?'}</h2>
                                <p className="text-xl text-gray-600 dark:text-gray-400">
                                    {settings?.features_subtitle || 'Fitur lengkap untuk monitoring IoT profesional'}
                                </p>
                            </div>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                                        <span className="text-3xl">⚡</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{settings?.feature_1_title || 'Real-Time Monitoring'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {settings?.feature_1_desc || 'Data sensor diupdate setiap detik. Pantau perubahan secara langsung dengan grafik interaktif.'}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                                        <span className="text-3xl">📊</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{settings?.feature_2_title || '36+ Sensor Support'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {settings?.feature_2_desc || 'Dari suhu, kelembaban, listrik, hingga deteksi api. Pilih sensor sesuai kebutuhan Anda.'}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                                        <span className="text-3xl">🔒</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">{settings?.feature_3_title || 'Aman & Terpercaya'}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {settings?.feature_3_desc || 'Data terenkripsi, API Key unik per device, dan backup otomatis untuk keamanan maksimal.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Pricing Cards - DYNAMIC from admin */}
                <section id="paket" className="py-20 px-6 bg-white/50 dark:bg-gray-800/50 scroll-mt-24">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">{settings?.pricing_title || 'Paket Monitoring'}</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                {settings?.pricing_subtitle || 'Pilih paket yang sesuai dengan kebutuhan monitoring Anda'}
                            </p>
                        </div>

                        <div className={`grid gap-6 ${gridCols}`}>
                            {activePackages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition p-8 border-2 relative ${pkg.is_popular ? 'transform lg:scale-105 shadow-xl' : ''
                                        } ${pkg.border_color || 'border-gray-300'}`}
                                >
                                    {pkg.is_popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <h3 className={`text-2xl font-bold mb-2 ${nameColor[pkg.color] || 'text-blue-600'}`}>
                                            {pkg.name}
                                        </h3>
                                        <div className="text-4xl font-bold mb-2">
                                            {pkg.price_label || (pkg.price === 0 ? 'Gratis' : `Rp${(pkg.price / 1000).toFixed(0)}K`)}
                                        </div>
                                        {pkg.price > 0 && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">per bulan</p>
                                        )}
                                        {pkg.price === 0 && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Coba gratis selamanya</p>
                                        )}
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        {pkg.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <span className={feature.included ? 'text-green-600' : 'text-red-500'}>
                                                    {feature.included ? '✓' : '✕'}
                                                </span>
                                                <span className={`text-sm ${!feature.included ? 'text-gray-400' : ''}`}>
                                                    {feature.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href={`/memberarea/checkout?package_id=${pkg.id}`}>
                                        <Button
                                            className={`w-full text-white bg-gradient-to-r ${buttonGradient[pkg.color] || buttonGradient.blue}`}
                                        >
                                            {pkg.button_text || 'Checkout'}
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                💡 Semua paket mendukung 36+ jenis sensor dan real-time monitoring
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {settings?.show_cta !== false && (
                    <section className="py-20 px-6">
                        <div className="container mx-auto max-w-4xl">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
                                <h2 className="text-4xl font-bold mb-4">
                                    {settings?.cta_title || 'Siap Mulai Monitoring?'}
                                </h2>
                                <p className="text-xl mb-8 opacity-90">
                                    {settings?.cta_subtitle || 'Setup device Anda dan pilih sensor yang ingin dimonitor'}
                                </p>
                                <a href="#paket" onClick={scrollToPaket}>
                                    <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                                        {settings?.cta_button_text || 'Lihat Paket'}
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="py-12 px-6 bg-gray-900 text-white">
                    <div className="container mx-auto max-w-6xl text-center">
                        <p className="text-gray-400">
                            {settings?.footer_text || `© ${new Date().getFullYear()} IoT Monitoring Platform. All rights reserved.`}
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}
