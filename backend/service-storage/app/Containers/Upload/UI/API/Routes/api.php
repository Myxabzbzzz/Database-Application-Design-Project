<?php

use App\Containers\Upload\UI\API\Controllers\UploadController;
use App\Ship\Middlewares\InternalOnly;
use Illuminate\Support\Facades\Route;

Route::middleware(InternalOnly::class)->group(function () {
    Route::post('/upload', [UploadController::class, 'upload']);
    Route::delete('/delete', [UploadController::class, 'delete']);
});
