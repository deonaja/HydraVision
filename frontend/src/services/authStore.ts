import { reactive, computed } from 'vue'
import api from './api'
import type { UserAccount } from '@/types/hydravision'
import { pushToast } from './mockStore' // masih pakai toast dari mockStore

interface AuthState {
  user: UserAccount | null
  token: string | null
  loading: boolean
  pendingResetEmail: string | null
  pendingResetToken: string | null
}

const state = reactive<AuthState>({
  user: null,
  token: localStorage.getItem('hv_token'),
  loading: false,
  pendingResetEmail: null,
  pendingResetToken: null,
})

function errMsg(err: any, fallback: string): string {
  const data = err?.response?.data
  if (data?.errors) {
    const first = Object.values(data.errors)[0] as string[] | undefined
    if (first?.[0]) return first[0]
  }
  return data?.message ?? fallback
}

// Hydrate user on page load if token exists
export async function hydrateAuth() {
  if (!state.token) return
  try {
    const res = await api.get('/auth/me')
    state.user = mapUser(res.data.user)
  } catch {
    state.token = null
    localStorage.removeItem('hv_token')
  }
}

function mapUser(u: any): UserAccount {
  return {
    id: String(u.id),
    name: u.name ?? '',
    email: u.email ?? '',
    password: '',
    role: u.role ?? 'user',
    status: u.status ?? 'active',
    createdAt: u.created_at ?? u.createdAt ?? '',
    lastLoginAt: u.last_login_at ?? u.lastLoginAt ?? '',
  }
}

export const currentUser = computed(() => state.user)
export const isAuthenticated = computed(() => state.user !== null)
export const isAdmin = computed(() => state.user?.role === 'admin')
export const authLoading = computed(() => state.loading)
export const hasAutoResetToken = computed(() => Boolean(state.pendingResetToken))

export async function loginUser(payload: { email: string; password: string }) {
  state.loading = true
  try {
    const res = await api.post('/auth/login', payload)
    state.token = res.data.token
    state.user = mapUser(res.data.user)
    localStorage.setItem('hv_token', res.data.token)
    pushToast(`Selamat datang kembali, ${res.data.user.name}.`, 'success')
    return { ok: true as const, user: state.user }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Login gagal.') }
  } finally {
    state.loading = false
  }
}

export async function registerUser(payload: {
  name: string
  email: string
  password: string
  passwordConfirmation?: string
}) {
  state.loading = true
  try {
    const res = await api.post('/auth/register', {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      password_confirmation: payload.passwordConfirmation ?? payload.password,
    })
    state.token = res.data.token
    state.user = mapUser(res.data.user)
    localStorage.setItem('hv_token', res.data.token)
    pushToast(`Akun ${res.data.user.name} berhasil didaftarkan.`, 'success')
    return { ok: true as const, user: state.user }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Registrasi gagal.') }
  } finally {
    state.loading = false
  }
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout')
  } catch {}
  state.user = null
  state.token = null
  localStorage.removeItem('hv_token')
  pushToast('Anda telah keluar dari sesi HydraVision.', 'info')
}

export async function requestPasswordReset(email: string) {
  try {
    const res = await api.post('/auth/forgot-password', { email })
    state.pendingResetEmail = email
    state.pendingResetToken = res.data?.reset_token ?? null
    return { ok: true as const, email }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Email tidak ditemukan.') }
  }
}

export async function completePasswordReset(newPassword: string, manualToken?: string) {
  if (!state.pendingResetEmail) {
    return { ok: false as const, error: 'Sesi reset tidak aktif. Ulangi permintaan reset password.' }
  }
  const token = (manualToken?.trim() || state.pendingResetToken || '').trim()
  if (!token) {
    return { ok: false as const, error: 'Token reset password wajib diisi.' }
  }
  try {
    await api.post('/auth/reset-password', {
      email: state.pendingResetEmail,
      token,
      password: newPassword,
      password_confirmation: newPassword,
    })
    state.pendingResetEmail = null
    state.pendingResetToken = null
    pushToast('Password berhasil diperbarui. Silakan masuk dengan password baru.', 'success')
    return { ok: true as const }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Reset password gagal.') }
  }
}

export async function updateCurrentProfile(payload: {
  name: string
  currentPassword?: string
  newPassword?: string
}) {
  try {
    const body: Record<string, string> = { name: payload.name }
    if (payload.newPassword) {
      body.old_password = payload.currentPassword ?? ''
      body.password = payload.newPassword
      body.password_confirmation = payload.newPassword
    }
    const res = await api.put('/auth/profile', body)
    state.user = mapUser(res.data.user)
    pushToast('Perubahan profil berhasil disimpan.', 'success')
    return { ok: true as const, user: state.user }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Update gagal.') }
  }
}
