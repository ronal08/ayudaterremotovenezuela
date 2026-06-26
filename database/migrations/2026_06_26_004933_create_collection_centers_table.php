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
        Schema::create('collection_centers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->text('address');
            $table->string('state', 100);
            $table->string('municipality', 100);
            $table->string('contact_name', 100);
            $table->string('contact_phone', 50);
            $table->string('location_url', 255)->nullable();
            $table->string('photo_path', 255)->nullable();
            $table->text('needs')->nullable();
            $table->string('status', 50)->default('Activo'); // Activo, Lleno, Inactivo
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
        Schema::dropIfExists('collection_centers');
    }
};
