<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $fillable = ['nombre', 'email', 'password', 'rol', 'estado'];
    protected $hidden = ['password', 'remember_token'];
    
    public function setPasswordAttribute($value) {
        $this->attributes['password'] = bcrypt($value);
    }
}