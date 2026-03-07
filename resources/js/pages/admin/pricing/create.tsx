import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';

interface Feature {
    label: string;
    included: boolean;
}

type FormData = {
    name: string;
    slug: string;
    price: number;
    price_label: string;
    color: string;
    border_color: string;
    button_color: string;
    is_popular: boolean;
    sort_order: number;
    max_devices: number;
    max_sensors: number;
    features: Feature[];
    button_text: string;
    is_active: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Paket Pricing', href: '/admin/pricing' },
    { title: 'Tambah Paket', href: '/admin/pricing/create' },
];

const colorOptions = [
    { value: 'green', label: 'Hijau', preview: 'bg-green-500' },
    { value: 'blue', label: 'Biru', preview: 'bg-blue-500' },
    { value: 'purple', label: 'Ungu', preview: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', preview: 'bg-orange-500' },
];

const borderColorMap: Record<string, string> = {
    green: 'border-green-500',
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
};

const colorMap: Record<string, string> = {
    green: 'from-emerald-500 to-green-600',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-pink-600',
    orange: 'from-orange-500 to-red-500',
};

export default function AdminPricingCreate() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: '',
        slug: '',
        price: 0,
        price_label: '',
        color: 'blue',
        border_color: 'border-blue-500',
        button_color: 'blue',
        is_popular: false,
        sort_order: 99,
        max_devices: 1,
        max_sensors: 5,
        features: [
            { label: '1 Device', included: true },
            { label: '5 Sensor/device', included: true },
            { label: 'Notifikasi WA/Telegram', included: false },
        ],
        button_text: 'Checkout',
        is_active: true,
    });

    const [newFeatureLabel, setNewFeatureLabel] = useState('');

    const handleColorChange = (color: string) => {
        setData(d => ({
            ...d,
            color,
            border_color: borderColorMap[color] || 'border-blue-500',
            button_color: color,
        }));
    };

    const handleNameChange = (name: string) => {
        setData(d => ({
            ...d,
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        }));
    };

    const addFeature = () => {
        if (!newFeatureLabel.trim()) return;
        setData('features', [...data.features, { label: newFeatureLabel.trim(), included: true }]);
        setNewFeatureLabel('');
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

    const toggleFeatureIncluded = (index: number) => {
        const updated = [...data.features];
        updated[index] = { ...updated[index], included: !updated[index].included };
        setData('features', updated);
    };

    const updateFeatureLabel = (index: number, label: string) => {
        const updated = [...data.features];
        updated[index] = { ...updated[index], label };
        setData('features', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/pricing', {
            onSuccess: () => router.visit('/admin/pricing'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Paket Pricing" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold">Tambah Paket Baru</h1>
                    <p className="text-muted-foreground mt-1">
                        Paket baru akan tampil di halaman Member Area setelah disimpan
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basics */}
                        <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 space-y-4">
                            <h2 className="text-lg font-semibold">📋 Informasi Dasar</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nama Paket *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => handleNameChange(e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="contoh: Enterprise"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Slug (otomatis)</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={e => setData('slug', e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="enterprise"
                                    />
                                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Harga (Rp) *</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', Number(e.target.value))}
                                        min="0"
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0 = Gratis"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Label Harga (opsional)</label>
                                    <input
                                        type="text"
                                        value={data.price_label}
                                        onChange={e => setData('price_label', e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Rp500K"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Teks Tombol *</label>
                                    <input
                                        type="text"
                                        value={data.button_text}
                                        onChange={e => setData('button_text', e.target.value)}
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Checkout"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Devices</label>
                                    <input
                                        type="number"
                                        value={data.max_devices}
                                        onChange={e => setData('max_devices', Number(e.target.value))}
                                        min="1"
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.max_devices && <p className="text-red-500 text-xs mt-1">{errors.max_devices}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Sensors</label>
                                    <input
                                        type="number"
                                        value={data.max_sensors}
                                        onChange={e => setData('max_sensors', Number(e.target.value))}
                                        min="1"
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.max_sensors && <p className="text-red-500 text-xs mt-1">{errors.max_sensors}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={e => setData('sort_order', Number(e.target.value))}
                                        className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Color */}
                        <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 space-y-4">
                            <h2 className="text-lg font-semibold">🎨 Tema Warna</h2>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {colorOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleColorChange(opt.value)}
                                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${data.color === opt.value
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full ${opt.preview}`} />
                                        <span className="text-xs font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features */}
                        <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 space-y-4">
                            <h2 className="text-lg font-semibold">✅ Fitur Paket</h2>
                            <div className="space-y-2">
                                {data.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 group">
                                        <button
                                            type="button"
                                            onClick={() => toggleFeatureIncluded(index)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition flex-shrink-0 ${feature.included ? 'bg-green-500' : 'bg-red-400'
                                                }`}
                                        >
                                            {feature.included ? '✓' : '✕'}
                                        </button>
                                        <input
                                            type="text"
                                            value={feature.label}
                                            onChange={e => updateFeatureLabel(index, e.target.value)}
                                            className="flex-1 rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(index)}
                                            className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newFeatureLabel}
                                    onChange={e => setNewFeatureLabel(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                    className="flex-1 rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="+ Tambah fitur..."
                                />
                                <button
                                    type="button"
                                    onClick={addFeature}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                >
                                    Tambah
                                </button>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-6 space-y-4">
                            <h2 className="text-lg font-semibold">⚙️ Pengaturan</h2>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_popular}
                                        onChange={e => setData('is_popular', e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Tandai sebagai Popular ⭐</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Aktifkan paket ini</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 p-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Preview</h2>
                                <div className={`rounded-2xl border-2 overflow-hidden ${data.border_color} relative`}>
                                    <div className={`h-1.5 w-full bg-gradient-to-r ${colorMap[data.color]}`} />
                                    {data.is_popular && (
                                        <div className="absolute top-3 right-3">
                                            <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-0.5 text-xs font-semibold text-white">
                                                ⭐ Popular
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-5">
                                        <p className="text-sm font-bold mb-1">{data.name || 'Nama Paket'}</p>
                                        <div className="text-2xl font-bold">
                                            {data.price_label || (data.price === 0 ? 'Gratis' : `Rp${(data.price / 1000).toFixed(0)}K`)}
                                        </div>
                                        {data.price > 0 && <p className="text-xs text-gray-500">per bulan</p>}
                                        <div className="space-y-1.5 my-3">
                                            {data.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                                    <span className={f.included ? 'text-green-500' : 'text-red-400'}>{f.included ? '✓' : '✕'}</span>
                                                    <span className={f.included ? '' : 'text-gray-400'}>{f.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" className={`w-full rounded-lg py-2 text-sm font-medium text-white bg-gradient-to-r ${colorMap[data.color]}`}>
                                            {data.button_text || 'Checkout'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 font-semibold text-white hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 transition shadow-lg"
                                >
                                    {processing ? '⏳ Menyimpan...' : '✅ Tambah Paket'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.visit('/admin/pricing')}
                                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
