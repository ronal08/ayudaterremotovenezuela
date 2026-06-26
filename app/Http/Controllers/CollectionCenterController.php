<?php

namespace App\Http\Controllers;

use App\Models\CollectionCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class CollectionCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CollectionCenter::query();

        // Solo mostrar centros de acopio verificados (a menos que sea admin, pero eso se maneja en el admin dashboard)
        $query->where('is_verified', true);

        // Filtros de búsqueda
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('needs', 'like', "%{$search}%")
                  ->orWhere('contact_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('state')) {
            $query->where('state', $request->input('state'));
        }

        if ($request->filled('status') && in_array($request->input('status'), ['Activo', 'Lleno'])) {
            $query->where('status', $request->input('status'));
        }

        $centers = $query->orderBy('created_at', 'desc')->get();

        // Estadísticas básicas
        $stats = [
            'total' => CollectionCenter::where('is_verified', true)->count(),
            'active' => CollectionCenter::where('is_verified', true)->where('status', 'Activo')->count(),
            'full' => CollectionCenter::where('is_verified', true)->where('status', 'Lleno')->count(),
        ];

        return Inertia::render('CollectionCenters/Index', [
            'centers' => $centers,
            'stats' => $stats,
            'filters' => $request->only(['search', 'state', 'status']),
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
        return Inertia::render('CollectionCenters/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'address' => 'required|string',
            'state' => 'required|string|max:100',
            'municipality' => 'required|string|max:100',
            'contact_name' => 'required|string|max:100',
            'contact_phone' => 'required|string|max:50',
            'location_url' => 'nullable|url|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
            'needs' => 'nullable|string',
            'security_pin' => 'required|string|size:4',
        ], [
            'name.required' => 'El nombre del centro de acopio es obligatorio.',
            'address.required' => 'La dirección detallada es obligatoria.',
            'state.required' => 'El estado es obligatorio.',
            'municipality.required' => 'El municipio es obligatorio.',
            'contact_name.required' => 'El nombre de contacto es obligatorio.',
            'contact_phone.required' => 'El teléfono de contacto es obligatorio.',
            'location_url.url' => 'El enlace de ubicación debe ser una URL válida.',
            'security_pin.required' => 'El PIN de seguridad es obligatorio.',
            'security_pin.size' => 'El PIN debe ser exactamente de 4 números.',
            'photo.max' => 'La foto no debe pesar más de 2MB.',
            'photo.image' => 'El archivo debe ser una imagen válida.'
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos_centers', 'public');
        }

        CollectionCenter::create([
            'name' => $validated['name'],
            'address' => $validated['address'],
            'state' => $validated['state'],
            'municipality' => $validated['municipality'],
            'contact_name' => $validated['contact_name'],
            'contact_phone' => $validated['contact_phone'],
            'location_url' => $validated['location_url'] ?? null,
            'photo_path' => $photoPath,
            'needs' => $validated['needs'] ?? null,
            'status' => 'Activo',
            'is_verified' => false, // Requiere aprobación del admin
            'security_pin' => Hash::make($validated['security_pin']),
        ]);

        return redirect()->route('centers.index')->with('success', 'Centro de acopio registrado con éxito. Será visible tan pronto como sea verificado por los moderadores. Guarda tu PIN de seguridad para actualizar la información más adelante.');
    }

    /**
     * Update the status and needs of the collection center using security PIN.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
            'status' => 'required|string|in:Activo,Lleno,Inactivo',
            'needs' => 'nullable|string',
        ], [
            'pin.required' => 'El PIN es obligatorio.',
            'pin.size' => 'El PIN debe ser de 4 dígitos.',
            'status.in' => 'El estado no es válido.'
        ]);

        $center = CollectionCenter::findOrFail($id);

        if (Hash::check($request->pin, $center->security_pin)) {
            $center->update([
                'status' => $request->status,
                'needs' => $request->needs,
            ]);
            return redirect()->route('centers.index')->with('success', 'Información del centro de acopio actualizada con éxito.');
        }

        return redirect()->route('centers.index')->with('error', 'El PIN de seguridad ingresado es incorrecto.');
    }
}
