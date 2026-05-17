<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->char('id', 26)->primary();
            $table->char('designer_id', 26)->nullable();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('category', 100);
            $table->string('size', 50)->nullable();
            $table->string('color', 50)->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_signature')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('designer_id')
                ->references('id')
                ->on('designers')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
