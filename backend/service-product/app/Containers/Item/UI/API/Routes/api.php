<?php

use App\Containers\Item\UI\API\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::apiResource('items', ItemController::class);
