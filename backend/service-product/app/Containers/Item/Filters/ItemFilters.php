<?php

declare(strict_types=1);

namespace App\Containers\Merchant\Filters;

class ItemFilters extends AbstractFilters
{
    protected array $filters = [
        ItemNameFilter::class,
    ];
}
