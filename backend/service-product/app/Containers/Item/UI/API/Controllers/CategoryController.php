<?php

namespace App\Containers\Item\UI\API\Controllers;

use App\Containers\Item\Enums\ItemCategoryEnum;
use App\Ship\Parents\Controller;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all available item categories.
     */
    public function index(): JsonResponse
    {
        $categories = collect(ItemCategoryEnum::cases())->map(function ($category) {
            return ['value' => $category->value];
        });

        return response()->json([
            'data' => $categories,
        ]);
    }
}
