<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    //
    protected $primaryKey = 'id_com';

    protected $fillable = [
        'user_id',
        'id_pub',
        'contenu_com',
        'date_com'
    ];

    protected $casts = [
        'date_com' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(
            User::class,
            'user_id',
            'id'
        );
    }
    
    public function publication()
    {
        return $this->belongsTo(
            Publication::class,
            'id_pub',
            'id_pub'
        );
    }
}
