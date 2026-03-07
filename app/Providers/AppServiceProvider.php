<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Set custom temp directory to avoid open_basedir restrictions
        $tempDir = storage_path('framework/temp');
        
        if (!is_dir($tempDir)) {
            @mkdir($tempDir, 0775, true);
        }
        
        if (function_exists('putenv')) {
            putenv('TMPDIR=' . $tempDir);
        }

        // Override Filesystem to avoid tempnam() open_basedir issues
        $this->app->singleton('files', function () {
            return new \App\Overrides\Filesystem;
        });

        // Register custom LoginResponse
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            \App\Http\Responses\LoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
