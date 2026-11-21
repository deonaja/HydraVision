<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAuthenticated, isAdmin } from '@/services/authStore'
import { pushToast } from '@/services/mockStore'
import AppShell from '@/components/AppShell.vue'
import HvIcon from '@/components/HvIcon.vue'

type QuickLink = {
  to: string
  label: string
  detail: string
  icon: 'home' | 'scan' | 'history' | 'user' | 'users' | 'book-care' | 'lock' | 'plus'
}

const route = useRoute()
const router = useRouter()
const copied = ref(false)
let copyTimer: number | null = null
let previousTitle = ''

const requestedPath = computed(() => route.fullPath || route.path || '/')

const primaryDestination = computed(() => {
  if (!isAuthenticated.value) {
    return { to: '/', label: 'Kembali ke Beranda', icon: 'home' as const }
  }
  if (isAdmin.value) {
    return { to: '/admin', label: 'Ke Ringkasan Admin', icon: 'home' as const }
  }
  return { to: '/dashboard', label: 'Ke Dashboard', icon: 'home' as const }
})

const quickLinks = computed<QuickLink[]>(() => {
  if (!isAuthenticated.value) {
    return [
      {
        to: '/',
        label: 'Beranda HydraVision',
        detail: 'Lihat cara kerja analisis hidrasi kulit dan contoh hasil.',
        icon: 'home',
      },
      {
        to: '/login',
        label: 'Masuk ke Akun',
        detail: 'Buka dashboard pribadi, cek kulit, dan riwayat tersimpan.',
        icon: 'lock',
      },
      {
        to: '/register',
        label: 'Daftar Akun Baru',
        detail: 'Buat akun untuk mulai mengecek hidrasi kulit secara rutin.',
        icon: 'plus',
      },
    ]
  }

  if (isAdmin.value) {
    return [
      {
        to: '/admin',
        label: 'Ringkasan Panel Admin',
        detail: 'Pantau jumlah pengguna aktif, hasil scan, dan status sistem.',
        icon: 'home',
      },
      {
        to: '/admin/users',
        label: 'Kelola Akun User',
        detail: 'Tinjau daftar pengguna, ubah status aktif, atau hapus akun.',
        icon: 'users',
      },
      {
        to: '/admin/recommendations',
        label: 'Kelola Rekomendasi',
        detail: 'Perbarui saran perawatan untuk kondisi Terhidrasi dan Kering.',
        icon: 'book-care',
      },
      {
        to: '/classify',
        label: 'Uji Klasifikasi Kulit',
        detail: 'Unggah foto atau ambil gambar langsung dari kamera.',
        icon: 'scan',
      },
    ]
  }

  return [
    {
      to: '/dashboard',
      label: 'Dashboard Pribadi',
      detail: 'Lihat ringkasan pengecekan terakhir dan tren hidrasi Anda.',
      icon: 'home',
    },
    {
      to: '/classify',
      label: 'Cek Kondisi Kulit',
      detail: 'Unggah foto kulit atau gunakan kamera untuk analisis baru.',
      icon: 'scan',
    },
    {
      to: '/history',
      label: 'Riwayat Klasifikasi',
      detail: 'Bandingkan catatan sebelumnya beserta saran perawatannya.',
      icon: 'history',
    },
    {
      to: '/profile',
      label: 'Profil Akun',
      detail: 'Kelola nama tampilan dan pengaturan keamanan password.',
      icon: 'user',
    },
  ]
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push(primaryDestination.value.to)
  }
}

async function copyRequestedPath() {
  const value = requestedPath.value
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    pushToast('Alamat halaman disalin ke papan klip.', 'info')
    if (copyTimer) window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch {
    pushToast('Tidak dapat menyalin alamat secara otomatis.', 'error')
  }
}

onMounted(() => {
  previousTitle = document.title
  document.title = '404 — Halaman tidak ditemukan · HydraVision'
})

onBeforeUnmount(() => {
  if (previousTitle) document.title = previousTitle
  if (copyTimer) window.clearTimeout(copyTimer)
})
</script>

