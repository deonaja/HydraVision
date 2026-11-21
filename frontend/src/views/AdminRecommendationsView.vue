<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  storeState,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
  formatDateFull,
} from '@/services/mockStore'
import type { CareRecommendation, SkinLabel } from '@/types/hydravision'
import AppShell from '@/components/AppShell.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import HvIcon from '@/components/HvIcon.vue'

const activeClass = ref<SkinLabel>('Terhidrasi')
const editingId = ref<string | null>(null)
const formSkinLabel = ref<SkinLabel>('Terhidrasi')
const formTitle = ref('')
const formBody = ref('')
const formError = ref<string | null>(null)
const deleteTarget = ref<CareRecommendation | null>(null)

const visibleItems = computed(() =>
  storeState.recommendations.filter((r) => r.skinLabel === activeClass.value),
)

function switchTab(label: SkinLabel) {
  activeClass.value = label
  if (!editingId.value) {
    formSkinLabel.value = label
  }
}

function startEdit(item: CareRecommendation) {
  editingId.value = item.id
  formSkinLabel.value = item.skinLabel
  formTitle.value = item.title
  formBody.value = item.body
  formError.value = null
}

function cancelEdit() {
  editingId.value = null
  formSkinLabel.value = activeClass.value
  formTitle.value = ''
  formBody.value = ''
  formError.value = null
}

function submitForm() {
  formError.value = null
  if (editingId.value) {
    const res = updateRecommendation(editingId.value, {
      skinLabel: formSkinLabel.value,
      title: formTitle.value,
      body: formBody.value,
    })
    if (!res.ok) {
      formError.value = res.error
      return
    }
    activeClass.value = formSkinLabel.value
    cancelEdit()
  } else {
    const res = createRecommendation({
      skinLabel: formSkinLabel.value,
      title: formTitle.value,
      body: formBody.value,
    })
    if (!res.ok) {
      formError.value = res.error
      return
    }
    activeClass.value = formSkinLabel.value
    cancelEdit()
  }
}

function confirmDelete() {
  if (deleteTarget.value) {
    if (editingId.value === deleteTarget.value.id) cancelEdit()
    deleteRecommendation(deleteTarget.value.id)
  }
  deleteTarget.value = null
}
</script>

