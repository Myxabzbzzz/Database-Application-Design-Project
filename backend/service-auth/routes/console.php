<?php

use App\Containers\User\UI\CLI\Commands\DeleteUnverifiedUsersCommand;
use App\Containers\User\UI\CLI\Commands\DetectSuspiciousLoginsCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register custom commands
Artisan::add(new DeleteUnverifiedUsersCommand());
Artisan::add(new DetectSuspiciousLoginsCommand());

// Note: Schedule is configured in bootstrap/app.php using ->withSchedule()