<template>
  <AppShell v-if="isAuthenticated">
    <div class="nf-workspace">
      <section class="vanity-tray nf-tray" aria-labelledby="nf-heading-auth">
        <div class="vanity-tray-well nf-empty-well">
          <div class="nf-empty-slot">
            <HvIcon name="compass" :size="26" class="nf-compass" />
            <p class="nf-code tabular" aria-hidden="true">404</p>
            <p class="nf-slot-note">Kompartemen alamat ini kosong.</p>
          </div>
        </div>

        <div class="vanity-tray-well nf-dish-well">
          <article class="ceramic-dish nf-dish">
            <div class="nf-dish-head">
              <h1 id="nf-heading-auth">Halaman tidak ditemukan</h1>
              <p class="nf-lead">
                Alamat yang Anda tuju tidak tersedia di HydraVision atau sudah dipindahkan. Sesi
                akun Anda tetap aman dan aktif—silakan lanjutkan ke halaman di bawah.
              </p>
            </div>

            <div class="nf-path-row">
              <div class="nf-path-meta">
                <span class="nf-path-label">Alamat yang diminta</span>
                <code class="nf-path-value">{{ requestedPath }}</code>
              </div>
              <button
                type="button"
                class="btn btn-ceramic btn-sm nf-copy-btn"
                :aria-label="copied ? 'Alamat sudah disalin' : 'Salin alamat yang diminta'"
                @click="copyRequestedPath"
              >
                <HvIcon :name="copied ? 'check-circle' : 'copy'" :size="15" />
                <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
              </button>
            </div>

            <div class="nf-actions">
              <RouterLink :to="primaryDestination.to" class="btn btn-primary">
                <HvIcon :name="primaryDestination.icon" :size="18" />
                <span>{{ primaryDestination.label }}</span>
              </RouterLink>
              <button type="button" class="btn btn-ceramic" @click="goBack">
                <HvIcon name="arrow-left" :size="17" />
                <span>Halaman Sebelumnya</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      <nav class="ceramic-panel nf-directory" aria-label="Jalur cepat halaman yang tersedia">
        <div class="nf-dir-head">
          <h2>Tujuan yang tersedia</h2>
          <p>Pilih langsung halaman utama yang ingin Anda buka.</p>
        </div>
        <ul class="nf-dir-list">
          <li v-for="item in quickLinks" :key="item.to">
            <RouterLink :to="item.to" class="nf-dir-link">
              <HvIcon :name="item.icon" :size="19" class="nf-dir-glyph" />
              <span class="nf-dir-copy">
                <strong>{{ item.label }}</strong>
                <span>{{ item.detail }}</span>
              </span>
              <HvIcon name="arrow-right" :size="17" class="nf-dir-arrow" />
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </AppShell>

  <div v-else class="nf-standalone">
    <header class="nf-topbar">
      <RouterLink to="/" class="brand-back">
        <span class="brand-mark" aria-hidden="true">
          <HvIcon name="droplet" :size="17" />
        </span>
        <span class="brand-wordmark">HydraVision</span>
      </RouterLink>
      <RouterLink to="/" class="back-link">
        <HvIcon name="arrow-left" :size="16" />
        <span>Kembali ke Beranda</span>
      </RouterLink>
    </header>

    <main class="nf-stage">
      <div class="nf-workspace nf-workspace-guest">
        <section class="vanity-tray nf-tray" aria-labelledby="nf-heading-guest">
          <div class="vanity-tray-well nf-empty-well">
            <div class="nf-empty-slot">
              <HvIcon name="compass" :size="26" class="nf-compass" />
              <p class="nf-code tabular" aria-hidden="true">404</p>
              <p class="nf-slot-note">Kompartemen alamat ini kosong.</p>
            </div>
          </div>

          <div class="vanity-tray-well nf-dish-well">
            <article class="ceramic-dish nf-dish">
              <div class="nf-dish-head">
                <h1 id="nf-heading-guest">Halaman tidak ditemukan</h1>
                <p class="nf-lead">
                  Alamat yang Anda buka tidak terdaftar di HydraVision atau mungkin terdapat salah
                  ketik pada tautan. Kembali ke beranda atau pilih halaman yang tersedia di bawah.
                </p>
              </div>

              <div class="nf-path-row">
                <div class="nf-path-meta">
                  <span class="nf-path-label">Alamat yang diminta</span>
                  <code class="nf-path-value">{{ requestedPath }}</code>
                </div>
                <button
                  type="button"
                  class="btn btn-ceramic btn-sm nf-copy-btn"
                  :aria-label="copied ? 'Alamat sudah disalin' : 'Salin alamat yang diminta'"
                  @click="copyRequestedPath"
                >
                  <HvIcon :name="copied ? 'check-circle' : 'copy'" :size="15" />
                  <span>{{ copied ? 'Tersalin' : 'Salin' }}</span>
                </button>
              </div>

              <div class="nf-actions">
                <RouterLink :to="primaryDestination.to" class="btn btn-primary">
                  <HvIcon :name="primaryDestination.icon" :size="18" />
                  <span>{{ primaryDestination.label }}</span>
                </RouterLink>
                <button type="button" class="btn btn-ceramic" @click="goBack">
                  <HvIcon name="arrow-left" :size="17" />
                  <span>Halaman Sebelumnya</span>
                </button>
              </div>
            </article>
          </div>
        </section>

        <nav class="ceramic-panel nf-directory" aria-label="Jalur cepat halaman yang tersedia">
          <div class="nf-dir-head">
            <h2>Tujuan yang tersedia</h2>
            <p>Mulai dari beranda atau masuk ke akun HydraVision Anda.</p>
          </div>
          <ul class="nf-dir-list">
            <li v-for="item in quickLinks" :key="item.to">
              <RouterLink :to="item.to" class="nf-dir-link">
                <span class="nf-dir-icon" aria-hidden="true">
                  <HvIcon :name="item.icon" :size="18" />
                </span>
                <span class="nf-dir-copy">
                  <strong>{{ item.label }}</strong>
                  <span>{{ item.detail }}</span>
                </span>
                <HvIcon name="arrow-right" :size="17" class="nf-dir-arrow" />
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  </div>
</template>

