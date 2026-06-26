<?php

namespace Tests\Feature;

use App\Models\Person;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DuplicateCheckTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_false_if_parameters_are_missing()
    {
        $response = $this->getJson(route('people.check-duplicate'));

        $response->assertStatus(200);
        $response->assertJson([
            'exists' => false
        ]);
    }

    /** @test */
    public function it_returns_false_if_no_similar_person_exists()
    {
        $response = $this->getJson(route('people.check-duplicate', [
            'first_name' => 'Luis',
            'last_name' => 'Rodriguez'
        ]));

        $response->assertStatus(200);
        $response->assertJson([
            'exists' => false
        ]);
    }

    /** @test */
    public function it_returns_true_and_matches_if_similar_person_exists()
    {
        // Crear una persona de prueba
        Person::create([
            'first_name' => 'Alejandro',
            'last_name' => 'Mendoza',
            'age' => 34,
            'gender' => 'Masculino',
            'last_seen_location' => 'Caracas',
            'last_seen_at' => '2026-06-24 12:00:00',
            'reporter_name' => 'Maria',
            'reporter_phone' => '0412-1111111',
            'reporter_relationship' => 'Hermana',
            'show_reporter_info' => false,
            'security_pin' => bcrypt('1234')
        ]);

        // Probar coincidencia exacta
        $response = $this->getJson(route('people.check-duplicate', [
            'first_name' => 'Alejandro',
            'last_name' => 'Mendoza'
        ]));

        $response->assertStatus(200);
        $response->assertJson([
            'exists' => true
        ]);
        $response->assertJsonCount(1, 'people');

        // Probar coincidencia parcial (LIKE)
        $responsePartial = $this->getJson(route('people.check-duplicate', [
            'first_name' => 'Alejan',
            'last_name' => 'Mend'
        ]));

        $responsePartial->assertStatus(200);
        $responsePartial->assertJson([
            'exists' => true
        ]);

        // Probar nombres invertidos
        $responseInverted = $this->getJson(route('people.check-duplicate', [
            'first_name' => 'Mendoza',
            'last_name' => 'Alejandro'
        ]));

        $responseInverted->assertStatus(200);
        $responseInverted->assertJson([
            'exists' => true
        ]);
    }
}
