import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface Order {
    id: number;
    order_number: string;
    device_name: string;
    device_location: string;
    device_description: string | null;
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
        code: string;
        price: number;
        unit: string;
        pivot: {
            variable_name: string;
            custom_name: string;
            unit: string;
            price: number;
        };
    }>;
}

interface Props {
    order: Order;
}

export default function OrderShow({ order }: Props) {
    const [showRejectForm, setShowRejectForm] = useState(false);

    const approveForm = useForm({});

    const rejectForm = useForm({
        rejection_reason: '',
    });

    const handleApprove = () => {
        if (confirm('Approve order ini? Device akan dibuat di IoT API.')) {
            approveForm.post(`/admin/orders/${order.id}/approve`);
        }
    };

    const handleReject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        rejectForm.post(`/admin/orders/${order.id}/reject`);
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };

    const statusText = {
        pending: 'Pending Approval',
        approved: 'Approved',
        rejected: 'Rejected',
    };

    return (
        <AppLayout>
            <Head title={`Order ${order.order_number}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block">
                            ← Back to Orders
                        </Link>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="text-muted-foreground mt-2">
                            {order.order_number}
                        </p>
                    </div>
                    <Badge className={`${statusColors[order.status as keyof typeof statusColors]} text-lg px-4 py-2`}>
                        {statusText[order.status as keyof typeof statusText]}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Name</p>
                                <p className="font-semibold">{order.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Email</p>
                                <p className="font-semibold">{order.user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Order Date</p>
                                <p className="font-semibold">
                                    {new Date(order.created_at).toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Sensors</p>
                                <p className="font-semibold">{order.sensors.length} sensors</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Monthly Cost</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    Rp {(order.total_amount / 1000).toFixed(0)}K
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Device Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Device Information</CardTitle>
                        <CardDescription>Device details provided by customer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <p className="text-sm text-muted-foreground">Device Name</p>
                            <p className="font-semibold">{order.device_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-semibold">{order.device_location}</p>
                        </div>
                        {order.device_description && (
                            <div>
                                <p className="text-sm text-muted-foreground">Description</p>
                                <p className="font-semibold">{order.device_description}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Sensors List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Selected Sensors ({order.sensors.length})</CardTitle>
                        <CardDescription>Sensors with V2 configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {order.sensors.map((sensor) => (
                                <div key={sensor.id} className="border rounded-lg p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-semibold">{sensor.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Template Code: {sensor.code}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-blue-600">
                                            Rp {(sensor.pivot.price / 1000).toFixed(0)}K/bln
                                        </p>
                                    </div>
                                    <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Variable</p>
                                            <p className="font-medium">{sensor.pivot.variable_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Custom Name</p>
                                            <p className="font-medium">{sensor.pivot.custom_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Unit</p>
                                            <p className="font-medium">{sensor.pivot.unit || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                {order.status === 'pending' && (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Approve Button */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-green-600">Approve Order</CardTitle>
                                <CardDescription>
                                    Device akan dibuat di IoT API dengan informasi yang sudah diberikan customer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    onClick={handleApprove}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    disabled={approveForm.processing}
                                >
                                    {approveForm.processing ? 'Processing...' : 'Approve Order'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Reject Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">Reject Order</CardTitle>
                                <CardDescription>
                                    Decline this order request
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!showRejectForm ? (
                                    <Button 
                                        onClick={() => setShowRejectForm(true)}
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Reject Order
                                    </Button>
                                ) : (
                                    <form onSubmit={handleReject} className="space-y-4">
                                        <div>
                                            <Label htmlFor="rejection_reason">Rejection Reason (Optional)</Label>
                                            <Textarea
                                                id="rejection_reason"
                                                value={rejectForm.data.rejection_reason}
                                                onChange={(e) => rejectForm.setData('rejection_reason', e.target.value)}
                                                placeholder="Reason for rejection..."
                                                rows={4}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                type="submit" 
                                                variant="destructive"
                                                className="flex-1"
                                                disabled={rejectForm.processing}
                                            >
                                                {rejectForm.processing ? 'Processing...' : 'Confirm Rejection'}
                                            </Button>
                                            <Button 
                                                type="button" 
                                                variant="outline"
                                                onClick={() => setShowRejectForm(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {order.status === 'approved' && (
                    <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CardContent className="pt-6">
                            <p className="text-center text-green-700 dark:text-green-300">
                                ✅ Order ini sudah disetujui dan subscription telah dibuat
                            </p>
                        </CardContent>
                    </Card>
                )}

                {order.status === 'rejected' && (
                    <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                        <CardContent className="pt-6">
                            <p className="text-center text-red-700 dark:text-red-300">
                                ❌ Order ini telah ditolak
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
