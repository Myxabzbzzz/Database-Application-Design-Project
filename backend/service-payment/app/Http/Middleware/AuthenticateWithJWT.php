<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateWithJWT
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $payload = $this->decodeHS256($token, env('JWT_SECRET'));
            $request->merge([
                'auth_user_id' => (int) $payload->sub,
                'auth_role'    => $payload->role ?? 'customer',
            ]);
        } catch (\Throwable) {
            return response()->json(['message' => 'Invalid or expired token'], 401);
        }

        return $next($request);
    }

    private function decodeHS256(string $token, string $secret): object
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            throw new \RuntimeException('Malformed token');
        }

        [$header, $payload, $signature] = $parts;

        $expected = rtrim(strtr(base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true)), '+/', '-_'), '=');
        if (! hash_equals($expected, $signature)) {
            throw new \RuntimeException('Invalid signature');
        }

        $data = json_decode(base64_decode(strtr($payload, '-_', '+/')));
        if (! $data) {
            throw new \RuntimeException('Invalid payload');
        }

        if (isset($data->exp) && $data->exp < time()) {
            throw new \RuntimeException('Token expired');
        }

        return $data;
    }
}
