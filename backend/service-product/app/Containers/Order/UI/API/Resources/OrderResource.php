<?php

namespace App\Containers\Order\UI\API\Resources;

use App\Containers\User\UI\API\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'subtotal' => $this->subtotal,
            'delivery_price' => $this->delivery_price,
            'total_price' => $this->total_price,
            'shipping_address' => $this->shipping_address,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Relations
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'items' => $this->whenLoaded('orderItems', function () {
                return OrderItemResource::collection($this->orderItems);
            }),

            // Counts
            'items_count' => $this->whenCounted('orderItems'),
        ];
    }
}
