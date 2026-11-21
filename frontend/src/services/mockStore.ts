import { reactive, computed } from 'vue'
import type {
  AccountStatus,
  CareRecommendation,
  ClassificationRecord,
  SkinLabel,
  ToastItem,
  UserAccount,
} from '@/types/hydravision'
import { createSyntheticSamplePhoto } from './sampleImages'

const STORAGE_KEY = 'hydravision_demo_state_v1'
export const NON_MEDICAL_DISCLAIMER =
  'Hasil klasifikasi HydraVision merupakan analisis bantuan AI dan bukan diagnosis medis. Untuk keluhan kulit serius atau berkelanjutan, konsultasikan dengan dokter atau dermatolog.'

export const PHOTO_GUIDELINES = [
  {
    id: 'light',
    title: 'Pencahayaan cukup',
    detail: 'Gunakan cahaya alami dekat jendela atau lampu ruangan merata agar warna kulit tidak tertutup bayangan.',
  },
  {
    id: 'clear',
    title: 'Area kulit terlihat jelas',
    detail: 'Fokuskan kamera pada area pipi, dahi, atau punggung tangan dengan jarak dekat dan tidak buram.',
  },
  {
    id: 'nofilter',
    title: 'Tanpa filter',
    detail: 'Matikan beauty filter, efek halus, atau preset warna kamera supaya tekstur permukaan kulit terbaca jujur.',
  },
] as const

interface PersistedState {
  users: UserAccount[]
  recommendations: CareRecommendation[]
  history: ClassificationRecord[]
  currentUserId: string | null
  pendingResetEmail: string | null
}

