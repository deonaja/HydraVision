---
version: 1
slug: "frontend-index-html"
primary_target: "index.html"
related_targets: []
---

# Surface Brief: HydraVision Web Frontend

- **Scope:** Seluruh antarmuka web frontend HydraVision (Landing Page publik + aplikasi penuh User & Admin sesuai `FR-01` s/d `FR-26` di `RancanganAwal_Web_HydraVision.docx`).
- **Visitor Mode:** Persuade (Landing Page publik) + Operate (Autentikasi, Dashboard User/Admin, Klasifikasi Kulit & Hasil, Riwayat & Detail, Profil, Admin Kelola User, Admin Kelola Rekomendasi).
- **Audience & Job:** Pengguna umum/skincare enthusiast di rumah (HP & laptop) yang ingin mengecek hidrasi kulitnya (Terhidrasi vs Kering) dari foto tanpa filter, membaca skor keyakinan serta saran perawatan umum, dan memantau riwayat; plus Admin yang mengelola akun user dan konten rekomendasi perawatan.
- **Constraints:** Bahasa Indonesia; Vue 3 + Vite + TypeScript + CSS murni; berjalan mandiri dengan lapisan mock API/data sintetis yang ditandai jelas; wajib mematuhi validasi JPG/JPEG/PNG maks 5 MB, panduan 3 syarat foto, disclaimer non-medis, dan konfirmasi aksi destruktif.
- **Critique Reference (Code-led by explicit user decision due to temporary 429 image-gen quota):** `.impeccable/mocks/decision/assigned.png` — User verbatim confirmation: `"Lanjut bangun sekarang (code-first) memakai desain Meja Rias Linen & Lempung (assigned.png) sebagai acuan visual utama untuk seluruh aplikasi Vue + TypeScript + CSS"`.
- **Memorable Moment:** Nampan meja rias keramik terracotta dua kompartemen di atas permukaan linen tenun hangat yang menyatukan zona unggah foto interaktif dengan kartu hasil hidrasi dan strip perbandingan riwayat serial.

## Direction contract

- **THESIS:** Cek hidrasi kulit yang terasa seperti cermin meja rias pagi di rumah—hangat, jujur tanpa filter, dan terstruktur rapi—menolak template SaaS skincare putih-biru polosan maupun tampilan klinis rumah sakit yang dingin.
- **OWN-WORLD:** Permukaan linen tenun hangat (`#EFE7DB`) berpadu nampan keramik terracotta matte (`#A65031`), piringan keramik gading (`#F8F4ED`), tinta espresso (`#211B17`), dan aksen mineral-indigo (`#234B72`) untuk aksi utama serta status Terhidrasi; tipografi Bricolage Grotesque dan Onest berangka tabular tanpa dekorasi gradien atau kartu seragam.
- **STORY:** Pengunjung langsung melihat cara unggah foto kulit tanpa filter, memahami perbedaan status Terhidrasi dan Kering beserta persentase keyakinan dan disclaimer non-medis, lalu masuk ke alur cek kulit, riwayat, atau panel admin dengan percaya diri.
- **FIRST VIEWPORT:** Bilah atas memuat logo HydraVision dan tautan Cara Kerja, Panduan Foto, Masuk, Daftar; judul utama dan subjudul di atas nampan keramik terracotta dua ruang (kiri zona unggah foto + tombol Mulai Cek Kulit indigo, kanan kartu hasil simulasi Terhidrasi 91% + saran perawatan) didampingi daftar Panduan Foto & catatan Bukan diagnosis medis di sisi kanan, serta strip riwayat serial 4 tanggal di bagian bawah lipatan.
- **FORM:** Meja Rias Linen & Lempung, kandidat #6 dari daftar berurutan, `seed:77b9303c8eb45452` (diperkuat ketegasan sel kosong & angka tabular, hierarki skala utama, strip perbandingan serial, dan alur kontinu).
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
