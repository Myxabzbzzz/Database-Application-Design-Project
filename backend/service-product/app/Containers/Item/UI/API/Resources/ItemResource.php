<?php

namespace App\Containers\Item\UI\API\Resources;

use App\Containers\Designer\UI\API\Resources\DesignerResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'designer_id' => $this->designer_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'category' => $this->category,
            'size' => $this->size,
            'color' => $this->color,
            'stock_quantity' => $this->stock_quantity,
            'is_signature' => $this->is_signature,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations
            'designer' => $this->whenLoaded('designer', function () {
                return new DesignerResource($this->designer);
            }),
            'images' => $this->whenLoaded('images', function () {
                return ItemImageResource::collection($this->images);
            }),

            // Counts
            'images_count' => $this->whenCounted('images'),
        ];
    }
}
