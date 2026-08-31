<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenariat extends Model
{
    //
    protected $primaryKey = 'id_part';

    protected $fillable = [
        'nom_part',
        'campus_part',
        'statut_part',
        'type_part',
        'nbr_intervenant',
        'prochaine_action',
        'contact_part',
        'observation',
    ];
}
