import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface MemberAreaSettings {
    id?: number;
    hero_title?: string;
    hero_subtitle?: string;
    hero_badge_text?: string;
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
    settings: MemberAreaSettings;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Member Area Editor', href: '/admin/member-area/editor' },
];

// --- Live Preview ---
function PreviewMemberArea({ s }: { s: MemberAreaSettings }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Fake Header */}
            <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">IoT</span>
                    </div>
                    <span className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Monitoring Platform
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Hi, John Doe</span>
                    <button className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
                        Logout
                    </button>
                </div>
            </header>

            {/* Hero - ID untuk scroll target */}
            <section id="preview-section-hero" className="pt-20 pb-14 px-6 text-center scroll-mt-4">
                <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">
                        {s.hero_badge_text || '🚀 Mulai Monitoring IoT Anda Sekarang'}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent max-w-3xl mx-auto leading-tight">
                    {s.hero_title || 'Monitor Perangkat IoT Anda Secara Real-Time'}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-7 max-w-2xl mx-auto">
                    {s.hero_subtitle || 'Platform monitoring IoT terlengkap dengan 36+ sensor, real-time data, dan dashboard interaktif.'}
                </p>
                <button className="px-7 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition">
                    {s.hero_cta_text || 'Lihat Paket'}
                </button>
            </section>

            {/* Features */}
            {s.show_features !== false && (
                <section id="preview-section-features" className="py-14 px-6 bg-white/50 dark:bg-gray-800/50 scroll-mt-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-3">
                                {s.features_title || 'Kenapa Pilih Kami?'}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {s.features_subtitle || 'Fitur lengkap untuk monitoring IoT profesional'}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: '⚡',
                                    gradient: 'from-blue-500 to-blue-600',
                                    title: s.feature_1_title || 'Real-Time Monitoring',
                                    desc: s.feature_1_desc || 'Data sensor diupdate setiap detik.',
                                },
                                {
                                    icon: '📊',
                                    gradient: 'from-purple-500 to-purple-600',
                                    title: s.feature_2_title || '36+ Sensor Support',
                                    desc: s.feature_2_desc || 'Dari suhu, kelembaban, hingga deteksi api.',
                                },
                                {
                                    icon: '🔒',
                                    gradient: 'from-pink-500 to-pink-600',
                                    title: s.feature_3_title || 'Aman & Terpercaya',
                                    desc: s.feature_3_desc || 'Data terenkripsi dan backup otomatis.',
                                },
                            ].map((feat, i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 p-7 rounded-2xl shadow-md hover:shadow-lg transition">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feat.gradient} rounded-xl flex items-center justify-center mb-5`}>
                                        <span className="text-2xl">{feat.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{feat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing */}
            <section id="preview-section-pricing" className="py-14 px-6 scroll-mt-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-3">
                        {s.pricing_title || 'Paket Monitoring'}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                        {s.pricing_subtitle || 'Pilih paket yang sesuai dengan kebutuhan monitoring Anda'}
                    </p>
                    <div className="grid md:grid-cols-3 gap-5">
                        {['Starter', 'Professional', 'Enterprise'].map((pkg, i) => (
                            <div
                                key={i}
                                className={`bg-white dark:bg-gray-900 rounded-2xl shadow-md p-7 border-2 ${i === 1 ? 'border-purple-400 scale-105' : 'border-gray-200'
                                    }`}
                            >
                                {i === 1 && (
                                    <span className="block mb-3 text-xs font-bold text-purple-600 bg-purple-100 rounded-full px-3 py-1 w-fit mx-auto">
                                        Popular
                                    </span>
                                )}
                                <h3 className={`text-xl font-bold mb-2 ${i === 0 ? 'text-green-600' : i === 1 ? 'text-purple-600' : 'text-blue-600'}`}>
                                    {pkg}
                                </h3>
                                <div className="text-3xl font-bold mb-1">Rp {(i + 1) * 99}K</div>
                                <p className="text-xs text-gray-500 mb-5">per bulan</p>
                                <button className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-700 text-sm font-semibold">
                                    Pilih Paket
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-sm text-gray-500">💡 Semua paket mendukung 36+ jenis sensor</p>
                </div>
            </section>

            {/* CTA */}
            {s.show_cta !== false && (
                <section id="preview-section-cta" className="py-14 px-6 scroll-mt-4">
                    <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-center text-white">
                        <h2 className="text-3xl font-bold mb-3">
                            {s.cta_title || 'Siap Mulai Monitoring?'}
                        </h2>
                        <p className="text-lg mb-7 opacity-90">
                            {s.cta_subtitle || 'Setup device Anda dan pilih sensor yang ingin dimonitor'}
                        </p>
                        <button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition text-sm">
                            {s.cta_button_text || 'Lihat Paket'}
                        </button>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer id="preview-section-footer" className="py-10 px-6 bg-gray-900 text-white text-center text-sm scroll-mt-4">
                <p className="text-gray-400">
                    {s.footer_text || `© ${new Date().getFullYear()} IoT Monitoring Platform. All rights reserved.`}
                </p>
            </footer>
        </div>
    );
}

// --- Edit Tabs ---
type TabKey = 'hero' | 'features' | 'pricing' | 'cta' | 'footer';
const TABS: { key: TabKey; label: string }[] = [
    { key: 'hero', label: '🏠 Hero' },
    { key: 'features', label: '⚡ Fitur' },
    { key: 'pricing', label: '💰 Pricing' },
    { key: 'cta', label: '📢 CTA' },
    { key: 'footer', label: '📄 Footer' },
];

export default function MemberAreaEditor({ settings }: Props) {
    const [data, setData] = useState<MemberAreaSettings>(settings);
    const [activeTab, setActiveTab] = useState<TabKey>('hero');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Ref untuk container scroll preview
    const previewScrollRef = useRef<HTMLDivElement>(null);

    const update = useCallback(<K extends keyof MemberAreaSettings>(key: K, val: MemberAreaSettings[K]) => {
        setData((prev) => ({ ...prev, [key]: val }));
    }, []);

    // Scroll preview ke section yang sesuai
    const scrollToSection = useCallback((tabKey: TabKey) => {
        setActiveTab(tabKey);

        // Gunakan timeout kecil agar jika terjadi re-render, scroll terjadi setelah elemen ada
        setTimeout(() => {
            const target = document.getElementById(`preview-section-${tabKey}`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 50);
    }, []);

    const handleSave = () => {
        setSaving(true);
        router.post('/admin/member-area/save-settings', data as Record<string, any>, {
            preserveScroll: true,
            onSuccess: () => {
                setSaving(false);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            },
            onError: () => setSaving(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visual Editor - Member Area" />

            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-950 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">MA</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold">Visual Editor — Member Area</h1>
                        <p className="text-xs text-gray-500">Edit konten halaman member secara real-time</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-3 py-1.5 text-xs rounded-md transition font-medium ${previewMode === 'desktop'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            🖥️ Desktop
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-3 py-1.5 text-xs rounded-md transition font-medium ${previewMode === 'mobile'
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            📱 Mobile
                        </button>
                    </div>
                    <a
                        href="/memberarea"
                        target="_blank"
                        className="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium flex items-center gap-1.5"
                    >
                        🔗 Lihat Live
                    </a>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                    >
                        {saving ? '⏳ Menyimpan...' : saved ? '✅ Tersimpan!' : '💾 Simpan Semua'}
                    </Button>
                </div>
            </div>

            <div className="flex h-[calc(100vh-120px)]">
                {/* Left: Preview */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
                    {/* Preview tab bar - klik untuk scroll ke section */}
                    <div className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                        <span className="text-xs text-gray-500 mr-2 font-medium">
                            Lompat ke Section:
                        </span>
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => scrollToSection(tab.key)}
                                className={`text-xs px-3 py-1 rounded-full transition font-medium ${activeTab === tab.key
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Preview scroll container — ref untuk scroll */}
                    <div ref={previewScrollRef} className="flex-1 overflow-auto p-6 flex justify-center">
                        <div
                            className={`transition-all duration-300 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden ${previewMode === 'mobile'
                                ? 'w-[390px] ring-4 ring-gray-800 rounded-[2rem]'
                                : 'w-full max-w-5xl'
                                }`}
                        >
                            {/* Fake browser bar */}
                            <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="flex-1 bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-gray-500 font-mono">
                                    yoursite.com/memberarea
                                </div>
                            </div>
                            <PreviewMemberArea s={data} />
                        </div>
                    </div>
                </div>

                {/* Right: Edit Panel */}
                <div className="w-[380px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col">
                    {/* Tab navigation — klik tab otomatis scroll preview */}
                    <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-800">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => scrollToSection(tab.key)}
                                className={`flex-1 min-w-[60px] py-3 px-1 text-xs font-semibold transition ${activeTab === tab.key
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50 dark:bg-purple-900/10'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Edit fields */}
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <>
                                <div className="space-y-1.5">
                                    <Label>Badge Teks</Label>
                                    <Input
                                        value={data.hero_badge_text || ''}
                                        onChange={(e) => update('hero_badge_text', e.target.value)}
                                        placeholder="🚀 Mulai Monitoring IoT Anda Sekarang"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Judul Utama</Label>
                                    <Textarea
                                        value={data.hero_title || ''}
                                        onChange={(e) => update('hero_title', e.target.value)}
                                        rows={3}
                                        placeholder="Monitor Perangkat IoT Anda Secara Real-Time"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sub Judul</Label>
                                    <Textarea
                                        value={data.hero_subtitle || ''}
                                        onChange={(e) => update('hero_subtitle', e.target.value)}
                                        rows={3}
                                        placeholder="Platform monitoring IoT terlengkap..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Teks Tombol CTA</Label>
                                    <Input
                                        value={data.hero_cta_text || ''}
                                        onChange={(e) => update('hero_cta_text', e.target.value)}
                                        placeholder="Lihat Paket"
                                    />
                                </div>
                            </>
                        )}

                        {/* FEATURES TAB */}
                        {activeTab === 'features' && (
                            <>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium">Tampilkan Section Fitur</p>
                                        <p className="text-xs text-gray-500">Aktifkan/matikan section kenapa pilih kami</p>
                                    </div>
                                    <Switch
                                        checked={data.show_features !== false}
                                        onCheckedChange={(val) => update('show_features', val)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Judul Section</Label>
                                    <Input
                                        value={data.features_title || ''}
                                        onChange={(e) => update('features_title', e.target.value)}
                                        placeholder="Kenapa Pilih Kami?"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sub Judul Section</Label>
                                    <Input
                                        value={data.features_subtitle || ''}
                                        onChange={(e) => update('features_subtitle', e.target.value)}
                                        placeholder="Fitur lengkap untuk monitoring IoT profesional"
                                    />
                                </div>
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2 bg-gray-50 dark:bg-gray-800/50">
                                        <p className="text-xs font-semibold text-gray-500 uppercase">Fitur #{n}</p>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Judul Fitur</Label>
                                            <Input
                                                value={(data as any)[`feature_${n}_title`] || ''}
                                                onChange={(e) => update(`feature_${n}_title` as keyof MemberAreaSettings, e.target.value)}
                                                placeholder={`Fitur ${n}`}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-xs">Deskripsi</Label>
                                            <Textarea
                                                value={(data as any)[`feature_${n}_desc`] || ''}
                                                onChange={(e) => update(`feature_${n}_desc` as keyof MemberAreaSettings, e.target.value)}
                                                rows={2}
                                                placeholder="Deskripsi fitur..."
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* PRICING TAB */}
                        {activeTab === 'pricing' && (
                            <>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                        💡 Kartu paket pricing diambil otomatis dari <strong>Admin → Pricing</strong>.
                                        Di sini Anda hanya bisa mengubah judul section pricing.
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Judul Section Pricing</Label>
                                    <Input
                                        value={data.pricing_title || ''}
                                        onChange={(e) => update('pricing_title', e.target.value)}
                                        placeholder="Paket Monitoring"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sub Judul Section Pricing</Label>
                                    <Textarea
                                        value={data.pricing_subtitle || ''}
                                        onChange={(e) => update('pricing_subtitle', e.target.value)}
                                        rows={2}
                                        placeholder="Pilih paket yang sesuai dengan kebutuhan monitoring Anda"
                                    />
                                </div>
                            </>
                        )}

                        {/* CTA TAB */}
                        {activeTab === 'cta' && (
                            <>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium">Tampilkan Section CTA</p>
                                        <p className="text-xs text-gray-500">Tampilkan banner ajakan aksi di bagian bawah</p>
                                    </div>
                                    <Switch
                                        checked={data.show_cta !== false}
                                        onCheckedChange={(val) => update('show_cta', val)}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Judul CTA</Label>
                                    <Input
                                        value={data.cta_title || ''}
                                        onChange={(e) => update('cta_title', e.target.value)}
                                        placeholder="Siap Mulai Monitoring?"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Sub Judul CTA</Label>
                                    <Textarea
                                        value={data.cta_subtitle || ''}
                                        onChange={(e) => update('cta_subtitle', e.target.value)}
                                        rows={2}
                                        placeholder="Setup device Anda dan pilih sensor..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Teks Tombol CTA</Label>
                                    <Input
                                        value={data.cta_button_text || ''}
                                        onChange={(e) => update('cta_button_text', e.target.value)}
                                        placeholder="Lihat Paket"
                                    />
                                </div>
                            </>
                        )}

                        {/* FOOTER TAB */}
                        {activeTab === 'footer' && (
                            <>
                                <div className="space-y-1.5">
                                    <Label>Teks Footer</Label>
                                    <Input
                                        value={data.footer_text || ''}
                                        onChange={(e) => update('footer_text', e.target.value)}
                                        placeholder={`© ${new Date().getFullYear()} IoT Monitoring Platform. All rights reserved.`}
                                    />
                                </div>
                            </>
                        )}

                        {/* Save */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                            <Button
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? '⏳ Menyimpan...' : saved ? '✅ Berhasil Disimpan!' : '💾 Simpan Semua Perubahan'}
                            </Button>
                            <p className="mt-2 text-xs text-center text-gray-400">
                                Preview di sebelah kiri terupdate secara real-time
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
