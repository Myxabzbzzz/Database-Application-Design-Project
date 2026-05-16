<?php

namespace App\Containers\Item\Models;

use App\Containers\Cart\Models\CartItem;
use App\Containers\Designer\Models\Designer;
use App\Containers\Merchant\Filters\ItemFilters;
use App\Containers\Order\Models\OrderItem;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;

#[Fillable([
    'designer_id',
    'name',
    'slug',
    'description',
    'price',
    'category',
    'size',
    'color',
    'stock_quantity',
    'is_signature',
    'is_active'
])]
class Item extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock_quantity' => 'integer',
            'is_signature' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the designer that owns the item.
     */
    public function designer(): BelongsTo
    {
        return $this->belongsTo(Designer::class);
    }

    /**
     * Get the images for the item.
     */
    public function images(): HasMany
    {
        return $this->hasMany(ItemImage::class)->orderBy('sort_order');
    }

    /**
     * Get the cart items for this item.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the order items for this item.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeFilterRequest(Builder $builder, Request $request, array $filters = []): Builder
    {
        return (new ItemFilters($request, $builder))->execute($filters);
    }
}
