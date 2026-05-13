<?php

use App\Http\Controllers\GenlienergyController;
use App\Models\Barrio;
use App\Models\Genlienergy;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Rutas de autenticación
Route::post('/login', function (Request $request) {
    $email = $request->email;
    $password = $request->password;
    
    $usuario = Usuario::where('email', $email)->where('estado', 'activo')->first();
    
    if (!$usuario || !Hash::check($password, $usuario->password)) {
        return response()->json(['error' => 'Credenciales inválidas'], 401);
    }
    
    return response()->json([
        'id' => $usuario->id,
        'nombre' => $usuario->nombre,
        'email' => $usuario->email,
        'rol' => $usuario->rol
    ]);
});

// Rutas de usuarios (solo admin) - verificamos desde el header
Route::get('/usuarios', function (Request $request) {
    $userData = $request->header('X-User');
    if (!$userData) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    $user = json_decode($userData, true);
    if (!isset($user['rol']) || $user['rol'] !== 'admin') {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    return response()->json(Usuario::select('id', 'nombre', 'email', 'rol', 'estado', 'created_at')->get());
});

Route::post('/usuarios', function (Request $request) {
    $userData = $request->header('X-User');
    if (!$userData) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    $user = json_decode($userData, true);
    if (!isset($user['rol']) || $user['rol'] !== 'admin') {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    
    $validated = $request->validate([
        'nombre' => 'required',
        'email' => 'required|email|unique:usuarios',
        'password' => 'required|min:6',
        'rol' => 'required|in:tecnico,gerente,admin'
    ]);
    
    $usuario = Usuario::create($validated);
    return response()->json($usuario, 201);
});

Route::put('/usuarios/{id}', function (Request $request, $id) {
    $userData = $request->header('X-User');
    if (!$userData) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    $user = json_decode($userData, true);
    if (!isset($user['rol']) || $user['rol'] !== 'admin') {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    
    $usuario = Usuario::findOrFail($id);
    $data = $request->only(['nombre', 'email', 'rol', 'estado']);
    if ($request->password) {
        $data['password'] = $request->password;
    }
    $usuario->update($data);
    return response()->json($usuario);
});

Route::delete('/usuarios/{id}', function (Request $request, $id) {
    $userData = $request->header('X-User');
    if (!$userData) {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    $user = json_decode($userData, true);
    if (!isset($user['rol']) || $user['rol'] !== 'admin') {
        return response()->json(['error' => 'No autorizado'], 403);
    }
    
    Usuario::findOrFail($id)->delete();
    return response()->json(['message' => 'Eliminado']);
});

// 1. Obtener todos los registros (Para el Index)
Route::get('/registros', function () {
    return response()->json(Genlienergy::all());
});

// 2. Obtener un registro específico (Para el Edit)
Route::get('/registros/{id}', function ($id) {
    return response()->json(Genlienergy::findOrFail($id));
});

// 3. Guardar nuevo registro (Para el Create)
Route::post('/registros', function (Request $request) {
    $nuevo = Genlienergy::create($request->all());

    return response()->json($nuevo, 201);
});

// 4. Actualizar registro (Para el Edit)
Route::put('/registros/{id}', function (Request $request, $id) {
    $registro = Genlienergy::findOrFail($id);
    $registro->update($request->all());

    return response()->json($registro);
});

// 5. Eliminar registro (Para el Dashboard)
Route::delete('/registros/{id}', function ($id) {
    Genlienergy::findOrFail($id)->delete();

    return response()->json(['message' => 'Eliminado']);
});

// 6. Ruta para los barrios (Para que funcione el datalist en React)
Route::get('/barrios', function () {
    $maestros = Barrio::pluck('nombre')->toArray();

    $reportados = Genlienergy::distinct()->pluck('barrio')->toArray();

    $todos = array_unique(array_merge($maestros, $reportados));
    sort($todos);

    return response()->json(array_values($todos));
});

Route::delete('/registros/{id}', function ($id) {
    $registro = Genlienergy::findOrFail($id);
    $registro->delete();

    return response()->json(['message' => 'Registro eliminado correctamente']);
});

Route::get('/reporte-pdf/{id}', [GenlienergyController::class, 'generarPDF']);

// Ruta para obtener datos procesados para los gráficos
Route::get('/analisis-stats', function () {
    try {
        $todos = Genlienergy::all();
        
        // Agrupar por barrio
        $porBarrio = $todos->groupBy('barrio')->map(function($group, $barrio) {
            return [
                'name' => $barrio,
                'value' => $group->sum('pEnergia')
            ];
        })->values()->toArray();

        // Agrupar por tipo
        $porTipo = $todos->groupBy('tipo')->map(function($group, $tipo) {
            return [
                'tipo' => $tipo === 'Tecnica' ? 'TÉCNICA' : 'NO TÉCNICA',
                'total' => $group->sum('pEnergia')
            ];
        })->values()->toArray();

        return response()->json([
            'porBarrio' => $porBarrio,
            'porTipo' => $porTipo
        ], 200, [], JSON_NUMERIC_CHECK);
        
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Ruta para datos de tendencia por mes
Route::get('/analisis-tendencia', function () {
    try {
        $todos = Genlienergy::all();
        
        if ($todos->isEmpty()) {
            return response()->json([
                'porMes' => [], 
                'porBarrio' => [],
                'porTipo' => [],
                'porPrioridad' => [],
                'porEstado' => [],
                'topSectores' => [],
                'resumen' => [
                    'totalRegistros' => 0,
                    'totalPerdida' => 0,
                    'totalUsuariosAfectados' => 0,
                    'promedioPerdida' => 0,
                ]
            ], 200);
        }
        
        // Agrupar por mes
        $porMes = [];
        foreach ($todos as $item) {
            $fecha = $item->fecha ?? '';
            $mes = $fecha && strlen($fecha) >= 7 ? substr($fecha, 0, 7) : date('Y-m');
            if (!isset($porMes[$mes])) $porMes[$mes] = 0;
            $porMes[$mes] += floatval($item->pEnergia);
        }
        $resultadoMes = [];
        foreach ($porMes as $mes => $total) {
            $resultadoMes[] = ['mes' => $mes, 'total' => round($total, 2)];
        }
        usort($resultadoMes, fn($a, $b) => $a['mes'] <=> $b['mes']);
        
        // Agrupar por barrio
        $porBarrio = [];
        foreach ($todos as $item) {
            $barrio = $item->barrio ?? 'Sin especificar';
            if (!isset($porBarrio[$barrio])) $porBarrio[$barrio] = 0;
            $porBarrio[$barrio] += floatval($item->pEnergia);
        }
        $resultadoBarrio = [];
        foreach ($porBarrio as $zona => $total) {
            $resultadoBarrio[] = ['zona' => $zona, 'perdida' => round($total, 2)];
        }
        usort($resultadoBarrio, fn($a, $b) => $b['perdida'] <=> $a['perdida']);
        
        // Agrupar por tipo
        $porTipo = [];
        foreach ($todos as $item) {
            $tipo = $item->tipo ?? 'No especificado';
            if (!isset($porTipo[$tipo])) $porTipo[$tipo] = 0;
            $porTipo[$tipo] += floatval($item->pEnergia);
        }
        $totalPerdida = array_sum($porTipo);
        $resultadoTipo = [];
        foreach ($porTipo as $tipo => $total) {
            $resultadoTipo[] = [
                'name' => $tipo === 'Tecnica' ? 'Pérdida Técnica' : 'Pérdida No Técnica',
                'value' => $totalPerdida > 0 ? round(($total / $totalPerdida) * 100, 1) : 0,
                'total' => round($total, 2)
            ];
        }
        
        // Agrupar por prioridad
        $porPrioridad = [];
        foreach ($todos as $item) {
            $prioridad = $item->prioridad ?? 'Media';
            if (!isset($porPrioridad[$prioridad])) $porPrioridad[$prioridad] = 0;
            $porPrioridad[$prioridad]++;
        }
        $resultadoPrioridad = [];
        foreach ($porPrioridad as $p => $count) {
            $resultadoPrioridad[] = ['name' => $p, 'value' => $count];
        }
        
        // Agrupar por estado
        $porEstado = [];
        foreach ($todos as $item) {
            $estado = $item->estado ?? 'Pendiente';
            if (!isset($porEstado[$estado])) $porEstado[$estado] = 0;
            $porEstado[$estado]++;
        }
        $resultadoEstado = [];
        foreach ($porEstado as $e => $count) {
            $resultadoEstado[] = ['name' => $e, 'value' => $count];
        }
        
        // Top 5 sectores
        $topSectores = array_slice($resultadoBarrio, 0, 5);
        
        // Resumen
        $totalPerdidaAll = $todos->sum('pEnergia');
        $totalUsuarios = $todos->sum('usuarios_afectados');
        
        return response()->json([
            'porMes' => $resultadoMes,
            'porBarrio' => $resultadoBarrio,
            'porTipo' => $resultadoTipo,
            'porPrioridad' => $resultadoPrioridad,
            'porEstado' => $resultadoEstado,
            'topSectores' => $topSectores,
            'resumen' => [
                'totalRegistros' => $todos->count(),
                'totalPerdida' => round($totalPerdidaAll, 2),
                'totalUsuariosAfectados' => $totalUsuarios,
                'promedioPerdida' => $todos->count() > 0 ? round($totalPerdidaAll / $todos->count(), 2) : 0,
            ]
        ], 200, [], JSON_NUMERIC_CHECK);
        
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
