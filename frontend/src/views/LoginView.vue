<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser, authLoading, consumePostLoginDestination } from '@/services/authStore'
import HvIcon from '@/components/HvIcon.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)

function fillDemo(role: 'user' | 'admin') {
  errorMessage.value = null
  if (role === 'admin') {
    email.value = 'admin@hydravision.demo'
    password.value = 'admin1234'
  } else {
    email.value = 'nadia@hydravision.demo'
    password.value = 'user1234'
  }
}

async function submitLogin() {
  errorMessage.value = null
  const result = await loginUser({ email: email.value, password: password.value })
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  const nextDest = consumePostLoginDestination()
  if (nextDest) {
    if (nextDest.startsWith('/admin') && result.user.role !== 'admin') {
      router.push('/dashboard')
    } else {
      router.push(nextDest)
    }
    return
  }
  router.push(result.user.role === 'admin' ? '/admin' : '/dashboard')
}
</script>

<template>
  <div class="auth-layout">
    <div class="auth-topbar">
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
    </div>

    <main class="auth-stage">
      <div class="auth-shell">
        <!-- Tactile terracotta context panel -->
        <aside class="auth-side vanity-tray">
          <div class="vanity-tray-well auth-side-well">
            <div class="ceramic-note">
              <h2>Satu pintu masuk untuk User dan Admin</h2>
              <p>
                Masuk untuk mengunggah foto kulit, melihat persentase keyakinan AI, dan menyimpan
                riwayat pengecekan secara otomatis.
              </p>

              <div class="demo-section">
                <p class="demo-title">Akun Pengujian Cepat</p>
                <div class="demo-buttons">
                  <button type="button" class="btn btn-ceramic btn-sm" @click="fillDemo('user')">
                    Isi Demo User
                  </button>
                  <button type="button" class="btn btn-ceramic btn-sm" @click="fillDemo('admin')">
                    Isi Demo Admin
                  </button>
                </div>
                <p class="demo-creds tabular">
                  User: nadia@hydravision.demo / user1234<br />
                  Admin: admin@hydravision.demo / admin1234
                </p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Login form panel -->
        <section class="auth-panel ceramic-panel">
          <h1>Masuk ke HydraVision</h1>
          <p class="auth-sub">
            Masukkan email dan password terdaftar. Sistem otomatis mengarahkan ke dashboard sesuai
            peran akun Anda.
          </p>

          <div v-if="errorMessage" class="notice notice-error" role="alert">
            <HvIcon name="alert" :size="18" />
            <span>{{ errorMessage }}</span>
          </div>

          <form class="auth-form" novalidate @submit.prevent="submitLogin">
            <div class="field">
              <label for="login-email" class="field-label">Email</label>
              <input
                id="login-email"
                v-model="email"
                type="email"
                class="field-input"
                autocomplete="email"
                placeholder="nama@contoh.com"
                required
              />
            </div>

            <div class="field">
              <div class="label-row">
                <label for="login-password" class="field-label">Password</label>
                <RouterLink to="/forgot-password" class="forgot-link">Lupa password?</RouterLink>
              </div>
              <div class="password-wrap">
                <input
                  id="login-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input password-input"
                  autocomplete="current-password"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  class="pw-toggle"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                  @click="showPassword = !showPassword"
                >
                  <HvIcon :name="showPassword ? 'eye-off' : 'eye'" :size="18" />
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="authLoading">
              {{ authLoading ? 'Memproses...' : 'Masuk' }}
            </button>
          </form>

          <p class="auth-switch">
            Belum memiliki akun?
            <RouterLink to="/register">Daftar sekarang</RouterLink>
          </p>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 40px;
}

.auth-topbar {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto 24px;
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
  border-radius: 8px;
  background: var(--clay-body);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
}

.brand-wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--ink-umber);
}

.back-link:hover {
  color: var(--indigo-primary);
}

.auth-stage {
  flex: 1;
  display: grid;
  place-items: center;
}

.auth-shell {
  max-width: 960px;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: 24px;
  align-items: stretch;
}

.auth-side {
  display: flex;
}

.auth-side-well {
  width: 100%;
  padding: 26px 18px 18px 24px;
  display: flex;
}

.ceramic-note {
  width: 100%;
  background: var(--ceramic-ivory);
  border-radius: var(--radius-sm);
  padding: 26px 24px;
  box-shadow: var(--shadow-dish);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 22px;
}

.ceramic-note h2 {
  font-size: 1.45rem;
  margin-bottom: 10px;
}

.ceramic-note > p {
  font-size: 0.9375rem;
  color: var(--ink-umber);
  line-height: 1.55;
}

.demo-section {
  padding-top: 18px;
  border-top: 1px solid var(--ceramic-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--ink-espresso);
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.demo-creds {
  font-size: 0.8rem;
  color: var(--ink-umber);
  line-height: 1.55;
}

.auth-panel {
  padding: 36px 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-panel h1 {
  font-size: 1.85rem;
}

.auth-sub {
  color: var(--ink-umber);
  font-size: 0.9375rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 4px;
}

.label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.forgot-link {
  font-size: 0.84rem;
  font-weight: 500;
}

.password-wrap {
  position: relative;
}

.password-input {
  padding-right: 46px;
}

.pw-toggle {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--ink-umber);
  border-radius: 6px;
  display: grid;
  place-items: center;
}

.pw-toggle:hover {
  background: rgba(33, 27, 23, 0.06);
  color: var(--ink-espresso);
}

.submit-btn {
  width: 100%;
  margin-top: 6px;
}

.auth-switch {
  font-size: 0.9rem;
  color: var(--ink-umber);
  text-align: center;
  padding-top: 8px;
  border-top: 1px solid var(--ceramic-border);
}

.auth-switch a {
  font-weight: 600;
}

@media (max-width: 820px) {
  .auth-layout {
    padding: 16px 16px 32px;
  }

  .auth-topbar {
    flex-wrap: wrap;
    gap: 10px;
  }

  .auth-shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .auth-panel {
    order: -1;
    padding: 24px 18px;
  }

  .auth-side-well {
    padding: 18px 14px 14px 18px;
  }
}
</style>
