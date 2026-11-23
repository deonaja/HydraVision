import { reactive, ref } from 'vue'
import api from './api'
import { pushToast, analyzeImageHeuristic } from './mockStore'
import { currentUser } from './authStore'
import type {
  AccountStatus,
  CareRecommendation,
  ClassificationRecord,
  SkinLabel,
  UserAccount,
} from '@/types/hydravision'

export type ManagedUser = UserAccount & { checksCount: number }

/* ================= STATE (sumber data: backend Laravel) ================= */
export const storeState = reactive<{
  users: ManagedUser[]
  recommendations: CareRecommendation[]
  totalScans: number
}>({
  users: [],
  recommendations: [],
  totalScans: 0,
})

export const myHistory = ref<ClassificationRecord[]>([])
export const historyLoading = ref(false)

function errMsg(err: any, fallback: string): string {
  const data = err?.response?.data
  if (data?.errors) {
    const first = Object.values(data.errors)[0] as string[] | undefined
    if (first?.[0]) return first[0]
  }
  return data?.message ?? fallback
}

/* ================= MAPPERS ================= */
function mapRecord(r: any): ClassificationRecord {
  return {
    id: String(r.id),
    userId: String(r.user_id),
    createdAt: r.created_at,
    fileName: r.file_name,
    imageDataUrl: r.image_url ?? r.image_data_url ?? r.imageDataUrl ?? '',
    label: r.label,
    confidence: Number(r.confidence),
    recommendationsSnapshot:
      typeof r.recommendations_snapshot === 'string'
        ? JSON.parse(r.recommendations_snapshot)
        : (r.recommendations_snapshot ?? []),
    isSimulated: Boolean(r.is_simulated),
  }
}

function mapRecommendation(r: any): CareRecommendation {
  return {
    id: String(r.id),
    skinLabel: r.skin_label ?? r.skinLabel,
    title: r.title,
    body: r.body,
    updatedAt: r.updated_at ?? r.updatedAt ?? '',
  }
}

function mapManagedUser(u: any): ManagedUser {
  return {
    id: String(u.id),
    name: u.name ?? '',
    email: u.email ?? '',
    password: '',
    role: u.role ?? 'user',
    status: u.status ?? 'active',
    createdAt: u.created_at ?? '',
    lastLoginAt: u.last_login_at ?? '',
    checksCount: Number(u.checks_count ?? 0),
  }
}

/* ================= RECOMMENDATIONS ================= */
export async function loadRecommendations(): Promise<CareRecommendation[]> {
  try {
    const res = await api.get('/recommendations')
    storeState.recommendations = (res.data.data ?? res.data).map(mapRecommendation)
  } catch {
    pushToast('Gagal memuat rekomendasi dari server.', 'error')
  }
  return storeState.recommendations
}

export async function getRecommendationsFor(label: SkinLabel): Promise<CareRecommendation[]> {
  const all = await loadRecommendations()
  return all.filter((r) => r.skinLabel === label)
}

export async function createRecommendation(payload: { skinLabel: SkinLabel; title: string; body: string }) {
  if (!payload.title.trim() || !payload.body.trim()) {
    return { ok: false as const, error: 'Judul dan isi rekomendasi wajib diisi.' }
  }
  try {
    const res = await api.post('/recommendations', {
      skin_label: payload.skinLabel,
      title: payload.title.trim(),
      body: payload.body.trim(),
    })
    const item = mapRecommendation(res.data.data ?? res.data)
    storeState.recommendations.push(item)
    pushToast(`Rekomendasi baru untuk kulit ${payload.skinLabel} ditambahkan.`, 'success')
    return { ok: true as const, item }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Gagal menambahkan rekomendasi.') }
  }
}

export async function updateRecommendation(
  id: string,
  payload: { skinLabel: SkinLabel; title: string; body: string },
) {
  if (!payload.title.trim() || !payload.body.trim()) {
    return { ok: false as const, error: 'Judul dan isi rekomendasi wajib diisi.' }
  }
  try {
    const res = await api.put(`/recommendations/${id}`, {
      skin_label: payload.skinLabel,
      title: payload.title.trim(),
      body: payload.body.trim(),
    })
    const item = mapRecommendation(res.data.data ?? res.data)
    const idx = storeState.recommendations.findIndex((r) => r.id === id)
    if (idx !== -1) storeState.recommendations[idx] = item
    pushToast('Konten rekomendasi perawatan diperbarui.', 'success')
    return { ok: true as const, item }
  } catch (err: any) {
    return { ok: false as const, error: errMsg(err, 'Gagal memperbarui rekomendasi.') }
  }
}

