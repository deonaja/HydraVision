<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NON_MEDICAL_DISCLAIMER,
  PHOTO_GUIDELINES,
  stagedLandingUpload,
  validateSkinImageFile,
} from '@/services/mockStore'
import { isAuthenticated, isAdmin } from '@/services/authStore'
import HvIcon from '@/components/HvIcon.vue'

interface SampleStripItem {
  id: string
  date: string
  label: 'Terhidrasi' | 'Kering'
  confidence: number
  advice: string
}

const sampleHistory: SampleStripItem[] = [
  {
    id: 's1',
    date: '18 Nov',
    label: 'Terhidrasi',
    confidence: 91,
    advice: 'Gunakan pelembap ringan dan cukupi minum air putih.',
  },
  {
    id: 's2',
    date: '14 Nov',
    label: 'Kering',
    confidence: 84,
    advice: 'Oleskan pelembap berbahan ceramide segera setelah mencuci wajah.',
  },
  {
    id: 's3',
    date: '10 Nov',
    label: 'Terhidrasi',
    confidence: 88,
    advice: 'Pertahankan pembersih wajah pH seimbang dan tabir surya siang hari.',
  },
  {
    id: 's4',
    date: '06 Nov',
    label: 'Kering',
    confidence: 82,
    advice: 'Hindari air terlalu panas saat mencuci wajah dan batasi eksfoliasi.',
  },
]

const router = useRouter()
const activeSample = ref<SampleStripItem>(sampleHistory[0])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const uploadError = ref<string | null>(null)

function triggerFilePicker() {
  uploadError.value = null
  fileInputRef.value?.click()
}

function stageFileAndContinue(file: File) {
  uploadError.value = null
  const check = validateSkinImageFile(file)
  if (!check.ok) {
    uploadError.value = check.error
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    stagedLandingUpload.fileName = file.name
    stagedLandingUpload.dataUrl = typeof reader.result === 'string' ? reader.result : null
    if (isAuthenticated.value) {
      router.push('/classify')
    } else {
      router.push({ path: '/login', query: { redirect: '/classify' } })
    }
  }
  reader.readAsDataURL(file)
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) stageFileAndContinue(file)
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) stageFileAndContinue(file)
}

function goStartCheck() {
  if (isAuthenticated.value) {
    router.push('/classify')
  } else {
    router.push({ path: '/login', query: { redirect: '/classify' } })
  }
}
</script>

