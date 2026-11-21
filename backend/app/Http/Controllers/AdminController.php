<?php

namespace App\Http\Controllers;

use App\Models\ClassificationRecord;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $users = User::withCount('classificationRecords')->orderByDesc('created_at')->get()->map(fn ($u) => [
            'id'            => $u->id,
            'name'          => $u->name,
            'email'         => $u->email,
            'role'          => $u->role,
            'status'        => $u->status,
            'created_at'    => $u->created_at,
            'last_login_at' => $u->last_login_at,
            'checks_count'  => $u->classification_records_count,
        ]);

        return response()->json(['data' => $users]);
    }

    public function updateUserStatus(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:active,inactive,banned',
        ]);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Tidak dapat mengubah status akun sendiri.'], 422);
        }

        $user->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status pengguna berhasil diperbarui.',
            'user'    => [
                'id'     => $user->id,
                'status' => $user->status,
            ],
        ]);
    }

    public function deleteUser(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Tidak dapat menghapus akun sendiri.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Pengguna berhasil dihapus.']);
    }

    public function dashboard(): JsonResponse
    {
        $totalUsers        = User::where('role', 'user')->count();
        $activeUsers       = User::where('role', 'user')->where('status', 'active')->count();
        $totalScans        = ClassificationRecord::count();
        $terhidrasiCount   = ClassificationRecord::where('label', 'Terhidrasi')->count();
        $keringCount       = ClassificationRecord::where('label', 'Kering')->count();
        $recentUsers       = User::where('role', 'user')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get(['id', 'name', 'email', 'status', 'created_at']);
        $recentScans       = ClassificationRecord::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'data' => [
                'stats' => [
                    'total_users'      => $totalUsers,
                    'active_users'     => $activeUsers,
                    'total_scans'      => $totalScans,
                    'terhidrasi_count' => $terhidrasiCount,
                    'kering_count'     => $keringCount,
                ],
                'recent_users' => $recentUsers,
                'recent_scans' => $recentScans,
            ],
        ]);
    }
}
