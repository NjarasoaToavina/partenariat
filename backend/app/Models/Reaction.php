<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{
    //
    protected $primaryKey = 'id_react';

    protected $fillable = [
        'user_id',
        'id_pub',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'id_pub', 'id_pub');
    }
}