<style scoped>
.nf-standalone {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 48px;
}

.nf-topbar {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.brand-back {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink-espresso);
}

.brand-mark {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-sm);
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
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-umber);
  transition: color var(--dur-fast) var(--ease-out);
}

.back-link:hover {
  color: var(--indigo-primary);
}

.nf-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nf-workspace {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nf-workspace-guest {
  max-width: 1000px;
  margin: 0 auto;
}

/* Signature two-compartment terracotta vanity tray */
.nf-tray {
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
  gap: 14px;
  animation: nf-settle 280ms var(--ease-out) both;
}

@keyframes nf-settle {
  from {
    transform: translateY(6px);
  }
  to {
    transform: translateY(0);
  }
}

.nf-empty-well {
  padding: 20px;
  display: flex;
}

.nf-empty-slot {
  width: 100%;
  min-height: 240px;
  border: 1.75px dashed rgba(250, 246, 239, 0.56);
  border-radius: var(--radius-sm);
  background: rgba(56, 20, 9, 0.14);
  padding: 28px 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.nf-compass {
  color: rgba(251, 246, 240, 0.86);
}

.nf-code {
  font-family: var(--font-display);
  font-size: clamp(2.05rem, 3.8vw, 3.25rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--ink-on-clay);
  text-shadow: 0 2px 6px rgba(48, 16, 6, 0.34);
}

.nf-slot-note {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(251, 246, 240, 0.92);
  max-width: 24ch;
}

.nf-dish-well {
  padding: 22px 16px 16px 22px;
  display: flex;
}

.nf-dish {
  width: 100%;
  padding: 28px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

.nf-dish-head {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nf-dish-head h1 {
  font-size: clamp(1.65rem, 2.6vw, 2.1rem);
  line-height: 1.18;
  letter-spacing: -0.025em;
}

.nf-lead {
  color: var(--ink-umber);
  font-size: 1rem;
  line-height: 1.55;
  max-width: 54ch;
}

.nf-path-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  background: var(--linen-soft);
  border: 1.5px solid var(--ceramic-border);
  border-radius: var(--radius-sm);
}

.nf-path-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nf-path-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-muted);
}

.nf-path-value {
  font-family: var(--font-ui);
  font-variant-numeric: tabular-nums;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-espresso);
  overflow-wrap: anywhere;
}

.nf-copy-btn {
  flex-shrink: 0;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 4px;
}

/* Ceramic directory panel beneath the tray */
.nf-directory {
  overflow: hidden;
}

.nf-dir-head {
  padding: 22px 24px 16px;
  border-bottom: 1px solid var(--ceramic-border);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.nf-dir-head h2 {
  font-size: 1.25rem;
}

.nf-dir-head p {
  font-size: 0.875rem;
  color: var(--ink-umber);
}

.nf-dir-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nf-dir-list li + li {
  border-top: 1px solid var(--ceramic-border);
}

.nf-dir-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 15px 24px;
  text-decoration: none;
  color: var(--ink-espresso);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.nf-dir-link:hover {
  background: var(--linen-soft);
  color: var(--ink-espresso);
}

.nf-dir-glyph {
  flex-shrink: 0;
  color: var(--indigo-primary);
}

.nf-dir-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nf-dir-copy strong {
  font-size: 1rem;
  font-weight: 600;
  color: var(--ink-espresso);
}

.nf-dir-copy span {
  font-size: 0.875rem;
  color: var(--ink-umber);
  line-height: 1.45;
}

.nf-dir-arrow {
  flex-shrink: 0;
  color: var(--ink-muted);
  transition:
    transform var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.nf-dir-link:hover .nf-dir-arrow {
  transform: translateX(3px);
  color: var(--indigo-primary);
}

@media (max-width: 860px) {
  .nf-tray {
    grid-template-columns: minmax(0, 1fr);
  }

  .nf-empty-slot {
    min-height: 168px;
    padding: 22px 18px;
  }

  .nf-dish-well {
    padding: 16px 14px 14px 16px;
  }

  .nf-dish {
    padding: 22px 20px;
  }
}

@media (max-width: 600px) {
  .nf-standalone {
    padding: 16px 16px 36px;
  }

  .nf-topbar {
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  .nf-path-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .nf-copy-btn {
    width: 100%;
  }

  .nf-actions {
    flex-direction: column;
  }

  .nf-actions .btn {
    width: 100%;
  }

  .nf-dir-head {
    padding: 18px 18px 14px;
  }

  .nf-dir-link {
    padding: 14px 18px;
  }
}
</style>
