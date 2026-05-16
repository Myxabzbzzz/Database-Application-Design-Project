<?php

namespace App\Containers\Item\UI\API\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:items,slug',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'size' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'category' => 'required|string|max:100',
            'designer_id' => 'nullable|exists:designers,id',
            'stock_quantity' => 'nullable|integer|min:0',
            'is_signature' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ];
    }
}
