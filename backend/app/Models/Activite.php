<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Activite extends Model
{
    //
       //
    protected $table = 'activites';
    protected $primaryKey = 'id_activ';
    protected $fillable = [
        'id',
        'sujet',
        'etat_activ',
        'date_debut_activ',
        'date_fin_activ',
    ];

    protected $casts = [
        'date_debut_activ' => 'datetime',
        'date_fin_activ' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id',
            'id'
        );
    }

    protected function etatActiv(): Attribute
    {
        return Attribute::make(
            get: function (string $value, array $attributes) {
                // Si la date de fin est passée, on retourne 'realise' dynamiquement
                if ($attributes['date_fin_activ'] && Carbon::parse($attributes['date_fin_activ'])->isPast()) {
                    return 'realise';
                }
                return $value; // Sinon on retourne l'état stocké ('planifie', etc.)
            }
        );
    }
    
}

