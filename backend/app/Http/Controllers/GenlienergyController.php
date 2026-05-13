<?php

namespace App\Http\Controllers;

use App\Models\Barrio;
use App\Models\Genlienergy;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GenlienergyController extends Controller
{
    /**
     * Display a listing (Modificado para responder JSON a React)
     */
    public function index(Request $request)
    {
        $query = Genlienergy::query();

        $query->when($request->tipo, function ($q) use ($request) {
            return $q->where('tipo', $request->tipo);
        });

        $query->when($request->fecha_inicio, function ($q) use ($request) {
            return $q->whereDate('fecha', '>=', $request->fecha_inicio);
        });

        $query->when($request->fecha_fin, function ($q) use ($request) {
            return $q->whereDate('fecha', '<=', $request->fecha_fin);
        });

        $genlienergy = $query->orderBy('fecha', 'desc')->get();

        // Si la petición viene de React (Axios), respondemos JSON
        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json($genlienergy);
        }

        return view('index', compact('genlienergy'));
    }

    /**
     * Store (CORREGIDO PARA REACT)
     */
   public function store(Request $request)
{
    try {
        $data = $request->validate([
            'barrio' => 'required|string',
            'pEnergia' => 'required|numeric',
            'tipo' => 'required|string',
        ]);

        // Guardamos. La fecha se pondrá sola gracias a Workbench
        Genlienergy::create($data);

        return response()->json(['status' => 'success'], 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    /**
     * Update (CORREGIDO PARA REACT)
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'barrio' => 'required|string',
            'pEnergia' => 'required|numeric',
            'tipo' => 'required|string',
        ]);

        $registro = Genlienergy::findOrFail($id);
        $registro->update($data);

        return response()->json([
            'message' => 'Registro actualizado',
            'data' => $registro
        ]);
    }

    /**
     * Destroy (CORREGIDO PARA REACT)
     */
    public function destroy(string $id)
    {
        $genlienergy = Genlienergy::findOrFail($id);
        $genlienergy->delete();

        return response()->json(['message' => 'Eliminado correctamente']);
    }

    /**
     * Estadísticas para los gráficos (NUEVO)
     */
    public function getStats()
    {
        $porBarrio = Genlienergy::select(
                'barrio as name', 
                DB::raw('SUM(pEnergia) as value')
            )
            ->groupBy('barrio')
            ->get();

        $porTipo = Genlienergy::select(
                'tipo', 
                DB::raw('SUM(pEnergia) as total')
            )
            ->groupBy('tipo')
            ->get();

        return response()->json([
            'porBarrio' => $porBarrio,
            'porTipo' => $porTipo
        ], 200, [], JSON_NUMERIC_CHECK);
    }

    public function getBarrios()
    {
        // Corregido para que devuelva la lista real de barrios
        $barrios = Barrio::orderBy('nombre')->pluck('nombre');
        return response()->json($barrios);
    }

    public function generarPDF($id)
    {
        $registro = Genlienergy::findOrFail($id);
        $pdf = Pdf::loadView('reporte_individual', compact('registro'));
        return $pdf->stream();
    }
}