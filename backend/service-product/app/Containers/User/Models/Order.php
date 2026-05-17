<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'name',
        'items',
        'amount',
        'currency',
        'status',
        'stripe_payment_intent_id',
    ];

    protected $casts = [
        'items' => 'array',
    ];
}
