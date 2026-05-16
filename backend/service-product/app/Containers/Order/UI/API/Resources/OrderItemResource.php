<?php

namespace App\Containers\Order\UI\API\Resources;

use App\Containers\Item\UI\API\Resources\ItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'order_id' => $this->order_id,
            'item_id' => $this->item_id,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'created_at' => $this->created_at?->toISOString(),

            // Relations
            'item' => $this->whenLoaded('item', function () {
                return new ItemResource($this->item);
            }),

            // Computed
            'subtotal' => (float) $this->price * $this->quantity,
        ];
    }
}
