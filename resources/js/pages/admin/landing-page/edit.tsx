import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface LandingSection {
    id: number;
    section: string;
    content: any;
    is_active: boolean;
}

interface Props {
    section: LandingSection;
}

export default function LandingPageEdit({ section }: Props) {
    const [content, setContent] = useState(section.content);
    const { data, setData, put, processing, errors } = useForm({
        content: section.content,
        is_active: section.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Admin Dashboard',
            href: '/admin/dashboard',
        },
        {
            title: 'Landing Page',
            href: '/admin/landing-page',
        },
        {
            title: `Edit ${section.section}`,
            href: `/admin/landing-page/${section.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/landing-page/${section.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit('/admin/landing-page');
            },
        });
    };

    const updateContent = (key: string, value: any) => {
        const newContent = { ...content, [key]: value };
        setContent(newContent);
        setData('content', newContent);
    };

    const updateArrayItem = (arrayKey: string, index: number, itemKey: string, value: any) => {
        const newContent = { ...content };
        newContent[arrayKey][index][itemKey] = value;
        setContent(newContent);
        setData('content', newContent);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${section.section}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold capitalize">Edit {section.section} Section</h1>
                        <p className="text-muted-foreground">
                            Update the content for this section
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Content</CardTitle>
                            <CardDescription>
                                Edit the content that will be displayed on the landing page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Hero Section */}
                            {section.section === 'hero' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={content.title || ''}
                                            onChange={(e) => updateContent('title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subtitle">Subtitle</Label>
                                        <Textarea
                                            id="subtitle"
                                            value={content.subtitle || ''}
                                            onChange={(e) => updateContent('subtitle', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="primary_button_text">Primary Button Text</Label>
                                            <Input
                                                id="primary_button_text"
                                                value={content.primary_button_text || ''}
                                                onChange={(e) => updateContent('primary_button_text', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="primary_button_url">Primary Button URL</Label>
                                            <Input
                                                id="primary_button_url"
                                                value={content.primary_button_url || ''}
                                                onChange={(e) => updateContent('primary_button_url', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="secondary_button_text">Secondary Button Text</Label>
                                            <Input
                                                id="secondary_button_text"
                                                value={content.secondary_button_text || ''}
                                                onChange={(e) => updateContent('secondary_button_text', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="secondary_button_url">Secondary Button URL</Label>
                                            <Input
                                                id="secondary_button_url"
                                                value={content.secondary_button_url || ''}
                                                onChange={(e) => updateContent('secondary_button_url', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Features Section */}
                            {section.section === 'features' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={content.title || ''}
                                            onChange={(e) => updateContent('title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subtitle">Subtitle</Label>
                                        <Input
                                            id="subtitle"
                                            value={content.subtitle || ''}
                                            onChange={(e) => updateContent('subtitle', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label>Feature Items</Label>
                                        {content.items?.map((item: any, index: number) => (
                                            <Card key={index}>
                                                <CardContent className="pt-6 space-y-3">
                                                    <div className="space-y-2">
                                                        <Label>Title</Label>
                                                        <Input
                                                            value={item.title || ''}
                                                            onChange={(e) => updateArrayItem('items', index, 'title', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Description</Label>
                                                        <Textarea
                                                            value={item.description || ''}
                                                            onChange={(e) => updateArrayItem('items', index, 'description', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Icon (monitor, automation, energy, security, voice, support)</Label>
                                                        <Input
                                                            value={item.icon || ''}
                                                            onChange={(e) => updateArrayItem('items', index, 'icon', e.target.value)}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* About Section */}
                            {section.section === 'about' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={content.title || ''}
                                            onChange={(e) => updateContent('title', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={content.description || ''}
                                            onChange={(e) => updateContent('description', e.target.value)}
                                            rows={4}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label>Statistics</Label>
                                        {content.stats?.map((stat: any, index: number) => (
                                            <div key={index} className="grid md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Label</Label>
                                                    <Input
                                                        value={stat.label || ''}
                                                        onChange={(e) => updateArrayItem('stats', index, 'label', e.target.value)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Value</Label>
                                                    <Input
                                                        value={stat.value || ''}
                                                        onChange={(e) => updateArrayItem('stats', index, 'value', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/admin/landing-page')}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
