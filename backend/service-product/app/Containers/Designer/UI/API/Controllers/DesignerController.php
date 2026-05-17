<?php

namespace App\Containers\Designer\UI\API\Controllers;

use App\Containers\Designer\Models\Designer;
use App\Containers\Designer\UI\API\Resources\DesignerResource;
use App\Ship\Parents\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class DesignerController extends Controller
{
    /**
     * Display a listing of the designers.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $designers = Designer::query()
            ->withCount('items')
            ->paginate((int) $request->query('per_page', 15));

        return DesignerResource::collection($designers);
    }

    /**
     * Store a newly created designer in storage.
     */
    public function store(Request $request): DesignerResource
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:designers,slug',
            'description' => 'nullable|string',
            'avatar_url' => 'nullable|url|max:2048',
            'banner_url' => 'nullable|url|max:2048',
        ]);

        $designer = Designer::create($validated);

        return new DesignerResource($designer);
    }

    /**
     * Display the specified designer.
     */
    public function show(string $id): DesignerResource
    {
        $designer = Designer::query()
            ->with('items')
            ->withCount('items')
            ->findOrFail($id);

        return new DesignerResource($designer);
    }

    /**
     * Update the specified designer in storage.
     */
    public function update(Request $request, string $id): DesignerResource
    {
        $designer = Designer::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:designers,slug,' . $id,
            'description' => 'nullable|string',
            'avatar_url' => 'nullable|url|max:2048',
            'banner_url' => 'nullable|url|max:2048',
        ]);

        $designer->update($validated);

        return new DesignerResource($designer);
    }

    /**
     * Remove the specified designer from storage.
     */
    public function destroy(string $id): Response
    {
        $designer = Designer::findOrFail($id);
        $designer->delete();

        return response()->noContent();
    }
}
