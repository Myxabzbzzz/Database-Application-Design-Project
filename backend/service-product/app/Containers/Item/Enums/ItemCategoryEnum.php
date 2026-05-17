<?php

namespace App\Containers\Item\Enums;

enum ItemCategoryEnum: string
{
    case OUTERWEAR = 'Outerwear';
    case KNITWEAR = 'Knitwear';
    case TAILORING = 'Tailoring';
    case ACCESSORIES = 'Accessories';

    /**
     * Get all values as array.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all values as comma-separated string for validation.
     */
    public static function valuesAsString(): string
    {
        return implode(',', self::values());
    }

    /**
     * Get label for display.
     */
    public function label(): string
    {
        return match($this) {
            self::OUTERWEAR => 'Верхняя одежда',
            self::KNITWEAR => 'Трикотаж',
            self::TAILORING => 'Костюмы и пошив',
            self::ACCESSORIES => 'Аксессуары',
        };
    }

    /**
     * Get description.
     */
    public function description(): string
    {
        return match($this) {
            self::OUTERWEAR => 'Пальто, куртки, плащи и другая верхняя одежда',
            self::KNITWEAR => 'Свитера, кардиганы, вязаные изделия',
            self::TAILORING => 'Костюмы, пиджаки, брюки, сорочки',
            self::ACCESSORIES => 'Сумки, обувь, ремни и другие аксессуары',
        };
    }

    /**
     * Try to get enum from string value.
     */
    public static function tryFromValue(string $value): ?self
    {
        return self::tryFrom($value);
    }
}
