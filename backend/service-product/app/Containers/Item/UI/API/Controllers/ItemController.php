<?php

namespace App\Containers\Item\UI\API\Controllers;

use App\Containers\Item\Models\Item;
use App\Ship\Parents\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     */
    public function index(): JsonResponse
    {
        $items = Item::with(['designer'])->get();

        return response()->json($items);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:items,slug',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'category' => 'required|string|max:100',
            'designer_id' => 'nullable|exists:designers,id',
            'stock_quantity' => 'nullable|integer|min:0',
            'is_signature' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $item = Item::create($validated);
        $item->load(['designer']);

        return response()->json($item, 201);
    }

    /**
     * Display the specified item.
     */
    public function show(string $id): JsonResponse
    {
        $item = Item::with(['designer', 'images'])->findOrFail($id);

        return response()->json($item);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:items,slug,' . $id,
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'category' => 'sometimes|required|string|max:100',
            'designer_id' => 'nullable|exists:designers,id',
            'stock_quantity' => 'nullable|integer|min:0',
            'is_signature' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $item = Item::findOrFail($id);
        $item->update($validated);
        $item->load(['designer', 'images']);

        return response()->json($item);
    }

    /**
     * Remove the specified item from storage.
     */
    public function destroy(string $id): Response
    {
        $item = Item::findOrFail($id);
        $item->delete();

        return response()->noContent();
    }
}