<template>
  <div class="landing-page">
    <div class="vanity-hero-canvas">
      <header class="top-nav">
        <div class="nav-inner">
          <RouterLink to="/" class="brand">
            <span class="brand-dot" aria-hidden="true">
              <HvIcon name="droplet" :size="17" />
            </span>
            <span class="brand-wordmark">HydraVision</span>
          </RouterLink>

          <nav class="nav-links" aria-label="Navigasi utama">
            <a href="#cara-kerja" class="nav-text-link">Cara Kerja</a>
            <a href="#panduan-foto" class="nav-text-link">Panduan Foto</a>
            <span class="nav-sep" aria-hidden="true"></span>
            <template v-if="isAuthenticated">
              <RouterLink :to="isAdmin ? '/admin' : '/dashboard'" class="btn btn-espresso btn-sm">
                Buka Dashboard
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/login" class="nav-text-link">Masuk</RouterLink>
              <RouterLink to="/register" class="btn btn-espresso btn-sm">Daftar</RouterLink>
            </template>
          </nav>
        </div>
      </header>

      <!-- First viewport: Linen & Clay Vanity Table -->
      <section class="hero-stage">
        <div class="hero-header">
          <h1>Cek Hidrasi Kulit dari Satu Foto</h1>
          <p class="hero-subtitle">
            Ketahui kondisi kulit <strong>Terhidrasi</strong> atau <strong>Kering</strong> beserta
            tingkat keyakinan dan saran perawatan harian.
          </p>
        </div>

        <div class="vanity-workspace">
          <!-- Signature sculpted two-compartment terracotta vanity tray plate -->
          <div class="vanity-tray hero-tray">
            <!-- Left well: Working upload dropzone + primary CTA -->
            <div
              class="vanity-tray-well upload-well"
              :class="{ 'is-dragging': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
            >
              <input
                ref="fileInputRef"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                class="sr-only"
                @change="onFileChange"
              />
              <div class="dropzone-frame" @click="triggerFilePicker">
                <span class="dropzone-icon" aria-hidden="true">
                  <HvIcon name="upload" :size="30" />
                </span>
                <p class="dropzone-title">
                  <strong>Unggah Foto Kulit</strong> · JPG/PNG maks 5 MB
                </p>
                <p v-if="uploadError" class="dropzone-error" role="alert">
                  {{ uploadError }}
                </p>
                <button
                  type="button"
                  class="btn btn-primary btn-lg tray-cta"
                  @click.stop="goStartCheck"
                >
                  Mulai Cek Kulit
                </button>
              </div>
            </div>

            <!-- Right well: Ivory ceramic dish displaying live sample verdict -->
            <div class="vanity-tray-well result-well">
              <article class="ceramic-dish" aria-live="polite">
                <Transition name="dish-settle" mode="out-in">
                  <div :key="activeSample.id" class="dish-content">
                    <span
                      class="badge dish-badge"
                      :class="
                        activeSample.label === 'Terhidrasi'
                          ? 'badge-hydrated-solid'
                          : 'badge-dry-solid'
                      "
                    >
                      <HvIcon name="droplet" :size="14" />
                      <span>Hasil Analisis · Contoh</span>
                    </span>

                    <p class="dish-verdict tabular">
                      {{ activeSample.label }} — {{ activeSample.confidence }}%
                    </p>
                    <p class="dish-sub">Keyakinan simulasi · {{ activeSample.date }}</p>

                    <div class="dish-advice">
                      <p class="dish-advice-title">Saran Perawatan</p>
                      <p class="dish-advice-body">{{ activeSample.advice }}</p>
                    </div>
                  </div>
                </Transition>
              </article>
            </div>
          </div>

          <!-- Side guide column beside the tray -->
          <aside class="guide-column" aria-label="Panduan Foto dan Keterangan">
            <h2>Panduan Foto</h2>
            <ul class="guide-checklist">
              <li>
                <HvIcon name="check-circle" :size="19" />
                <span>Pencahayaan cukup</span>
              </li>
              <li>
                <HvIcon name="check-circle" :size="19" />
                <span>Area kulit jelas</span>
              </li>
              <li>
                <HvIcon name="check-circle" :size="19" />
                <span>Tanpa filter</span>
              </li>
            </ul>
            <hr class="guide-rule" />
            <p class="guide-disclaimer">Bukan diagnosis medis</p>
          </aside>
        </div>

        <!-- Serial dated history comparison strip (interactive) -->
        <div class="history-strip-wrap">
          <p class="strip-legend">
            Contoh riwayat simulasi — klik salah satu tanggal untuk melihat pratinjau hasil
          </p>
          <div class="history-strip" role="tablist" aria-label="Contoh riwayat pengecekan berkala">
            <button
              v-for="item in sampleHistory"
              :key="item.id"
              type="button"
              role="tab"
              :aria-selected="activeSample.id === item.id"
              class="strip-chip tabular"
              :class="{
                'is-selected': activeSample.id === item.id,
                'is-dry': item.label === 'Kering',
                'is-hydrated': item.label === 'Terhidrasi',
              }"
              @click="activeSample = item"
            >
              <span class="chip-date-label">{{ item.date }} · {{ item.label }}</span>
              <strong class="chip-score">{{ item.confidence }}%</strong>
            </button>
          </div>
        </div>
      </section>
    </div>

    <main>

      <!-- Section 2: Continuous workflow strip -->
      <section id="cara-kerja" class="flow-section">
        <div class="section-inner">
          <div class="section-heading">
            <h2>Satu Alur Jelas dari Foto hingga Riwayat</h2>
            <p>
              Dirancang agar pengecekan kulit harian terasa cepat di ponsel maupun lega ditinjau
              kembali di layar desktop.
            </p>
          </div>

          <ol class="flow-track">
            <li class="flow-step">
              <span class="step-index tabular">1</span>
              <h3>Unggah & Validasi Foto</h3>
              <p>
                Pilih foto kulit berformat JPG, JPEG, atau PNG (maksimal 5 MB) lalu periksa
                pratinjau sebelum diproses.
              </p>
            </li>
            <li class="flow-step">
              <span class="step-index tabular">2</span>
              <h3>Klasifikasi AI Transparan</h3>
              <p>
                Sistem mengklasifikasikan kulit sebagai Terhidrasi atau Kering lengkap dengan
                persentase keyakinan model.
              </p>
            </li>
            <li class="flow-step">
              <span class="step-index tabular">3</span>
              <h3>Saran Perawatan Harian</h3>
              <p>
                Tampilkan langkah perawatan umum sesuai kelas hasil, selalu disertai keterangan
                bahwa hasil bukan diagnosis medis.
              </p>
            </li>
            <li class="flow-step">
              <span class="step-index tabular">4</span>
              <h3>Riwayat Tersimpan Otomatis</h3>
              <p>
                Setiap pemeriksaan langsung tercatat ke riwayat pribadi agar perubahan kulit bisa
                disaring berdasarkan tanggal dan hasil.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <!-- Section 3: Photo guide & honest non-medical scope -->
      <section id="panduan-foto" class="honesty-section">
        <div class="section-inner honesty-grid">
          <div class="honesty-rules ceramic-panel">
            <h2>Tiga Syarat Foto yang Jujur</h2>
            <p class="honesty-lead">
              Kualitas pembacaan hidrasi bergantung pada kejernihan foto yang Anda unggah. Pastikan
              tiga hal berikut sebelum memulai klasifikasi:
            </p>
            <dl class="rule-list">
              <div v-for="rule in PHOTO_GUIDELINES" :key="rule.id" class="rule-row">
                <dt>
                  <HvIcon
                    :name="rule.id === 'light' ? 'sun' : rule.id === 'clear' ? 'focus' : 'ban'"
                    :size="18"
                  />
                  <span>{{ rule.title }}</span>
                </dt>
                <dd>{{ rule.detail }}</dd>
              </div>
            </dl>
          </div>

          <div class="honesty-scope">
            <div class="vanity-tray scope-clay-tray">
              <div class="vanity-tray-well scope-clay-well">
                <div>
                  <h2>Batas Analisis & Transparansi</h2>
                  <p class="scope-disclaimer-text">{{ NON_MEDICAL_DISCLAIMER }}</p>
                </div>
                <div class="scope-demo-section">
                  <h3>Mode Demonstrasi Frontend</h3>
                  <p>
                    Versi ini berjalan mandiri di browser menggunakan akun demo User & Admin serta
                    simulasi klasifikasi lokal agar seluruh alur cek kulit, riwayat, dan pengelolaan
                    dapat langsung dicoba.
                  </p>
                  <div class="scope-actions">
                    <RouterLink to="/login" class="btn btn-ceramic">Masuk Akun Demo</RouterLink>
                    <RouterLink to="/register" class="btn btn-espresso">Daftar Akun Baru</RouterLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-wordmark">HydraVision</span>
          <p>Aplikasi web klasifikasi kondisi hidrasi kulit berbasis AI (Terhidrasi / Kering).</p>
        </div>
        <div class="footer-links">
          <a href="#cara-kerja">Cara Kerja</a>
          <a href="#panduan-foto">Panduan Foto</a>
          <RouterLink to="/login">Masuk</RouterLink>
          <RouterLink to="/register">Daftar</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Full-bleed sunlit morning vanity flat-lay canvas */
