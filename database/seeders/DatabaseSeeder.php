<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Crear Administrador de Moderación
        User::create([
            'name' => 'Admin Moderador',
            'email' => 'admin@ayudaterremotovenezuela.com',
            'password' => \Illuminate\Support\Facades\Hash::make('admin12345'),
        ]);

        // 2. Crear Datos de Prueba de Personas Desaparecidas
        $p1 = \App\Models\Person::create([
            'first_name' => 'Alejandro',
            'last_name' => 'Mendoza',
            'age' => 34,
            'gender' => 'Masculino',
            'last_seen_location' => 'Urb. Altamira, Caracas',
            'last_seen_at' => '2026-06-24 15:30:00',
            'distinctive_features' => 'Franela azul marino, jeans oscuros y zapatos deportivos negros. Tiene una cicatriz pequeña en la ceja derecha.',
            'photo_path' => null,
            'status' => 'missing',
            'reporter_name' => 'María Mendoza',
            'reporter_phone' => '0412-5551234',
            'reporter_email' => 'maria.mendoza@email.com',
            'reporter_relationship' => 'Hermana',
            'show_reporter_info' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('1234'),
            'is_verified' => true,
        ]);

        $p1->comments()->create([
            'author_name' => 'Juan Pérez (Rescatista)',
            'author_phone' => '0424-1112233',
            'content' => 'Lo vi hoy en la mañana en el puesto de socorro de Protección Civil en la Plaza Altamira. Estaba ileso y apoyando en la distribución de agua.',
        ]);

        $p2 = \App\Models\Person::create([
            'first_name' => 'Sofia Valentina',
            'last_name' => 'Rodríguez',
            'age' => 8,
            'gender' => 'Femenino',
            'last_seen_location' => 'Sector El Rosal, Chacao',
            'last_seen_at' => '2026-06-24 16:00:00',
            'distinctive_features' => 'Cabello castaño largo recogido en una cola. Vestía una franela rosada de Minnie Mouse y shorts azules.',
            'photo_path' => null,
            'status' => 'missing',
            'reporter_name' => 'Carlos Rodríguez',
            'reporter_phone' => '0414-9998877',
            'reporter_email' => 'carlos.r@email.com',
            'reporter_relationship' => 'Padre',
            'show_reporter_info' => false,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('1111'),
            'is_verified' => true,
        ]);

        $p3 = \App\Models\Person::create([
            'first_name' => 'Carmen Teresa',
            'last_name' => 'Alviarez',
            'age' => 72,
            'gender' => 'Femenino',
            'last_seen_location' => 'Municipio Baruta, Caracas',
            'last_seen_at' => '2026-06-24 14:15:00',
            'distinctive_features' => 'Usa lentes recetados de montura dorada. Camina muy despacio con apoyo de un bastón de madera con mango curvo.',
            'photo_path' => null,
            'status' => 'found',
            'reporter_name' => 'Gabriela Silva',
            'reporter_phone' => '0416-2223344',
            'reporter_email' => 'gabriela.silva@email.com',
            'reporter_relationship' => 'Nieta',
            'show_reporter_info' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('2222'),
            'is_verified' => true,
        ]);

        $p3->comments()->create([
            'author_name' => 'Dr. Ricardo Lugo',
            'author_phone' => '0412-8889900',
            'content' => 'La señora Carmen se encuentra resguardada en el Ambulatorio de Salud Baruta. Está en perfectas condiciones físicas y ya está en contacto con sus familiares directos.',
        ]);

        // 3. Crear Centros de Acopio de Prueba
        \App\Models\CollectionCenter::create([
            'name' => 'Cruz Roja Venezolana - Sede Caracas',
            'address' => 'Av. Andrés Bello, Edificio Cruz Roja, La Candelaria, Caracas',
            'state' => 'Distrito Capital',
            'municipality' => 'Libertador',
            'contact_name' => 'Dr. Luis Beltrán',
            'contact_phone' => '0212-5751111',
            'location_url' => 'https://maps.google.com/?q=Cruz+Roja+Venezolana+Caracas',
            'photo_path' => null,
            'needs' => 'Gasa, analgésicos, agua potable embotellada, alimentos no perecederos.',
            'status' => 'Activo',
            'is_verified' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('4321'),
        ]);

        \App\Models\CollectionCenter::create([
            'name' => 'Centro de Acopio Plaza Altamira',
            'address' => 'Plaza Francia de Altamira, Puesto de Control de Protección Civil, Chacao',
            'state' => 'Miranda',
            'municipality' => 'Chacao',
            'contact_name' => 'Comisionado Jorge Silva',
            'contact_phone' => '0424-9993322',
            'location_url' => 'https://maps.google.com/?q=Plaza+Francia+Altamira',
            'photo_path' => null,
            'needs' => 'Cobijas, colchonetas, linternas, baterías, pañales desechables.',
            'status' => 'Lleno',
            'is_verified' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('1234'),
        ]);

        // 4. Crear Voluntarios de Prueba
        \App\Models\Volunteer::create([
            'name' => 'Pedro Castillo (Grupo Motorizado Miranda)',
            'phone' => '0412-8883344',
            'vehicle_type' => 'Motocicleta',
            'vehicle_model' => 'KLR 650',
            'state' => 'Miranda',
            'municipality' => 'Chacao',
            'notes' => 'Tengo moto alta cilindrada con maletero amplio para transportar medicinas y comida rápida en zonas de difícil acceso.',
            'status' => 'Disponible',
            'is_verified' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('9999'),
        ]);

        \App\Models\Volunteer::create([
            'name' => 'Marcos Díaz',
            'phone' => '0416-5556677',
            'vehicle_type' => 'Camioneta',
            'vehicle_model' => 'Toyota Hilux 4x4',
            'state' => 'Distrito Capital',
            'municipality' => 'Libertador',
            'notes' => 'Camioneta pick-up con caja abierta grande disponible para recoger donaciones pesadas (cajas de agua, bultos de comida).',
            'status' => 'Disponible',
            'is_verified' => true,
            'security_pin' => \Illuminate\Support\Facades\Hash::make('8888'),
        ]);
    }
}
