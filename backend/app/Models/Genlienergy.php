<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Genlienergy extends Model
{
    protected $table = 'registro';
    protected $primaryKey = 'idRegistro'; // Tu llave de Workbench
    protected $guarded = []; // Deja pasar todo
}