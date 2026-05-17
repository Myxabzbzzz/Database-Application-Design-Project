<?php

namespace app\Containers\User\Helpers;

use Illuminate\Support\Facades\Redis;

class FailedLoginTracker
{
    /**
     * Record a failed login attempt
     */
    public static function record(string $ip): void
    {
        $redis = Redis::connection();
        $key = "failed_login:{$ip}";
        $timestamp = now()->timestamp;

        // Add timestamp to list
        $redis->rpush($key, $timestamp);

        // Keep only last 100 attempts (prevent memory issues)
        $redis->ltrim($key, -100, -1);

        // Set expiration to 24 hours (cleanup old data)
        $redis->expire($key, 86400);
    }

    /**
     * Clear failed login attempts for an IP (after successful login)
     */
    public static function clear(string $ip): void
    {
        $redis = Redis::connection();
        $key = "failed_login:{$ip}";
        $redis->del($key);
    }

    /**
     * Check if IP is blocked
     */
    public static function isBlocked(string $ip): bool
    {
        $redis = Redis::connection();
        $blockedKey = "blocked_ip:{$ip}";
        return (bool) $redis->exists($blockedKey);
    }

    /**
     * Get remaining block time in minutes
     */
    public static function getBlockTimeRemaining(string $ip): int
    {
        $redis = Redis::connection();
        $blockedKey = "blocked_ip:{$ip}";
        $ttl = $redis->ttl($blockedKey);

        return $ttl > 0 ? (int) ceil($ttl / 60) : 0;
    }
}
