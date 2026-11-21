export type UserRole = 'user' | 'admin'
export type AccountStatus = 'active' | 'inactive'
export type SkinLabel = 'Terhidrasi' | 'Kering'

export interface UserAccount {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  status: AccountStatus
  createdAt: string
  lastLoginAt: string
}

export interface CareRecommendation {
  id: string
  skinLabel: SkinLabel
  title: string
  body: string
  updatedAt: string
}

export interface ClassificationRecord {
  id: string
  userId: string
  createdAt: string
  fileName: string
  imageDataUrl: string
  label: SkinLabel
  confidence: number // integer percentage 0..100
  recommendationsSnapshot: Array<{ title: string; body: string }>
  isSimulated: boolean
}

export interface ToastItem {
  id: number
  tone: 'info' | 'success' | 'error'
  message: string
}

export interface HistoryQuery {
  label: 'Semua' | SkinLabel
  dateFrom: string
  dateTo: string
  sortBy: 'newest' | 'oldest' | 'confidence_desc' | 'confidence_asc'
}
