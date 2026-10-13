<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Proposition extends Model
{
    //
    protected $table = 'propositions';
    protected $primaryKey = 'id_propos';
    protected $fillable = [
        'user_id',
        'part_propos',
        'campus_propos',
        'contact_propos',
        'commentaire',
        'date_propos',
        'etat_propos',
    ];

    protected $casts = [
        'date_propos' => 'datetime',
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
