<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Historique extends Model
{
    protected $primaryKey = 'id_hist';

    protected $fillable = [
        'user_id',
        'action',
        'module',
        'description',
        'element_id',
    ];

    // Relation avec l'utilisateur
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}