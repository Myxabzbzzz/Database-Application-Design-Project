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
    /**
     * Display the authenticated user's cart.
     */
    public function show(Request $request): CartResource
    {
        $cart = Cart::query()
            ->with(['cartItems.item.designer', 'cartItems.item.images'])
            ->withCount('cartItems')
            ->firstOrCreate(['user_id' => $request->user()->id]);

        return new CartResource($cart);
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

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $cartItem = CartItem::updateOrCreate(
            [
                'cart_id' => $cart->id,
                'item_id' => $validated['item_id'],
            ],
            [
                'quantity' => $validated['quantity'],
            ]
        );

        $cart->load(['cartItems.item.designer', 'cartItems.item.images']);
        $cart->loadCount('cartItems');

        return new CartResource($cart);
    }

    /**
     * Update cart item quantity.
     */
    public function updateItem(Request $request, string $cartItemId): CartResource
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::query()
            ->whereHas('cart', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->findOrFail($cartItemId);

        $cartItem->update($validated);

        $cart = $cartItem->cart;
        $cart->load(['cartItems.item.designer', 'cartItems.item.images']);
        $cart->loadCount('cartItems');

        return new CartResource($cart);
    }

    /**
     * Remove item from cart.
     */
    public function removeItem(Request $request, string $cartItemId): Response
    {
        $cartItem = CartItem::query()
            ->whereHas('cart', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })
            ->findOrFail($cartItemId);

        $cartItem->delete();

        return response()->noContent();
    }

    /**
     * Clear the cart.
     */
    public function clear(Request $request): Response
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if ($cart) {
            $cart->cartItems()->delete();
        }

        return response()->noContent();
    }
}
