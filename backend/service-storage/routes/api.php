<?php

use App\Http\Controllers\UploadController;
use App\Http\Middleware\InternalOnly;
use Illuminate\Support\Facades\Route;

Route::middleware(InternalOnly::class)->group(function () {
    Route::post('/upload', [UploadController::class, 'upload']);
    Route::delete('/delete', [UploadController::class, 'delete']);
});
