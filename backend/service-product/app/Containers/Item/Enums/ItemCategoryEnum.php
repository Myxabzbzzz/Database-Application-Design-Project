<?php

namespace App\Containers\Item\Enums;

enum ItemCategoryEnum: string
{
    case DRESSES     = 'Dresses';
    case BLAZERS     = 'Blazers';
    case COATS       = 'Coats';
    case KNITWEAR    = 'Knitwear';
    case TROUSERS    = 'Trousers';
    case BAGS        = 'Bags';
    case FOOTWEAR    = 'Footwear';
    case ACCESSORIES = 'Accessories';

    public function label(): string
    {
        return $this->value;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
