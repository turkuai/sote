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
        Schema::create('patient_sectors', function (Blueprint $table) {
            $table->foreignId('patient_id')->constrained('patients')->onDelete('restrict');
            $table->foreignId('sector_id')->constrained('sectors')->onDelete('restrict');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['patient_id', 'sector_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_sectors');
    }
};
