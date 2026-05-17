<?php

namespace App\Auth;

use Illuminate\Auth\EloquentUserProvider;

class JWTUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by their unique identifier.
     * Auto-creates a stub record if the user doesn't exist yet.
     * Users live in service-auth; product-service creates a local stub on first touch.
     */
    public function retrieveById($identifier): mixed
    {
        $model = parent::retrieveById($identifier);

        if ($model === null) {
            $instance = $this->createModel();
            $instance->id = $identifier;
            $instance->save();
            $model = $instance;
        }

        return $model;
    }
}
