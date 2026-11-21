<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  myHistory,
  deleteHistoryRecord,
  formatDateFull,
  formatDateShort,
} from '@/services/mockStore'
import type { HistoryQuery } from '@/types/hydravision'
import AppShell from '@/components/AppShell.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import HvIcon from '@/components/HvIcon.vue'

const query = ref<HistoryQuery>({
  label: 'Semua',
  dateFrom: '',
  dateTo: '',
  sortBy: 'newest',
})

const deleteTargetId = ref<string | null>(null)

const filteredHistory = computed(() => {
  let list = [...myHistory.value]

  if (query.value.label !== 'Semua') {
    list = list.filter((item) => item.label === query.value.label)
  }

  if (query.value.dateFrom) {
    const fromTime = new Date(`${query.value.dateFrom}T00:00:00`).getTime()
    list = list.filter((item) => new Date(item.createdAt).getTime() >= fromTime)
  }

  if (query.value.dateTo) {
    const toTime = new Date(`${query.value.dateTo}T23:59:59`).getTime()
    list = list.filter((item) => new Date(item.createdAt).getTime() <= toTime)
  }

  list.sort((a, b) => {
    switch (query.value.sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'confidence_desc':
        return b.confidence - a.confidence
      case 'confidence_asc':
        return a.confidence - b.confidence
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return list
})

const hasActiveFilters = computed(
  () =>
    query.value.label !== 'Semua' ||
    query.value.dateFrom !== '' ||
    query.value.dateTo !== '' ||
    query.value.sortBy !== 'newest',
)

function resetFilters() {
  query.value = {
    label: 'Semua',
    dateFrom: '',
    dateTo: '',
    sortBy: 'newest',
  }
}

function confirmDelete() {
  if (deleteTargetId.value) {
    deleteHistoryRecord(deleteTargetId.value)
  }
  deleteTargetId.value = null
}
</script>

<template>
  <AppShell>
    <div class="history-page">
      <header class="page-head">
        <div>
          <h1>Riwayat Klasifikasi</h1>
          <p class="page-sub">
            Tinjau perbandingan kondisi kulit Anda lintas tanggal, buka detail saran perawatan, atau
            hapus catatan lama.
          </p>
        </div>
        <RouterLink to="/classify" class="btn btn-primary">
          <HvIcon name="upload" :size="17" />
          <span>Cek Kulit Baru</span>
        </RouterLink>
      </header>

      <!-- FR-24: Filter & Sort bar -->
      <section class="filter-bar ceramic-panel" aria-label="Filter dan urutan riwayat">
        <div class="filter-row">
          <div class="field filter-field">
            <label for="filter-label" class="field-label">Hasil Klasifikasi</label>
            <select id="filter-label" v-model="query.label" class="field-select">
              <option value="Semua">Semua Hasil</option>
              <option value="Terhidrasi">Terhidrasi</option>
              <option value="Kering">Kering</option>
            </select>
          </div>

          <div class="field filter-field">
            <label for="filter-from" class="field-label">Dari Tanggal</label>
            <input id="filter-from" v-model="query.dateFrom" type="date" class="field-input" />
          </div>

          <div class="field filter-field">
            <label for="filter-to" class="field-label">Sampai Tanggal</label>
            <input id="filter-to" v-model="query.dateTo" type="date" class="field-input" />
          </div>

          <div class="field filter-field">
            <label for="filter-sort" class="field-label">Urutkan</label>
            <select id="filter-sort" v-model="query.sortBy" class="field-select">
              <option value="newest">Terbaru lebih dulu</option>
              <option value="oldest">Terlama lebih dulu</option>
              <option value="confidence_desc">Keyakinan tertinggi</option>
              <option value="confidence_asc">Keyakinan terendah</option>
            </select>
          </div>
        </div>

        <div class="filter-footer">
          <p class="result-count tabular">
            Menampilkan <strong>{{ filteredHistory.length }}</strong> dari
            <strong>{{ myHistory.length }}</strong> catatan riwayat
          </p>
          <button
            v-if="hasActiveFilters"
            type="button"
            class="btn btn-ghost btn-sm"
            @click="resetFilters"
          >
            Atur ulang filter
          </button>
        </div>
      </section>

      <!-- FR-21: History list -->
      <section v-if="filteredHistory.length > 0" class="history-list">
        <article
          v-for="item in filteredHistory"
          :key="item.id"
          class="history-row ceramic-panel"
        >
          <RouterLink :to="`/history/${item.id}`" class="row-thumb-link">
            <img
              :src="item.imageDataUrl"
              :alt="`Foto kulit ${formatDateShort(item.createdAt)}`"
              class="row-thumb"
            />
          </RouterLink>

          <div class="row-info">
            <div class="row-top">
              <span
                class="badge"
                :class="item.label === 'Terhidrasi' ? 'badge-hydrated' : 'badge-dry'"
              >
                <HvIcon name="droplet" :size="13" />
                <span>{{ item.label }}</span>
              </span>
              <span class="row-confidence tabular">
                Keyakinan <strong>{{ item.confidence }}%</strong>
              </span>
              <span v-if="item.isSimulated" class="badge badge-demo">Simulasi</span>
            </div>

            <p class="row-date tabular">{{ formatDateFull(item.createdAt) }}</p>
            <p class="row-file">Berkas: {{ item.fileName }}</p>
          </div>

          <div class="row-actions">
            <RouterLink :to="`/history/${item.id}`" class="btn btn-ceramic btn-sm">
              Detail
            </RouterLink>
            <button
              type="button"
              class="btn btn-danger btn-sm"
              @click="deleteTargetId = item.id"
            >
              <HvIcon name="trash" :size="15" />
              <span>Hapus</span>
            </button>
          </div>
        </article>
      </section>

      <section v-else class="empty-state ceramic-panel">
        <h2>{{ myHistory.length === 0 ? 'Belum ada riwayat klasifikasi' : 'Tidak ada riwayat yang cocok' }}</h2>
        <p>
          {{
            myHistory.length === 0
              ? 'Setiap kali Anda mengklasifikasikan foto kulit, hasilnya otomatis disimpan di halaman ini.'
              : 'Coba ubah rentang tanggal atau filter kelas hasil untuk melihat catatan lainnya.'
          }}
        </p>
        <div class="empty-actions">
          <RouterLink v-if="myHistory.length === 0" to="/classify" class="btn btn-primary">
            Mulai Klasifikasi Pertama
          </RouterLink>
          <button v-else type="button" class="btn btn-ceramic" @click="resetFilters">
            Tampilkan Semua Riwayat
          </button>
        </div>
      </section>

      <!-- FR-23: Delete Confirmation Dialog -->
      <ConfirmDialog
        :open="deleteTargetId !== null"
        title="Hapus data riwayat ini?"
        message="Catatan foto, skor keyakinan, dan saran perawatan pada tanggal tersebut akan dihapus permanen dari daftar riwayat Anda."
        confirm-label="Ya, Hapus Riwayat"
        tone="danger"
        @confirm="confirmDelete"
        @cancel="deleteTargetId = null"
      />
    </div>
  </AppShell>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.page-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}

.page-head h1 {
  font-size: clamp(1.65rem, 2.6vw, 2.1rem);
  margin-bottom: 6px;
}

.page-sub {
  color: var(--ink-umber);
  max-width: 60ch;
}

.filter-bar {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.filter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--ceramic-border);
}

.result-count {
  font-size: 0.875rem;
  color: var(--ink-umber);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-row {
  padding: 14px 18px;
  display: grid;
  grid-template-columns: 124px minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
}

.row-thumb-link {
  display: block;
  border-radius: var(--radius-xs);
  overflow: hidden;
  border: 1px solid var(--ceramic-border);
}

.row-thumb {
  width: 124px;
  height: 92px;
  object-fit: cover;
  display: block;
}

.row-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row-top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.row-confidence {
  font-size: 0.9375rem;
  color: var(--ink-espresso);
}

.row-date {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink-espresso);
}

.row-file {
  font-size: 0.825rem;
  color: var(--ink-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.empty-state {
  padding: 40px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.empty-state h2 {
  font-size: 1.3rem;
}

.empty-state p {
  color: var(--ink-umber);
  max-width: 48ch;
}

.empty-actions {
  margin-top: 8px;
}

@media (max-width: 960px) {
  .filter-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .filter-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .history-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding: 14px;
  }

  .row-thumb {
    width: 100%;
    height: 170px;
  }

  .row-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
