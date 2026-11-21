---
version: 1
slug: "src-views-notfoundview-vue"
primary_target: "src/views/NotFoundView.vue"
related_targets: ["src/router/index.ts"]
---

# Surface Brief: Halaman 404 (NotFoundView)

- **Scope:** Halaman fallback 404 (`src/views/NotFoundView.vue`) untuk seluruh rute tidak dikenal (`/:pathMatch(.*)*`).
- **Visitor mode:** Operate (recovery & wayfinding).
- **Audience & job:** Tamu, User, atau Admin yang membuka URL tidak valid, typo, atau tautan lama perlu langsung tahu bahwa alamat tersebut tidak tersedia dan dapat kembali ke alur kerja utamanya dalam satu klik tanpa kehilangan konteks sesi.
- **Constraints:** Adaptif—tampil di dalam `AppShell` (dengan sidebar) saat sudah login, dan tampil mandiri dengan topbar brand HydraVision saat belum login. Bahasa Indonesia natural (sentence case), patuh penuh pada token `DESIGN.md` (*Meja Rias Linen & Lempung*), tanpa kicker/eyebrow di atas `<h1>`.

## Direction contract

- **THESIS:** Halaman 404 sebagai kompartemen lempung kosong pada baki meja rias HydraVision—menolak pola generik ikon besar di tengah layar putih dengan menghadirkan baki terakota dua ruang yang memisahkan tanda posisi kosong (`404`) dari piringan keramik panduan pemulihan.
- **OWN-WORLD:** Kanvas Oat Linen (`#ede5d8`), baki Matte Terracotta (`#a34d2d`) dengan ceruk Recessed Clay (`#904225`) dan garis putus-putus bekas piringan yang kosong, berdampingan dengan piringan Glazed Ceramic Ivory (`#faf6ef`), aksi utama Mineral Indigo (`#234b72`), tipografi `Bricolage Grotesque` + `Onest` (`.tabular`), dan ikon stroke `HvIcon`.
- **STORY:** Pengunjung langsung melihat rute mana yang keliru, memahami bahwa sesi mereka tetap aman, lalu memilih satu tombol utama kontekstual (Ringkasan Admin, Dashboard, atau Beranda), tombol Kembali yang aktif, atau langsung melompat ke halaman tujuan lewat daftar jalur cepat di bawah baki.
- **FIRST VIEWPORT:** Pada desktop maupun mobile, baki terakota dua ruang (`.notfound-tray`, rasio `0.85fr / 1.15fr`, bertumpuk vertikal di `< 860px`) langsung menjadi pusat perhatian di atas lipatan: ceruk kiri menampilkan angka `404` terukir dalam bingkai putus-putus piringan kosong; ceruk kanan memuat piringan keramik dengan `<h1>` "Halaman tidak ditemukan", alamat URL salah beserta tombol salin, tombol utama Mineral Indigo kontekstual, dan tombol Kembali keramik. Di bawahnya duduk panel direktori jalur cepat keramik satu garis pembatas.
- **FORM:** Established-world narrow recovery surface (baki dua kompartemen adaptif + direktori jalur cepat), `seed: none (pinned)` — "gunakan impeccable buat halamanny dan untuk setiap page yang salah arah, tampilkan 404".
- **FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
