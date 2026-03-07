import { Head, Link } from '@inertiajs/react';

export default function Error403() {
    return (
        <>
            <Head title="403 - Akses Ditolak" />

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-red-600/10 blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl" />
                </div>

                <div className="relative max-w-lg w-full text-center">
                    {/* Icon */}
                    <div className="mx-auto mb-8 w-32 h-32 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <span className="text-6xl">🔒</span>
                    </div>

                    {/* Error code */}
                    <div className="mb-4">
                        <span className="text-8xl font-black bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                            403
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-3">
                        Akses Ditolak
                    </h1>

                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Anda tidak memiliki izin untuk mengakses halaman ini.
                        Halaman admin hanya dapat diakses oleh administrator yang berwenang.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition"
                        >
                            <span>🏠</span> Kembali ke Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-600 px-6 py-3 font-medium text-gray-300 hover:bg-gray-800 transition"
                        >
                            <span>🌐</span> Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
