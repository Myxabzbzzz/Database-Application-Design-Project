<?php

use App\Containers\Item\UI\API\Controllers\CategoryController;
use App\Containers\Item\UI\API\Controllers\ItemController;
use Illuminate\Support\Facades\Route;

Route::get('categories', [CategoryController::class, 'index']);
Route::apiResource('items', ItemController::class);
