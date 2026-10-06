<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Convention;

class Partenariat extends Model
{
    //
    protected $primaryKey = 'id_part';

    protected $fillable = [
        'nom_part',
        'campus_part',
        'statut_part',
        'type_part',
        'nbr_intervention',
        'prochaine_action',
        'contact_part',
        'observation',
        ];

    public function conventions()
    {
        return $this->hasMany(Convention::class, 'id_part', 'id_part');
    }
}
        