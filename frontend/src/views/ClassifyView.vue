<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NON_MEDICAL_DISCLAIMER,
  PHOTO_GUIDELINES,
  runMockClassification,
  stagedLandingUpload,
  validateSkinImageFile,
} from '@/services/mockStore'
import { createSyntheticSamplePhoto } from '@/services/sampleImages'
import type { ClassificationRecord } from '@/types/hydravision'
import AppShell from '@/components/AppShell.vue'
import HvIcon from '@/components/HvIcon.vue'

type ViewStage = 'upload' | 'loading' | 'result'

const stage = ref<ViewStage>('upload')
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const fileName = ref<string | null>(null)
const previewDataUrl = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const simulateFailure = ref(false)
const loadingStep = ref('Memvalidasi dimensi dan pencahayaan foto...')
const resultRecord = ref<ClassificationRecord | null>(null)

onMounted(() => {
  if (stagedLandingUpload.dataUrl && stagedLandingUpload.fileName) {
    fileName.value = stagedLandingUpload.fileName
    previewDataUrl.value = stagedLandingUpload.dataUrl
    stagedLandingUpload.fileName = null
    stagedLandingUpload.dataUrl = null
  }
})

function openPicker() {
  errorMessage.value = null
  fileInputRef.value?.click()
}

function handleFile(file: File) {
  errorMessage.value = null
  const check = validateSkinImageFile(file)
  if (!check.ok) {
    errorMessage.value = check.error
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    fileName.value = file.name
    previewDataUrl.value = typeof reader.result === 'string' ? reader.result : null
  }
  reader.readAsDataURL(file)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) handleFile(file)
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function clearPhoto() {
  fileName.value = null
  previewDataUrl.value = null
  errorMessage.value = null
}

function loadDemoSample(variant: 'hydrated-1' | 'dry-1') {
  errorMessage.value = null
  fileName.value = variant === 'hydrated-1' ? 'sampel-kulit-terhidrasi.png' : 'sampel-kulit-kering.png'
  previewDataUrl.value = createSyntheticSamplePhoto(variant)
}

async function processClassification() {
  if (!previewDataUrl.value || !fileName.value) {
    errorMessage.value = 'Pilih atau unggah foto kulit terlebih dahulu sebelum memulai klasifikasi.'
    return
  }
  errorMessage.value = null
  stage.value = 'loading'
  loadingStep.value = 'Menyesuaikan gambar ke format input model...'

  const timer = window.setTimeout(() => {
    loadingStep.value = 'Menganalisis tekstur dan tingkat hidrasi kulit...'
  }, 650)

  const res = await runMockClassification({
    fileName: fileName.value,
    imageDataUrl: previewDataUrl.value,
    simulateError: simulateFailure.value,
  })
  window.clearTimeout(timer)

  if (!res.ok) {
    stage.value = 'upload'
    errorMessage.value = res.error
    return
  }

  resultRecord.value = res.record
  stage.value = 'result'
}

function resetForNewCheck() {
  resultRecord.value = null
  clearPhoto()
  stage.value = 'upload'
}
</script>

