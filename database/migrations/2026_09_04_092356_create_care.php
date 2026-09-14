<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void {
    Schema::create('care_categories', function (Blueprint $table) {
      $table->id();
      $table->foreignId('parent_category_id')
        ->nullable()
        ->constrained('care_categories')
        ->onDelete('restrict');
      $table->string('name', 100);
      $table->string('description', 1000);
      $table->timestamps();
    });

    Schema::create('care_problems', function (Blueprint $table) {
      $table->id();
      $table->foreignId('category_id')
        ->constrained('care_categories')
        ->onDelete('restrict');
      $table->foreignID('author_id')
        ->constrained('users')
        ->onDelete('restrict');
      $table->foreignID('patient_id')
        ->constrained('patients')
        ->onDelete('restrict');
      $table->string('description', 1000);
      $table->timestamps();
    });

    Schema::create('care_problem_items', function (Blueprint $table) {
      $table->id();
      $table->foreignID('problem_id')
        ->constrained('care_problems')
        ->onDelete('restrict');
      $table->string('description', 1000);
      $table->foreignId('author_id')
        ->constrained('users')
        ->onDelete('restrict');;
      $table->enum('type', ['goal', 'activity', 'review']);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void {
    Schema::dropIfExists('care_problem_items');
    Schema::dropIfExists('care_problem');
    Schema::dropIfExists('care_categories');
  }
};