function createInitialState(): PersistedState {
  return {
    users: [
      {
        id: 'usr-1',
        name: 'Nadia Kusuma',
        email: 'nadia@hydravision.demo',
        password: 'user1234',
        role: 'user',
        status: 'active',
        createdAt: '2026-10-12T08:15:00+07:00',
        lastLoginAt: '2026-11-18T07:40:00+07:00',
      },
      {
        id: 'usr-2',
        name: 'Dimas Mahendra',
        email: 'dimas@hydravision.demo',
        password: 'user1234',
        role: 'user',
        status: 'active',
        createdAt: '2026-10-20T14:22:00+07:00',
        lastLoginAt: '2026-11-15T19:10:00+07:00',
      },
      {
        id: 'usr-3',
        name: 'Sinta Rahmawati',
        email: 'sinta@hydravision.demo',
        password: 'user1234',
        role: 'user',
        status: 'inactive',
        createdAt: '2026-09-28T11:05:00+07:00',
        lastLoginAt: '2026-10-30T09:15:00+07:00',
      },
      {
        id: 'adm-1',
        name: 'Raka Pratama',
        email: 'admin@hydravision.demo',
        password: 'admin1234',
        role: 'admin',
        status: 'active',
        createdAt: '2026-09-01T09:00:00+07:00',
        lastLoginAt: '2026-11-20T08:30:00+07:00',
      },
    ],
    recommendations: [
      {
        id: 'rec-h1',
        skinLabel: 'Terhidrasi',
        title: 'Pertahankan pelembap ringan harian',
        body: 'Gunakan pelembap bertekstur gel atau lotion ringan pagi dan malam untuk mengunci kadar air tanpa terasa berat.',
        updatedAt: '2026-11-10T10:00:00+07:00',
      },
      {
        id: 'rec-h2',
        skinLabel: 'Terhidrasi',
        title: 'Gunakan pembersih wajah lembut',
        body: 'Pilih facial wash pH seimbang tanpa sulfat keras agar lapisan pelindung alami kulit tetap terjaga.',
        updatedAt: '2026-11-10T10:00:00+07:00',
      },
      {
        id: 'rec-h3',
        skinLabel: 'Terhidrasi',
        title: 'Lindungi dengan tabir surya siang hari',
        body: 'Aplikasikan sunscreen minimal SPF 30 sebelum beraktivitas di luar ruangan dan cukupi minum air putih.',
        updatedAt: '2026-11-12T09:30:00+07:00',
      },
      {
        id: 'rec-d1',
        skinLabel: 'Kering',
        title: 'Pilih pelembap kaya humektan dan ceramide',
        body: 'Oleskan pelembap mengandung hyaluronic acid, glycerin, atau ceramide segera setelah mencuci muka saat kulit masih sedikit lembap.',
        updatedAt: '2026-11-10T10:00:00+07:00',
      },
      {
        id: 'rec-d2',
        skinLabel: 'Kering',
        title: 'Hindari air terlalu panas saat mencuci wajah',
        body: 'Gunakan air suam-suam kuku atau dingin, lalu tepuk lembut dengan handuk bersih agar minyak alami kulit tidak terkikis.',
        updatedAt: '2026-11-10T10:00:00+07:00',
      },
      {
        id: 'rec-d3',
        skinLabel: 'Kering',
        title: 'Kurangi eksfoliasi sementara dan jaga kelembapan ruang',
        body: 'Batasi penggunaan scrub atau asam eksfoliasi hingga rasa tertarik mereda, dan perbanyak konsumsi air bila sering berada di ruang ber-AC.',
        updatedAt: '2026-11-14T16:15:00+07:00',
      },
    ],
    history: [
      {
        id: 'his-104',
        userId: 'usr-1',
        createdAt: '2026-11-18T07:45:00+07:00',
        fileName: 'pipi-pagi-18nov.jpg',
        imageDataUrl: createSyntheticSamplePhoto('hydrated-1'),
        label: 'Terhidrasi',
        confidence: 91,
        recommendationsSnapshot: [
          {
            title: 'Pertahankan pelembap ringan harian',
            body: 'Gunakan pelembap bertekstur gel atau lotion ringan pagi dan malam untuk mengunci kadar air tanpa terasa berat.',
          },
          {
            title: 'Lindungi dengan tabir surya siang hari',
            body: 'Aplikasikan sunscreen minimal SPF 30 sebelum beraktivitas di luar ruangan dan cukupi minum air putih.',
          },
        ],
        isSimulated: true,
      },
      {
        id: 'his-103',
        userId: 'usr-1',
        createdAt: '2026-11-14T20:15:00+07:00',
        fileName: 'kulit-sore-ac-14nov.png',
        imageDataUrl: createSyntheticSamplePhoto('dry-1'),
        label: 'Kering',
        confidence: 84,
        recommendationsSnapshot: [
          {
            title: 'Pilih pelembap kaya humektan dan ceramide',
            body: 'Oleskan pelembap mengandung hyaluronic acid, glycerin, atau ceramide segera setelah mencuci muka saat kulit masih sedikit lembap.',
          },
          {
            title: 'Hindari air terlalu panas saat mencuci wajah',
            body: 'Gunakan air suam-suam kuku atau dingin, lalu tepuk lembut dengan handuk bersih agar minyak alami kulit tidak terkikis.',
          },
        ],
        isSimulated: true,
      },
      {
        id: 'his-102',
        userId: 'usr-1',
        createdAt: '2026-11-10T08:10:00+07:00',
        fileName: 'cek-rutin-10nov.jpg',
        imageDataUrl: createSyntheticSamplePhoto('hydrated-2'),
        label: 'Terhidrasi',
        confidence: 88,
        recommendationsSnapshot: [
          {
            title: 'Pertahankan pelembap ringan harian',
            body: 'Gunakan pelembap bertekstur gel atau lotion ringan pagi dan malam untuk mengunci kadar air tanpa terasa berat.',
          },
        ],
        isSimulated: true,
      },
      {
        id: 'his-101',
        userId: 'usr-1',
        createdAt: '2026-11-06T18:30:00+07:00',
        fileName: 'dahi-sore-06nov.jpeg',
        imageDataUrl: createSyntheticSamplePhoto('dry-2'),
        label: 'Kering',
        confidence: 82,
        recommendationsSnapshot: [
          {
            title: 'Pilih pelembap kaya humektan dan ceramide',
            body: 'Oleskan pelembap mengandung hyaluronic acid, glycerin, atau ceramide segera setelah mencuci muka saat kulit masih sedikit lembap.',
          },
        ],
        isSimulated: true,
      },
      {
        id: 'his-201',
        userId: 'adm-1',
        createdAt: '2026-11-17T09:20:00+07:00',
        fileName: 'uji-kalibrasi-admin.jpg',
        imageDataUrl: createSyntheticSamplePhoto('admin-1'),
        label: 'Terhidrasi',
        confidence: 89,
        recommendationsSnapshot: [
          {
            title: 'Pertahankan pelembap ringan harian',
            body: 'Gunakan pelembap bertekstur gel atau lotion ringan pagi dan malam untuk mengunci kadar air tanpa terasa berat.',
          },
        ],
        isSimulated: true,
      },
    ],
    currentUserId: null,
    pendingResetEmail: null,
  }
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as PersistedState
    if (!Array.isArray(parsed.users) || !Array.isArray(parsed.recommendations)) {
      return createInitialState()
    }
    return parsed
  } catch {
    return createInitialState()
  }
}

