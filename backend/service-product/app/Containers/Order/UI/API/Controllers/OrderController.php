<?php

namespace App\Containers\Order\UI\API\Controllers;

use App\Containers\Cart\Models\Cart;
use App\Containers\Order\Models\Order;
use App\Containers\Order\Models\OrderItem;
use App\Containers\Order\UI\API\Resources\OrderResource;
use App\Ship\Parents\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['orderItems.item.designer'])
            ->withCount('orderItems')
            ->orderByDesc('created_at')
            ->paginate((int) $request->query('per_page', 15));

        return OrderResource::collection($orders);
    }

    /**
     * Create a new order from cart.
     */
    public function store(Request $request): OrderResource
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string|max:1000',
            'delivery_price' => 'required|numeric|min:0',
        ]);

        $cart = Cart::query()
            ->where('user_id', $request->user()->id)
            ->with('cartItems.item')
            ->firstOrFail();

        if ($cart->cartItems->isEmpty()) {
            abort(422, 'Cart is empty');
        }

        // Calculate totals
        $subtotal = $cart->cartItems->sum(function ($cartItem) {
            return (float) $cartItem->item->price * $cartItem->quantity;
        });

        $totalPrice = $subtotal + (float) $validated['delivery_price'];

        // Create order
        $order = Order::create([
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'subtotal' => $subtotal,
            'delivery_price' => $validated['delivery_price'],
            'total_price' => $totalPrice,
            'shipping_address' => $validated['shipping_address'],
        ]);

        // Create order items from cart items
        foreach ($cart->cartItems as $cartItem) {
            OrderItem::create([
                'order_id' => $order->id,
                'item_id' => $cartItem->item_id,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->item->price,
            ]);
        }

        // Clear cart
        $cart->cartItems()->delete();

        $order->load(['orderItems.item.designer', 'user']);
        $order->loadCount('orderItems');

        return new OrderResource($order);
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, string $id): OrderResource
    {
        $order = Order::query()
            ->where('user_id', $request->user()->id)
            ->with(['orderItems.item.designer', 'user'])
            ->withCount('orderItems')
            ->findOrFail($id);

        return new OrderResource($order);
    }

    /**
     * Cancel an order (only if pending).
     */
    public function cancel(Request $request, string $id): OrderResource
    {
        $order = Order::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'pending')
            ->findOrFail($id);

        $order->update(['status' => 'cancelled']);

        $order->load(['orderItems.item.designer', 'user']);
        $order->loadCount('orderItems');

        return new OrderResource($order);
    }
}
