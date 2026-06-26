<?php

namespace App\Http\Controllers;

use App\Models\Person;
use App\Models\Comment;
use App\Models\CollectionCenter;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function login()
    {
        if (Auth::check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login', [
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Authenticate the admin user.
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El correo no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->route('admin.dashboard')->with('success', 'Sesión iniciada con éxito.');
        }

        return back()->withErrors([
            'email' => 'Las credenciales no coinciden con nuestros registros.',
        ])->onlyInput('email');
    }

    /**
     * Log the admin user out.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login')->with('success', 'Sesión cerrada correctamente.');
    }

    /**
     * Show the admin dashboard.
     */
    public function dashboard()
    {
        $people = Person::with('comments')
            ->orderBy('created_at', 'desc')
            ->get();

        $centers = CollectionCenter::orderBy('created_at', 'desc')->get();
        $volunteers = Volunteer::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Dashboard', [
            'people' => $people,
            'centers' => $centers,
            'volunteers' => $volunteers,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    /**
     * Toggle verification status of a person.
     */
    public function verify($id)
    {
        $person = Person::findOrFail($id);
        $person->update([
            'is_verified' => !$person->is_verified
        ]);

        $status = $person->is_verified ? 'verificado' : 'desmarcado como verificado';
        return redirect()->back()->with('success', "El reporte de {$person->full_name} ha sido {$status}.");
    }

    /**
     * Update person information (moderation edit).
     */
    public function update(Request $request, $id)
    {
        $person = Person::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'age' => 'nullable|integer|min:0|max:120',
            'gender' => 'nullable|string|in:Masculino,Femenino,Otro',
            'last_seen_location' => 'required|string|max:255',
            'distinctive_features' => 'nullable|string',
            'status' => 'required|string|in:missing,found',
        ]);

        $person->update($validated);

        return redirect()->back()->with('success', "El reporte de {$person->full_name} fue actualizado correctamente.");
    }

    /**
     * Delete a person report.
     */
    public function deletePerson($id)
    {
        $person = Person::findOrFail($id);

        // Borrar la foto asociada
        if ($person->photo_path) {
            Storage::disk('public')->delete($person->photo_path);
        }

        $name = $person->full_name;
        $person->delete();

        return redirect()->back()->with('success', "El reporte de {$name} ha sido eliminado.");
    }

    /**
     * Delete a comment/tip.
     */
    public function deleteComment($id)
    {
        $comment = Comment::findOrFail($id);
        $comment->delete();

        return redirect()->back()->with('success', 'El comentario/pista fue eliminado.');
    }

    /**
     * Toggle verification status of a collection center.
     */
    public function verifyCenter($id)
    {
        $center = CollectionCenter::findOrFail($id);
        $center->update([
            'is_verified' => !$center->is_verified
        ]);

        $status = $center->is_verified ? 'verificado y publicado' : 'desmarcado como verificado y ocultado';
        return redirect()->back()->with('success', "El centro de acopio \"{$center->name}\" ha sido {$status}.");
    }

    /**
     * Delete a collection center.
     */
    public function deleteCenter($id)
    {
        $center = CollectionCenter::findOrFail($id);

        if ($center->photo_path) {
            Storage::disk('public')->delete($center->photo_path);
        }

        $name = $center->name;
        $center->delete();

        return redirect()->back()->with('success', "El centro de acopio \"{$name}\" ha sido eliminado.");
    }

    /**
     * Toggle verification status of a volunteer.
     */
    public function verifyVolunteer($id)
    {
        $volunteer = Volunteer::findOrFail($id);
        $volunteer->update([
            'is_verified' => !$volunteer->is_verified
        ]);

        $status = $volunteer->is_verified ? 'verificado y publicado' : 'desmarcado como verificado';
        return redirect()->back()->with('success', "El voluntario {$volunteer->name} ha sido {$status}.");
    }

    /**
     * Delete a volunteer.
     */
    public function deleteVolunteer($id)
    {
        $volunteer = Volunteer::findOrFail($id);
        $name = $volunteer->name;
        $volunteer->delete();

        return redirect()->back()->with('success', "El voluntario {$name} ha sido eliminado.");
    }
}
