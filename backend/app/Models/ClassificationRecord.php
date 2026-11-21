<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassificationRecord extends Model
{
    protected $fillable = [
        'user_id',
        'file_name',
        'image_path',
        'label',
        'confidence',
        'recommendations_snapshot',
        'is_simulated',
    ];

    protected $casts = [
        'recommendations_snapshot' => 'array',
        'is_simulated'             => 'boolean',
        'confidence'               => 'integer',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image_path) {
            return null;
        }
        if (str_starts_with($this->image_path, 'http') || str_starts_with($this->image_path, 'data:')) {
            return $this->image_path;
        }

        return '/storage/' . ltrim($this->image_path, '/');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
