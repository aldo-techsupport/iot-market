import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
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

interface Props {
    packages: PricingPackage[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Paket Pricing', href: '/admin/pricing' },
];

const colorMap: Record<string, string> = {
    green: 'from-emerald-500 to-green-600',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-500',
};

const badgeColor: Record<string, string> = {
    green: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
};

export default function AdminPricingIndex({ packages }: Props) {
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Hapus paket "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeleting(id);
        router.delete(`/admin/pricing/${id}`, {
            onFinish: () => setDeleting(null),
        });
    };

    const toggleActive = (id: number, current: boolean) => {
        router.patch(`/admin/pricing/${id}/toggle`, { is_active: !current });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Paket Pricing" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Paket Pricing</h1>
                        <p className="text-muted-foreground mt-1">
                            Kelola paket yang tampil di halaman Member Area & Landing Page
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <a href="/memberarea" target="_blank">
                            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                                <span>👁️</span> Preview
                            </button>
                        </a>
                        <Link href="/admin/pricing/create">
                            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-700 hover:to-purple-700 transition shadow-md">
                                <span>+</span> Tambah Paket
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-sm text-gray-500">Total Paket</p>
                        <p className="text-2xl font-bold">{packages.length}</p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-sm text-gray-500">Aktif</p>
                        <p className="text-2xl font-bold text-green-600">
                            {packages.filter(p => p.is_active).length}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-sm text-gray-500">Popular</p>
                        <p className="text-2xl font-bold text-purple-600">
                            {packages.filter(p => p.is_popular).length}
                        </p>
                    </div>
                    <div className="rounded-xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
                        <p className="text-sm text-gray-500">Non-Aktif</p>
                        <p className="text-2xl font-bold text-red-500">
                            {packages.filter(p => !p.is_active).length}
                        </p>
                    </div>
                </div>

                {/* Package Cards */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative rounded-2xl border-2 bg-white dark:bg-gray-900 overflow-hidden transition-all hover:shadow-xl ${pkg.is_active
                                    ? pkg.border_color || 'border-gray-300'
                                    : 'border-dashed border-gray-300 opacity-60'
                                }`}
                        >
                            {/* Top gradient bar */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${colorMap[pkg.color] || colorMap.blue}`} />

                            {/* Popular badge */}
                            {pkg.is_popular && (
                                <div className="absolute top-3 right-3">
                                    <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-semibold text-white shadow">
                                        ⭐ Popular
                                    </span>
                                </div>
                            )}

                            {/* Inactive badge */}
                            {!pkg.is_active && (
                                <div className="absolute top-3 left-3">
                                    <span className="rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-semibold text-gray-500">
                                        Non-aktif
                                    </span>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Header */}
                                <div className="mb-4">
                                    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold mb-2 ${badgeColor[pkg.color] || badgeColor.blue}`}>
                                        {pkg.name}
                                    </span>
                                    <div className="text-3xl font-bold">
                                        {pkg.price_label || (pkg.price === 0 ? 'Gratis' : `Rp${(pkg.price / 1000).toFixed(0)}K`)}
                                    </div>
                                    {pkg.price > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">per bulan</p>
                                    )}
                                </div>

                                {/* Features */}
                                <div className="mb-5 space-y-2">
                                    {pkg.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm">
                                            <span className={f.included ? 'text-green-500' : 'text-red-400'}>
                                                {f.included ? '✓' : '✕'}
                                            </span>
                                            <span className={f.included ? '' : 'text-gray-400'}>
                                                {f.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t dark:border-gray-700">
                                    <Link
                                        href={`/admin/pricing/${pkg.id}/edit`}
                                        className="flex-1 text-center rounded-lg bg-blue-50 dark:bg-blue-900/30 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                                    >
                                        ✏️ Edit
                                    </Link>
                                    <button
                                        onClick={() => toggleActive(pkg.id, pkg.is_active)}
                                        className={`rounded-lg px-3 py-2 text-sm font-medium transition ${pkg.is_active
                                                ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100'
                                                : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100'
                                            }`}
                                    >
                                        {pkg.is_active ? '⏸' : '▶'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg.id, pkg.name)}
                                        disabled={deleting === pkg.id}
                                        className="rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 transition disabled:opacity-50"
                                    >
                                        {deleting === pkg.id ? '...' : '🗑'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {packages.length === 0 && (
                    <div className="rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">Belum ada paket</h3>
                        <p className="text-gray-500 mb-6">Tambahkan paket pricing pertama untuk ditampilkan di Member Area.</p>
                        <Link href="/admin/pricing/create">
                            <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition">
                                + Tambah Paket Pertama
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
