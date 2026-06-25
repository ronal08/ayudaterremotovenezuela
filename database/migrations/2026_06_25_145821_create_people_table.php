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
        Schema::create('people', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->integer('age')->nullable();
            $table->string('gender')->nullable(); // Masculino, Femenino, Otro
            $table->string('last_seen_location');
            $table->dateTime('last_seen_at');
            $table->text('distinctive_features')->nullable();
            $table->string('photo_path')->nullable();
            $table->enum('status', ['missing', 'found'])->default('missing'); // 'missing' = Sin contacto, 'found' = Localizado
            $table->string('reporter_name');
            $table->string('reporter_phone');
            $table->string('reporter_email')->nullable();
            $table->string('reporter_relationship');
            $table->boolean('show_reporter_info')->default(false);
            $table->string('security_pin'); // Hashed code for updates
            $table->boolean('is_verified')->default(false); // Sello verificado por administradores
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('people');
    }
};
