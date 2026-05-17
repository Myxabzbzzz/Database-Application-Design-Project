<?php

use App\Containers\Order\UI\CLI\Commands\CancelPendingOrdersCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register custom commands
Artisan::add(new CancelPendingOrdersCommand());

// Note: Schedule is configured in bootstrap/app.php using ->withSchedule()
