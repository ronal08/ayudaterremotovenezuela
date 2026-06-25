<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PersonController;
use App\Http\Controllers\AdminController;

// Rutas Públicas de Personas Desaparecidas
Route::get('/', [PersonController::class, 'index'])->name('people.index');
Route::get('/reportar', [PersonController::class, 'create'])->name('people.create');
Route::post('/reportar', [PersonController::class, 'store'])->name('people.store');
Route::get('/persona/{id}', [PersonController::class, 'show'])->name('people.show');
Route::post('/persona/{id}/estado', [PersonController::class, 'updateStatus'])->name('people.status.update');
Route::post('/persona/{id}/comentar', [PersonController::class, 'addComment'])->name('people.comment.store');

// Rutas del Panel de Administración
Route::get('/admin/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/login', [AdminController::class, 'authenticate'])->name('admin.authenticate');
Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/admin/persona/{id}/verificar', [AdminController::class, 'verify'])->name('admin.people.verify');
    Route::put('/admin/persona/{id}', [AdminController::class, 'update'])->name('admin.people.update');
    Route::delete('/admin/persona/{id}', [AdminController::class, 'deletePerson'])->name('admin.people.delete');
    Route::delete('/admin/comentario/{id}', [AdminController::class, 'deleteComment'])->name('admin.comment.delete');
});
