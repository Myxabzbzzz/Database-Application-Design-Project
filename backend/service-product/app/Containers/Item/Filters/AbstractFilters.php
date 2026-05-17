<?php

declare(strict_types=1);

namespace App\Containers\Item\Filters;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string[] $filters
 */
abstract class AbstractFilters
{
    protected array $filters = [];

    public function __construct(
        protected Request $request,
        protected Builder $builder
    ) {
    }

    private function getRequestBindings(): array
    {
        $bindings = [];

        foreach ($this->filters as $filterName) {
            /** @var AbstractExactFilter $newFilterName */
            $newFilterName = (new $filterName());

            $filterBindingName = $newFilterName->getBindingName();

            $bindings[$filterBindingName] = $filterName;
        }

        return $bindings;
    }

    /**
     * @param  string[] $filters
     */
    public function execute(array $filters = []): Builder
    {
        $drainedFilters = $this->drainPassedFilters($filters);

        foreach ($drainedFilters as $filterName => $value) {
            if ($value !== null) {
                /** @var AbstractExactFilter $newFilerName */
                $newFilerName = (new $filterName());
                $newFilerName->filter($this->builder, $value);
            }
        }

        return $this->builder;
    }

    /**
     * @property string[] $filters
     * @return string[]
     */
    private function drainPassedFilters(array $filters): array
    {
        $intersected = array_intersect($this->filters, $filters);

        $bindingNames = array_map(function ($filterName) {
            /** @var AbstractExactFilter $newFilterName */
            $newFilterName = (new $filterName());

            return $newFilterName->getBindingName();
        }, $intersected);

        $request = $this->request->only($bindingNames);

        $result = [];

        foreach ($request as $key => $value) {
            $filterName = $this->getRequestBindings()[$key];

            $result[$filterName] = $value;
        }

        return $result;
    }
}
