<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class PersonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Person::query();
        $externalPeople = [];
        $externalStats = ['total' => 0, 'missing' => 0, 'found' => 0];

        $page = intval($request->input('page', 1));
        if ($page < 1) {
            $page = 1;
        }

        $pageSize = 16;

        // Determinar parámetros de consulta para la API externa
        // NOTA: La API aliada tiene un alto volumen de spam (~75% de los registros recientes).
        // Solicitamos 100 items y luego filtramos spam, recortando a 16 resultados limpios por página.
        $search = $request->input('search');
        $apiParams = ['page' => $page, 'pageSize' => 100];
        if ($request->filled('search')) {
            $apiParams['q'] = $search;
        }

        $externalTotal = 0;

        // Consulta a la API externa aliada
        try {
            $response = \Illuminate\Support\Facades\Http::timeout(6)->get('https://desaparecidos-terremoto-api.theempire.tech/api/personas', $apiParams);

            if ($response->successful()) {
                $externalData = $response->json();
                
                // Extraer estadísticas de la API externa
                if (isset($externalData['counts']) && is_array($externalData['counts'])) {
                    $externalStats['total'] = intval($externalData['counts']['total'] ?? 0);
                    $externalStats['missing'] = intval($externalData['counts']['sinContacto'] ?? 0);
                    $externalStats['found'] = intval($externalData['counts']['localizado'] ?? 0);
                }

                $externalTotal = intval($externalData['total'] ?? 0);

                $items = $externalData['items'] ?? $externalData['personas'] ?? [];
                if (is_array($items)) {
                    foreach ($items as $item) {
                        $nombre = $item['nombre'] ?? '';

                        // Filtro de spam básico para omitir registros falsos de la API
                        $isSpam = false;
                        $spamKeywords = ['trusted', 'http', 'oracle', 'hotel', 'test-logo', 'infinityhotel', 'www.', '.com', '.it'];
                        foreach ($spamKeywords as $keyword) {
                            if (stripos($nombre, $keyword) !== false) {
                                $isSpam = true;
                                break;
                            }
                        }

                        if (!$isSpam && !empty($nombre)) {
                            $mappedStatus = ($item['estado'] ?? '') === 'localizado' ? 'found' : 'missing';

                            // Filtrar por estado si el filtro está activo
                            if ($request->filled('status') && in_array($request->input('status'), ['missing', 'found'])) {
                                if ($request->input('status') !== $mappedStatus) {
                                    continue;
                                }
                            }

                            $externalPeople[] = [
                                'id' => $item['id'] ?? uniqid(),
                                'full_name' => $nombre,
                                'age' => $item['edad'] ?? null,
                                'last_seen_location' => $item['ubicacion'] ?? 'No especificada',
                                'last_seen_at' => $item['fecha'] ?? null,
                                'distinctive_features' => $item['distinctive_features'] ?? ($item['descripcion'] ?? null),
                                'photo_url' => $item['foto'] ?? null,
                                'status' => $mappedStatus,
                                'contact' => $item['contacto'] ?? null,
                                'is_external' => true,
                                'source_url' => 'https://desaparecidosterremotovenezuela.com'
                            ];
                        }
                    }
                }
                
                // Recortar a pageSize (16)
                $externalPeople = array_slice($externalPeople, 0, $pageSize);
            }
        } catch (\Exception $e) {
            // Loguear error de forma silenciosa para que la app principal no falle si la API externa está inactiva
            \Illuminate\Support\Facades\Log::error('Error consultando API externa: ' . $e->getMessage());
        }

        // Aplicar filtros de búsqueda locales
        if ($request->filled('search')) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('last_seen_location', 'like', "%{$search}%")
                  ->orWhere('distinctive_features', 'like', "%{$search}%");
            });
        }

        // Filtro de estado ('missing' o 'found') local
        if ($request->filled('status') && in_array($request->input('status'), ['missing', 'found'])) {
            $query->where('status', $request->input('status'));
        }

        $localTotal = $query->count();
        $people = $query->orderBy('created_at', 'desc')->skip(($page - 1) * $pageSize)->take($pageSize)->get();

        // Estadísticas unificadas (Locales + Externas)
        $stats = [
            'total' => Person::count() + $externalStats['total'],
            'missing' => Person::where('status', 'missing')->count() + $externalStats['missing'],
            'found' => Person::where('status', 'found')->count() + $externalStats['found'],
        ];

        // Calcular total de páginas
        $totalLocalPages = ceil($localTotal / $pageSize);
        $totalExternalPages = ceil($externalTotal / $pageSize);
        $totalPages = max($totalLocalPages, $totalExternalPages);
        if ($totalPages < 1) {
            $totalPages = 1;
        }

        return Inertia::render('Index', [
            'people' => $people,
            'externalPeople' => $externalPeople,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'page']),
            'pagination' => [
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'localTotal' => $localTotal,
                'externalTotal' => $externalTotal
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Check if a person with similar name already exists.
     */
    public function checkDuplicate(Request $request)
    {
        $firstName = $request->query('first_name');
        $lastName = $request->query('last_name');

        if (empty($firstName) || empty($lastName)) {
            return response()->json(['exists' => false]);
        }

        // Buscar coincidencias similares (ignorando mayúsculas/minúsculas y buscando subcadenas)
        $similarPeople = Person::where(function ($query) use ($firstName, $lastName) {
            $query->where('first_name', 'like', "%{$firstName}%")
                  ->where('last_name', 'like', "%{$lastName}%");
        })->orWhere(function ($query) use ($firstName, $lastName) {
            // Por si ingresan el apellido en el campo de nombre o viceversa
            $query->where('first_name', 'like', "%{$lastName}%")
                  ->where('last_name', 'like', "%{$firstName}%");
        })->get(['id', 'first_name', 'last_name', 'age', 'last_seen_location', 'status']);

        if ($similarPeople->isNotEmpty()) {
            return response()->json([
                'exists' => true,
                'people' => $similarPeople
            ]);
        }

        return response()->json(['exists' => false]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'age' => 'nullable|integer|min:0|max:120',
            'gender' => 'nullable|string|in:Masculino,Femenino,Otro',
            'last_seen_location' => 'required|string|max:255',
            'last_seen_at' => 'required|date',
            'distinctive_features' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
            'reporter_name' => 'required|string|max:100',
            'reporter_phone' => 'required|string|max:50',
            'reporter_email' => 'nullable|email|max:100',
            'reporter_relationship' => 'required|string|max:100',
            'show_reporter_info' => 'required|boolean',
            'security_pin' => 'required|string|size:4',
        ], [
            'first_name.required' => 'El nombre es obligatorio.',
            'last_name.required' => 'El apellido es obligatorio.',
            'last_seen_location.required' => 'El último lugar visto es obligatorio.',
            'last_seen_at.required' => 'La fecha de último contacto es obligatoria.',
            'reporter_name.required' => 'Tu nombre es obligatorio.',
            'reporter_phone.required' => 'Tu teléfono es obligatorio para contactarte si es necesario.',
            'reporter_relationship.required' => 'Indica tu relación con la persona.',
            'security_pin.required' => 'El PIN es obligatorio.',
            'security_pin.size' => 'El PIN debe ser exactamente de 4 números.',
            'photo.max' => 'La foto no debe pesar más de 2MB.',
            'photo.image' => 'El archivo debe ser una imagen válida.'
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');
        }

        Person::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'age' => $validated['age'] ?? null,
            'gender' => $validated['gender'] ?? null,
            'last_seen_location' => $validated['last_seen_location'],
            'last_seen_at' => $validated['last_seen_at'],
            'distinctive_features' => $validated['distinctive_features'] ?? null,
            'photo_path' => $photoPath,
            'status' => 'missing',
            'reporter_name' => $validated['reporter_name'],
            'reporter_phone' => $validated['reporter_phone'],
            'reporter_email' => $validated['reporter_email'] ?? null,
            'reporter_relationship' => $validated['reporter_relationship'],
            'show_reporter_info' => $validated['show_reporter_info'],
            'security_pin' => Hash::make($validated['security_pin']),
            'is_verified' => false,
        ]);

        return redirect()->route('people.index')->with('success', 'Reporte publicado con éxito. Guarda tu PIN de seguridad para actualizar su estado luego.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $person = Person::with('comments')->findOrFail($id);

        return Inertia::render('Show', [
            'person' => $person,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Update the status of the person using security PIN.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'pin' => 'required|string|size:4',
            'status' => 'required|string|in:missing,found',
        ], [
            'pin.required' => 'El PIN es obligatorio.',
            'pin.size' => 'El PIN debe ser de 4 dígitos.',
            'status.in' => 'El estado no es válido.'
        ]);

        $person = Person::findOrFail($id);

        if (Hash::check($request->pin, $person->security_pin)) {
            $person->update(['status' => $request->status]);
            $mensaje = $request->status === 'found' ? 'Localizado a salvo' : 'Sin contacto';
            return redirect()->route('people.show', $id)->with('success', "Estado actualizado con éxito a: {$mensaje}.");
        }

        return redirect()->route('people.show', $id)->with('error', 'El PIN de seguridad ingresado es incorrecto.');
    }

    /**
     * Add a comment/tip to the person report.
     */
    public function addComment(Request $request, $id)
    {
        $validated = $request->validate([
            'author_name' => 'required|string|max:100',
            'author_phone' => 'required|string|max:50',
            'content' => 'required|string',
        ], [
            'author_name.required' => 'Tu nombre es obligatorio.',
            'author_phone.required' => 'Tu número de teléfono es obligatorio.',
            'content.required' => 'El contenido del comentario/pista no puede estar vacío.'
        ]);

        Comment::create([
            'person_id' => $id,
            'author_name' => $validated['author_name'],
            'author_phone' => $validated['author_phone'],
            'content' => $validated['content'],
        ]);

        return redirect()->route('people.show', $id)->with('success', 'Pista agregada correctamente. Gracias por ayudar.');
    }
}
