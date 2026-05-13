<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::create([
            'nombre' => 'Administrador',
            'email' => 'admin@genli.com',
            'password' => Hash::make('admin123'),
            'rol' => 'admin',
            'estado' => 'activo'
        ]);
        
        Usuario::create([
            'nombre' => 'Gerente Genli',
            'email' => 'gerente@genli.com',
            'password' => Hash::make('gerente123'),
            'rol' => 'gerente',
            'estado' => 'activo'
        ]);
        
        Usuario::create([
            'nombre' => 'Técnico Genli',
            'email' => 'tecnico@genli.com',
            'password' => Hash::make('tecnico123'),
            'rol' => 'tecnico',
            'estado' => 'activo'
        ]);
    }
}