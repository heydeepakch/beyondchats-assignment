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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->longText('content');
            $table->string('source_url')->nullable();
            $table->enum('status', ['original', 'updated'])->default('original');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->timestamps();
            $table->foreign('parent_id')
                  ->references('id')
                  ->on('articles')
                  ->onDelete('cascade');
            $table->unique(['source_url', 'status']);
            $table->unique(['parent_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
