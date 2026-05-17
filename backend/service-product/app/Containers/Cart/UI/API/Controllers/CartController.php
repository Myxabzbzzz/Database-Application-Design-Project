<?php

namespace App\Containers\Cart\UI\API\Controllers;

use App\Containers\Cart\Models\Cart;
use App\Containers\Cart\Models\CartItem;
use App\Containers\Cart\UI\API\Resources\CartResource;
use App\Ship\Parents\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartController extends Controller
{
    private function userId(): string
    {
        return auth('api')->id();
    }

    private function loadCart(Cart $cart): Cart
    {
        $cart->load(['cartItems.item.designer', 'cartItems.item.images']);
        $cart->loadCount('cartItems');
        return $cart;
    }

    /**
     * Display the authenticated user's cart.
     */
    public function show(Request $request): CartResource
    {
        $cart = Cart::firstOrCreate(['user_id' => $this->userId()]);
        return new CartResource($this->loadCart($cart));
    }

    /**
     * Add item to cart.
     */
    public function addItem(Request $request): CartResource
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::firstOrCreate(['user_id' => $this->userId()]);

        CartItem::updateOrCreate(
            ['cart_id' => $cart->id, 'item_id' => $validated['item_id']],
            ['quantity' => $validated['quantity']]
        );

        return new CartResource($this->loadCart($cart));
    }

    /**
     * Update cart item quantity.
     */
    public function updateItem(Request $request, string $cartItemId): CartResource
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $userId = $this->userId();
        $cartItem = CartItem::query()
            ->whereHas('cart', fn($q) => $q->where('user_id', $userId))
            ->findOrFail($cartItemId);

        $cartItem->update($validated);

        return new CartResource($this->loadCart($cartItem->cart));
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(Request $request, string $cartItemId): Response
    {
        $userId = $this->userId();
        CartItem::query()
            ->whereHas('cart', fn($q) => $q->where('user_id', $userId))
            ->findOrFail($cartItemId)
            ->delete();

        return response()->noContent();
    }

    /**
     * Clear the cart.
     */
    public function clear(Request $request): Response
    {
        Cart::where('user_id', $this->userId())->first()?->cartItems()->delete();

        return response()->noContent();
    }
}
