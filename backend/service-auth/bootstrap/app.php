<?php

use App\Containers\User\Middlewares\CheckBlockedIp;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->remove(\Illuminate\Http\Middleware\HandleCors::class);
        $middleware->redirectGuestsTo(fn () => null);

        // Apply CheckBlockedIp middleware to login routes
        $middleware->alias([
            'check.blocked.ip' => CheckBlockedIp::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn ($request) => $request->is('api/*'));
    })
    ->withSchedule(function ($schedule) {
        $schedule->command('users:delete-unverified --days=7')
            ->weekly()
            ->sundays()
            ->at('03:00')
            ->withoutOverlapping(10)
            ->runInBackground()
            ->appendOutputTo(storage_path('logs/users-delete-unverified.log'));

        $schedule->command('auth:detect-suspicious-logins --threshold=5 --window=15 --block-duration=60')
            ->everyFifteenMinutes()
            ->withoutOverlapping(5)
            ->runInBackground()
            ->appendOutputTo(storage_path('logs/suspicious-logins.log'));
    })

    ->create();