.vanity-hero-canvas {
  position: relative;
  background-color: var(--linen-ground);
  background-image: url("/images/hero-vanity-backdrop.png");
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
}

.top-nav {
  padding: 20px 28px 6px;
}

.nav-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink-espresso);
}

.brand-dot {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--clay-body);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
}

.brand-wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
  color: var(--ink-espresso);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 22px;
}

.nav-text-link {
  text-decoration: none;
  color: var(--ink-espresso);
  font-size: 0.9375rem;
  font-weight: 500;
}

.nav-text-link:hover {
  color: var(--indigo-primary);
}

.nav-sep {
  width: 1px;
  height: 20px;
  background: var(--ceramic-border-strong);
}

/* First viewport */
.hero-stage {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 28px 52px;
}

.hero-header {
  text-align: center;
  max-width: 940px;
  margin: 0 auto 30px;
}

.hero-header h1 {
  font-size: clamp(2.05rem, 3.8vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  margin-bottom: 12px;
}

.hero-subtitle {
  font-size: clamp(1rem, 1.35vw, 1.125rem);
  color: var(--ink-umber);
  line-height: 1.5;
}

.hero-subtitle strong {
  color: var(--ink-espresso);
  font-weight: 600;
}

.vanity-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 216px;
  gap: 28px;
  align-items: center;
}

