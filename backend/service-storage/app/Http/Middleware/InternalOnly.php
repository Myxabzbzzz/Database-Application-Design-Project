<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InternalOnly
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = env('INTERNAL_TOKEN');

        if (! $token || $request->header('X-Internal-Token') !== $token) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
