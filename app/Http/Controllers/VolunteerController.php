<?php

namespace App\Http\Controllers;

use App\Models\Volunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class VolunteerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Volunteer::query();

        // Solo voluntarios verificados para el público
        $query->where('is_verified', true);

        // Filtros
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('vehicle_model', 'like', "%{$search}%")
                  ->orWhere('municipality', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        if ($request->filled('state')) {
            $query->where('state', $request->input('state'));
        }

        if ($request->filled('vehicle_type')) {
            $query->where('vehicle_type', $request->input('vehicle_type'));
        }

        if ($request->filled('status') && in_array($request->input('status'), ['Disponible', 'En misión', 'No disponible'])) {
            $query->where('status', $request->input('status'));
        }

        $volunteers = $query->orderBy('created_at', 'desc')->get();

        // Estadísticas básicas
        $stats = [
            'total' => Volunteer::where('is_verified', true)->count(),
            'available' => Volunteer::where('is_verified', true)->where('status', 'Disponible')->count(),
            'on_mission' => Volunteer::where('is_verified', true)->where('status', 'En misión')->count(),
        ];

        return Inertia::render('Volunteers/Index', [
            'volunteers' => $volunteers,
            'stats' => $stats,
            'filters' => $request->only(['search', 'state', 'vehicle_type', 'status']),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Volunteers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'vehicle_type' => 'required|string|in:Motocicleta,Carro,Camioneta,Camión,Otro',
            'vehicle_model' => 'nullable|string|max:100',
            'state' => 'required|string|max:100',
            'municipality' => 'required|string|max:100',
            'notes' => 'nullable|string',
            'security_pin' => 'required|string|size:4',
        ], [
            'name.required' => 'Tu nombre completo es obligatorio.',
            'phone.required' => 'El teléfono de contacto es obligatorio.',
            'vehicle_type.required' => 'El tipo de vehículo es obligatorio.',
            'vehicle_type.in' => 'El tipo de vehículo no es válido.',
            'state.required' => 'El estado de cobertura es obligatorio.',
            'municipality.required' => 'El municipio/zona es obligatorio.',
            'security_pin.required' => 'El PIN es obligatorio.',
            'security_pin.size' => 'El PIN debe ser exactamente de 4 números.'
        ]);

        Volunteer::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'vehicle_type' => $validated['vehicle_type'],
            'vehicle_model' => $validated['vehicle_model'] ?? null,
            'state' => $validated['state'],
            'municipality' => $validated['municipality'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'Disponible',
            'is_verified' => false, // Requiere aprobación del admin
            'security_pin' => Hash::make($validated['security_pin']),
        ]);

        return redirect()->route('volunteers.index')->with('success', 'Registro de voluntario enviado con éxito. Aparecerás en la lista una vez que los moderadores verifiquen tu contacto. Guarda tu PIN de seguridad para actualizar tu estado de disponibilidad.');
    }

    /**
     * Update availability status using security PIN.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
            'status' => 'required|string|in:Disponible,En misión,No disponible',
        ], [
            'pin.required' => 'El PIN es obligatorio.',
            'pin.size' => 'El PIN debe ser de 4 dígitos.',
            'status.in' => 'El estado no es válido.'
        ]);

        $volunteer = Volunteer::findOrFail($id);

        if (Hash::check($request->pin, $volunteer->security_pin)) {
            $volunteer->update(['status' => $request->status]);
            return redirect()->route('volunteers.index')->with('success', 'Estado de disponibilidad actualizado con éxito.');
        }

        return redirect()->route('volunteers.index')->with('error', 'El PIN de seguridad ingresado es incorrecto.');
    }
}
