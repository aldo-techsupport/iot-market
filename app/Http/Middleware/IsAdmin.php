<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            // Lempar AccessDeniedHttpException agar ditangkap oleh exception handler
            // yang akan render halaman 403 Inertia yang bagus
            throw new AccessDeniedHttpException('Unauthorized access. Halaman ini hanya untuk administrator.');
        }

        return $next($request);
    }
}
