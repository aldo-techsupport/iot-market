import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Eye, Trash2, RefreshCw, UserCheck, Smartphone } from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from '@/components/ui/dialog';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    devices_count: number;
    orders_count: number;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
    from: number;
    to: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    users: PaginatedUsers;
    search: string;
}

export default function AdminUsersIndex({ users, search }: Props) {
    const [searchQuery, setSearchQuery] = useState(search ?? '');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search: searchQuery }, { preserveState: true });
    };

    const handleDelete = () => {
        if (!deleteUser) return;
        setDeleteLoading(true);
        router.delete(`/admin/users/${deleteUser.id}`, {
            onFinish: () => { setDeleteLoading(false); setDeleteOpen(false); },
        });
    };

    return (
        <AppLayout>
            <Head title="Kelola Users — Admin" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Users className="h-6 w-6 text-blue-500" />
                            Kelola Users
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Total {users.total} user terdaftar
                        </p>
                    </div>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Cari nama / email..."
                                className="pl-9 w-64"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="sm">Cari</Button>
                        {search && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => { setSearchQuery(''); router.get('/admin/users'); }}
                            >
                                Reset
                            </Button>
                        )}
                    </form>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold">{users.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Halaman ini</p>
                                    <p className="text-2xl font-bold">{users.data.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <Search className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Page</p>
                                    <p className="text-2xl font-bold">{users.current_page} / {users.last_page}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/40">
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Email</th>
                                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Devices</th>
                                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Orders</th>
                                        <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Daftar</th>
                                        <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                                Tidak ada user ditemukan
                                            </td>
                                        </tr>
                                    ) : users.data.map(user => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="outline">{user.devices_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Badge variant="outline">{user.orders_count}</Badge>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground text-xs">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Button size="sm" variant="outline" className="h-8 gap-1.5">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                                                        onClick={() => { setDeleteUser(user); setDeleteOpen(true); }}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {users.last_page > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t">
                                <p className="text-xs text-muted-foreground">
                                    Menampilkan {users.from}–{users.to} dari {users.total} user
                                </p>
                                <div className="flex gap-1">
                                    {users.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                                    link.active
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="px-3 py-1.5 rounded text-xs text-muted-foreground opacity-50"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Hapus User</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus user <strong>{deleteUser?.name}</strong>? 
                            Seluruh data device, subscription, dan order akan ikut terhapus.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Batal</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
