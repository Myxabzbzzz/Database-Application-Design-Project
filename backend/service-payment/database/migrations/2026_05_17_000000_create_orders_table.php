<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('email');
            $table->string('name');
            $table->json('items');
            $table->unsignedInteger('amount');
            $table->string('currency', 3)->default('usd');
            $table->enum('status', ['pending', 'paid', 'failed', 'cancelled'])->default('pending');
            $table->string('stripe_payment_intent_id')->unique()->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
