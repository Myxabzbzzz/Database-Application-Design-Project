<?php

namespace App\Containers\Cart\UI\API\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
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
            'user_id' => $this->user_id,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations
            'items' => $this->whenLoaded('cartItems', function () {
                return CartItemResource::collection($this->cartItems);
            }),

            // Counts
            'items_count' => $this->whenCounted('cartItems'),

            // Computed
            'total' => $this->when(
                $this->relationLoaded('cartItems') && $this->cartItems->every->relationLoaded('item'),
                function () {
                    return $this->cartItems->sum(function ($cartItem) {
                        return (float) $cartItem->item->price * $cartItem->quantity;
                    });
                }
            ),
        ];
    }
}
