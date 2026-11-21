<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareRecommendation extends Model
{
    protected $fillable = [
        'skin_label',
        'title',
        'body',
    ];

    protected $casts = [
        'skin_label' => 'string',
    ];
}
