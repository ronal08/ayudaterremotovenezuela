<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CollectionCenterController;
use App\Http\Controllers\VolunteerController;

// Rutas Públicas de Personas Desaparecidas
Route::get('/', [PersonController::class, 'index'])->name('people.index');
Route::get('/api/check-duplicate', [PersonController::class, 'checkDuplicate'])->name('people.check-duplicate');
Route::get('/reportar', [PersonController::class, 'create'])->name('people.create');
Route::post('/reportar', [PersonController::class, 'store'])->name('people.store');
Route::get('/persona/{id}', [PersonController::class, 'show'])->name('people.show');
Route::post('/persona/{id}/estado', [PersonController::class, 'updateStatus'])->name('people.status.update');
Route::post('/persona/{id}/comentar', [PersonController::class, 'addComment'])->name('people.comment.store');

// Rutas Públicas de Centros de Acopio
Route::get('/centros', [CollectionCenterController::class, 'index'])->name('centers.index');
Route::get('/centros/nuevo', [CollectionCenterController::class, 'create'])->name('centers.create');
Route::post('/centros', [CollectionCenterController::class, 'store'])->name('centers.store');
Route::post('/centros/{id}/actualizar', [CollectionCenterController::class, 'updateStatus'])->name('centers.status.update');

// Rutas Públicas de Voluntarios de Transporte
Route::get('/voluntarios', [VolunteerController::class, 'index'])->name('volunteers.index');
Route::get('/voluntarios/registro', [VolunteerController::class, 'create'])->name('volunteers.create');
Route::post('/voluntarios', [VolunteerController::class, 'store'])->name('volunteers.store');
Route::post('/voluntarios/{id}/actualizar', [VolunteerController::class, 'updateStatus'])->name('volunteers.status.update');

// Rutas del Panel de Administración
Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Moderación de Personas
    Route::post('/admin/persona/{id}/verificar', [AdminController::class, 'verify'])->name('admin.people.verify');
    Route::put('/admin/persona/{id}', [AdminController::class, 'update'])->name('admin.people.update');
    Route::delete('/admin/persona/{id}', [AdminController::class, 'deletePerson'])->name('admin.people.delete');
    Route::delete('/admin/comentario/{id}', [AdminController::class, 'deleteComment'])->name('admin.comment.delete');

    // Moderación de Centros de Acopio
    Route::post('/admin/centros/{id}/verificar', [AdminController::class, 'verifyCenter'])->name('admin.centers.verify');
    Route::delete('/admin/centros/{id}', [AdminController::class, 'deleteCenter'])->name('admin.centers.delete');

    // Moderación de Voluntarios
    Route::post('/admin/voluntarios/{id}/verificar', [AdminController::class, 'verifyVolunteer'])->name('admin.volunteers.verify');
    Route::delete('/admin/voluntarios/{id}', [AdminController::class, 'deleteVolunteer'])->name('admin.volunteers.delete');
});

