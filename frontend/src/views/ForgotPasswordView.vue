<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  requestPasswordReset,
  completePasswordReset,
  hasAutoResetToken,
} from '@/services/authStore'
import HvIcon from '@/components/HvIcon.vue'

const router = useRouter()

type Step = 'request' | 'sent' | 'reset'
const step = ref<Step>('request')
const email = ref('')
const sentEmail = ref('')
const resetToken = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref<string | null>(null)

async function handleRequest() {
  errorMessage.value = null
  const result = await requestPasswordReset(email.value)
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  sentEmail.value = result.email
  step.value = 'sent'
}

async function handleResetPassword() {
  errorMessage.value = null
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Konfirmasi password baru tidak sama.'
    return
  }
  const result = await completePasswordReset(newPassword.value, resetToken.value)
  if (!result.ok) {
    errorMessage.value = result.error
    return
  }
  router.push('/login')
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
      <RouterLink to="/login" class="back-link">
        <HvIcon name="arrow-left" :size="16" />
        <span>Kembali ke Login</span>
      </RouterLink>
    </div>

    <main class="auth-stage">
      <section class="reset-panel ceramic-panel">
        <template v-if="step === 'request'">
          <h1>Reset Password</h1>
          <p class="auth-sub">
            Masukkan email akun HydraVision yang terdaftar. Kami akan mengirimkan tautan untuk
            membuat password baru.
          </p>

          <div v-if="errorMessage" class="notice notice-error" role="alert">
            <HvIcon name="alert" :size="18" />
            <span>{{ errorMessage }}</span>
          </div>

          <form class="auth-form" novalidate @submit.prevent="handleRequest">
            <div class="field">
              <label for="reset-email" class="field-label">Email Terdaftar</label>
              <input
                id="reset-email"
                v-model="email"
                type="email"
                class="field-input"
                placeholder="nadia@hydravision.demo"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary btn-lg submit-btn">
              Kirim Tautan Reset
            </button>
          </form>
        </template>

        <template v-else-if="step === 'sent'">
          <h1>Tautan Reset Terkirim</h1>
          <p class="auth-sub">
            Tautan pengaturan ulang password telah dikirim ke
            <strong>{{ sentEmail }}</strong>.
          </p>

          <div class="notice notice-info">
            <HvIcon name="mail" :size="18" />
            <div>
              <strong>Token Reset Aktif:</strong>
              {{
                hasAutoResetToken
                  ? 'Backend telah menerbitkan token reset untuk sesi lokal ini. Klik tombol di bawah untuk langsung membuat password baru.'
                  : 'Periksa email Anda untuk mendapatkan token reset, lalu lanjutkan ke halaman pengaturan password baru.'
              }}
            </div>
          </div>

          <div class="sent-actions">
            <button type="button" class="btn btn-primary btn-lg" @click="step = 'reset'">
              Lanjut Atur Password Baru
            </button>
            <button type="button" class="btn btn-ceramic" @click="step = 'request'">
              Ganti Email
            </button>
          </div>
        </template>

        <template v-else>
          <h1>Buat Password Baru</h1>
          <p class="auth-sub">
            Atur password baru untuk akun <strong>{{ sentEmail }}</strong>. Setelah tersimpan, Anda
            akan diarahkan kembali ke halaman login.
          </p>

          <div v-if="errorMessage" class="notice notice-error" role="alert">
            <HvIcon name="alert" :size="18" />
            <span>{{ errorMessage }}</span>
          </div>

          <form class="auth-form" novalidate @submit.prevent="handleResetPassword">
            <div v-if="!hasAutoResetToken" class="field">
              <label for="reset-token" class="field-label">Token Reset</label>
              <input
                id="reset-token"
                v-model="resetToken"
                type="text"
                class="field-input"
                placeholder="Masukkan token reset dari email"
                required
              />
            </div>

            <div class="field">
              <label for="new-pw" class="field-label">Password Baru</label>
              <input
                id="new-pw"
                v-model="newPassword"
                type="password"
                class="field-input"
                placeholder="Minimal 8 karakter"
                required
              />
            </div>

            <div class="field">
              <label for="confirm-new-pw" class="field-label">Konfirmasi Password Baru</label>
              <input
                id="confirm-new-pw"
                v-model="confirmPassword"
                type="password"
                class="field-input"
                placeholder="Ulangi password baru"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg submit-btn">
              Simpan Password Baru
            </button>
          </form>
        </template>
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
  max-width: 520px;
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

.reset-panel {
  max-width: 520px;
  width: 100%;
  padding: 36px 34px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.reset-panel h1 {
  font-size: 1.8rem;
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

.submit-btn {
  width: 100%;
}

.sent-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
