<?php

namespace App\Containers\Designer\UI\API\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDesignerRequest extends FormRequest
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
            'slug' => 'required|string|max:255|unique:designers,slug',
            'description' => 'nullable|string',
            'avatar_url' => 'nullable|url|max:2048',
            'banner_url' => 'nullable|url|max:2048',
        ];
    }
}
