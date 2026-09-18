<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atelier extends Model
{
    //
    protected $primaryKey = 'id_atel';

    protected $fillable = [
        'date_atel',
        'campus_atel',
        'groupe',
        'contenu_atel',
        'intervenant',
        'statut_atel',
    ];
    
    protected $casts = [
        'date_atel' => 'datetime',
    ];
}
