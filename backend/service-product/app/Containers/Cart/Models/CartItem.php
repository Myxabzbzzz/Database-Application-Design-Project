<?php

namespace App\Containers\Cart\Models;

use App\Containers\Item\Models\Item;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['cart_id', 'item_id', 'quantity'])]
class CartItem extends Model
{
    use HasFactory, HasUlids;

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
        ];
    }

    /**
     * Get the cart that owns the cart item.
     */
    public function cart(): BelongsTo
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the item that belongs to the cart item.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
