import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, FileText, Settings, Monitor, Users } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import { dashboard } from '@/routes';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.role === 'admin';

    // Menu untuk admin
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Orders',
            href: '/admin/orders',
            icon: FileText,
        },
        {
            title: 'Landing Page',
            href: '/admin/landing-page',
            icon: Settings,
        },
        {
            title: 'Visual Editor LP',
            href: '/admin/landing-page/visual-editor',
            icon: Monitor,
        },
        {
            title: 'Member Area Editor',
            href: '/admin/member-area/editor',
            icon: Users,
        },
        {
            title: 'Paket Pricing',
            href: '/admin/pricing',
            icon: Folder,
        },
    ];

    // Menu untuk user biasa
    const userNavItems: NavItem[] = [
        {
            title: 'Monitoring',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Member Area',
            href: '/memberarea',
            icon: Folder,
        },
    ];

    const mainNavItems = isAdmin ? adminNavItems : userNavItems;
    const homeUrl = isAdmin ? '/admin/dashboard' : '/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