export async function deleteRecommendation(id: string) {
  try {
    await api.delete(`/recommendations/${id}`)
    storeState.recommendations = storeState.recommendations.filter((r) => r.id !== id)
    pushToast('Item rekomendasi perawatan dihapus.', 'info')
    return true
  } catch (err: any) {
    pushToast(errMsg(err, 'Gagal menghapus rekomendasi.'), 'error')
    return false
  }
}

/* ================= HISTORY ================= */
export async function loadMyHistory(): Promise<ClassificationRecord[]> {
  historyLoading.value = true
  try {
    const res = await api.get('/history')
    myHistory.value = (res.data.data ?? res.data).map(mapRecord)
  } catch {
    pushToast('Gagal memuat riwayat dari server.', 'error')
  } finally {
    historyLoading.value = false
  }
  return myHistory.value
}

/** Alias lama */
export const getMyHistory = loadMyHistory

export async function getHistoryRecord(id: string): Promise<ClassificationRecord | null> {
  try {
    const res = await api.get(`/history/${id}`)
    return mapRecord(res.data.data ?? res.data)
  } catch {
    return null
  }
}

export async function saveHistoryRecord(payload: {
  fileName: string
  imageDataUrl: string
  label: SkinLabel
  confidence: number
  isSimulated: boolean
}) {
  const res = await api.post('/history', {
    file_name: payload.fileName,
    image_data_url: payload.imageDataUrl,
    label: payload.label,
    confidence: payload.confidence,
    is_simulated: payload.isSimulated,
  })
  const record = mapRecord(res.data.data ?? res.data)
  myHistory.value = [record, ...myHistory.value]
  pushToast(`Hasil klasifikasi (${payload.label} · ${payload.confidence}%) tersimpan otomatis ke riwayat.`, 'success')
  return record
}

export async function deleteHistoryRecord(id: string): Promise<boolean> {
  try {
    await api.delete(`/history/${id}`)
    myHistory.value = myHistory.value.filter((h) => h.id !== id)
    pushToast('Data riwayat klasifikasi telah dihapus.', 'info')
    return true
  } catch (err: any) {
    pushToast(errMsg(err, 'Gagal menghapus riwayat.'), 'error')
    return false
  }
}

/* ================= CLASSIFICATION ================= */
// Mengirim foto ke backend Laravel, yang akan memproses inferensi via microservice MobileNetV4
export async function runClassification(params: {
  fileName: string
  imageDataUrl: string
  simulateError?: boolean
}): Promise<{ ok: true; record: ClassificationRecord } | { ok: false; error: string }> {
  if (!currentUser.value) {
    return { ok: false, error: 'Anda harus login untuk menjalankan klasifikasi.' }
  }

  if (params.simulateError) {
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    return {
      ok: false,
      error:
        'Proses klasifikasi gagal karena simulasi error diaktifkan. Periksa foto Anda lalu coba proses ulang.',
    }
  }

  try {
    const res = await api.post('/classify', {
      file_name: params.fileName,
      image_data_url: params.imageDataUrl,
    })
    const record = mapRecord(res.data.data ?? res.data)
    myHistory.value = [record, ...myHistory.value]
    pushToast(`Klasifikasi MobileNetV4 selesai (${record.label} · ${record.confidence}%). Tersimpan ke riwayat.`, 'success')
    return { ok: true, record }
  } catch (err: any) {
    return { ok: false, error: errMsg(err, 'Gagal melakukan klasifikasi gambar dengan model MobileNetV4.') }
  }
}

/* ================= ADMIN ================= */
export async function loadAdminUsers(): Promise<ManagedUser[]> {
  try {
    const res = await api.get('/admin/users')
    storeState.users = (res.data.data ?? res.data).map(mapManagedUser)
  } catch {
    pushToast('Gagal memuat daftar pengguna.', 'error')
  }
  return storeState.users
}

export async function loadAdminDashboard() {
  try {
    const res = await api.get('/admin/dashboard')
    const data = res.data.data ?? res.data
    storeState.totalScans = Number(data?.stats?.total_scans ?? 0)
    return data
  } catch {
    pushToast('Gagal memuat ringkasan admin.', 'error')
    return null
  }
}

export async function setUserAccountStatus(userId: string, status: AccountStatus) {
  try {
    await api.put(`/admin/users/${userId}/status`, { status })
    const u = storeState.users.find((x) => x.id === userId)
    if (u) u.status = status
    pushToast(status === 'inactive' ? 'Akun dinonaktifkan.' : 'Akun diaktifkan kembali.', 'info')
    return true
  } catch (err: any) {
    pushToast(errMsg(err, 'Gagal mengubah status akun.'), 'error')
    return false
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    await api.delete(`/admin/users/${userId}`)
    storeState.users = storeState.users.filter((u) => u.id !== userId)
    pushToast('Akun dan riwayatnya telah dihapus.', 'info')
    return true
  } catch (err: any) {
    pushToast(errMsg(err, 'Gagal menghapus akun.'), 'error')
    return false
  }
}
