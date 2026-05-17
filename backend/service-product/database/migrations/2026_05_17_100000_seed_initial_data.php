<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        (new \Database\Seeders\DesignerSeeder())->run();
        (new \Database\Seeders\ItemSeeder())->run();
    }

    public function down(): void
    {
        DB::table('item_images')->delete();
        DB::table('items')->delete();
        DB::table('designers')->delete();
    }
};
