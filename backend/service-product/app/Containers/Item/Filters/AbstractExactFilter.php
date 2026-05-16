<?php
declare(strict_types=1);

namespace App\Containers\Item\Filters;

use Illuminate\Database\Eloquent\Builder;

abstract class AbstractExactFilter
{
    abstract public function filter(Builder $builder, mixed $value): void;

    abstract public function getBindingName(): string;
}
