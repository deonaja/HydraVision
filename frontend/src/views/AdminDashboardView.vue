<script setup lang="ts">
import { computed } from 'vue'
import { storeState, currentUser, myHistory } from '@/services/mockStore'
import AppShell from '@/components/AppShell.vue'
import HvIcon from '@/components/HvIcon.vue'

const managedUsers = computed(() => storeState.users.filter((u) => u.role === 'user'))
const activeUsers = computed(() => managedUsers.value.filter((u) => u.status === 'active').length)
const inactiveUsers = computed(() => managedUsers.value.filter((u) => u.status === 'inactive').length)
const hydratedRecs = computed(
  () => storeState.recommendations.filter((r) => r.skinLabel === 'Terhidrasi').length,
)
const dryRecs = computed(
  () => storeState.recommendations.filter((r) => r.skinLabel === 'Kering').length,
)
</script>

<template>
  <AppShell>
    <div class="admin-dash">
      <header class="page-head">
        <div>
          <h1>Ringkasan Panel Admin</h1>
          <p class="page-sub">
            Selamat bertugas, {{ currentUser?.name }}. Kelola akun pengguna, perbarui konten saran
            perawatan, atau jalankan klasifikasi kulit langsung.
          </p>
        </div>
        <div class="head-actions">
          <RouterLink to="/admin/users" class="btn btn-ceramic">
            <HvIcon name="users" :size="17" />
            <span>Kelola User</span>
          </RouterLink>
          <RouterLink to="/admin/recommendations" class="btn btn-primary">
            <HvIcon name="book-care" :size="17" />
            <span>Kelola Rekomendasi</span>
          </RouterLink>
        </div>
      </header>

      <!-- Tabular system counters -->
      <section class="summary-bar ceramic-panel" aria-label="Ringkasan data sistem">
        <div class="summary-cell">
          <span class="summary-label">Total Akun User</span>
          <strong class="summary-value tabular">{{ managedUsers.length }}</strong>
          <span class="summary-sub tabular">{{ activeUsers }} aktif · {{ inactiveUsers }} nonaktif</span>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Saran Kulit Terhidrasi</span>
          <strong class="summary-value tabular is-indigo">{{ hydratedRecs }}</strong>
          <span class="summary-sub">Tampil otomatis di hasil FR-18</span>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Saran Kulit Kering</span>
          <strong class="summary-value tabular is-clay">{{ dryRecs }}</strong>
          <span class="summary-sub">Tampil otomatis di hasil FR-18</span>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Total Klasifikasi Tersimpan</span>
          <strong class="summary-value tabular">{{ storeState.history.length }}</strong>
          <span class="summary-sub tabular">{{ myHistory.length }} milik akun admin</span>
        </div>
      </section>

      <!-- Dual admin control tray -->
      <section class="vanity-tray admin-tray">
        <div class="vanity-tray-well tray-slot">
          <article class="ceramic-dish">
            <div>
              <h2>Kelola Akun Pengguna</h2>
              <p>
                Lihat detail akun user terdaftar, nonaktifkan akses sementara, atau hapus akun
                beserta konfirmasi keamanan.
              </p>
            </div>
            <RouterLink to="/admin/users" class="btn btn-primary">
              <span>Buka Daftar User</span>
              <HvIcon name="arrow-right" :size="16" />
            </RouterLink>
          </article>
        </div>

        <div class="vanity-tray-well tray-slot">
          <article class="ceramic-dish">
            <div>
              <h2>Kelola Konten Rekomendasi</h2>
              <p>
                Tambah dan perbarui teks saran perawatan umum untuk kelas Terhidrasi dan Kering.
                Perubahan langsung tampil pada halaman hasil klasifikasi.
              </p>
            </div>
            <RouterLink to="/admin/recommendations" class="btn btn-clay">
              <span>Atur Rekomendasi</span>
              <HvIcon name="arrow-right" :size="16" />
            </RouterLink>
          </article>
        </div>
      </section>

      <!-- Admin also shares classify & history flow -->
      <section class="ceramic-panel admin-self">
        <div>
          <h2>Alur Klasifikasi & Riwayat Pribadi Admin</h2>
          <p>
            Sesuai spesifikasi HydraVision, Admin dapat menguji unggah foto, melihat hasil
            klasifikasi lengkap dengan rekomendasi terbaru, dan meninjau riwayat miliknya sendiri.
          </p>
        </div>
        <div class="self-actions">
          <RouterLink to="/classify" class="btn btn-primary">Uji Klasifikasi Kulit</RouterLink>
          <RouterLink to="/history" class="btn btn-ceramic">Lihat Riwayat Saya</RouterLink>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.admin-dash {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.page-head h1 {
  font-size: clamp(1.65rem, 2.6vw, 2.1rem);
  margin-bottom: 6px;
}

.page-sub {
  color: var(--ink-umber);
  max-width: 62ch;
}

.head-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.summary-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.summary-cell {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid var(--ceramic-border);
}

.summary-cell:last-child {
  border-right: none;
}

.summary-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--ink-muted);
}

.summary-value {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 700;
}

.summary-value.is-indigo {
  color: var(--indigo-primary);
}

.summary-value.is-clay {
  color: var(--clay-body);
}

.summary-sub {
  font-size: 0.8rem;
  color: var(--ink-umber);
}

.admin-tray {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.tray-slot {
  padding: 24px 16px 16px 22px;
  display: flex;
}

.ceramic-dish {
  width: 100%;
  background: var(--ceramic-ivory);
  border-radius: var(--radius-sm);
  padding: 24px;
  box-shadow: var(--shadow-dish);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
}

.ceramic-dish h2 {
  font-size: 1.3rem;
  margin-bottom: 8px;
}

.ceramic-dish p {
  font-size: 0.9375rem;
  color: var(--ink-umber);
  line-height: 1.52;
}

.ceramic-dish .btn {
  align-self: flex-start;
}

.admin-self {
  padding: 24px 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
}

.admin-self h2 {
  font-size: 1.2rem;
  margin-bottom: 4px;
}

.admin-self p {
  color: var(--ink-umber);
  max-width: 60ch;
  font-size: 0.9375rem;
}

.self-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 1020px) {
  .summary-bar {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .summary-cell:nth-child(2) {
    border-right: none;
  }

  .summary-cell:nth-child(1),
  .summary-cell:nth-child(2) {
    border-bottom: 1px solid var(--ceramic-border);
  }

  .admin-tray {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 600px) {
  .summary-bar {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-cell {
    border-right: none;
    border-bottom: 1px solid var(--ceramic-border);
  }

  .summary-cell:last-child {
    border-bottom: none;
  }

  .tray-slot {
    padding: 16px 12px 12px 16px;
  }
}
</style>
