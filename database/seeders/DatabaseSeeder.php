<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Patient;
use App\Models\CareCategory;
use App\Models\CareProblem;
use App\Libraries\Role;
use App\Models\CareProblemItems;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    // Create admin user with full permissions
    $admin = User::create([
      'name' => 'Admin User',
      'first_name' => 'Admin',
      'last_name' => 'User',
      'email' => 'admin@example.com',
      'password' => Hash::make('admin123'),
      'role' => Role::getPermissions('admin'),
      'role_type' => 'admin',
      'email_verified_at' => now(),
    ]);

    // Create manager (moderator) - can manage nurses, create groups, approve actions
    $manager = User::create([
      'name' => 'Jane Smith',
      'first_name' => 'Jane',
      'last_name' => 'Smith',
      'email' => 'jane@example.com',
      'password' => Hash::make('password123'),
      'role' => Role::getPermissions('manager'),
      'role_type' => 'manager',
      'email_verified_at' => now(),
    ]);

    // Create nurse (regular user) - read-only access
    $nurse = User::create([
      'name' => 'Bob Johnson',
      'first_name' => 'Bob',
      'last_name' => 'Johnson',
      'email' => 'bob@example.com',
      'password' => Hash::make('password123'),
      'role' => Role::getPermissions('nurse'),
      'role_type' => 'nurse',
      'email_verified_at' => now(),
    ]);

    // Create 100 additional test users
    for ($i = 1; $i <= 100; $i++) {
      User::create([
        'name' => "Test User $i",
        'first_name' => "Test",
        'last_name' => "User $i",
        'email' => "testuser$i@example.com",
        'password' => Hash::make('password123'),
        'role' => Role::getPermissions('nurse'),
        'role_type' => 'nurse',
        'email_verified_at' => now(),
      ]);
    }

    $firstPatient = null;

    // Create 100 test patients
    for ($i = 1; $i <= 100; $i++) {
      $patient = Patient::create([
        'first_name' => "Test",
        'last_name' => "Patient $i",
        'social_id' => "$i",
        'arrival_date' => now(),
        'remarks' => "test",
      ]);

      if ($firstPatient == null) {
        $firstPatient = $patient;
      }
    }

    $categories = [
      [
        'name' => "Aineenvaihdunta",
        'description' => "aineenvaihduntaan ja immunologiseen järjestelmään liittyvät osatekijät matalalle ja korkealle verensokerille",
        'subItems' => ["Verensokerin muutos"],
      ],

      [
        'name' => "Aisti- ja neurologiset toiminnot",
        'description' => "aisti- ja neurologisiin toimintoihin liittyvät osatekijät potilaan kuulo-, näkö-, tunto-, haju- ja maku- sekä tasapainoaisteissa tapahtuvia muutoksia ja häiriöitä sekä aistien toimintaa edistäviä auttamiskeinoja.",
        'subItems' => ["Aistitoiminnan muutos"],
      ],

      [
        'name' => "Elämänkaari",
        'description' => "Elämänkaari -elämän vaiheisiin liittyvät osatekijät",
        'subItems' => ["Toimintakyky", "Lähestyvä kuolema"],
      ],

      [
        'name' => "Erittäminen",
        'description' => "ruoansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät",
        'subItems' => ["Virtsaamiseen liittyvä häiriö", "Verenvuoto", "Muu erittämiseen liittyvä häiriö"],
      ],

      [
        'name' => "Hengitys",
        'description' => "keuhkojen toimintaan ja hengittämiseen liittyvät osatekijät",
        'subItems' => ["Hengitysvaikeus"],
      ],

      [
        'name' => "Hoidon ja jatkohoidon koordinointi",
        'description' => "moniammatillisen hoidon ja jatkohoidon sekä yksilöllisten palvelutarpeiden koordinointi ja ohjaus",
        'subItems' => ["Asiantuntijapalvelujen tarve", "Jatkohoidon tarve"],
      ],

      [
        'name' => "Kivunhoito",
        'description' => "kipuun ja kivunhoitoon liittyvät osatekijät",
        'subItems' => [],
      ],

      [
        'name' => "Kudoseheys",
        'description' => "lima- ja sarveiskalvojen sekä ihon ja ihonalaisten kerrosten kuntoon liittyvät osatekijät",
        'subItems' => ["Ihorikko", "Kirurginen haava", "Diabeettinen jalkahaava", "Säärihaava", "Painehaava", "Tulehtunut haava"],
      ],

      [
        'name' => "Lääkehoito",
        'description' => "lääkkeiden käyttöön ja lääkehoidon toteuttamiseen liittyvät osatekijät",
        'subItems' => [],
      ],

      [
        'name' => "Nestetasapaino",
        'description' => "elimistön nestemäärään liittyvät osatekijät",
        'subItems' => [],
      ],
      [
        'name' => "Psyykkinen toimintakyky",
        'description' => "psyykkisen toimintakykyyn liittyvät osatekijät",
        'subItems' => [],
      ],

      [
        'name' => "Päivittäiset toiminnot ja omatoimisuus",
        'description' => "omatoimisuuteen ja fyysiseen toimintakykyyn liittyvät osatekijät",
        'subItems' => [],
      ],

      [
        'name' => "Ravitsemus",
        'description' => "ravinnon ja ravintoaineiden turvaamiseen liittyvät osatekijät",
        'subItems' => [],
      ],

      [
        'name' => "Verenkierto",
        'description' => "eri elinten verenkiertoon liittyvät osatekijät",
        'subItems' => [],
      ],
    ];

    foreach ($categories as $categoryData) {
      $parentCategory = CareCategory::create([
        'parent_category_id' => null,
        'name' => $categoryData['name'],
        'description' => $categoryData['description'],
      ]);

      foreach ($categoryData['subItems'] as $subItemName) {
        CareCategory::create([
          'parent_category_id' => $parentCategory->id,
          'name' => $subItemName
        ]);
      }
    }

    $problem = CareProblem::create([
      'category_id' => $parentCategory->id,
      'author_id' => $admin->id,
      'patient_id' =>  $firstPatient->id,
      'description' => "This patient has some issues :'(",
    ]);

    $problemItem = CareProblemItems::create([
      'problem_id' => $problem->id,
      'description' => "Very meaningful text here...",
      'author_id' => $manager->id,
      'type' => '1',
    ]);
  }
}
