<?php

namespace app\Containers\User\Middlewares;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\Response;

class CheckBlockedIp
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $redis = Redis::connection();
        $blockedKey = "blocked_ip:{$ip}";

        if ($redis->exists($blockedKey)) {
            $ttl = $redis->ttl($blockedKey);
            $minutes = ceil($ttl / 60);

            return response()->json([
                'error' => 'Too many failed login attempts',
                'message' => "Your IP has been temporarily blocked due to suspicious activity. Please try again in {$minutes} minute(s).",
                'blocked_until_minutes' => $minutes,
            ], 429);
        }

        return $next($request);
    }
}
