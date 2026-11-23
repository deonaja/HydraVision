<?php

namespace App\Http\Controllers;

use App\Models\CareRecommendation;
use App\Models\ClassificationRecord;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HistoryController extends Controller
{
    public function classify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file_name'      => 'required|string|max:255',
            'image_data_url' => 'required|string',
        ]);

        if (! preg_match('/^data:image\/(png|jpe?g);base64,/', $validated['image_data_url'], $m)) {
            return response()->json(['message' => 'Format gambar tidak valid. Gunakan JPG atau PNG.'], 422);
        }
        $binary = base64_decode(substr($validated['image_data_url'], strpos($validated['image_data_url'], ',') + 1), true);
        if ($binary === false) {
            return response()->json(['message' => 'Data gambar rusak.'], 422);
        }

        $ext       = $m[1] === 'png' ? 'png' : 'jpg';
        $imagePath = 'scans/' . $request->user()->id . '/' . Str::uuid() . '.' . $ext;
        Storage::disk('public')->put($imagePath, $binary);

        $mlServiceUrl = env('ML_SERVICE_URL', 'http://ml-service:5000');
        $label = 'Terhidrasi';
        $confidence = 85;
        $isSimulated = false;

        $response = null;
        $candidates = array_unique([$mlServiceUrl, 'http://ml-service:5000', 'http://127.0.0.1:5000', 'http://host.docker.internal:5000']);
        $lastError = '';

        foreach ($candidates as $targetUrl) {
            try {
                $res = Http::timeout(10)
                    ->attach('file', $binary, 'photo.' . $ext)
                    ->post($targetUrl . '/predict');

                if ($res->successful()) {
                    $response = $res;
                    break;
                } else {
                    $lastError = 'HTTP ' . $res->status();
                }
            } catch (\Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        if ($response && $response->successful()) {
            $mlResult = $response->json();
            $label = $mlResult['label'] ?? 'Terhidrasi';
            $confidence = (int) ($mlResult['confidence'] ?? 85);
            $isSimulated = false;
        } else {
            Log::warning('ML service call failed: ' . $lastError);
            return response()->json([
                'message' => 'Layanan MobileNetV4 belum aktif (' . $lastError . '). Silakan jalankan perintah: docker compose up -d --build ml-service'
            ], 503);
        }

        $recommendations = CareRecommendation::where('skin_label', $label)
            ->get(['title', 'body']);

        $record = ClassificationRecord::create([
            'user_id'                  => $request->user()->id,
            'file_name'                => $validated['file_name'],
            'image_path'               => $imagePath,
            'label'                    => $label,
            'confidence'               => $confidence,
            'recommendations_snapshot' => $recommendations->toArray(),
            'is_simulated'             => $isSimulated,
        ]);

        return response()->json(['data' => $record], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $records = ClassificationRecord::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['data' => $records]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file_name'      => 'required|string|max:255',
            'image_data_url' => 'required_without:image_path|string',
            'image_path'     => 'required_without:image_data_url|string|max:255',
            'label'          => 'required|in:Terhidrasi,Kering',
            'confidence'     => 'required|integer|min:0|max:100',
            'is_simulated'   => 'sometimes|boolean',
        ]);

        $imagePath = $validated['image_path'] ?? null;

        if (! empty($validated['image_data_url'])) {
            if (! preg_match('/^data:image\/(png|jpe?g);base64,/', $validated['image_data_url'], $m)) {
                return response()->json(['message' => 'Format gambar tidak valid. Gunakan JPG atau PNG.'], 422);
            }
            $binary = base64_decode(substr($validated['image_data_url'], strpos($validated['image_data_url'], ',') + 1), true);
            if ($binary === false) {
                return response()->json(['message' => 'Data gambar rusak.'], 422);
            }
            $ext       = $m[1] === 'png' ? 'png' : 'jpg';
            $imagePath = 'scans/' . $request->user()->id . '/' . Str::uuid() . '.' . $ext;
            Storage::disk('public')->put($imagePath, $binary);
        }

        // Snapshot recommendations for this label
        $recommendations = CareRecommendation::where('skin_label', $validated['label'])
            ->get(['title', 'body']);

        $record = ClassificationRecord::create([
            'user_id'                  => $request->user()->id,
            'file_name'                => $validated['file_name'],
            'image_path'               => $imagePath,
            'label'                    => $validated['label'],
            'confidence'               => $validated['confidence'],
            'recommendations_snapshot' => $recommendations->toArray(),
            'is_simulated'             => $validated['is_simulated'] ?? true,
        ]);

        return response()->json(['data' => $record], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $record = ClassificationRecord::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json(['data' => $record]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $record = ClassificationRecord::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if ($record->image_path && str_starts_with($record->image_path, 'scans/')) {
            Storage::disk('public')->delete($record->image_path);
        }

        $record->delete();

        return response()->json(['message' => 'Riwayat berhasil dihapus.']);
    }
}
