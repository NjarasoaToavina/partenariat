<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    //
       //
    protected $table = 'activites';
    protected $primaryKey = 'id_activ';
    protected $fillable = [
        'id',
        'sujet',
        'date_debut_activ',
        'date_fin_activ',
        'contact_propos',
        'commentaire',
        'date_propos',
        'etat_propos',
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
}
