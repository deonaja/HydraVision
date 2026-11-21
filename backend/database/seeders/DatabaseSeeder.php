<?php

namespace Database\Seeders;

use App\Models\CareRecommendation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name'     => 'Raka Pratama',
            'email'    => 'admin@hydravision.demo',
            'password' => Hash::make('admin1234'),
            'role'     => 'admin',
            'status'   => 'active',
        ]);

        // Regular user
        User::create([
            'name'     => 'Nadia Kusuma',
            'email'    => 'nadia@hydravision.demo',
            'password' => Hash::make('user1234'),
            'role'     => 'user',
            'status'   => 'active',
        ]);

        // Care recommendations for Terhidrasi
        $terhidrasiRecs = [
            [
                'title' => 'Pertahankan Kelembapan Kulit',
                'body'  => 'Kulit Anda dalam kondisi terhidrasi dengan baik. Terus gunakan pelembap ringan setiap hari untuk menjaga kelembapan optimal. Pilih pelembap berbahan dasar air (water-based) agar kulit tidak terasa berat.',
            ],
            [
                'title' => 'Minum Air yang Cukup',
                'body'  => 'Pertahankan asupan air minimal 8 gelas per hari. Hidrasi dari dalam sangat penting untuk menjaga elastisitas dan kesehatan kulit jangka panjang.',
            ],
            [
                'title' => 'Gunakan Sunscreen Harian',
                'body'  => 'Lindungi kulit yang sehat dengan sunscreen SPF 30+ setiap hari, bahkan di dalam ruangan. Paparan UV dapat merusak barrier kulit dan mengurangi kadar air di dalam kulit.',
            ],
        ];

        foreach ($terhidrasiRecs as $rec) {
            CareRecommendation::create([
                'skin_label' => 'Terhidrasi',
                'title'      => $rec['title'],
                'body'       => $rec['body'],
            ]);
        }

        // Care recommendations for Kering
        $keringRecs = [
            [
                'title' => 'Gunakan Pelembap Intensif',
                'body'  => 'Kulit Anda membutuhkan hidrasi ekstra. Gunakan pelembap intensif berbahan ceramide, hyaluronic acid, atau glycerin segera setelah mandi saat kulit masih sedikit lembap untuk mengunci moisture.',
            ],
            [
                'title' => 'Hindari Sabun Berbahan Keras',
                'body'  => 'Gunakan sabun muka dan sabun mandi yang bebas sulfat dan bahan keras. Pilih produk berlabel "gentle" atau "for sensitive/dry skin" untuk menghindari iritasi lebih lanjut.',
            ],
            [
                'title' => 'Perbanyak Asupan Air dan Omega-3',
                'body'  => 'Tingkatkan konsumsi air minum hingga 10 gelas per hari. Konsumsi makanan kaya omega-3 seperti ikan salmon, alpukat, dan kacang kenari untuk membantu memulihkan barrier lipid kulit secara alami.',
            ],
            [
                'title' => 'Gunakan Humidifier di Ruangan',
                'body'  => 'Jika Anda sering berada di ruangan ber-AC, gunakan humidifier untuk menjaga kelembapan udara di atas 40–60%. Udara kering mempercepat penguapan air dari permukaan kulit.',
            ],
        ];

        foreach ($keringRecs as $rec) {
            CareRecommendation::create([
                'skin_label' => 'Kering',
                'title'      => $rec['title'],
                'body'       => $rec['body'],
            ]);
        }
    }
}
