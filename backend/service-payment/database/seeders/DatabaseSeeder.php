<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /* Seed a test user so payment flows can be tested locally.
           The real users are synced from service-auth on first order. */
        DB::table('users')->upsert(
            [
                [
                    'id'                => '01JTEST000000000000000001A',
                    'name'              => 'Test User',
                    'email'             => 'test@example.com',
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now(),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ],
            ],
            ['email'],
            ['name', 'updated_at']
        );

        $this->command?->info('Payment DB seeded.');
    }
}
