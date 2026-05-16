<?php

namespace App\Ship\Helpers;

use OpenApi\Attributes as OA;

#[OA\Info(
    title: 'service-auth API',
    version: '1.0.0',
    description: 'Authentication microservice — register, login, JWT token management',
)]
#[OA\Server(url: 'http://localhost/api/auth', description: 'Gateway')]
#[OA\Server(url: 'http://localhost:8001/api', description: 'Direct')]
#[OA\SecurityScheme(
    securityScheme: 'bearerAuth',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
)]
class OpenApi {}
