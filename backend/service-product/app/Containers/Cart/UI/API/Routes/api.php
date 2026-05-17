<?php

use App\Containers\Cart\UI\API\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'show']);
    Route::post('/items', [CartController::class, 'addItem']);
    Route::put('/items/{cartItemId}', [CartController::class, 'updateItem']);
    Route::delete('/items/{cartItemId}', [CartController::class, 'removeItem']);
    Route::delete('/', [CartController::class, 'clear']);
});
