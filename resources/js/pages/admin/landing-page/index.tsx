import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LandingSection {
    id: number;
    section: string;
    content: any;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    sections: LandingSection[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
    },
    {
        title: 'Landing Page',
        href: '/admin/landing-page',
    },
];

export default function LandingPageIndex({ sections }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Landing Page" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Landing Page Sections</h1>
                        <p className="text-muted-foreground">
                            Manage your website landing page content
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/landing-page/visual-editor">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                                ✏️ Visual Editor
                            </Button>
                        </Link>
                        <Link href="/" target="_blank">
                            <Button variant="outline">
                                Preview Landing Page
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {sections.map((section) => (
                        <Card key={section.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="capitalize">
                                        {section.section}
                                    </CardTitle>
                                    <Badge variant={section.is_active ? 'default' : 'secondary'}>
                                        {section.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <CardDescription>
                                    Last updated: {new Date(section.updated_at).toLocaleDateString()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/admin/landing-page/${section.id}/edit`}>
                                    <Button className="w-full">
                                        Edit Section
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
