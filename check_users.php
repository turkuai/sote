<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

use App\Models\User;

$users = User::all();
echo "Total users: " . $users->count() . "\n";
foreach ($users as $user) {
    echo "- ID: " . $user->id . " | Email: " . $user->email . " | Name: " . $user->first_name . " " . $user->last_name . "\n";
}
?>
