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
        Schema::create('volunteers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('phone', 50);
            $table->string('vehicle_type', 50); // Motocicleta, Carro, Camioneta, Camión
            $table->string('vehicle_model', 100)->nullable();
            $table->string('state', 100);
            $table->string('municipality', 100);
            $table->text('notes')->nullable();
            $table->string('status', 50)->default('Disponible'); // Disponible, En misión, No disponible
            $table->boolean('is_verified')->default(false);
            $table->string('security_pin', 60); // Hashed PIN
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('volunteers');
    }
};
