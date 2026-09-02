<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the fields used by the current Patient model without removing the
     * legacy patient columns that may still be needed elsewhere.
     */
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('first_name');
            $table->string('last_name');
            $table->string('social_id', 11);
            $table->timestamp('arrival_date')->nullable();
            $table->text('remarks')->nullable();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migration.
     */
    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropColumn([
                'first_name',
                'last_name',
                'social_id',
                'arrival_date',
                'remarks',
            ]);
        });
    }
};
