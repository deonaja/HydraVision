import { reactive, computed } from 'vue'
import api from './api'
import type { UserAccount } from '@/types/hydravision'
import { pushToast } from './mockStore' // masih pakai toast dari mockStore

interface AuthState {
  user: UserAccount | null
  token: string | null
  loading: boolean
  pendingResetEmail: string | null
}

const state = reactive<AuthState>({
  user: null,
  token: localStorage.getItem('hv_token'),
  loading: false,
  pendingResetEmail: null,
})

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

export async function loginUser(payload: { email: string; password: string }) {
  state.loading = true
  try {
    const res = await api.post('/auth/login', payload)
    state.token = res.data.token
    state.user = mapUser(res.data.user)
    localStorage.setItem('hv_token', res.data.token)
    pushToast(`Selamat datang kembali, ${res.data.user.name}.`, 'success')
    return { ok: true as const, user: res.data.user }
  } catch (err: any) {
    const msg = err.response?.data?.message ?? 'Login gagal.'
    return { ok: false as const, error: msg }
  } finally {
    state.loading = false
  }
}

export async function registerUser(payload: { name: string; email: string; password: string }) {
  state.loading = true
  try {
    const res = await api.post('/auth/register', payload)
    state.token = res.data.token
    state.user = mapUser(res.data.user)
    localStorage.setItem('hv_token', res.data.token)
    pushToast(`Akun ${res.data.user.name} berhasil didaftarkan.`, 'success')
    return { ok: true as const, user: res.data.user }
  } catch (err: any) {
    const msg = err.response?.data?.message ?? 'Registrasi gagal.'
    return { ok: false as const, error: msg }
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
    await api.post('/auth/forgot-password', { email })
    state.pendingResetEmail = email
    return { ok: true as const, email }
  } catch (err: any) {
    return { ok: false as const, error: err.response?.data?.message ?? 'Email tidak ditemukan.' }
  }
}

export async function completePasswordReset(newPassword: string) {
  if (!state.pendingResetEmail) return { ok: false as const, error: 'Session reset tidak aktif.' }
  try {
    await api.post('/auth/reset-password', { email: state.pendingResetEmail, password: newPassword, password_confirmation: newPassword })
    state.pendingResetEmail = null
    pushToast('Password berhasil diperbarui. Silakan masuk dengan password baru.', 'success')
    return { ok: true as const }
  } catch (err: any) {
    return { ok: false as const, error: err.response?.data?.message ?? 'Reset gagal.' }
  }
}

export async function updateCurrentProfile(payload: { name: string; currentPassword?: string; newPassword?: string }) {
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
    return { ok: true as const, user: res.data.user }
  } catch (err: any) {
    return { ok: false as const, error: err.response?.data?.message ?? 'Update gagal.' }
  }
}
