import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Order {
    id: number;
    order_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    sensors: Array<{
        id: number;
        name: string;
        price: number;
    }>;
}

interface Stats {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
}

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: Stats;
}

export default function OrdersIndex({ orders, stats }: Props) {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const statusText = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
    };

    return (
        <AppLayout>
            <Head title="Manage Orders" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Manage Orders</h1>
                    <p className="text-muted-foreground mt-2">
                        Review and approve customer orders
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                        <CardDescription>
                            Showing {orders.data.length} of {orders.total} orders
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.data.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    Belum ada order
                                </p>
                            ) : (
                                orders.data.map((order) => (
                                    <div 
                                        key={order.id} 
                                        className="flex items-start justify-between border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    >
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-mono font-semibold">{order.order_number}</p>
                                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                                    {statusText[order.status as keyof typeof statusText]}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <p>Customer: {order.user.name} ({order.user.email})</p>
                                                <p>Sensors: {order.sensors.length} items</p>
                                                <p>Date: {new Date(order.created_at).toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="text-xl font-bold text-blue-600">
                                                Rp {(order.total_amount / 1000).toFixed(0)}K/bln
                                            </p>
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {orders.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === orders.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => router.get(`/admin/orders?page=${page}`)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
