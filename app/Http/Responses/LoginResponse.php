<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        $user = auth()->user();
        
        // Redirect admin ke admin dashboard
        if ($user->isAdmin()) {
            return $request->wantsJson()
                ? new JsonResponse('', 204)
                : redirect()->intended(route('admin.dashboard'));
        }
        
        // User biasa: cek apakah punya subscription aktif
        $hasActiveSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->exists();
        
        // Jika punya subscription aktif, ke dashboard monitoring
        if ($hasActiveSubscription) {
            return $request->wantsJson()
                ? new JsonResponse('', 204)
                : redirect()->intended(route('dashboard.monitoring'));
        }
        
        // Jika belum punya subscription, ke member area
        return $request->wantsJson()
            ? new JsonResponse('', 204)
            : redirect()->intended(route('member.area'));
    }
}
