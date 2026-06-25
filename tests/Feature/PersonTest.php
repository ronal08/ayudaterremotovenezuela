<?php

namespace Tests\Feature;

use App\Models\Person;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PersonTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can publish a missing person report successfully.
     */
    public function test_can_create_a_missing_person_report()
    {
        $response = $this->post(route('people.store'), [
            'first_name' => 'Luis',
            'last_name' => 'Gómez',
            'age' => 28,
            'gender' => 'Masculino',
            'last_seen_location' => 'Valencia, Carabobo',
            'last_seen_at' => '2026-06-25 10:00:00',
            'distinctive_features' => 'Ninguna',
            'reporter_name' => 'Ana Gómez',
            'reporter_phone' => '0424-9991122',
            'reporter_relationship' => 'Esposa',
            'show_reporter_info' => false,
            'security_pin' => '4321',
        ]);

        $response->assertRedirect(route('people.index'));
        $this->assertDatabaseHas('people', [
            'first_name' => 'Luis',
            'last_name' => 'Gómez',
            'status' => 'missing',
        ]);
    }

    /**
     * Test updating status requires correct security PIN validation.
     */
    public function test_can_update_status_with_correct_pin()
    {
        $person = Person::create([
            'first_name' => 'Luis',
            'last_name' => 'Gómez',
            'age' => 28,
            'gender' => 'Masculino',
            'last_seen_location' => 'Valencia, Carabobo',
            'last_seen_at' => '2026-06-25 10:00:00',
            'distinctive_features' => 'Ninguna',
            'reporter_name' => 'Ana Gómez',
            'reporter_phone' => '0424-9991122',
            'reporter_relationship' => 'Esposa',
            'show_reporter_info' => false,
            'security_pin' => Hash::make('4321'),
            'status' => 'missing',
        ]);

        // Intentar actualizar con PIN incorrecto debe fallar
        $response = $this->post(route('people.status.update', $person->id), [
            'pin' => '0000',
            'status' => 'found',
        ]);
        $response->assertRedirect(route('people.show', $person->id));
        $this->assertEquals('missing', $person->fresh()->status);
        $response->assertSessionHas('error');

        // Intentar actualizar con PIN correcto debe tener éxito
        $response = $this->post(route('people.status.update', $person->id), [
            'pin' => '4321',
            'status' => 'found',
        ]);
        $response->assertRedirect(route('people.show', $person->id));
        $this->assertEquals('found', $person->fresh()->status);
        $response->assertSessionHas('success');
    }
}
