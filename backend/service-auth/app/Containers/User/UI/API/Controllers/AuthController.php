<?php

namespace app\Containers\User\UI\API\Controllers;

use App\Containers\User\Helpers\FailedLoginTracker;
use App\Containers\User\Mail\VerifyEmail;
use App\Containers\User\Models\User;
use App\Ship\Parents\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;
use OpenApi\Attributes as OA;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\JWTGuard;

class AuthController extends Controller
{
    private function guard(): JWTGuard
    {
        return Auth::guard('api');
    }

    private function sendVerificationCode(User $user): void
    {
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        Cache::put("email_verification:{$user->id}", $code, now()->addMinutes(10));
        Mail::to($user->email)->send(new VerifyEmail($code, $user->name));
    }

    #[OA\Post(
        path: '/register',
        summary: 'Register a new user',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'email', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'John Doe'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
                    new OA\Property(property: 'password', type: 'string', minLength: 8, example: 'password123'),
                    new OA\Property(property: 'password_confirmation', type: 'string', example: 'password123'),
                ]
            )
        ),
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'User registered',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'user', type: 'object'),
                        new OA\Property(property: 'token', type: 'string'),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create($data);
        $token = JWTAuth::fromUser($user);

        $this->sendVerificationCode($user);

        return response()->json([
            'user'    => $user,
            'token'   => $token,
            'message' => 'Verification code sent to your email',
        ], 201);
    }

    #[OA\Post(
        path: '/login',
        summary: 'Login and get JWT token',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'john@example.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'password123'),
                ]
            )
        ),
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Authenticated',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string'),
                        new OA\Property(property: 'token_type', type: 'string', example: 'bearer'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Invalid credentials'),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $ip = $request->ip();

        if (! $token = $this->guard()->attempt($credentials)) {
            // Record failed login attempt
            FailedLoginTracker::record($ip);

            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Clear failed login attempts on successful login
        FailedLoginTracker::clear($ip);

        return response()->json(['token' => $token, 'token_type' => 'bearer']);
    }

    #[OA\Post(
        path: '/logout',
        summary: 'Logout (invalidate token)',
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'Logged out'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function logout(): JsonResponse
    {
        $this->guard()->logout();

        return response()->json(['message' => 'Logged out successfully']);
    }

    #[OA\Get(
        path: '/me',
        summary: 'Get current authenticated user',
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'User data'),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function me(): JsonResponse
    {
        return response()->json($this->guard()->user());
    }

    #[OA\Post(
        path: '/refresh',
        summary: 'Refresh JWT token',
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'New token',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'token', type: 'string'),
                        new OA\Property(property: 'token_type', type: 'string', example: 'bearer'),
                    ]
                )
            ),
            new OA\Response(response: 401, description: 'Unauthenticated'),
        ]
    )]
    public function refresh(): JsonResponse
    {
        $token = $this->guard()->refresh();

        return response()->json(['token' => $token, 'token_type' => 'bearer']);
    }

    #[OA\Post(
        path: '/email/verify',
        summary: 'Verify email with 6-digit code',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['code'],
                properties: [
                    new OA\Property(property: 'code', type: 'string', minLength: 6, maxLength: 6, example: '123456'),
                ]
            )
        ),
        tags: ['Email Verification'],
        responses: [
            new OA\Response(response: 200, description: 'Email verified'),
            new OA\Response(response: 422, description: 'Invalid or expired code'),
        ]
    )]
    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate(['code' => ['required', 'string', 'size:6']]);

        $user = $this->guard()->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified']);
        }

        $key    = "email_verification:{$user->id}";
        $stored = Cache::get($key);

        if (! $stored || $stored !== $request->code) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        $user->email_verified_at = now();
        $user->save();
        Cache::forget($key);

        return response()->json(['message' => 'Email verified successfully']);
    }

    #[OA\Post(
        path: '/email/resend',
        summary: 'Resend email verification code',
        security: [['bearerAuth' => []]],
        tags: ['Email Verification'],
        responses: [
            new OA\Response(response: 200, description: 'Code resent'),
            new OA\Response(response: 422, description: 'Email already verified'),
        ]
    )]
    public function resendCode(): JsonResponse
    {
        $user = $this->guard()->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Email already verified'], 422);
        }

        $this->sendVerificationCode($user);

        return response()->json(['message' => 'Verification code resent']);
    }

    #[OA\Put(
        path: '/password',
        summary: 'Change password',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['current_password', 'password', 'password_confirmation'],
                properties: [
                    new OA\Property(property: 'current_password', type: 'string', example: 'password123'),
                    new OA\Property(property: 'password', type: 'string', minLength: 8, example: 'newpassword456'),
                    new OA\Property(property: 'password_confirmation', type: 'string', example: 'newpassword456'),
                ]
            )
        ),
        security: [['bearerAuth' => []]],
        tags: ['Auth'],
        responses: [
            new OA\Response(response: 200, description: 'Password changed'),
            new OA\Response(response: 422, description: 'Current password incorrect'),
        ]
    )]
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $this->guard()->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->update(['password' => $request->password]);

        return response()->json(['message' => 'Password changed successfully']);
    }
}
