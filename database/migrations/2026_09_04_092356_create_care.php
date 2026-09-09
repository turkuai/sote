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
        Schema::create('care_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_category_id')->nullable();
            $table->string('name', 100);
            $table->string('description', 1000);
            $table->timestamps();

            $table->foreign('parent_category_id', 'fk_care_categories_parent_id')
                ->references('id')
                ->on('care_categories')
                ->nullOnDelete();
        });

        Schema::create('care_problems', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('author_id');
            $table->unsignedBigInteger('patient_id');
            $table->string('description', 1000);
            $table->timestamps();

            $table->foreign('category_id', 'fk_patient_category')
                ->references('id')
                ->on('care_categories');

            $table->foreign('author_id', 'fk_author_id')
                ->references('id')
                ->on('users');

            $table->foreign('patient_id', 'fk_patient_id')
                ->references('id')
                ->on('patients');
        });

        Schema::create('care_problem_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('problem_id');
            $table->string('description', 1000);
            $table->unsignedBigInteger('author_id');
            $table->enum('type', ['0', '1', '2']);
            $table->timestamps();

            $table->foreign('problem_id', 'fk_care_problem_id')
                ->references('id')
                ->on('care_problems');

            $table->foreign('author_id', 'fk_user_id')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::dropIfExists('care_problem_items');
        Schema::dropIfExists('care_problem');
        Schema::dropIfExists('care_categories');

        Schema::enableForeignKeyConstraints();
    }
};
