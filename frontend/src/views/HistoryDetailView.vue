<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDateFull, NON_MEDICAL_DISCLAIMER } from '@/services/mockStore'
import { getHistoryRecord, deleteHistoryRecord } from '@/services/dataStore'
import type { ClassificationRecord } from '@/types/hydravision'
import AppShell from '@/components/AppShell.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import HvIcon from '@/components/HvIcon.vue'

const route = useRoute()
const router = useRouter()
const confirmOpen = ref(false)
const loading = ref(true)
const record = ref<ClassificationRecord | null>(null)

watch(
  () => route.params.id,
  async (id) => {
    loading.value = true
    record.value = typeof id === 'string' ? await getHistoryRecord(id) : null
    loading.value = false
  },
  { immediate: true },
)

async function handleDelete() {
  if (!record.value) return
  confirmOpen.value = false
  const ok = await deleteHistoryRecord(record.value.id)
  if (ok) router.push('/history')
}
</script>

<template>
  <AppShell>
    <div class="detail-page">
      <div class="back-row">
        <RouterLink to="/history" class="back-link">
          <HvIcon name="arrow-left" :size="17" />
          <span>Kembali ke Daftar Riwayat</span>
        </RouterLink>
      </div>

      <template v-if="record">
        <header class="page-head">
          <div>
            <h1>Detail Hasil Klasifikasi</h1>
            <p class="page-sub tabular">Dicatat pada {{ formatDateFull(record.createdAt) }}</p>
          </div>
          <button type="button" class="btn btn-danger" @click="confirmOpen = true">
            <HvIcon name="trash" :size="16" />
            <span>Hapus Riwayat</span>
          </button>
        </header>

        <section class="vanity-tray detail-tray">
          <div class="vanity-tray-well photo-well">
            <img :src="record.imageDataUrl" :alt="`Foto ${record.fileName}`" class="detail-photo" />
          </div>

          <div class="vanity-tray-well info-well">
            <article class="detail-dish">
              <div class="dish-badges">
                <span
                  class="badge"
                  :class="
                    record.label === 'Terhidrasi' ? 'badge-hydrated-solid' : 'badge-dry-solid'
                  "
                >
                  <HvIcon name="droplet" :size="14" />
                  <span>{{ record.label }}</span>
                </span>
                <span v-if="record.isSimulated" class="badge badge-demo">Mode Simulasi</span>
              </div>

              <p class="dish-verdict tabular">
                {{ record.label }} — {{ record.confidence }}%
              </p>

              <div class="confidence-track" aria-hidden="true">
                <div
                  class="confidence-fill"
                  :class="record.label === 'Terhidrasi' ? 'is-indigo' : 'is-clay'"
                  :style="{ width: `${record.confidence}%` }"
                ></div>
              </div>

              <dl class="meta-list">
                <div>
                  <dt>Nama Berkas</dt>
                  <dd>{{ record.fileName }}</dd>
                </div>
                <div>
                  <dt>Waktu Pemeriksaan</dt>
                  <dd class="tabular">{{ formatDateFull(record.createdAt) }}</dd>
                </div>
                <div>
                  <dt>ID Catatan</dt>
                  <dd class="tabular">{{ record.id }}</dd>
                </div>
              </dl>
            </article>
          </div>
        </section>

        <section class="ceramic-panel advice-panel">
          <h2>Saran Perawatan yang Diberikan</h2>
          <ul class="advice-grid">
            <li v-for="(item, idx) in record.recommendationsSnapshot" :key="idx">
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </li>
          </ul>
        </section>

        <div class="notice notice-disclaimer">
          <HvIcon name="info" :size="18" />
          <div>
            <strong>Disclaimer Non-Medis:</strong> {{ NON_MEDICAL_DISCLAIMER }}
          </div>
        </div>

        <ConfirmDialog
          :open="confirmOpen"
          title="Hapus catatan klasifikasi ini?"
          message="Data hasil dan foto yang tersimpan pada catatan ini akan dihapus permanen dari riwayat Anda."
          confirm-label="Ya, Hapus"
          tone="danger"
          @confirm="handleDelete"
          @cancel="confirmOpen = false"
        />
      </template>

      <section v-else-if="loading" class="ceramic-panel not-found">
        <p>Memuat detail riwayat...</p>
      </section>

      <section v-else class="ceramic-panel not-found">
        <h1>Riwayat tidak ditemukan</h1>
        <p>Catatan yang Anda cari mungkin sudah dihapus atau bukan milik akun saat ini.</p>
        <RouterLink to="/history" class="btn btn-primary">Kembali ke Riwayat</RouterLink>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--ink-umber);
}

.back-link:hover {
  color: var(--indigo-primary);
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
  margin-bottom: 4px;
}

.page-sub {
  color: var(--ink-umber);
}

.detail-tray {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.photo-well,
.info-well {
  padding: 22px 16px 16px 20px;
  display: flex;
}

.detail-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
  display: block;
}

.detail-dish {
  width: 100%;
  background: var(--ceramic-ivory);
  border-radius: var(--radius-sm);
  padding: 24px;
  box-shadow: var(--shadow-dish);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.dish-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish-verdict {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 2.6vw, 2.25rem);
  font-weight: 700;
  color: var(--ink-espresso);
}

.confidence-track {
  height: 10px;
  border-radius: 999px;
  background: var(--linen-deep);
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 999px;
}

.confidence-fill.is-indigo {
  background: var(--indigo-primary);
}

.confidence-fill.is-clay {
  background: var(--clay-body);
}

.meta-list {
  margin: 8px 0 0;
  padding-top: 14px;
  border-top: 1px solid var(--ceramic-border);
  display: grid;
  gap: 10px;
}

.meta-list > div {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 0.875rem;
}

.meta-list dt {
  color: var(--ink-muted);
}

.meta-list dd {
  margin: 0;
  font-weight: 600;
  color: var(--ink-espresso);
  text-align: right;
  overflow-wrap: anywhere;
}

.advice-panel {
  padding: 26px 28px;
}

.advice-panel h2 {
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.advice-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 16px;
}

.advice-grid li {
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  background: var(--linen-soft);
  border: 1px solid var(--ceramic-border);
}

.advice-grid h3 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.advice-grid p {
  font-size: 0.9rem;
  color: var(--ink-umber);
  line-height: 1.5;
}

.not-found {
  padding: 40px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

@media (max-width: 860px) {
  .detail-tray {
    grid-template-columns: minmax(0, 1fr);
  }

  .photo-well,
  .info-well {
    padding: 16px 12px 12px 16px;
  }

  .advice-panel {
    padding: 20px 18px;
  }
}
</style>
