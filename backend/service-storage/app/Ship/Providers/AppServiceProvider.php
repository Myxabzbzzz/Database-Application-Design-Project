<?php

namespace App\Ship\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->loadMigrationsFromContainers();
    }

    /**
     * Load migrations from all containers.
     */
    protected function loadMigrationsFromContainers(): void
    {
        $containersPath = app_path('Containers');

        if (!File::exists($containersPath)) {
            return;
        }

        $containers = File::directories($containersPath);

        foreach ($containers as $container) {
            $migrationsPath = $container . '/Data/Migrations';

            if (File::exists($migrationsPath)) {
                $this->loadMigrationsFrom($migrationsPath);
            }
        }
    }
}
