<?php

namespace App\Containers\Cart\UI\API\Resources;

use App\Containers\Item\UI\API\Resources\ItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
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
            'cart_id' => $this->cart_id,
            'item_id' => $this->item_id,
            'quantity' => $this->quantity,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations
            'item' => $this->whenLoaded('item', function () {
                return new ItemResource($this->item);
            }),

            // Computed
            'subtotal' => $this->when(
                $this->relationLoaded('item'),
                fn() => (float) $this->item->price * $this->quantity
            ),
        ];
    }
}
