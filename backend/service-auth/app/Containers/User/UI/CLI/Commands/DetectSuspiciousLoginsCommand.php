<?php

namespace app\Containers\User\UI\CLI\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

class DetectSuspiciousLoginsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:detect-suspicious-logins
                            {--threshold=5 : Number of failed attempts before blocking}
                            {--window=15 : Time window in minutes to check attempts}
                            {--block-duration=60 : Block duration in minutes}
                            {--dry-run : Run without actually blocking IPs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Detect and block suspicious login attempts based on failed login patterns';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $threshold = (int) $this->option('threshold');
        $window = (int) $this->option('window');
        $blockDuration = (int) $this->option('block-duration');
        $dryRun = $this->option('dry-run');

        $this->info("Detecting suspicious login attempts (threshold: {$threshold} failures in {$window} minutes)...");

        // Get all IPs with failed login attempts
        $redis = Redis::connection();
        $pattern = 'failed_login:*';
        $keys = $redis->keys($pattern);

        if (empty($keys)) {
            $this->info('No failed login attempts found.');
            return self::SUCCESS;
        }

        $suspiciousIps = [];
        $currentTime = now()->timestamp;

        foreach ($keys as $key) {
            // Key format: failed_login:{ip}
            $ip = str_replace('failed_login:', '', $key);

            // Get all timestamps for this IP
            $attempts = $redis->lrange($key, 0, -1);

            if (empty($attempts)) {
                continue;
            }

            // Filter attempts within the time window
            $recentAttempts = array_filter($attempts, function ($timestamp) use ($currentTime, $window) {
                return ($currentTime - $timestamp) <= ($window * 60);
            });

            $attemptCount = count($recentAttempts);

            if ($attemptCount >= $threshold) {
                // Check if already blocked
                $blockedKey = "blocked_ip:{$ip}";
                $isBlocked = $redis->exists($blockedKey);

                $suspiciousIps[] = [
                    'ip' => $ip,
                    'attempts' => $attemptCount,
                    'status' => $isBlocked ? 'Already Blocked' : 'New',
                    'is_blocked' => (bool) $isBlocked,
                ];
            }
        }

        if (empty($suspiciousIps)) {
            $this->info('No suspicious IPs detected.');
            return self::SUCCESS;
        }

        $this->warn("Found " . count($suspiciousIps) . " suspicious IP(s):");

        $this->table(
            ['IP Address', 'Failed Attempts', 'Status'],
            array_map(function ($data) {
                return [
                    $data['ip'],
                    $data['attempts'],
                    $data['status'],
                ];
            }, $suspiciousIps)
        );

        if ($dryRun) {
            $this->comment('DRY RUN: No IPs were blocked.');
            Log::info("Dry run: Would block " . count($suspiciousIps) . " suspicious IPs", [
                'ips' => array_column($suspiciousIps, 'ip'),
                'threshold' => $threshold,
                'window' => $window,
            ]);
            return self::SUCCESS;
        }

        // Block new suspicious IPs
        $newBlocks = 0;
        $alreadyBlocked = 0;

        foreach ($suspiciousIps as $data) {
            if ($data['is_blocked']) {
                $alreadyBlocked++;
                continue;
            }

            try {
                $blockedKey = "blocked_ip:{$data['ip']}";
                $redis->setex($blockedKey, $blockDuration * 60, $currentTime);

                $newBlocks++;
                $this->line("  Blocked IP: {$data['ip']} ({$data['attempts']} attempts) for {$blockDuration} minutes");

                Log::warning("IP blocked due to suspicious login activity", [
                    'ip' => $data['ip'],
                    'failed_attempts' => $data['attempts'],
                    'block_duration_minutes' => $blockDuration,
                ]);
            } catch (\Exception $e) {
                $this->error("  Failed to block IP {$data['ip']}: {$e->getMessage()}");
                Log::error("Failed to block suspicious IP", [
                    'ip' => $data['ip'],
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("Successfully blocked {$newBlocks} new IP(s).");

        if ($alreadyBlocked > 0) {
            $this->info("{$alreadyBlocked} IP(s) were already blocked.");
        }

        Log::info("Suspicious login detection completed", [
            'total_suspicious' => count($suspiciousIps),
            'newly_blocked' => $newBlocks,
            'already_blocked' => $alreadyBlocked,
            'threshold' => $threshold,
            'window_minutes' => $window,
            'block_duration_minutes' => $blockDuration,
        ]);

        return self::SUCCESS;
    }
}
