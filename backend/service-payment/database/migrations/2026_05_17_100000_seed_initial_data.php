<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new \Database\Seeders\DatabaseSeeder())->run();
    }

    public function down(): void
    {
        DB::table('users')->delete();
    }
};
