<?php

namespace app\Containers\Order\UI\CLI\Commands;

use App\Containers\Order\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CancelPendingOrdersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:cancel-pending
                            {--hours=24 : Number of hours after which pending orders are cancelled}
                            {--restore-stock : Restore stock quantity for cancelled items}
                            {--dry-run : Run without actually cancelling}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel orders that have been in pending status for too long';

    /**
     * Execute the console command.
     * @throws \Throwable
     */
    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $restoreStock = $this->option('restore-stock');
        $dryRun = $this->option('dry-run');
        $cutoffTime = now()->subHours($hours);

        $this->info("Searching for pending orders older than {$hours} hours (before {$cutoffTime->format('Y-m-d H:i:s')})...");

        // Find pending orders created before cutoff time
        $orders = Order::query()->where('status', 'pending')
            ->where('created_at', '<', $cutoffTime)
            ->with(['orderItems.item', 'user'])
            ->get();

        $count = $orders->count();

        if ($count === 0) {
            $this->info('No pending orders found to cancel.');
            return self::SUCCESS;
        }

        $this->warn("Found {$count} pending order(s) to cancel:");

        // Calculate statistics
        $totalAmount = $orders->sum('total_price');

        // Display orders table
        $this->table(
            ['Order ID', 'User Email', 'Items Count', 'Total Price', 'Created At', 'Age'],
            $orders->map(function ($order) {
                return [
                    substr($order->id, 0, 12) . '...',
                    $order->user->email ?? 'N/A',
                    $order->orderItems->count(),
                    '$' . number_format($order->total_price, 2),
                    $order->created_at->format('Y-m-d H:i'),
                    $order->created_at->diffForHumans(null, true),
                ];
            })
        );

        $this->newLine();
        $this->info("Total amount to cancel: $" . number_format($totalAmount, 2));

        if ($restoreStock) {
            $this->info("Stock restoration is ENABLED");
        }

        if ($dryRun) {
            $this->comment('DRY RUN: No orders were cancelled.');
            Log::info("Dry run: Would cancel {$count} pending orders", [
                'order_ids' => $orders->pluck('id')->toArray(),
                'total_amount' => $totalAmount,
                'restore_stock' => $restoreStock,
            ]);
            return self::SUCCESS;
        }

        // Confirm cancellation
        if (!$this->confirm('Do you want to cancel these orders?', true)) {
            $this->comment('Cancellation aborted.');
            return self::SUCCESS;
        }

        // Cancel orders
        $cancelled = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($orders as $order) {
                try {
                    // Restore stock if enabled
                    if ($restoreStock) {
                        foreach ($order->orderItems as $orderItem) {
                            if ($orderItem->item) {
                                $orderItem->item->increment('stock_quantity', $orderItem->quantity);
                            }
                        }
                    }

                    // Update order status to cancelled
                    $order->status = 'cancelled';
                    $order->save();

                    $cancelled++;
                    $stockInfo = $restoreStock ? ' (stock restored)' : '';
                    $this->line("  ✓ Cancelled: Order #{$order->id} - \${$order->total_price}{$stockInfo}");
                } catch (\Exception $e) {
                    $errors[] = [
                        'order_id' => $order->id,
                        'error' => $e->getMessage(),
                    ];
                    $this->error("  ✗ Failed to cancel order #{$order->id}: {$e->getMessage()}");
                }
            }

            DB::commit();

            $this->newLine();
            $this->info("Successfully cancelled {$cancelled} pending order(s).");

            if (!empty($errors)) {
                $this->warn( count($errors) . " order(s) failed to cancel.");
            }

            Log::info("Cancelled pending orders", [
                'count' => $cancelled,
                'hours' => $hours,
                'cutoff_time' => $cutoffTime->toDateTimeString(),
                'total_amount' => $totalAmount,
                'restore_stock' => $restoreStock,
                'errors' => $errors,
            ]);

            return self::SUCCESS;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Transaction failed: {$e->getMessage()}");
            Log::error("Failed to cancel pending orders", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return self::FAILURE;
        }
    }
}
