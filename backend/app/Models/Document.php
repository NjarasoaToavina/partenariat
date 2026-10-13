<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    //

    protected $table = 'documents';
    protected $primaryKey = 'id_doc';
    protected $fillable = [
        'user_id',
        'type_doc',
        'statut_doc',
        'date_envoi',
        'remarque',
        'fichier_doc'
    ];

    protected $casts = [
        'date_envoi' => 'datetime',
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
