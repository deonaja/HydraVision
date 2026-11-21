# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vue 3 + Vite + TypeScript + CSS murni (berjalan mandiri di sisi frontend dengan mock data dan mock API layer lokal yang siap disambungkan ke backend Laravel + MySQL; seluruh antarmuka berbahasa Indonesia).

## Users

- **Pengguna utama (User):** Pengguna umum dan *skincare enthusiast* yang ingin mengecek kondisi hidrasi kulitnya secara mandiri di rumah melalui ponsel maupun laptop, sekaligus pengguna uji dan evaluator proyek kuliah/portofolio.
- **Pengelola sistem (Admin):** Pengelola yang mengawasi akun pengguna dan memperbarui konten rekomendasi perawatan untuk tiap kelas hasil, sekaligus dapat menjalankan alur klasifikasi kulit dan melihat riwayatnya sendiri seperti User.

## Product Purpose

HydraVision adalah aplikasi web klasifikasi kondisi kulit berbasis AI. Pengguna mengunggah foto kulit, melihat pratinjau, lalu memperoleh klasifikasi kondisi kulit (**Terhidrasi** atau **Kering**) beserta persentase keyakinan model (*confidence*), saran perawatan umum yang sesuai, keterangan disclaimer bahwa hasil bukan diagnosis medis, serta penyimpanan otomatis ke riwayat pribadi agar perkembangan kondisi kulit mudah ditinjau kembali. Keberhasilan berarti pengguna dapat menyelesaikan cek kondisi kulit dengan rasa percaya dan paham langkah berikutnya dalam hitungan detik, sementara admin dapat mengelola akun dan rekomendasi tanpa hambatan.

## Positioning

Pendamping pengecekan hidrasi kulit mandiri berbasis foto di web yang menekankan kualitas input yang jujur (panduan pencahayaan cukup, area kulit jelas, tanpa filter), transparansi hasil AI (label biner `Terhidrasi` / `Kering`, skor *confidence*, dan disclaimer non-medis), serta kesinambungan antara hasil klasifikasi, riwayat pribadi, dan rekomendasi perawatan yang terkelola.

## Operating Context

Digunakan di rumah (meja rias, kamar mandi, ruang dengan pencahayaan alami/lampu ruang) melalui browser ponsel maupun desktop untuk mengunggah foto kulit, memeriksa hasil, dan meninjau riwayat berkala. Juga digunakan dalam konteks demonstrasi proyek kuliah dan portofolio frontend. Saat ini repositori hanya membangun lapisan frontend secara mandiri (`backend/` belum berisi implementasi Laravel maupun model AI).

## Capabilities and Constraints

- **Cakupan halaman:** Landing Page publik pengenalan HydraVision plus seluruh 26 kebutuhan fungsional (`FR-01` s/d `FR-26`) dari `RancanganAwal_Web_HydraVision.docx`.
- **Autentikasi & proteksi rute (`FR-01`–`FR-05`):** Registrasi (nama, email, password), login satu halaman untuk User dan Admin yang otomatis mengarahkan ke dashboard sesuai role, logout, lupa password via tautan email (termasuk simulasi alur reset password), dan proteksi halaman terautentikasi.
- **Profil (`FR-06`–`FR-07`):** Melihat data profil serta mengubah nama dan password.
- **Klasifikasi kulit (`FR-08`–`FR-20`):** Upload foto dari perangkat, validasi ketat format `JPG`/`JPEG`/`PNG` maksimal `5 MB` dengan pesan error yang jelas, pratinjau foto sebelum diproses, ganti/hapus foto sebelum klasifikasi, panduan pengambilan foto (pencahayaan cukup, area kulit terlihat jelas, tanpa filter), indikator loading selama klasifikasi, penanganan error yang jelas bila klasifikasi gagal, halaman hasil dengan foto + label (`Terhidrasi` atau `Kering`) + persentase *confidence* + rekomendasi perawatan sesuai kelas + disclaimer bahwa hasil bukan diagnosis medis + simpan otomatis ke riwayat.
- **Riwayat klasifikasi (`FR-21`–`FR-24`):** Daftar riwayat memuat tanggal, foto, hasil, dan *confidence*; halaman/panel detail satu riwayat; hapus riwayat milik sendiri dengan konfirmasi; filter dan pengurutan berdasarkan tanggal atau hasil.
- **Admin (`FR-25`–`FR-26`):** Kelola user (lihat detail, nonaktifkan, hapus akun dengan konfirmasi) dan kelola konten rekomendasi perawatan (tambah & ubah teks saran untuk kelas `Terhidrasi` dan `Kering` yang langsung tampil di hasil klasifikasi `FR-18`). Admin juga dapat melakukan klasifikasi dan melihat riwayat miliknya melalui alur yang sama dengan User.
- **Bahasa & terminologi:** Bahasa Indonesia; label hasil wajib `Terhidrasi` dan `Kering`; disclaimer non-medis wajib hadir pada setiap tampilan hasil.
- **Keputusan yang belum final / di luar cakupan FE saat ini:** Framework dan format model AI, API backend Laravel, skema database MySQL, penyimpanan gambar produksi, layanan email reset password, serta platform deployment/hosting.

## Brand Commitments

- **Nama produk:** HydraVision.
- **Aset & identitas visual:** Belum ada logo, panduan warna, atau aset brand yang sudah ditetapkan sebelumnya.

## Evidence on Hand

- `RancanganAwal_Web_HydraVision.docx`: Daftar lengkap `FR-01` s/d `FR-26`, 9 diagram user flow, dan tabel teknologi awal.
- **Yang belum tersedia (tidak boleh diklaim atau diada-adakan):** Data pengguna nyata, testimoni pelanggan, angka akurasi/benchmark model AI produksi, studi klinis, persetujuan dokter/dermatolog, atau foto sampel kulit nyata. Semua akun demo, riwayat contoh, simulasi klasifikasi, dan rekomendasi awal di frontend adalah data demonstrasi sintetis yang harus diberi penanda jelas sebagai mode demo/simulasi.

## Product Principles

- **Transparan atas batas AI:** Setiap hasil klasifikasi selalu menyandingkan label, tingkat keyakinan, dan disclaimer non-medis dengan jelas tanpa memberi kesan diagnosis klinis.
- **Pandu input sebelum menilai:** Kualitas foto (cahaya, kejelasan kulit, tanpa filter) dan pratinjau menjadi bagian inti alur, bukan catatan kaki tersembunyi.
- **Cepat dipakai di ponsel, lega dikelola di desktop:** Alur unggah dan cek hasil terasa alami di genggaman, sementara riwayat, detail, dan panel admin tetap jernih di layar lebar.
- **Satu bahasa pengalaman untuk User dan Admin:** Login, klasifikasi, dan riwayat konsisten lintas role dengan pemisahan kendali admin yang tegas dan aman (konfirmasi pada aksi destruktif).
- **Siap sambung ke backend:** Pemisahan state, layanan mock API, dan tipe TypeScript yang rapi memudahkan integrasi Laravel + model AI di tahap berikutnya.