<template>
  <AppShell>
    <div class="classify-page">
      <header class="page-head">
        <div>
          <h1>Klasifikasi Kondisi Kulit</h1>
          <p class="page-sub">
            Unggah satu foto kulit tanpa filter untuk mengetahui apakah kondisi kulit
            <strong>Terhidrasi</strong> atau <strong>Kering</strong>.
          </p>
        </div>
        <span class="badge badge-demo">Mode Simulasi Frontend</span>
      </header>

      <!-- FR-15 / FR-09 Error alert -->
      <div v-if="errorMessage" class="notice notice-error" role="alert">
        <HvIcon name="alert" :size="19" />
        <div>
          <strong>Gagal memproses foto.</strong>
          <p>{{ errorMessage }}</p>
        </div>
      </div>

      <!-- STAGE 1: Upload, Preview, Photo Guidelines (FR-08 to FR-12) -->
      <section v-if="stage === 'upload'" class="classify-grid">
        <div class="vanity-tray upload-tray">
          <input
            ref="fileInputRef"
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            class="sr-only"
            @change="onFileChange"
          />

          <div
            v-if="!previewDataUrl"
            class="vanity-tray-well drop-well"
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <div class="drop-inner" @click="openPicker">
              <span class="drop-icon" aria-hidden="true">
                <HvIcon name="upload" :size="30" />
              </span>
              <h2>Unggah Foto Kulit dari Perangkat</h2>
              <p>Tarik foto ke area ini atau pilih berkas. Format JPG, JPEG, atau PNG (maks 5 MB).</p>
              <button type="button" class="btn btn-primary btn-lg" @click.stop="openPicker">
                Pilih Foto Kulit
              </button>
            </div>

            <div class="sample-bar">
              <span>Ingin mencoba cepat tanpa unggah berkas?</span>
              <div class="sample-btns">
                <button
                  type="button"
                  class="btn btn-ceramic btn-sm"
                  @click="loadDemoSample('hydrated-1')"
                >
                  Pakai Sampel Terhidrasi
                </button>
                <button
                  type="button"
                  class="btn btn-ceramic btn-sm"
                  @click="loadDemoSample('dry-1')"
                >
                  Pakai Sampel Kering
                </button>
              </div>
            </div>
          </div>

          <!-- FR-10 & FR-11: Preview + Replace/Remove before classification -->
          <div v-else class="vanity-tray-well preview-well">
            <div class="preview-dish">
              <div class="preview-image-box">
                <img :src="previewDataUrl" :alt="`Pratinjau ${fileName}`" class="preview-img" />
              </div>

              <div class="preview-meta">
                <div>
                  <strong class="file-name">{{ fileName }}</strong>
                  <p class="file-hint">Periksa kejelasan fokus dan pencahayaan sebelum diproses.</p>
                </div>

                <div class="preview-actions">
                  <button type="button" class="btn btn-ceramic" @click="openPicker">
                    <HvIcon name="refresh" :size="16" />
                    <span>Ganti Foto</span>
                  </button>
                  <button type="button" class="btn btn-danger" @click="clearPhoto">
                    <HvIcon name="trash" :size="16" />
                    <span>Hapus Foto</span>
                  </button>
                </div>

                <label class="sim-error-toggle">
                  <input v-model="simulateFailure" type="checkbox" />
                  <span>Simulasikan error klasifikasi (untuk uji FR-15)</span>
                </label>

                <button
                  type="button"
                  class="btn btn-primary btn-lg process-btn"
                  @click="processClassification"
                >
                  <HvIcon name="scan" :size="18" />
                  <span>Proses Klasifikasi Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- FR-12: Panduan Foto always visible alongside upload -->
        <aside class="ceramic-panel guide-panel">
          <h2>Panduan Pengambilan Foto</h2>
          <p class="guide-intro">
            Pastikan foto memenuhi tiga kriteria berikut agar pembacaan kondisi kulit lebih akurat:
          </p>
          <ul class="guide-list">
            <li v-for="item in PHOTO_GUIDELINES" :key="item.id">
              <span class="guide-icon" aria-hidden="true">
                <HvIcon
                  :name="item.id === 'light' ? 'sun' : item.id === 'clear' ? 'focus' : 'ban'"
                  :size="18"
                />
              </span>
              <div>
                <strong>{{ item.title }}</strong>
                <p>{{ item.detail }}</p>
              </div>
            </li>
          </ul>
          <hr class="guide-divider" />
          <p class="guide-note">{{ NON_MEDICAL_DISCLAIMER }}</p>
        </aside>
      </section>

      <!-- STAGE 2: FR-14 Loading Indicator -->
      <section v-else-if="stage === 'loading'" class="loading-stage ceramic-panel" aria-live="polite">
        <div class="loading-preview">
          <img v-if="previewDataUrl" :src="previewDataUrl" alt="Foto sedang diproses" />
          <div class="scan-beam" aria-hidden="true"></div>
        </div>
        <div class="loading-copy">
          <h2>Sedang Mengklasifikasikan Kondisi Kulit</h2>
          <p>{{ loadingStep }}</p>
          <div class="loading-bar" aria-hidden="true">
            <div class="loading-bar-fill"></div>
          </div>
          <p class="loading-sub">Mohon tunggu sebentar, hasil akan otomatis disimpan ke riwayat Anda.</p>
        </div>
      </section>

      <!-- STAGE 3: FR-16 to FR-20 Results View -->
      <section v-else-if="stage === 'result' && resultRecord" class="result-stage">
        <div class="vanity-tray result-tray">
          <div class="vanity-tray-well result-photo-well">
            <img
              :src="resultRecord.imageDataUrl"
              :alt="`Foto hasil klasifikasi ${resultRecord.label}`"
              class="result-photo"
            />
          </div>

          <div class="vanity-tray-well result-card-well">
            <article class="result-dish">
              <div class="result-badges">
                <span
                  class="badge"
                  :class="
                    resultRecord.label === 'Terhidrasi'
                      ? 'badge-hydrated-solid'
                      : 'badge-dry-solid'
                  "
                >
                  <HvIcon name="droplet" :size="14" />
                  <span>Hasil Klasifikasi</span>
                </span>
                <span class="badge badge-active">
                  <HvIcon name="check-circle" :size="14" />
                  <span>Tersimpan Otomatis</span>
                </span>
              </div>

              <h2 class="result-verdict tabular">{{ resultRecord.label }}</h2>

              <div class="confidence-block">
                <div class="confidence-row">
                  <span>Tingkat Keyakinan Model (Simulasi)</span>
                  <strong class="tabular">{{ resultRecord.confidence }}%</strong>
                </div>
                <div
                  class="confidence-track"
                  role="progressbar"
                  :aria-valuenow="resultRecord.confidence"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="confidence-fill"
                    :class="resultRecord.label === 'Terhidrasi' ? 'is-indigo' : 'is-clay'"
                    :style="{ width: `${resultRecord.confidence}%` }"
                  ></div>
                </div>
              </div>

              <div class="result-actions">
                <button type="button" class="btn btn-primary" @click="resetForNewCheck">
                  <HvIcon name="refresh" :size="16" />
                  <span>Cek Foto Lain</span>
                </button>
                <RouterLink :to="`/history/${resultRecord.id}`" class="btn btn-ceramic">
                  Lihat di Riwayat
                </RouterLink>
              </div>
            </article>
          </div>
        </div>

        <!-- FR-18: Care recommendations synced with Admin -->
        <div class="ceramic-panel care-panel">
          <h2>Saran Perawatan Umum untuk Kulit {{ resultRecord.label }}</h2>
          <ul class="care-list">
            <li v-for="(rec, idx) in resultRecord.recommendationsSnapshot" :key="idx">
              <h3>{{ rec.title }}</h3>
              <p>{{ rec.body }}</p>
            </li>
          </ul>
        </div>

        <!-- FR-19: Mandatory Non-Medical Disclaimer -->
        <div class="notice notice-disclaimer" role="note">
          <HvIcon name="info" :size="19" />
          <div>
            <strong>Disclaimer Non-Medis:</strong>
            {{ NON_MEDICAL_DISCLAIMER }}
          </div>
        </div>
      </section>
    </div>
  </AppShell>
