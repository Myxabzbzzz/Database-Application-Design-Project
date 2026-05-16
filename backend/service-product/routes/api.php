<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

// Load routes from all containers
$containersPath = app_path('Containers');

if (File::exists($containersPath)) {
    $containers = File::directories($containersPath);

    foreach ($containers as $container) {
        $routesPath = $container . '/UI/API/Routes/api.php';

        if (File::exists($routesPath)) {
            require $routesPath;
        }
    }
}
