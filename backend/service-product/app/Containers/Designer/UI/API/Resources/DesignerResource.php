<?php

namespace App\Containers\Designer\UI\API\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DesignerResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'avatar_url' => $this->avatar_url,
            'banner_url' => $this->banner_url,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations
            'items' => $this->whenLoaded('items', function () {
                return \App\Containers\Item\UI\API\Resources\ItemResource::collection($this->items);
            }),

            // Counts
            'items_count' => $this->whenCounted('items'),
        ];
    }
}
