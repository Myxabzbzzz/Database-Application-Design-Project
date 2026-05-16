<?php

use App\Containers\Designer\UI\API\Controllers\DesignerController;
use Illuminate\Support\Facades\Route;

Route::apiResource('designers', DesignerController::class);
