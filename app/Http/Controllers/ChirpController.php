{
$chirps = [
[
'author' => 'Jane Doe',
'message' => 'Just deployed my first Laravel app!',
'time' => '5 minutes ago'
],
[
'author' => 'John Smith',
'message' => 'Loving the new features in Laravel 9!',
'time' => '10 minutes ago'
],
[
'author' => 'Alice Johnson',
'message' => 'Excited to start my new project with Laravel!',
'time' => '15 minutes ago'
]
];
return view('home', ['chirps' => $chirps]);
}