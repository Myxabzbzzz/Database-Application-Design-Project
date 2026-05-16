<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Event;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Stripe\Webhook;

class PaymentController extends Controller
{
    public function checkout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items'            => 'required|array|min:1',
            'items.*.name'     => 'required|string',
            'items.*.price'    => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|max:255',
        ]);

        $amount = (int) round(
            collect($validated['items'])->sum(
                fn ($item) => $item['price'] * $item['quantity'] * 100
            )
        );

        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        $intent = PaymentIntent::create([
            'amount'   => $amount,
            'currency' => 'usd',
            'metadata' => ['user_id' => $request->auth_user_id],
        ]);

        $order = Order::create([
            'user_id'                  => $request->auth_user_id,
            'email'                    => $validated['email'],
            'name'                     => $validated['name'],
            'items'                    => $validated['items'],
            'amount'                   => $amount,
            'currency'                 => 'usd',
            'status'                   => 'pending',
            'stripe_payment_intent_id' => $intent->id,
        ]);

        return response()->json([
            'client_secret' => $intent->client_secret,
            'order_id'      => $order->id,
        ]);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = $secret
                ? Webhook::constructEvent($payload, $sigHeader, $secret)
                : Event::constructFrom(json_decode($payload, true));
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        match ($event->type) {
            'payment_intent.succeeded' => Order::where('stripe_payment_intent_id', $event->data->object->id)
                ->update(['status' => 'paid']),
            'payment_intent.payment_failed' => Order::where('stripe_payment_intent_id', $event->data->object->id)
                ->update(['status' => 'failed']),
            default => null,
        };

        return response()->json(['received' => true]);
    }

    public function orders(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->auth_user_id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }
}