/* Photographed sculpted terracotta stoneware two-compartment tray */
.hero-tray {
  display: grid;
  grid-template-columns: 59.5% 40.5%;
  gap: 0;
  padding: 0;
  background-color: transparent;
  background-image: url("/images/terracotta-tray-plate.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: none;
  border-radius: 10px;
  box-shadow: 0 18px 34px rgba(48, 28, 18, 0.22), 0 4px 10px rgba(48, 28, 18, 0.14);
  min-height: 368px;
}

.upload-well {
  /* Seated strictly inside the measured sunlit clay floor (clearing top 12.4% & left 6.1% inner walls) */
  padding: 52px 24px 30px 58px;
  display: flex;
  align-items: stretch;
  background: transparent;
  border: none;
  box-shadow: none;
  transition: background-color var(--dur-fast) var(--ease-out);
}

.upload-well.is-dragging {
  background: rgba(58, 20, 8, 0.22);
}

.dropzone-frame {
  width: 100%;
  border: 1.5px dashed rgba(250, 246, 239, 0.56);
  border-radius: 8px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  cursor: pointer;
  color: var(--ink-on-clay);
  transition:
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out);
}

.dropzone-frame:hover {
  border-color: rgba(250, 246, 239, 0.92);
  background: rgba(255, 248, 240, 0.08);
}

.dropzone-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(250, 246, 239, 0.14);
  display: grid;
  place-items: center;
  color: var(--ceramic-ivory);
}

.dropzone-title {
  font-size: 0.9375rem;
  color: rgba(250, 246, 239, 0.94);
}

.dropzone-title strong {
  color: #ffffff;
  font-weight: 600;
}

.dropzone-error {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  background: var(--ceramic-ivory);
  color: var(--state-danger-fg);
  font-size: 0.8125rem;
  font-weight: 500;
}

.tray-cta {
  width: 100%;
  max-width: 256px;
  margin-top: 2px;
}

.result-well {
  /* Seated squarely on the measured right-compartment floor (clearing top 12.4% wall & divider shadow) */
  padding: 52px 34px 30px 48px;
  display: flex;
  align-items: stretch;
  background: transparent;
  border: none;
  box-shadow: none;
}

.ceramic-dish {
  position: relative;
  width: 100%;
  background: linear-gradient(155deg, #efe7da 0%, #f6f0e6 34%, #f8f3ea 100%);
  border: 1px solid rgba(118, 56, 28, 0.28);
  border-radius: 9px;
  padding: 20px 18px 18px;
  box-shadow:
    inset 0 2px 6px rgba(96, 40, 18, 0.12),
    inset 2px 0 6px rgba(96, 40, 18, 0.09),
    inset -1px -1px 0 rgba(255, 250, 243, 0.8),
    0 1px 2px rgba(48, 16, 6, 0.42),
    4px 6px 14px rgba(54, 19, 8, 0.34);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

/* Soft morning wall-shadow falloff from upper-left tray rim onto the ceramic dish */
.ceramic-dish::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(92, 38, 16, 0.14) 0%, rgba(92, 38, 16, 0.03) 18%, transparent 40%),
    linear-gradient(90deg, rgba(92, 38, 16, 0.11) 0%, rgba(92, 38, 16, 0.025) 14%, transparent 32%);
}

.dish-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dish-settle-enter-active,
.dish-settle-leave-active {
  transition:
    opacity 180ms var(--ease-out),
    transform 180ms var(--ease-out);
}

.dish-settle-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.dish-settle-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.dish-badge {
  align-self: flex-start;
  margin-bottom: 4px;
}

.dish-verdict {
  font-family: var(--font-display);
  font-size: clamp(1.22rem, 1.52vw, 1.46rem);
  font-weight: 700;
  color: var(--ink-espresso);
  letter-spacing: -0.025em;
  line-height: 1.15;
  white-space: nowrap;
}

.dish-sub {
  font-size: 0.9rem;
  color: var(--ink-umber);
  margin-bottom: 8px;
}

