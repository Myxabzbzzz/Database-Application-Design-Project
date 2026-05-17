<?php

namespace app\Containers\Cart\Models;

use App\Containers\User\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id'])]

/**
 * @property int $id
 * @property int user_id
 * @method static Builder|Cart query()
 * @method static Builder|Cart newModelQuery()
 * @method static Builder|Cart newQuery()
 */

class Cart extends Model
{
    use HasFactory, HasUlids;

    /**
     * Get the user that owns the cart.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the cart items for the cart.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}
