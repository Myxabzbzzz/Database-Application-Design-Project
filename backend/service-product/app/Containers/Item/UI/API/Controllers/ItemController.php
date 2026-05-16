<?php

namespace App\Containers\Item\UI\API\Controllers;

use App\Containers\Item\Enums\ItemCategoryEnum;
use App\Containers\Item\Models\Item;
use App\Containers\Item\UI\API\Requests\StoreItemRequest;
use App\Containers\Item\UI\API\Requests\UpdateItemRequest;
use App\Containers\Item\UI\API\Resources\ItemResource;
use App\Ship\Parents\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    /**
     * Display a listing of the items.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $items = Item::query()
            ->with(['designer', 'images'])
            ->withCount('images')
            ->when($request->query('category'), function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($request->query('designer_id'), function ($query, $designerId) {
                $query->where('designer_id', $designerId);
            })
            ->when($request->query('is_signature'), function ($query, $isSignature) {
                $query->where('is_signature', filter_var($isSignature, FILTER_VALIDATE_BOOLEAN));
            })
            ->when($request->query('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->where('is_active', true)
            ->orderByDesc('created_at')
            ->paginate((int) $request->query('per_page', 15));

        return ItemResource::collection($items);
    }

    /**
     * Store a newly created item in storage.
     */
    public function store(StoreItemRequest $request): ItemResource
    {
        $validated = $request->validated();

        $item = Item::create($validated);
        $item->load(['designer', 'images']);

        return new ItemResource($item);
    }

    /**
     * Display the specified item.
     */
    public function show(string $id): ItemResource
    {
        $item = Item::query()
            ->with(['designer', 'images'])
            ->withCount('images')
            ->findOrFail($id);

        return new ItemResource($item);
    }

    /**
     * Update the specified item in storage.
     */
    public function update(UpdateItemRequest $request, string $id): ItemResource
    {
        $item = Item::findOrFail($id);

        $validated = $request->validated();

        $item->update($validated);
        $item->load(['designer', 'images']);

        return new ItemResource($item);
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
