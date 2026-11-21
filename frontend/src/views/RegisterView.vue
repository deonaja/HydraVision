<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, authLoading } from '@/services/authStore'
import HvIcon from '@/components/HvIcon.vue'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)

async function submitRegister() {
  errorMessage.value = null
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi password belum sama dengan password yang dimasukkan.'
    return
  }
  const result = await registerUser({
    name: name.value,
    email: email.value,
    password: password.value,
  })
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  router.push('/dashboard')
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
      <section class="register-panel ceramic-panel">
        <h1>Buat Akun HydraVision</h1>
        <p class="auth-sub">
          Daftar menggunakan nama, email, dan password untuk mulai mengecek kondisi kulit dan
          menyimpan riwayat pribadi Anda.
        </p>

        <div v-if="errorMessage" class="notice notice-error" role="alert">
          <HvIcon name="alert" :size="18" />
          <span>{{ errorMessage }}</span>
        </div>

        <form class="auth-form" novalidate @submit.prevent="submitRegister">
          <div class="field">
            <label for="reg-name" class="field-label">Nama Lengkap</label>
            <input
              id="reg-name"
              v-model="name"
              type="text"
              class="field-input"
              autocomplete="name"
              placeholder="Contoh: Nadia Kusuma"
              required
            />
          </div>

          <div class="field">
            <label for="reg-email" class="field-label">Email</label>
            <input
              id="reg-email"
              v-model="email"
              type="email"
              class="field-input"
              autocomplete="email"
              placeholder="nama@contoh.com"
              required
            />
          </div>

          <div class="field">
            <label for="reg-password" class="field-label">Password</label>
            <div class="password-wrap">
              <input
                id="reg-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input password-input"
                autocomplete="new-password"
                placeholder="Minimal 8 karakter"
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
            <span class="field-hint">Gunakan minimal 8 karakter agar akun aman.</span>
          </div>

          <div class="field">
            <label for="reg-confirm" class="field-label">Konfirmasi Password</label>
            <input
              id="reg-confirm"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="field-input"
              autocomplete="new-password"
              placeholder="Ulangi password"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-lg submit-btn" :disabled="authLoading">
            {{ authLoading ? 'Memproses...' : 'Daftar Akun' }}
          </button>
        </form>

        <p class="auth-switch">
          Sudah punya akun?
          <RouterLink to="/login">Masuk di sini</RouterLink>
        </p>
      </section>
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
  max-width: 540px;
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

.auth-stage {
  flex: 1;
  display: grid;
  place-items: center;
}

.register-panel {
  max-width: 540px;
  width: 100%;
  padding: 36px 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.register-panel h1 {
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

.submit-btn {
  width: 100%;
  margin-top: 4px;
}

.auth-switch {
  font-size: 0.9rem;
  color: var(--ink-umber);
  text-align: center;
  padding-top: 10px;
  border-top: 1px solid var(--ceramic-border);
}

.auth-switch a {
  font-weight: 600;
}

@media (max-width: 600px) {
  .register-panel {
    padding: 26px 20px;
  }
}
</style>