const persisted = reactive<PersistedState>(loadState())
const toasts = reactive<ToastItem[]>([])
let toastSeq = 1

// Optional staged file when a visitor drops a file right from the landing page vanity tray
export const stagedLandingUpload = reactive<{
  fileName: string | null
  dataUrl: string | null
}>({
  fileName: null,
  dataUrl: null,
})

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted))
  } catch {
    // Ignore storage quota overflow for large user-uploaded previews
  }
}

export function pushToast(message: string, tone: ToastItem['tone'] = 'info') {
  const id = toastSeq++
  toasts.push({ id, tone, message })
  window.setTimeout(() => {
    const idx = toasts.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.splice(idx, 1)
  }, 3800)
}

export function dismissToast(id: number) {
  const idx = toasts.findIndex((t) => t.id === id)
  if (idx !== -1) toasts.splice(idx, 1)
}

export const storeState = persisted
export const toastList = toasts

export const currentUser = computed<UserAccount | null>(() => {
  if (!persisted.currentUserId) return null
  return persisted.users.find((u) => u.id === persisted.currentUserId) ?? null
})

export const isAuthenticated = computed(() => currentUser.value !== null)
export const isAdmin = computed(() => currentUser.value?.role === 'admin')

export const myHistory = computed<ClassificationRecord[]>(() => {
  if (!currentUser.value) return []
  return persisted.history
    .filter((item) => item.userId === currentUser.value?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

export function getRecommendationsFor(label: SkinLabel): CareRecommendation[] {
  return persisted.recommendations.filter((r) => r.skinLabel === label)
}

/* FR-01: Registrasi */
export function registerUser(payload: { name: string; email: string; password: string }) {
  const cleanEmail = payload.email.trim().toLowerCase()
  const cleanName = payload.name.trim()
  if (cleanName.length < 2) {
    return { ok: false as const, error: 'Nama minimal terdiri dari 2 karakter.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { ok: false as const, error: 'Format email belum valid. Periksa kembali alamat email Anda.' }
  }
  if (payload.password.length < 8) {
    return { ok: false as const, error: 'Password minimal 8 karakter agar akun tetap aman.' }
  }
  if (persisted.users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return {
      ok: false as const,
      error: 'Email ini sudah terdaftar. Gunakan email lain atau masuk ke akun yang sudah ada.',
    }
  }
  const now = new Date().toISOString()
  const newUser: UserAccount = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: payload.password,
    role: 'user',
    status: 'active',
    createdAt: now,
    lastLoginAt: now,
  }
  persisted.users.unshift(newUser)
  persisted.currentUserId = newUser.id
  saveState()
  pushToast(`Akun ${newUser.name} berhasil didaftarkan.`, 'success')
  return { ok: true as const, user: newUser }
}

/* FR-02: Login */
export function loginUser(payload: { email: string; password: string }) {
  const cleanEmail = payload.email.trim().toLowerCase()
  const found = persisted.users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (!found || found.password !== payload.password) {
    return {
      ok: false as const,
      error: 'Email atau password tidak sesuai. Periksa kembali data masuk Anda.',
    }
  }
  if (found.status === 'inactive') {
    return {
      ok: false as const,
      error: 'Akun Anda sedang dinonaktifkan oleh admin. Hubungi pengelola untuk mengaktifkan kembali.',
    }
  }
  found.lastLoginAt = new Date().toISOString()
  persisted.currentUserId = found.id
  saveState()
  pushToast(`Selamat datang kembali, ${found.name}.`, 'success')
  return { ok: true as const, user: found }
}

/* FR-03: Logout */
export function logoutUser() {
  persisted.currentUserId = null
  saveState()
  pushToast('Anda telah keluar dari sesi HydraVision.', 'info')
}

/* FR-04: Lupa Password */
export function requestPasswordReset(email: string) {
  const cleanEmail = email.trim().toLowerCase()
  const found = persisted.users.find((u) => u.email.toLowerCase() === cleanEmail)
  if (!found) {
    return {
      ok: false as const,
      error: 'Email tidak ditemukan di daftar akun HydraVision. Pastikan ejaan sudah benar.',
    }
  }
  persisted.pendingResetEmail = found.email
  saveState()
  return { ok: true as const, email: found.email }
}

export function completePasswordReset(newPassword: string) {
  if (!persisted.pendingResetEmail) {
    return { ok: false as const, error: 'Tautan reset tidak aktif. Ulangi permintaan kirim email reset.' }
  }
  if (newPassword.length < 8) {
    return { ok: false as const, error: 'Password baru minimal 8 karakter.' }
  }
  const found = persisted.users.find(
    (u) => u.email.toLowerCase() === persisted.pendingResetEmail?.toLowerCase(),
  )
  if (!found) {
    return { ok: false as const, error: 'Akun tidak ditemukan.' }
  }
  found.password = newPassword
  persisted.pendingResetEmail = null
  saveState()
  pushToast('Password berhasil diperbarui. Silakan masuk dengan password baru.', 'success')
  return { ok: true as const }
}

/* FR-07: Edit Profil */
export function updateCurrentProfile(payload: {
  name: string
  currentPassword?: string
  newPassword?: string
}) {
  const user = currentUser.value
  if (!user) return { ok: false as const, error: 'Sesi tidak ditemukan.' }
  const cleanName = payload.name.trim()
  if (cleanName.length < 2) {
    return { ok: false as const, error: 'Nama minimal 2 karakter.' }
  }
  if (payload.newPassword && payload.newPassword.length > 0) {
    if (payload.currentPassword !== user.password) {
      return { ok: false as const, error: 'Password saat ini tidak sesuai.' }
    }
    if (payload.newPassword.length < 8) {
      return { ok: false as const, error: 'Password baru minimal 8 karakter.' }
    }
    user.password = payload.newPassword
  }
  user.name = cleanName
  saveState()
  pushToast('Perubahan profil berhasil disimpan.', 'success')
  return { ok: true as const, user }
}

/* FR-09: Validasi File (JPG, JPEG, PNG, maks 5 MB) */
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png'])
const ALLOWED_EXT = /\.(jpe?g|png)$/i
const MAX_BYTES = 5 * 1024 * 1024

export function validateSkinImageFile(file: File): { ok: true } | { ok: false; error: string } {
  const extOk = ALLOWED_EXT.test(file.name)
  const mimeOk = ALLOWED_MIME.has(file.type)
  if (!extOk || !mimeOk) {
    return {
      ok: false,
      error: `Format "${file.name}" tidak didukung. Unggah file foto berformat JPG, JPEG, atau PNG.`,
    }
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return {
      ok: false,
      error: `Ukuran file ${mb} MB melebihi batas maksimal 5 MB. Kompres atau pilih foto lain.`,
    }
  }
  return { ok: true }
}

/* FR-13 to FR-20: Klasifikasi + Simpan Otomatis */
export async function runMockClassification(params: {
  fileName: string
  imageDataUrl: string
  simulateError?: boolean
}): Promise<{ ok: true; record: ClassificationRecord } | { ok: false; error: string }> {
  const user = currentUser.value
  if (!user) {
    return { ok: false, error: 'Anda harus login untuk menjalankan klasifikasi.' }
  }

  // Deterministic lightweight pixel-luminance analysis so uploaded photos yield consistent readings
  const analysis = await analyzeImageHeuristic(params.imageDataUrl)

  await new Promise((resolve) => window.setTimeout(resolve, 1450))

  if (params.simulateError) {
    return {
      ok: false,
      error:
        'Proses klasifikasi gagal karena layanan analisis tidak merespons (simulasi error). Periksa foto Anda lalu coba unggah atau proses ulang.',
    }
  }

  const label: SkinLabel = analysis.label
  const confidence = analysis.confidence
  const recs = getRecommendationsFor(label).map((r) => ({ title: r.title, body: r.body }))

  const record: ClassificationRecord = {
    id: `his-${Date.now()}`,
    userId: user.id,
    createdAt: new Date().toISOString(),
    fileName: params.fileName,
    imageDataUrl: params.imageDataUrl,
    label,
    confidence,
    recommendationsSnapshot: recs,
    isSimulated: true,
  }

  persisted.history.unshift(record)
  saveState()
  pushToast(`Hasil klasifikasi (${label} · ${confidence}%) tersimpan otomatis ke riwayat.`, 'success')
  return { ok: true, record }
}

function analyzeImageHeuristic(dataUrl: string): Promise<{ label: SkinLabel; confidence: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 32
        canvas.height = 32
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({ label: 'Terhidrasi', confidence: 89 })
          return
        }
        ctx.drawImage(img, 0, 0, 32, 32)
        const { data } = ctx.getImageData(0, 0, 32, 32)
        let lumSum = 0
        let varianceSum = 0
        const lums: number[] = []
        for (let i = 0; i < data.length; i += 4) {
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
          lums.push(lum)
          lumSum += lum
        }
        const mean = lumSum / lums.length
        for (const l of lums) varianceSum += (l - mean) * (l - mean)
        const std = Math.sqrt(varianceSum / lums.length)
        const isHydrated = mean >= 132 || std < 24
        const rawConf = Math.round(78 + ((Math.round(mean + std) % 18)))
        resolve({
          label: isHydrated ? 'Terhidrasi' : 'Kering',
          confidence: Math.min(96, Math.max(76, rawConf)),
        })
      } catch {
        resolve({ label: 'Terhidrasi', confidence: 90 })
      }
    }
    img.onerror = () => resolve({ label: 'Terhidrasi', confidence: 88 })
    img.src = dataUrl
  })
}

