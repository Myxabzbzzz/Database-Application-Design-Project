<?php

namespace app\Containers\Order\Models;

use App\Containers\User\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $status
 * @property float $subtotal
 * @property float $delivery_price
 * @property float $total_price
 * @property string $shipping_address
 * @property Carbon $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static Builder|Order query()
 * @method static Builder|Order newModelQuery()
 * @method static Builder|Order newQuery()
 */
class Order extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'delivery_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    /**
     * Get the user that owns the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the order items for the order.
     */
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
