import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Stats {
    total_users: number;
    total_devices: number;
    active_subscriptions: number;
    pending_orders: number;
    total_revenue: number;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    sensors: Array<{
        id: number;
        name: string;
    }>;
}

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentOrders: Order[];
    recentUsers: User[];
}

export default function AdminDashboard({ stats, recentOrders, recentUsers }: Props) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola semua order, user, dan subscription
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">Registered users</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                            <span className="text-2xl">📱</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_devices}</div>
                            <p className="text-xs text-muted-foreground">Active devices</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                            <span className="text-2xl">✅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.active_subscriptions}</div>
                            <p className="text-xs text-muted-foreground">Currently active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                            <span className="text-2xl">⏳</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending_orders}</div>
                            <p className="text-xs text-muted-foreground">Needs approval</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <span className="text-2xl">💰</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                Rp {(stats.total_revenue / 1000).toFixed(0)}K
                            </div>
                            <p className="text-xs text-muted-foreground">Per month</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Orders</CardTitle>
                                    <CardDescription>Latest order submissions</CardDescription>
                                </div>
                                <Link
                                    href="/admin/orders"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View All →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada order
                                    </p>
                                ) : (
                                    recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.user.name} • {order.sensors.length} sensors
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                    {order.status}
                                                </Badge>
                                                <p className="text-sm font-semibold">
                                                    Rp {(order.total_amount / 1000).toFixed(0)}K
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Users */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Users</CardTitle>
                                    <CardDescription>Newly registered users</CardDescription>
                                </div>
                                <Link
                                    href="/admin/users"
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    View All →
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentUsers.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Belum ada user
                                    </p>
                                ) : (
                                    recentUsers.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common administrative tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            <Link
                                href="/admin/orders"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <span className="text-4xl mb-2">📋</span>
                                <span className="text-sm font-medium">Manage Orders</span>
                            </Link>
                            <Link
                                href="/admin/users"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition"
                            >
                                <span className="text-4xl mb-2">👥</span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Kelola Users</span>
                            </Link>
                            <Link
                                href="/admin/devices"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800 transition"
                            >
                                <span className="text-4xl mb-2">📡</span>
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">Kelola Devices</span>
                            </Link>
                            <Link
                                href="/admin/landing-page"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <span className="text-4xl mb-2">🎨</span>
                                <span className="text-sm font-medium">Edit Landing Page</span>
                            </Link>
                            <Link
                                href="/admin/pricing"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800 transition"
                            >
                                <span className="text-4xl mb-2">💰</span>
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Edit Paket Pricing</span>
                            </Link>
                            <Link
                                href="/admin/landing-page/visual-editor"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800 transition"
                            >
                                <span className="text-4xl mb-2">🖥️</span>
                                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Visual Editor LP</span>
                            </Link>
                            <Link
                                href="/admin/member-area/editor"
                                className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 border-pink-200 dark:border-pink-800 transition"
                            >
                                <span className="text-4xl mb-2">📱</span>
                                <span className="text-sm font-medium text-pink-600 dark:text-pink-400">Visual Editor Member</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