/* FR-22 & FR-23: Riwayat Detail & Hapus */
export function getHistoryRecord(id: string): ClassificationRecord | null {
  const user = currentUser.value
  if (!user) return null
  return persisted.history.find((h) => h.id === id && h.userId === user.id) ?? null
}

export function deleteHistoryRecord(id: string) {
  const user = currentUser.value
  if (!user) return false
  const idx = persisted.history.findIndex((h) => h.id === id && h.userId === user.id)
  if (idx === -1) return false
  persisted.history.splice(idx, 1)
  saveState()
  pushToast('Data riwayat klasifikasi telah dihapus.', 'info')
  return true
}

/* FR-25: Admin Kelola User */
export function setUserAccountStatus(userId: string, status: AccountStatus) {
  const target = persisted.users.find((u) => u.id === userId && u.role === 'user')
  if (!target) return false
  target.status = status
  saveState()
  pushToast(
    status === 'inactive'
      ? `Akun ${target.name} telah dinonaktifkan.`
      : `Akun ${target.name} telah diaktifkan kembali.`,
    'info',
  )
  return true
}

export function deleteUserAccount(userId: string) {
  const idx = persisted.users.findIndex((u) => u.id === userId && u.role === 'user')
  if (idx === -1) return false
  const removed = persisted.users[idx]
  persisted.users.splice(idx, 1)
  persisted.history = persisted.history.filter((h) => h.userId !== userId)
  saveState()
  pushToast(`Akun ${removed.name} beserta riwayatnya telah dihapus.`, 'info')
  return true
}

