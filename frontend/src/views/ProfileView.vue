<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  currentUser,
  updateCurrentProfile,
  logoutUser,
} from '@/services/authStore'
import { formatDateFull } from '@/services/mockStore'
import { getMyHistory } from '@/services/dataStore'
import AppShell from '@/components/AppShell.vue'
import HvIcon from '@/components/HvIcon.vue'

const router = useRouter()

const name = ref(currentUser.value?.name ?? '')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref<string | null>(null)
const savedNotice = ref(false)
const historyCount = ref(0)

onMounted(async () => {
  try {
    const history = await getMyHistory()
    historyCount.value = history.length
  } catch {}
})

watch(currentUser, (u) => {
  if (u) name.value = u.name
})

async function handleSave() {
  errorMessage.value = null
  savedNotice.value = false

  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi password baru belum sama.'
    return
  }

  const res = await updateCurrentProfile({
    name: name.value,
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
  })

  if (!res.ok) {
    errorMessage.value = res.error
    return
  }

  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  savedNotice.value = true
}

async function handleLogout() {
  await logoutUser()
  router.push('/login')
}
</script>

<template>
  <AppShell>
    <div class="profile-page">
      <header class="page-head">
        <div>
          <h1>Profil Akun</h1>
          <p class="page-sub">
            Lihat informasi akun Anda serta perbarui nama tampilan atau password keamanan.
          </p>
        </div>
        <button type="button" class="btn btn-ceramic" @click="handleLogout">
          <HvIcon name="logout" :size="17" />
          <span>Keluar dari Sesi</span>
        </button>
      </header>

      <div class="profile-grid">
        <!-- FR-06: Lihat Profil -->
        <section v-if="currentUser" class="ceramic-panel profile-summary">
          <div class="avatar-row">
            <div class="big-avatar" aria-hidden="true">
              {{ currentUser.name.slice(0, 1).toUpperCase() }}
            </div>
            <div>
              <h2>{{ currentUser.name }}</h2>
              <p class="email-line">{{ currentUser.email }}</p>
            </div>
          </div>

          <dl class="profile-dl">
            <div>
              <dt>Peran Akun</dt>
              <dd>{{ currentUser.role === 'admin' ? 'Admin Pengelola' : 'Pengguna (User)' }}</dd>
            </div>
            <div>
              <dt>Status Akun</dt>
              <dd>
                <span class="badge badge-active">Aktif</span>
              </dd>
            </div>
            <div>
              <dt>Terdaftar Sejak</dt>
              <dd class="tabular">{{ formatDateFull(currentUser.createdAt) }}</dd>
            </div>
            <div>
              <dt>Total Riwayat Klasifikasi</dt>
              <dd class="tabular">{{ historyCount }} catatan</dd>
            </div>
          </dl>
        </section>

        <!-- FR-07: Edit Profil (Nama & Password) -->
        <section class="ceramic-panel profile-form-card">
          <h2>Ubah Nama & Password</h2>
          <p class="form-sub">
            Kosongkan bagian password apabila Anda hanya ingin mengganti nama akun.
          </p>

          <div v-if="errorMessage" class="notice notice-error" role="alert">
            <HvIcon name="alert" :size="18" />
            <span>{{ errorMessage }}</span>
          </div>

          <div v-if="savedNotice" class="notice notice-info" role="status">
            <HvIcon name="check-circle" :size="18" />
            <span>Data profil Anda telah diperbarui.</span>
          </div>

          <form class="edit-form" novalidate @submit.prevent="handleSave">
            <div class="field">
              <label for="prof-name" class="field-label">Nama Lengkap</label>
              <input id="prof-name" v-model="name" type="text" class="field-input" required />
            </div>

            <div class="field">
              <label for="prof-email" class="field-label">Email (tidak dapat diubah)</label>
              <input
                id="prof-email"
                :value="currentUser?.email"
                type="email"
                class="field-input"
                disabled
              />
            </div>

            <hr class="form-divider" />

            <div class="field">
              <label for="prof-cur-pw" class="field-label">Password Saat Ini</label>
              <input
                id="prof-cur-pw"
                v-model="currentPassword"
                type="password"
                class="field-input"
                placeholder="Isi jika ingin mengganti password"
                autocomplete="current-password"
              />
            </div>

            <div class="pw-pair">
              <div class="field">
                <label for="prof-new-pw" class="field-label">Password Baru</label>
                <input
                  id="prof-new-pw"
                  v-model="newPassword"
                  type="password"
                  class="field-input"
                  placeholder="Minimal 8 karakter"
                  autocomplete="new-password"
                />
              </div>

              <div class="field">
                <label for="prof-conf-pw" class="field-label">Konfirmasi Password Baru</label>
                <input
                  id="prof-conf-pw"
                  v-model="confirmPassword"
                  type="password"
                  class="field-input"
                  placeholder="Ulangi password baru"
                  autocomplete="new-password"
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">Simpan Perubahan</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </AppShell>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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
}

.profile-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 24px;
  align-items: start;
}

.profile-summary {
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.big-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--clay-body);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.avatar-row h2 {
  font-size: 1.25rem;
}

.email-line {
  font-size: 0.875rem;
  color: var(--ink-muted);
}

.profile-dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 16px;
  border-top: 1px solid var(--ceramic-border);
}

.profile-dl > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 0.9rem;
}

.profile-dl dt {
  color: var(--ink-muted);
}

.profile-dl dd {
  margin: 0;
  font-weight: 600;
  color: var(--ink-espresso);
  text-align: right;
}

.profile-form-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-form-card h2 {
  font-size: 1.3rem;
}

.form-sub {
  font-size: 0.9rem;
  color: var(--ink-umber);
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-divider {
  border: 0;
  height: 1px;
  background: var(--ceramic-border);
  margin: 4px 0;
}

.pw-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

@media (max-width: 900px) {
  .profile-grid,
  .pw-pair {
    grid-template-columns: minmax(0, 1fr);
  }

  .profile-summary,
  .profile-form-card {
    padding: 20px 18px;
  }
}
</style>
