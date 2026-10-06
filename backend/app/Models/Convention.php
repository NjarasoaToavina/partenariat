<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Convention extends Model
{
    protected $table = 'conventions';

    protected $primaryKey = 'id_conv';

    protected $fillable = [
        'id_part',
        'num_conv',
        'preambule',
        'repres_int',
        'repres_ext',
        'fct_int',
        'fct_ext',
        'objet_part',
        'axe_collab',
        'cond_part',
        'cond_finan',
        'date_debut_conv',
        'date_fin_conv',
        'resiliation',
        'confidentialite',
        'regle_diff',
        'droit_appli',
        'photo_conv',
        'scan',
    ];

    protected $casts = [
        'date_debut_conv' => 'date',
        'date_fin_conv' => 'date',
    ];

    public function partenariat()
    {
        return $this->belongsTo(
            Partenariat::class,
            'id_part',
            'id_part'
        );
    }
}