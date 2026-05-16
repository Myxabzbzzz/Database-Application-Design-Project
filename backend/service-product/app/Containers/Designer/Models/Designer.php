<?php

namespace App\Containers\Designer\Models;

use App\Containers\Item\Models\Item;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'slug', 'description', 'avatar_url', 'banner_url'])]
class Designer extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    /**
     * Get the items for the designer.
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
}
