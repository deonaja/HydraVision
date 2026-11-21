<?php

namespace App\Http\Controllers;

use App\Models\CareRecommendation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index(): JsonResponse
    {
        $recommendations = CareRecommendation::orderBy('skin_label')->orderBy('id')->get();

        return response()->json(['data' => $recommendations]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'skin_label' => 'required|in:Terhidrasi,Kering',
            'title'      => 'required|string|max:255',
            'body'       => 'required|string',
        ]);

        $recommendation = CareRecommendation::create($validated);

        return response()->json(['data' => $recommendation], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $recommendation = CareRecommendation::findOrFail($id);

        $validated = $request->validate([
            'skin_label' => 'sometimes|in:Terhidrasi,Kering',
            'title'      => 'sometimes|string|max:255',
            'body'       => 'sometimes|string',
        ]);

        $recommendation->update($validated);

        return response()->json(['data' => $recommendation]);
    }

    public function destroy(int $id): JsonResponse
    {
        $recommendation = CareRecommendation::findOrFail($id);
        $recommendation->delete();

        return response()->json(['message' => 'Rekomendasi berhasil dihapus.']);
    }
}