</template>

<style scoped>
.classify-page {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-head {
  display: flex;
  align-items: flex-start;
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

.classify-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 0.85fr);
  gap: 24px;
  align-items: start;
}

.classify-grid > * {
  min-width: 0;
}

.drop-well {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.drop-well.is-dragging {
  background: #7c361c;
}

.drop-inner {
  border: 1.75px dashed rgba(250, 246, 239, 0.58);
  border-radius: var(--radius-sm);
  padding: 40px 24px;
  text-align: center;
  color: var(--ink-on-clay);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.drop-inner:hover {
  border-color: rgba(250, 246, 239, 0.92);
  background: rgba(255, 250, 244, 0.05);
}

.drop-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(250, 246, 239, 0.14);
  display: grid;
  place-items: center;
}

.drop-inner h2 {
  color: var(--ink-on-clay);
  font-size: 1.35rem;
}

.drop-inner p {
  color: rgba(251, 246, 240, 0.88);
  max-width: 44ch;
  font-size: 0.9375rem;
}

.sample-bar {
  background: rgba(250, 246, 239, 0.12);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  color: var(--ink-on-clay);
  font-size: 0.84rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.sample-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-well {
  padding: 24px 16px 16px 22px;
}

.preview-dish {
  width: 100%;
  min-width: 0;
  background: var(--ceramic-ivory);
  border-radius: var(--radius-sm);
  padding: 20px;
  box-shadow: var(--shadow-dish);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.preview-image-box {
  width: 100%;
  min-width: 0;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--linen-deep);
  border: 1px solid var(--ceramic-border);
}

.preview-img {
  width: 100%;
  height: 100%;
  max-width: 100%;
  object-fit: cover;
  display: block;
}

.preview-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.file-name {
  display: block;
  font-size: 0.95rem;
  color: var(--ink-espresso);
  overflow-wrap: anywhere;
}

.file-hint {
  font-size: 0.85rem;
  color: var(--ink-umber);
  margin-top: 2px;
}

.preview-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sim-error-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  color: var(--ink-umber);
  cursor: pointer;
}

.process-btn {
  width: 100%;
}

/* Guide panel */
.guide-panel {
  padding: 24px;
}

.guide-panel h2 {
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.guide-intro {
  font-size: 0.9rem;
  color: var(--ink-umber);
  margin-bottom: 18px;
}

.guide-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.guide-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.guide-icon {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: var(--indigo-tint);
  color: var(--indigo-primary);
  display: grid;
  place-items: center;
}

.guide-list strong {
  display: block;
  font-size: 0.9375rem;
  margin-bottom: 2px;
}

.guide-list p {
  font-size: 0.84rem;
  color: var(--ink-umber);
  line-height: 1.48;
}

.guide-divider {
  border: 0;
  height: 1px;
  background: var(--ceramic-border);
  margin: 18px 0 14px;
}

.guide-note {
  font-size: 0.8125rem;
  color: var(--ink-muted);
  line-height: 1.5;
}

/* Loading stage */
.loading-stage {
  padding: 36px 28px;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 28px;
  align-items: center;
}

.loading-preview {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1.5px solid var(--ceramic-border-strong);
}

.loading-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scan-beam {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--ceramic-ivory);
  border-bottom: 1px solid var(--indigo-primary);
  box-shadow: 0 3px 8px rgba(33, 27, 23, 0.28);
  animation: scanSweep 1.3s ease-in-out infinite alternate;
}

@keyframes scanSweep {
  from {
    top: 10%;
  }
  to {
    top: 88%;
  }
}

.loading-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loading-copy h2 {
  font-size: 1.4rem;
}

.loading-bar {
  width: 100%;
  max-width: 420px;
  height: 8px;
  border-radius: 999px;
  background: var(--linen-deep);
  overflow: hidden;
  margin-top: 4px;
}

.loading-bar-fill {
  width: 55%;
  height: 100%;
  background: var(--indigo-primary);
  border-radius: 999px;
  animation: barSlide 1.1s ease-in-out infinite;
}

@keyframes barSlide {
  0% {
    transform: translateX(-80%);
  }
  100% {
    transform: translateX(200%);
  }
}

.loading-sub {
  font-size: 0.875rem;
  color: var(--ink-muted);
}

/* Result stage */
.result-stage {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.result-tray {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 14px;
}

.result-photo-well {
  padding: 22px 16px 16px 20px;
  display: flex;
}

.result-photo {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-sm);
  display: block;
}

.result-card-well {
  padding: 22px 16px 16px 20px;
  display: flex;
}

.result-dish {
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

.result-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.result-verdict {
  font-size: clamp(2rem, 3.2vw, 2.65rem);
  font-weight: 700;
}

.confidence-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confidence-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9rem;
  color: var(--ink-umber);
}

.confidence-row strong {
  font-size: 1.35rem;
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
  transition: width 360ms var(--ease-out);
}

.confidence-fill.is-indigo {
  background: var(--indigo-primary);
}

.confidence-fill.is-clay {
  background: var(--clay-body);
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.care-panel {
  padding: 26px 28px;
}

.care-panel h2 {
  font-size: 1.3rem;
  margin-bottom: 16px;
}

.care-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 18px;
}

.care-list li {
  min-width: 0;
  padding: 16px 18px;
  border-radius: var(--radius-sm);
  background: var(--linen-soft);
  border: 1px solid var(--ceramic-border);
}

.care-list h3 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.care-list p {
  font-size: 0.9rem;
  color: var(--ink-umber);
  line-height: 1.5;
}

@media (max-width: 960px) {
  .classify-grid,
  .result-tray,
  .loading-stage {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .drop-well,
  .preview-well,
  .result-photo-well,
  .result-card-well {
    padding: 16px 12px 12px 16px;
  }

  .drop-inner {
    padding: 26px 16px;
  }

  .preview-dish,
  .result-dish,
  .guide-panel,
  .care-panel,
  .loading-stage {
    padding: 16px;
  }

  .preview-actions .btn,
  .result-actions .btn,
  .sample-btns .btn {
    flex: 1 1 130px;
  }
}
</style>
