<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Commentaire;

class Publication extends Model
{
    protected $primaryKey = 'id_pub';

    protected $fillable = [
        'user_id',
        'titre_pub',
        'contenu_pub',
        'reaction',
        'photo_pub',
        'date_pub',
        'prochaine_action',
        'contact_part',
        'observation',
    ];

    protected $casts = [
        'date_pub' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id',
            'id'
        );
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class, 'id_pub', 'id_pub');
    }

    public function reactions()
    {
        return $this->hasMany(Reaction::class, 'id_pub', 'id_pub');
    }

}

