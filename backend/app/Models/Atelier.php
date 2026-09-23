<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atelier extends Model
{
    //
    protected $primaryKey = 'id_atel';

    protected $fillable = [
        'date_debut_atel',
        'date_fin_atel',
        'campus_atel',
        'atelier_atel',
        'groupe',
        'contenu_atel',
        'intervenant',
        'statut_atel',
    ];
    
    protected $casts = [
        'date_atel' => 'datetime',
    ];
}
