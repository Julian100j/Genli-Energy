<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::create([
            'nombre' => 'Administrador',
            'email' => 'admin@genli.com',
            'password' => 'admin123',
            'rol' => 'admin',
            'estado' => 'activo'
        ]);
        
        Usuario::create([
            'nombre' => 'Gerente Genli',
            'email' => 'gerente@genli.com',
            'password' => 'gerente123',
            'rol' => 'gerente',
            'estado' => 'activo'
        ]);
        
        Usuario::create([
            'nombre' => 'Técnico Genli',
            'email' => 'tecnico@genli.com',
            'password' => 'tecnico123',
            'rol' => 'tecnico',
            'estado' => 'activo'
        ]);
    }
}