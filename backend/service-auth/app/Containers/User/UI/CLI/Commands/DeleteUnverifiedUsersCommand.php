<?php

namespace app\Containers\User\UI\CLI\Commands;

use App\Containers\User\Models\User;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Log;

class DeleteUnverifiedUsersCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:delete-unverified {--days=7 : Number of days after which unverified users are deleted} {--dry-run : Run without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete users who have not verified their email after specified number of days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $dryRun = $this->option('dry-run');
        $cutoffDate = now()->subDays($days);

        $this->info("Searching for unverified users older than {$days} days (before {$cutoffDate->format('Y-m-d H:i:s')})...");

        // Find unverified users created before cutoff date
        /** @var Builder<User> $query */
        $query = User::query();
        $users = $query->whereNull('email_verified_at')
            ->where('created_at', '<', $cutoffDate)
            ->get();

        $count = $users->count();

        if ($count === 0) {
            $this->info('No unverified users found to delete.');
            return self::SUCCESS;
        }

        $this->warn("Found {$count} unverified user(s) to delete:");

        // Display user table
        $this->table(
            ['ID', 'Email', 'Name', 'Created At', 'Age (days)'],
            $users->map(function ($user) {
                return [
                    substr($user->id, 0, 12) . '...',
                    $user->email,
                    $user->name,
                    $user->created_at->format('Y-m-d H:i'),
                    $user->created_at->diffInDays(now()) . ' days',
                ];
            })
        );

        if ($dryRun) {
            $this->comment('DRY RUN: No users were deleted.');
            Log::info("Dry run: Would delete {$count} unverified users", [
                'emails' => $users->pluck('email')->toArray(),
            ]);
            return self::SUCCESS;
        }

        // Confirm deletion
        if (!$this->confirm('Do you want to delete these users?', true)) {
            $this->comment('Deletion cancelled.');
            return self::SUCCESS;
        }

        // Delete users
        $deleted = 0;
        foreach ($users as $user) {
            try {
                $user->delete();
                $deleted++;
                $this->line("Deleted: {$user->email}");
            } catch (\Exception $e) {
                $this->error("Failed to delete {$user->email}: {$e->getMessage()}");
                Log::error("Failed to delete unverified user", [
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Successfully deleted {$deleted} unverified user(s).");

        Log::info("Deleted unverified users", [
            'count' => $deleted,
            'days' => $days,
            'cutoff_date' => $cutoffDate->toDateTimeString(),
        ]);

        return self::SUCCESS;
    }
}
