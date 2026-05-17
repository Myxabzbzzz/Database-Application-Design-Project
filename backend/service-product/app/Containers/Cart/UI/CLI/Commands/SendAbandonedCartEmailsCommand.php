<?php

namespace app\Containers\Cart\UI\CLI\Commands;

use App\Containers\Cart\Mail\AbandonedCartReminder;
use App\Containers\Cart\Models\Cart;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendAbandonedCartEmailsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'carts:send-abandoned-reminders
                            {--min-hours=24 : Minimum hours of inactivity before sending reminder}
                            {--max-hours=48 : Maximum hours of inactivity (don\'t remind after this)}
                            {--dry-run : Run without actually sending emails}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders to users who have abandoned their shopping carts';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $minHours = (int) $this->option('min-hours');
        $maxHours = (int) $this->option('max-hours');
        $dryRun = $this->option('dry-run');

        $minTime = now()->subHours($maxHours);
        $maxTime = now()->subHours($minHours);

        $this->info("Searching for abandoned carts between {$minHours}-{$maxHours} hours of inactivity...");

        // Find carts with items that haven't been updated recently
        // and haven't been reminded yet (or reminded more than 7 days ago)
        $carts = Cart::query()->with(['cartItems.item.itemImages', 'user'])
            ->whereHas('cartItems') // Must have items
            ->where('updated_at', '>=', $minTime)
            ->where('updated_at', '<=', $maxTime)
            ->where(function ($query) {
                $query->whereNull('reminded_at')
                    ->orWhere('reminded_at', '<', now()->subDays(7));
            })
            ->get();

        $count = $carts->count();

        if ($count === 0) {
            $this->info('No abandoned carts found to remind.');
            return self::SUCCESS;
        }

        $this->warn("Found {$count} abandoned cart(s) to remind:");

        // Prepare cart data for display
        $tableData = [];
        foreach ($carts as $cart) {
            $itemCount = $cart->cartItems->count();
            $totalPrice = $cart->cartItems->sum(function ($cartItem) {
                return $cartItem->item->price * $cartItem->quantity;
            });

            $tableData[] = [
                substr($cart->id, 0, 12) . '...',
                $cart->user->email,
                $cart->user->name,
                $itemCount,
                '$' . number_format($totalPrice, 2),
                $cart->updated_at->format('Y-m-d H:i'),
                $cart->updated_at->diffForHumans(null, true),
            ];
        }

        $this->table(
            ['Cart ID', 'Email', 'Name', 'Items', 'Total Value', 'Last Update', 'Age'],
            $tableData
        );

        if ($dryRun) {
            $this->comment('DRY RUN: No emails were sent.');
            Log::info("Dry run: Would send {$count} abandoned cart reminders", [
                'cart_ids' => $carts->pluck('id')->toArray(),
            ]);
            return self::SUCCESS;
        }

        // Confirm sending
        if (!$this->confirm('Do you want to send reminder emails?', true)) {
            $this->comment('Email sending cancelled.');
            return self::SUCCESS;
        }

        // Send emails
        $sent = 0;
        $failed = 0;

        foreach ($carts as $cart) {
            try {
                // Prepare cart data
                $cartData = $this->prepareCartData($cart);

                // Send email
                Mail::to($cart->user->email)->send(
                    new AbandonedCartReminder($cart, $cartData)
                );

                // Update reminded_at timestamp
                $cart->reminded_at = now();
                $cart->save();

                $sent++;
                $this->line("  Sent to: {$cart->user->email} ({$cartData['itemCount']} items, \${$cartData['totalPrice']})");
            } catch (\Exception $e) {
                $failed++;
                $this->error("  Failed to send to {$cart->user->email}: {$e->getMessage()}");
                Log::error("Failed to send abandoned cart email", [
                    'cart_id' => $cart->id,
                    'user_email' => $cart->user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Successfully sent {$sent} reminder email(s).");

        if ($failed > 0) {
            $this->warn("{$failed} email(s) failed to send.");
        }

        Log::info("Sent abandoned cart reminders", [
            'sent' => $sent,
            'failed' => $failed,
            'min_hours' => $minHours,
            'max_hours' => $maxHours,
        ]);

        return self::SUCCESS;
    }

    /**
     * Prepare cart data for email template
     */
    private function prepareCartData(Cart $cart): array
    {
        $items = [];
        $totalPrice = 0;

        foreach ($cart->cartItems as $cartItem) {
            $item = $cartItem->item;
            $subtotal = $item->price * $cartItem->quantity;
            $totalPrice += $subtotal;

            $items[] = [
                'name' => $item->name,
                'price' => $item->price,
                'quantity' => $cartItem->quantity,
                'subtotal' => $subtotal,
                'image_url' => $item->itemImages->first()?->url ?? null,
                'size' => $item->size,
                'color' => $item->color,
            ];
        }

        return [
            'items' => $items,
            'itemCount' => count($items),
            'totalPrice' => number_format($totalPrice, 2),
        ];
    }
}
