<script setup lang="ts">
import { computed } from 'vue'
import {
  currentUser,
  myHistory,
  formatDateShort,
  formatDateFull,
  NON_MEDICAL_DISCLAIMER,
} from '@/services/mockStore'
import AppShell from '@/components/AppShell.vue'
import HvIcon from '@/components/HvIcon.vue'

const latestCheck = computed(() => myHistory.value[0] ?? null)
const hydratedCount = computed(
  () => myHistory.value.filter((item) => item.label === 'Terhidrasi').length,
)
const dryCount = computed(() => myHistory.value.filter((item) => item.label === 'Kering').length)
const recentFour = computed(() => myHistory.value.slice(0, 4))
</script>

<template>
  <AppShell>
    <div class="dash-page">
      <header class="page-head">
        <div>
          <h1>Halo, {{ currentUser?.name }}</h1>
          <p class="page-sub">
            Pantau kondisi hidrasi kulit Anda secara rutin dan simpan setiap hasil dalam satu
            tempat.
          </p>
        </div>
        <RouterLink to="/classify" class="btn btn-primary btn-lg">
          <HvIcon name="upload" :size="18" />
          <span>Cek Kondisi Kulit</span>
        </RouterLink>
      </header>

      <!-- Signature terracotta vanity tray dashboard hero -->
      <section class="vanity-tray dash-tray">
        <div class="vanity-tray-well tray-left">
          <div class="tray-prompt">
            <h2>Siap mengecek kulit hari ini?</h2>
            <p>
              Unggah foto kulit tanpa filter dengan cahaya cukup (JPG, JPEG, atau PNG maks 5 MB)
              untuk melihat status hidrasi terbaru.
            </p>
            <div class="tray-actions">
              <RouterLink to="/classify" class="btn btn-primary">Mulai Klasifikasi</RouterLink>
              <RouterLink to="/history" class="btn btn-ceramic">Lihat Semua Riwayat</RouterLink>
            </div>
          </div>
        </div>

        <div class="vanity-tray-well tray-right">
          <article v-if="latestCheck" class="ceramic-dish">
            <div class="dish-top">
              <span
                class="badge"
                :class="
                  latestCheck.label === 'Terhidrasi' ? 'badge-hydrated-solid' : 'badge-dry-solid'
                "
              >
                <HvIcon name="droplet" :size="14" />
                <span>Pengecekan Terakhir</span>
              </span>
              <span class="dish-date tabular">{{ formatDateShort(latestCheck.createdAt) }}</span>
            </div>

            <p class="dish-verdict tabular">
              {{ latestCheck.label }} — {{ latestCheck.confidence }}%
            </p>
            <p class="dish-meta">
              {{ formatDateFull(latestCheck.createdAt) }}
            </p>

            <RouterLink :to="`/history/${latestCheck.id}`" class="dish-link">
              <span>Buka detail & saran perawatan</span>
              <HvIcon name="arrow-right" :size="16" />
            </RouterLink>
          </article>

          <article v-else class="ceramic-dish dish-empty">
            <h3>Belum ada riwayat pengecekan</h3>
            <p>
              Unggah foto kulit pertama Anda untuk memperoleh hasil klasifikasi dan rekomendasi
              perawatan harian.
            </p>
          </article>
        </div>
      </section>

      <!-- Compact tabular summary row (not generic icon-card boilerplate) -->
      <section class="summary-bar ceramic-panel" aria-label="Ringkasan riwayat pengecekan">
        <div class="summary-cell">
          <span class="summary-label">Total Pengecekan</span>
          <strong class="summary-value tabular">{{ myHistory.length }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Status Terhidrasi</span>
          <strong class="summary-value tabular is-indigo">{{ hydratedCount }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Status Kering</span>
          <strong class="summary-value tabular is-clay">{{ dryCount }}</strong>
        </div>
        <div class="summary-cell">
          <span class="summary-label">Akun Aktif</span>
          <strong class="summary-email">{{ currentUser?.email }}</strong>
        </div>
      </section>

      <!-- Recent serial strip -->
      <section class="recent-section">
        <div class="section-row">
          <h2>Riwayat Terbaru</h2>
          <RouterLink to="/history" class="view-all">Kelola semua riwayat</RouterLink>
        </div>

        <div v-if="recentFour.length > 0" class="recent-grid">
          <RouterLink
            v-for="item in recentFour"
            :key="item.id"
            :to="`/history/${item.id}`"
            class="recent-item ceramic-panel"
          >
            <img :src="item.imageDataUrl" :alt="`Foto kulit ${formatDateShort(item.createdAt)}`" class="recent-thumb" />
            <div class="recent-body">
              <div class="recent-top">
                <span
                  class="badge"
                  :class="item.label === 'Terhidrasi' ? 'badge-hydrated' : 'badge-dry'"
                >
                  {{ item.label }}
                </span>
                <strong class="tabular recent-score">{{ item.confidence }}%</strong>
              </div>
              <p class="recent-date tabular">{{ formatDateFull(item.createdAt) }}</p>
            </div>
          </RouterLink>
        </div>

        <div v-else class="empty-block ceramic-panel">
          <p>Belum ada hasil tersimpan. Mulai pemeriksaan pertama dari tombol Cek Kondisi Kulit.</p>
          <RouterLink to="/classify" class="btn btn-primary btn-sm">Mulai Sekarang</RouterLink>
        </div>
      </section>

      <div class="notice notice-disclaimer">
        <HvIcon name="info" :size="18" />
        <span>{{ NON_MEDICAL_DISCLAIMER }}</span>
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.dash-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.page-head h1 {
  font-size: clamp(1.65rem, 2.6vw, 2.15rem);
  margin-bottom: 6px;
}

.page-sub {
  color: var(--ink-umber);
  max-width: 58ch;
}

.dash-tray {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: 14px;
}

.tray-left {
  padding: 26px 24px;
  display: flex;
  align-items: center;
}

.tray-prompt {
  color: var(--ink-on-clay);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tray-prompt h2 {
  color: var(--ink-on-clay);
  font-size: 1.4rem;
}

.tray-prompt p {
  color: rgba(251, 246, 240, 0.9);
  font-size: 0.9375rem;
  max-width: 48ch;
}

.tray-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.tray-right {
  padding: 24px 16px 16px 22px;
  display: flex;
}

.ceramic-dish {
  width: 100%;
  background: var(--ceramic-ivory);
  border-radius: var(--radius-sm);
  padding: 20px;
  box-shadow: var(--shadow-dish);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.dish-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.dish-date {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--ink-muted);
}

.dish-verdict {
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  color: var(--ink-espresso);
}

.dish-meta {
  font-size: 0.84rem;
  color: var(--ink-umber);
}

.dish-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 4px;
}

.dish-empty h3 {
  font-size: 1.05rem;
}

.dish-empty p {
  font-size: 0.9rem;
  color: var(--ink-umber);
}

.summary-bar {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  overflow: hidden;
}

.summary-cell {
  padding: 18px 20px;
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
  color: var(--ink-muted);
  font-weight: 500;
}

.summary-value {
  font-family: var(--font-display);
  font-size: 1.65rem;
  font-weight: 700;
  color: var(--ink-espresso);
}

.summary-value.is-indigo {
  color: var(--indigo-primary);
}

.summary-value.is-clay {
  color: var(--clay-body);
}

.summary-email {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink-espresso);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 6px;
}

.section-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section-row h2 {
  font-size: 1.35rem;
}

.view-all {
  font-size: 0.9rem;
  font-weight: 600;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.recent-item {
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    transform var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.recent-item:hover {
  transform: translateY(-2px);
  border-color: var(--ink-umber);
}

.recent-thumb {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  background: var(--linen-deep);
}

.recent-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recent-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.recent-score {
  font-size: 0.95rem;
  color: var(--ink-espresso);
}

.recent-date {
  font-size: 0.8rem;
  color: var(--ink-muted);
}

.empty-block {
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  color: var(--ink-umber);
}

@media (max-width: 1020px) {
  .dash-tray {
    grid-template-columns: minmax(0, 1fr);
  }

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

  .recent-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .summary-bar,
  .recent-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary-cell {
    border-right: none;
    border-bottom: 1px solid var(--ceramic-border);
  }

  .summary-cell:last-child {
    border-bottom: none;
  }

  .tray-left {
    padding: 20px 16px;
  }

  .tray-right {
    padding: 16px 12px 12px 16px;
  }
}
</style>