/* FR-26: Admin Kelola Konten Rekomendasi */
export function createRecommendation(payload: { skinLabel: SkinLabel; title: string; body: string }) {
  const title = payload.title.trim()
  const body = payload.body.trim()
  if (title.length < 3 || body.length < 8) {
    return { ok: false as const, error: 'Judul dan isi saran perawatan wajib diisi dengan lengkap.' }
  }
  const item: CareRecommendation = {
    id: `rec-${Date.now()}`,
    skinLabel: payload.skinLabel,
    title,
    body,
    updatedAt: new Date().toISOString(),
  }
  persisted.recommendations.unshift(item)
  saveState()
  pushToast(`Rekomendasi baru untuk kulit ${payload.skinLabel} ditambahkan.`, 'success')
  return { ok: true as const, item }
}

export function updateRecommendation(
  id: string,
  payload: { skinLabel: SkinLabel; title: string; body: string },
) {
  const target = persisted.recommendations.find((r) => r.id === id)
  if (!target) return { ok: false as const, error: 'Rekomendasi tidak ditemukan.' }
  const title = payload.title.trim()
  const body = payload.body.trim()
  if (title.length < 3 || body.length < 8) {
    return { ok: false as const, error: 'Judul dan isi saran perawatan wajib diisi dengan lengkap.' }
  }
  target.skinLabel = payload.skinLabel
  target.title = title
  target.body = body
  target.updatedAt = new Date().toISOString()
  saveState()
  pushToast('Konten rekomendasi perawatan diperbarui.', 'success')
  return { ok: true as const, item: target }
}

export function deleteRecommendation(id: string) {
  const idx = persisted.recommendations.findIndex((r) => r.id === id)
  if (idx === -1) return false
  persisted.recommendations.splice(idx, 1)
  saveState()
  pushToast('Item rekomendasi perawatan dihapus.', 'info')
  return true
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
  }).format(d)
}

export function formatDateFull(iso: string): string {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
