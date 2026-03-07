import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface LandingSection {
    id: number;
    section: string;
    content: any;
    is_active: boolean;
}

interface Props {
    sections: LandingSection[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: '/admin/dashboard' },
    { title: 'Landing Page', href: '/admin/landing-page' },
    { title: 'Visual Editor', href: '/admin/landing-page/visual-editor' },
];

// --- Live Preview Components ---
function PreviewHero({ content }: { content: any }) {
    return (
        <section
            id="preview-hero"
            className="relative z-10 overflow-hidden bg-white pb-12 pt-[100px] dark:bg-gray-900 scroll-mt-4"
        >
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-[700px] text-center">
                    <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl">
                        {content?.title || 'Smart IoT Monitoring Platform'}
                    </h1>
                    <p className="mb-10 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                        {content?.subtitle ||
                            'Monitor and control your IoT devices with real-time data analytics.'}
                    </p>
                    <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                        <span className="inline-block rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white">
                            {content?.primary_button_text || '🚀 Get Started'}
                        </span>
                        <span className="inline-block rounded-md bg-black px-6 py-3 text-sm font-semibold text-white">
                            {content?.secondary_button_text || 'Learn More'}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PreviewFeatures({ content }: { content: any }) {
    const items = content?.items || [
        { icon: 'monitor', title: 'Real-time Monitoring', description: 'Monitor IoT devices in real-time.' },
        { icon: 'automation', title: 'Smart Automation', description: 'Automate with intelligent rules.' },
        { icon: 'analytics', title: 'Data Analytics', description: 'Analyze with powerful tools.' },
    ];
    const iconMap: Record<string, string> = {
        monitor: '📊', automation: '⚙️', analytics: '📈',
        security: '🔒', api: '🔌', support: '💬',
    };
    return (
        <section id="preview-features" className="py-12 bg-white dark:bg-gray-900 scroll-mt-4">
            <div className="container mx-auto px-4">
                <div className="mx-auto mb-10 max-w-[500px] text-center">
                    <h2 className="mb-3 text-2xl font-bold text-black dark:text-white">
                        {content?.title || 'Main Features'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {content?.subtitle || 'Powerful features for your IoT devices'}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {items.slice(0, 6).map((feature: any, index: number) => (
                        <div key={index} className="w-full">
                            <div className="relative z-10 mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-blue-600">
                                <span className="text-xl">{iconMap[feature.icon] || '⭐'}</span>
                            </div>
                            <h3 className="mb-2 text-base font-bold text-black dark:text-white">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function PreviewAbout({ content }: { content: any }) {
    if (!content) return null;
    return (
        <section id="preview-about" className="py-12 bg-gray-50 dark:bg-gray-800 scroll-mt-4">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
                        {content?.title || 'About Us'}
                    </h2>
                    <p className="mb-8 text-base text-gray-600 dark:text-gray-400">
                        {content?.description || 'Learn more about our platform.'}
                    </p>
                    {content?.stats && (
                        <div className="grid gap-6 md:grid-cols-3">
                            {content.stats.map((stat: any, index: number) => (
                                <div key={index} className="text-center">
                                    <div className="mb-1 text-3xl font-bold text-blue-600">{stat.value}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// --- Edit Panels ---
function EditHero({
    content,
    onChange,
}: {
    content: any;
    onChange: (key: string, val: string) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label>Judul Utama (Title)</Label>
                <Input
                    value={content?.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Smart IoT Monitoring Platform"
                />
            </div>
            <div className="space-y-1.5">
                <Label>Sub Judul (Subtitle)</Label>
                <Textarea
                    value={content?.subtitle || ''}
                    onChange={(e) => onChange('subtitle', e.target.value)}
                    rows={3}
                    placeholder="Monitor and control your IoT devices..."
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label>Teks Tombol Utama</Label>
                    <Input
                        value={content?.primary_button_text || ''}
                        onChange={(e) => onChange('primary_button_text', e.target.value)}
                        placeholder="🚀 Get Started"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>URL Tombol Utama</Label>
                    <Input
                        value={content?.primary_button_url || ''}
                        onChange={(e) => onChange('primary_button_url', e.target.value)}
                        placeholder="/register"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label>Teks Tombol Sekunder</Label>
                    <Input
                        value={content?.secondary_button_text || ''}
                        onChange={(e) => onChange('secondary_button_text', e.target.value)}
                        placeholder="Learn More"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label>URL Tombol Sekunder</Label>
                    <Input
                        value={content?.secondary_button_url || ''}
                        onChange={(e) => onChange('secondary_button_url', e.target.value)}
                        placeholder="#features"
                    />
                </div>
            </div>
        </div>
    );
}

function EditFeatures({
    content,
    onChange,
    onArrayChange,
}: {
    content: any;
    onChange: (key: string, val: string) => void;
    onArrayChange: (arrayKey: string, index: number, itemKey: string, val: string) => void;
}) {
    const iconOptions = ['monitor', 'automation', 'analytics', 'security', 'api', 'support'];
    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label>Judul Section</Label>
                <Input
                    value={content?.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="Main Features"
                />
            </div>
            <div className="space-y-1.5">
                <Label>Sub Judul Section</Label>
                <Input
                    value={content?.subtitle || ''}
                    onChange={(e) => onChange('subtitle', e.target.value)}
                    placeholder="Powerful features..."
                />
            </div>
            <div className="space-y-3">
                <Label className="text-sm font-semibold">Daftar Fitur</Label>
                {(content?.items || []).map((item: any, index: number) => (
                    <div
                        key={index}
                        className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2 bg-gray-50 dark:bg-gray-800/50"
                    >
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Fitur #{index + 1}
                        </p>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Judul Fitur</Label>
                            <Input
                                value={item.title || ''}
                                onChange={(e) => onArrayChange('items', index, 'title', e.target.value)}
                                placeholder="Feature title"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Deskripsi</Label>
                            <Textarea
                                value={item.description || ''}
                                onChange={(e) => onArrayChange('items', index, 'description', e.target.value)}
                                rows={2}
                                placeholder="Feature description..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Icon</Label>
                            <div className="flex gap-2 flex-wrap">
                                {iconOptions.map((ic) => (
                                    <button
                                        key={ic}
                                        type="button"
                                        onClick={() => onArrayChange('items', index, 'icon', ic)}
                                        className={`text-xs px-2 py-1 rounded border transition ${item.icon === ic
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                            }`}
                                    >
                                        {ic}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EditAbout({
    content,
    onChange,
    onArrayChange,
}: {
    content: any;
    onChange: (key: string, val: string) => void;
    onArrayChange: (arrayKey: string, index: number, itemKey: string, val: string) => void;
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-1.5">
                <Label>Judul Section</Label>
                <Input
                    value={content?.title || ''}
                    onChange={(e) => onChange('title', e.target.value)}
                    placeholder="About Us"
                />
            </div>
            <div className="space-y-1.5">
                <Label>Deskripsi</Label>
                <Textarea
                    value={content?.description || ''}
                    onChange={(e) => onChange('description', e.target.value)}
                    rows={4}
                    placeholder="Describe your platform..."
                />
            </div>
            {(content?.stats || []).map((stat: any, index: number) => (
                <div key={index} className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Label Statistik #{index + 1}</Label>
                        <Input
                            value={stat.label || ''}
                            onChange={(e) => onArrayChange('stats', index, 'label', e.target.value)}
                            placeholder="Users"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Nilai Statistik #{index + 1}</Label>
                        <Input
                            value={stat.value || ''}
                            onChange={(e) => onArrayChange('stats', index, 'value', e.target.value)}
                            placeholder="1000+"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- Main Component ---
export default function LandingPageVisualEditor({ sections }: Props) {
    const [sectionsData, setSectionsData] = useState<LandingSection[]>(sections);
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.section || 'hero');
    const [saving, setSaving] = useState<Record<string, boolean>>({});
    const [saved, setSaved] = useState<Record<string, boolean>>({});
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Ref untuk container scroll preview
    const previewScrollRef = useRef<HTMLDivElement>(null);

    const currentSection = sectionsData.find((s) => s.section === activeSection);

    // Scroll preview ke section + aktifkan tab edit
    const scrollToSection = useCallback((sectionName: string) => {
        setActiveSection(sectionName);
        const container = previewScrollRef.current;
        if (!container) return;
        // ID di preview: hero -> preview-hero, features -> preview-features, about -> preview-about
        const target = container.querySelector(`#preview-${sectionName}`);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const updateContent = useCallback(
        (key: string, value: string) => {
            setSectionsData((prev) =>
                prev.map((s) =>
                    s.section === activeSection
                        ? { ...s, content: { ...s.content, [key]: value } }
                        : s,
                ),
            );
        },
        [activeSection],
    );

    const updateArrayItem = useCallback(
        (arrayKey: string, index: number, itemKey: string, value: string) => {
            setSectionsData((prev) =>
                prev.map((s) => {
                    if (s.section !== activeSection) return s;
                    const newContent = { ...s.content };
                    newContent[arrayKey] = [...(newContent[arrayKey] || [])];
                    newContent[arrayKey][index] = { ...newContent[arrayKey][index], [itemKey]: value };
                    return { ...s, content: newContent };
                }),
            );
        },
        [activeSection],
    );

    const toggleActive = useCallback(
        (sectionName: string, value: boolean) => {
            setSectionsData((prev) =>
                prev.map((s) => (s.section === sectionName ? { ...s, is_active: value } : s)),
            );
        },
        [],
    );

    const saveSection = useCallback(
        (sectionName: string) => {
            const section = sectionsData.find((s) => s.section === sectionName);
            if (!section) return;
            setSaving((prev) => ({ ...prev, [sectionName]: true }));
            router.put(
                `/admin/landing-page/${section.id}`,
                {
                    content: section.content,
                    is_active: section.is_active,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSaving((prev) => ({ ...prev, [sectionName]: false }));
                        setSaved((prev) => ({ ...prev, [sectionName]: true }));
                        setTimeout(() => setSaved((prev) => ({ ...prev, [sectionName]: false })), 2500);
                    },
                    onError: () => {
                        setSaving((prev) => ({ ...prev, [sectionName]: false }));
                    },
                },
            );
        },
        [sectionsData],
    );

    const sectionLabels: Record<string, string> = {
        hero: '🏠 Hero',
        features: '⚡ Features',
        about: '📖 About',
    };

    const heroContent = sectionsData.find((s) => s.section === 'hero')?.content;
    const featuresContent = sectionsData.find((s) => s.section === 'features')?.content;
    const aboutSection = sectionsData.find((s) => s.section === 'about');
    const aboutContent = aboutSection?.content;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Visual Editor - Landing Page" />

            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-gray-950 sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">LP</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold">Visual Editor — Landing Page</h1>
                        <p className="text-xs text-gray-500">Edit dan lihat perubahan secara real-time</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Preview mode toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`px-3 py-1.5 text-xs rounded-md transition font-medium flex items-center gap-1.5 ${previewMode === 'desktop'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            🖥️ Desktop
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`px-3 py-1.5 text-xs rounded-md transition font-medium flex items-center gap-1.5 ${previewMode === 'mobile'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            📱 Mobile
                        </button>
                    </div>
                    <a
                        href="/"
                        target="_blank"
                        className="text-xs px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium flex items-center gap-1.5"
                    >
                        🔗 Lihat Live
                    </a>
                    <Button
                        size="sm"
                        onClick={() => currentSection && saveSection(currentSection.section)}
                        disabled={!currentSection || saving[activeSection]}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                    >
                        {saving[activeSection]
                            ? '⏳ Menyimpan...'
                            : saved[activeSection]
                                ? '✅ Tersimpan!'
                                : '💾 Simpan'}
                    </Button>
                </div>
            </div>

            <div className="flex h-[calc(100vh-120px)]">
                {/* Left: Preview */}
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 overflow-hidden flex flex-col">
                    {/* Preview nav tabs */}
                    <div className="flex items-center gap-1 px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
                        <span className="text-xs text-gray-500 mr-2 font-medium">Lompat ke Section:</span>
                        {sectionsData.map((s) => (
                            <button
                                key={s.section}
                                onClick={() => scrollToSection(s.section)}
                                className={`text-xs px-3 py-1 rounded-full transition font-medium ${activeSection === s.section
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {sectionLabels[s.section] || s.section}
                            </button>
                        ))}
                    </div>

                    {/* Preview Frame — dengan ref untuk scroll */}
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
                                    yoursite.com
                                </div>
                            </div>

                            {/* Fake Header */}
                            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
                                <span className="text-base font-bold text-blue-600">IoT Platform</span>
                                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <span>Home</span>
                                    <span>Features</span>
                                    <span>About</span>
                                    <span className="bg-blue-600 text-white px-3 py-1 rounded-md">Sign In</span>
                                </div>
                            </div>

                            {/* Preview Content with real-time updates */}
                            <PreviewHero content={heroContent} />
                            <PreviewFeatures content={featuresContent} />
                            {aboutSection?.is_active && <PreviewAbout content={aboutContent} />}

                            {/* Fake Footer */}
                            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-4 text-center text-xs text-gray-400">
                                © {new Date().getFullYear()} IoT Platform. All rights reserved.
                            </footer>
                        </div>
                    </div>
                </div>

                {/* Right: Edit Panel */}
                <div className="w-[380px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col">
                    {/* Section tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        {sectionsData.map((s) => (
                            <button
                                key={s.section}
                                onClick={() => scrollToSection(s.section)}
                                className={`flex-1 py-3 px-2 text-xs font-semibold transition relative ${activeSection === s.section
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {sectionLabels[s.section] || s.section}
                            </button>
                        ))}
                    </div>

                    {/* Edit form */}
                    <div className="flex-1 overflow-auto">
                        {currentSection && (
                            <div className="p-4 space-y-5">
                                {/* Section Status */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p className="text-sm font-medium">Status Section</p>
                                        <p className="text-xs text-gray-500">
                                            {currentSection.is_active ? 'Aktif & tampil di website' : 'Tersembunyi dari website'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={currentSection.is_active ? 'default' : 'secondary'} className="text-xs">
                                            {currentSection.is_active ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                        <Switch
                                            checked={currentSection.is_active}
                                            onCheckedChange={(val) => toggleActive(currentSection.section, val)}
                                        />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-100 dark:border-gray-800" />

                                {/* Section-specific edit forms */}
                                {activeSection === 'hero' && (
                                    <EditHero content={currentSection.content} onChange={updateContent} />
                                )}
                                {activeSection === 'features' && (
                                    <EditFeatures
                                        content={currentSection.content}
                                        onChange={updateContent}
                                        onArrayChange={updateArrayItem}
                                    />
                                )}
                                {activeSection === 'about' && (
                                    <EditAbout
                                        content={currentSection.content}
                                        onChange={updateContent}
                                        onArrayChange={updateArrayItem}
                                    />
                                )}

                                {/* Save Button */}
                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                                        onClick={() => saveSection(activeSection)}
                                        disabled={saving[activeSection]}
                                    >
                                        {saving[activeSection]
                                            ? '⏳ Menyimpan...'
                                            : saved[activeSection]
                                                ? '✅ Berhasil Disimpan!'
                                                : `💾 Simpan Section "${sectionLabels[activeSection] || activeSection}"`}
                                    </Button>
                                    <p className="mt-2 text-xs text-center text-gray-400">
                                        Perubahan ditampilkan secara real-time di preview sebelah kiri
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
