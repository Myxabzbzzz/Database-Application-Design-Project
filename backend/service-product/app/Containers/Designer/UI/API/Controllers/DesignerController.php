<?php

namespace App\Containers\Designer\UI\API\Controllers;

use App\Containers\Designer\Models\Designer;
use App\Ship\Parents\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DesignerController extends Controller
{
    /**
     * Display a listing of the designers.
     */
    public function index(): JsonResponse
    {
        $designers = Designer::with('items')->get();

        return response()->json($designers);
    }

    /**
     * Store a newly created designer in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $designer = Designer::create($validated);

        return response()->json($designer, 201);
    }

    /**
     * Display the specified designer.
     */
    public function show(string $id): JsonResponse
    {
        $designer = Designer::with('items')->findOrFail($id);

        return response()->json($designer);
    }

    /**
     * Update the specified designer in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $designer = Designer::findOrFail($id);
        $designer->update($validated);

        return response()->json($designer);
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