.dish-advice {
  padding-top: 12px;
  border-top: 1px solid var(--ceramic-border);
}

.dish-advice-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--ink-espresso);
  margin-bottom: 4px;
}

.dish-advice-body {
  font-size: 0.9rem;
  color: var(--ink-umber);
  line-height: 1.48;
}

/* Guide column */
.guide-column h2 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 14px;
}

.guide-checklist {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-checklist li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: var(--ink-espresso);
}

.guide-checklist svg {
  color: var(--ink-espresso);
  flex-shrink: 0;
}

.guide-rule {
  border: 0;
  height: 1px;
  background: var(--ceramic-border-strong);
  margin: 18px 0 14px;
}

.guide-disclaimer {
  font-size: 0.9375rem;
  color: var(--ink-umber);
  font-weight: 500;
}

/* Serial history contact strip */
.history-strip-wrap {
  margin-top: 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.strip-legend {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--ink-umber);
}

.history-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.strip-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 54px;
  padding: 0 18px;
  border-radius: var(--radius-sm);
  background: var(--ceramic-ivory);
  border: 1.5px solid var(--ceramic-border);
  color: var(--ink-espresso);
  font-size: 0.9375rem;
  box-shadow: 0 2px 6px rgba(33, 27, 23, 0.06);
  transition:
    transform var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out),
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.strip-chip:hover {
  transform: translateY(-1px);
  border-color: var(--ink-umber);
}

.strip-chip.is-dry {
  background-color: var(--clay-body);
  background-image:
    linear-gradient(160deg, rgba(248, 198, 166, 0.14) 0%, transparent 45%, rgba(56, 18, 6, 0.18) 100%),
    url("/images/terracotta-tile.png");
  background-size: auto, 260px 260px;
  border-color: #7f361b;
  color: var(--ink-on-clay);
  box-shadow:
    inset 0 1.5px 0 rgba(246, 192, 160, 0.34),
    inset 0 -1.5px 1px rgba(74, 24, 9, 0.38),
    0 3px 8px rgba(48, 24, 14, 0.16);
}

.strip-chip.is-selected.is-hydrated {
  border-color: var(--indigo-primary);
  box-shadow: 0 0 0 2px rgba(35, 75, 114, 0.22);
}

.strip-chip.is-selected.is-dry {
  border-color: var(--ink-espresso);
  box-shadow: 0 0 0 2px rgba(33, 27, 23, 0.24);
}

.chip-score {
  font-weight: 700;
}

/* Section 2: Continuous flow */
.flow-section {
  background: var(--linen-soft);
  border-top: 1.5px solid var(--ceramic-border);
  border-bottom: 1.5px solid var(--ceramic-border);
  padding: 64px 28px;
}

.section-inner {
  max-width: 1180px;
  margin: 0 auto;
}

.section-heading {
  max-width: 760px;
  margin-bottom: 36px;
}

.section-heading h2 {
  font-size: clamp(1.65rem, 2.8vw, 2.25rem);
  margin-bottom: 10px;
}

.section-heading p {
  color: var(--ink-umber);
  font-size: 1rem;
}

.flow-track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.flow-step {
  padding-top: 20px;
  border-top: 2px solid var(--ceramic-border-strong);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-index {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--indigo-primary);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.flow-step h3 {
  font-size: 1.075rem;
}

.flow-step p {
  font-size: 0.9375rem;
  color: var(--ink-umber);
  line-height: 1.55;
}

/* Section 3: Photo guide & scope */
.honesty-section {
  padding: 64px 28px 72px;
}

.honesty-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 28px;
  align-items: stretch;
}

.honesty-rules {
  padding: 32px;
}

.honesty-rules h2 {
  font-size: clamp(1.45rem, 2.3vw, 1.85rem);
  margin-bottom: 10px;
}

.honesty-lead {
  color: var(--ink-umber);
  margin-bottom: 24px;
  max-width: 60ch;
}

.rule-list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.rule-row {
  padding-top: 16px;
  border-top: 1px solid var(--ceramic-border);
}

.rule-row:first-child {
  padding-top: 0;
  border-top: 0;
}

.rule-row dt {
  display: flex;
  align-items: center;
  gap: 9px;
  font-weight: 700;
  color: var(--ink-espresso);
  margin-bottom: 4px;
}

