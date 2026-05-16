<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

Route::post('/webhook', [PaymentController::class, 'webhook']);

Route::middleware('auth.jwt')->group(function () {
    Route::post('/checkout', [PaymentController::class, 'checkout']);
    Route::get('/orders', [PaymentController::class, 'orders']);
});
