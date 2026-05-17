<?php

declare(strict_types=1);

namespace App\Containers\Merchant\Filters;

use Illuminate\Database\Eloquent\Builder;

class ItemNameFilter extends AbstractExactFilter
{
    public function filter(Builder $builder, mixed $value): void
    {
        $builder->where('name', 'ilike', '%' . $value . '%');
    }

    public function getBindingName(): string
    {
        return 'q';
    }
}