.rule-row dt svg {
  color: var(--indigo-primary);
}

.rule-row dd {
  margin: 0;
  padding-left: 27px;
  color: var(--ink-umber);
  font-size: 0.9375rem;
}

.scope-clay-tray {
  height: 100%;
  display: flex;
}

.scope-clay-well {
  width: 100%;
  padding: 34px 30px 30px 34px;
  color: var(--ink-on-clay);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
}

.scope-clay-well h2 {
  color: var(--ink-on-clay);
  font-size: clamp(1.45rem, 2.2vw, 1.8rem);
  margin-bottom: 10px;
}

.scope-disclaimer-text {
  color: rgba(251, 246, 240, 0.94);
  font-size: 0.95rem;
  line-height: 1.6;
}

.scope-demo-section {
  padding-top: 22px;
  border-top: 1px solid rgba(250, 246, 239, 0.28);
}

.scope-demo-section h3 {
  color: var(--ink-on-clay);
  font-size: 1.05rem;
  margin-bottom: 8px;
}

.scope-demo-section p {
  font-size: 0.9rem;
  color: rgba(251, 246, 240, 0.9);
  margin-bottom: 18px;
  line-height: 1.55;
}

.scope-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Footer */
.site-footer {
  margin-top: auto;
  border-top: 1.5px solid var(--ceramic-border);
  background: var(--linen-rail);
  padding: 28px;
}

.footer-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
}

.footer-brand p {
  font-size: 0.875rem;
  color: var(--ink-umber);
  margin-top: 4px;
}

.footer-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 0.9rem;
}

.footer-links a {
  text-decoration: none;
  color: var(--ink-espresso);
  font-weight: 500;
}

.footer-links a:hover {
  color: var(--indigo-primary);
}

@media (max-width: 1120px) {
  .vanity-hero-canvas {
    background-image: url("/images/linen-tile.png");
    background-size: 340px 340px;
    background-repeat: repeat;
  }
}

@media (max-width: 1020px) {
  .vanity-workspace {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }

  .dish-verdict {
    white-space: normal;
  }

  .guide-column {
    background: var(--ceramic-ivory);
    border: 1.5px solid var(--ceramic-border);
    border-radius: var(--radius-md);
    padding: 20px 22px;
  }

  .guide-checklist {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 12px 24px;
  }

  .history-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .flow-track {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .honesty-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 860px) {
  .hero-tray {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    padding: 12px;
    min-height: 0;
    background-color: var(--clay-body);
    background-image:
      linear-gradient(160deg, rgba(248, 198, 166, 0.14) 0%, transparent 40%, rgba(56, 18, 6, 0.16) 100%),
      url("/images/terracotta-tile.png");
    background-size: auto, 280px 280px;
    background-repeat: no-repeat, repeat;
    border: 1px solid #7f361b;
  }

  .upload-well,
  .result-well {
    padding: 22px 16px 16px 20px;
    background-color: var(--clay-recess);
    background-image:
      linear-gradient(135deg, rgba(36, 10, 2, 0.36) 0%, rgba(44, 14, 4, 0.1) 36%, transparent 72%),
      url("/images/terracotta-tile.png");
    background-size: auto, 280px 280px;
    border: 1px solid rgba(64, 22, 8, 0.42);
    box-shadow:
      inset 14px 16px 22px rgba(34, 9, 2, 0.56),
      inset 4px 5px 8px rgba(32, 8, 2, 0.48),
      inset -2px -2px 5px rgba(232, 158, 118, 0.26);
  }
}

@media (max-width: 720px) {
  .top-nav {
    padding: 16px 16px 8px;
  }

  .nav-links {
    gap: 12px;
  }

  .nav-text-link[href^="#"],
  .nav-sep {
    display: none;
  }

  .hero-stage {
    padding: 20px 16px 38px;
  }

  .dropzone-frame {
    padding: 22px 14px;
  }

  .guide-checklist {
    flex-direction: column;
    gap: 10px;
  }

  .history-strip,
  .flow-track {
    grid-template-columns: minmax(0, 1fr);
  }

  .flow-section,
  .honesty-section {
    padding: 40px 16px;
  }

  .honesty-rules {
    padding: 20px;
  }

  .scope-clay-well {
    padding: 24px 18px 20px 22px;
  }
}
</style>
