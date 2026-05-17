<?php

use App\Containers\Cart\UI\CLI\Commands\SendAbandonedCartEmailsCommand;
use App\Containers\Order\UI\CLI\Commands\CancelPendingOrdersCommand;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Register custom commands
Artisan::add(new CancelPendingOrdersCommand());
Artisan::add(new SendAbandonedCartEmailsCommand());

// Note: Schedule is configured in bootstrap/app.php using ->withSchedule()
