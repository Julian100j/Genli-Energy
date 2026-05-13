<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registro', function (Blueprint $table) {
            $table->text('descripcion')->nullable()->after('tipo');
            $table->enum('prioridad', ['Baja', 'Media', 'Alta', 'Critica'])->default('Media')->after('descripcion');
            $table->enum('estado', ['Pendiente', 'En proceso', 'Resuelto'])->default('Pendiente')->after('prioridad');
            $table->string('tipo_instalacion')->nullable()->after('estado');
            $table->string('causa')->nullable()->after('tipo_instalacion');
            $table->integer('usuarios_afectados')->default(0)->after('causa');
        });
    }

    public function down(): void
    {
        Schema::table('registro', function (Blueprint $table) {
            $table->dropColumn(['descripcion', 'prioridad', 'estado', 'tipo_instalacion', 'causa', 'usuarios_afectados']);
        });
    }
};