<template>
  <AppShell>
    <div class="recs-page">
      <header class="page-head">
        <div>
          <h1>Kelola Konten Rekomendasi</h1>
          <p class="page-sub">
            Tambah atau ubah saran perawatan umum untuk kelas <strong>Terhidrasi</strong> dan
            <strong>Kering</strong>. Saran yang tersimpan langsung tampil pada halaman hasil
            klasifikasi.
          </p>
        </div>
        <RouterLink to="/classify" class="btn btn-ceramic">Uji Tampilan di Cek Kulit</RouterLink>
      </header>

      <div class="recs-grid">
        <!-- List of recommendations by skin class -->
        <section class="recs-list-col">
          <div class="class-tabs" role="tablist" aria-label="Pilih kelas kondisi kulit">
            <button
              type="button"
              role="tab"
              :aria-selected="activeClass === 'Terhidrasi'"
              class="tab-btn"
              :class="{ 'is-active is-indigo': activeClass === 'Terhidrasi' }"
              @click="switchTab('Terhidrasi')"
            >
              <HvIcon name="droplet" :size="16" />
              <span>Terhidrasi</span>
              <strong class="tabular">
                ({{ storeState.recommendations.filter((r) => r.skinLabel === 'Terhidrasi').length }})
              </strong>
            </button>

            <button
              type="button"
              role="tab"
              :aria-selected="activeClass === 'Kering'"
              class="tab-btn"
              :class="{ 'is-active is-clay': activeClass === 'Kering' }"
              @click="switchTab('Kering')"
            >
              <HvIcon name="sun" :size="16" />
              <span>Kering</span>
              <strong class="tabular">
                ({{ storeState.recommendations.filter((r) => r.skinLabel === 'Kering').length }})
              </strong>
            </button>
          </div>

          <div v-if="visibleItems.length > 0" class="rec-cards">
            <article
              v-for="item in visibleItems"
              :key="item.id"
              class="rec-item ceramic-panel"
              :class="{ 'is-editing': editingId === item.id }"
            >
              <div class="rec-body">
                <h3>{{ item.title }}</h3>
                <p>{{ item.body }}</p>
                <span class="rec-updated tabular">
                  Diperbarui {{ formatDateFull(item.updatedAt) }}
                </span>
              </div>
              <div class="rec-actions">
                <button type="button" class="btn btn-ceramic btn-sm" @click="startEdit(item)">
                  <HvIcon name="edit" :size="15" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  aria-label="Hapus rekomendasi"
                  @click="deleteTarget = item"
                >
                  <HvIcon name="trash" :size="15" />
                </button>
              </div>
            </article>
          </div>

          <div v-else class="ceramic-panel empty-recs">
            <p>Belum ada saran perawatan untuk kelas {{ activeClass }}. Tambahkan melalui formulir di samping.</p>
          </div>
        </section>

        <!-- Add / Edit Form -->
        <aside class="ceramic-panel editor-panel">
          <h2>{{ editingId ? 'Ubah Saran Perawatan' : 'Tambah Saran Perawatan' }}</h2>
          <p class="editor-sub">
            Pastikan bahasa jelas, praktis, dan bersifat edukasi perawatan umum (bukan resep medis).
          </p>

          <div v-if="formError" class="notice notice-error" role="alert">
            <HvIcon name="alert" :size="18" />
            <span>{{ formError }}</span>
          </div>

          <form class="editor-form" novalidate @submit.prevent="submitForm">
            <div class="field">
              <label for="rec-class" class="field-label">Kelas Kondisi Kulit</label>
              <select id="rec-class" v-model="formSkinLabel" class="field-select">
                <option value="Terhidrasi">Terhidrasi</option>
                <option value="Kering">Kering</option>
              </select>
            </div>

            <div class="field">
              <label for="rec-title" class="field-label">Judul Saran</label>
              <input
                id="rec-title"
                v-model="formTitle"
                type="text"
                class="field-input"
                placeholder="Contoh: Gunakan pelembap berbahan ceramide"
                required
              />
            </div>

            <div class="field">
              <label for="rec-body" class="field-label">Deskripsi Saran Perawatan</label>
              <textarea
                id="rec-body"
                v-model="formBody"
                class="field-textarea"
                placeholder="Tuliskan langkah perawatan singkat dan mudah dipahami pengguna..."
                required
              ></textarea>
            </div>

            <div class="editor-actions">
              <button type="submit" class="btn btn-primary">
                <HvIcon :name="editingId ? 'check-circle' : 'plus'" :size="17" />
                <span>{{ editingId ? 'Simpan Perubahan' : 'Tambahkan Rekomendasi' }}</span>
              </button>
              <button v-if="editingId" type="button" class="btn btn-ceramic" @click="cancelEdit">
                Batal Ubah
              </button>
            </div>
          </form>
        </aside>
      </div>

      <ConfirmDialog
        :open="deleteTarget !== null"
        title="Hapus saran perawatan ini?"
        :message="`Saran '${deleteTarget?.title ?? ''}' tidak lagi ditampilkan pada hasil klasifikasi kulit ${deleteTarget?.skinLabel ?? ''}.`"
        confirm-label="Ya, Hapus"
        tone="danger"
        @confirm="confirmDelete"
        @cancel="deleteTarget = null"
      />
    </div>
  </AppShell>
</template>

<style scoped>
.recs-page {
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
  max-width: 64ch;
}

.recs-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.85fr);
  gap: 24px;
  align-items: start;
}

.recs-list-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.class-tabs {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 10px;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 16px;
  border-radius: var(--radius-sm);
  background: var(--ceramic-ivory);
  border: 1.5px solid var(--ceramic-border-strong);
  color: var(--ink-umber);
  font-weight: 600;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.tab-btn.is-active.is-indigo {
  background: var(--indigo-primary);
  border-color: var(--indigo-primary);
  color: var(--ceramic-ivory);
}

.tab-btn.is-active.is-clay {
  background: var(--clay-body);
  border-color: var(--clay-body);
  color: var(--ink-on-clay);
}

.rec-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rec-item {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.rec-item.is-editing {
  border-color: var(--indigo-primary);
  box-shadow: 0 0 0 2px rgba(35, 75, 114, 0.18);
}

.rec-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rec-body h3 {
  font-size: 1.05rem;
}

.rec-body p {
  font-size: 0.925rem;
  color: var(--ink-umber);
  line-height: 1.52;
}

.rec-updated {
  font-size: 0.78rem;
  color: var(--ink-muted);
  margin-top: 4px;
}

.rec-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.empty-recs {
  padding: 32px 24px;
  text-align: center;
  color: var(--ink-umber);
}

.editor-panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-panel h2 {
  font-size: 1.25rem;
}

.editor-sub {
  font-size: 0.875rem;
  color: var(--ink-umber);
}

.editor-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
}

@media (max-width: 960px) {
  .recs-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .rec-item {
    flex-direction: column;
  }

  .rec-actions {
    align-self: flex-end;
  }

  .class-tabs {
    grid-template-columns: minmax(0, 1fr);
  }

  .editor-panel {
    padding: 18px 16px;
  }
}
</style>
