<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  storeState,
  setUserAccountStatus,
  deleteUserAccount,
  formatDateFull,
} from '@/services/mockStore'
import type { UserAccount } from '@/types/hydravision'
import AppShell from '@/components/AppShell.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import HvIcon from '@/components/HvIcon.vue'

const searchText = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const selectedUserId = ref<string | null>(null)

const confirmAction = ref<{
  type: 'deactivate' | 'activate' | 'delete'
  user: UserAccount
} | null>(null)

const userAccounts = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  return storeState.users
    .filter((u) => u.role === 'user')
    .filter((u) => (statusFilter.value === 'all' ? true : u.status === statusFilter.value))
    .filter(
      (u) =>
        q === '' ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    )
})

const selectedUser = computed(
  () => storeState.users.find((u) => u.id === selectedUserId.value && u.role === 'user') ?? null,
)

function countChecks(userId: string) {
  return storeState.history.filter((h) => h.userId === userId).length
}

function executeConfirmedAction() {
  if (!confirmAction.value) return
  const { type, user } = confirmAction.value
  if (type === 'deactivate') {
    setUserAccountStatus(user.id, 'inactive')
  } else if (type === 'activate') {
    setUserAccountStatus(user.id, 'active')
  } else if (type === 'delete') {
    deleteUserAccount(user.id)
    if (selectedUserId.value === user.id) selectedUserId.value = null
  }
  confirmAction.value = null
}
</script>

<template>
  <AppShell>
    <div class="users-page">
      <header class="page-head">
        <div>
          <h1>Kelola Akun User</h1>
          <p class="page-sub">
            Lihat detail akun pengguna, nonaktifkan sementara, atau hapus akun dengan konfirmasi.
          </p>
        </div>
        <span class="badge badge-hydrated tabular">{{ userAccounts.length }} akun tampil</span>
      </header>

      <section class="filter-strip ceramic-panel">
        <div class="field search-field">
          <label for="user-search" class="field-label">Cari Nama atau Email</label>
          <input
            id="user-search"
            v-model="searchText"
            type="search"
            class="field-input"
            placeholder="Ketik nama atau alamat email..."
          />
        </div>
        <div class="field status-field">
          <label for="user-status" class="field-label">Filter Status</label>
          <select id="user-status" v-model="statusFilter" class="field-select">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </section>

      <div class="users-workspace" :class="{ 'has-detail': selectedUser !== null }">
        <section class="ceramic-panel table-card">
          <div v-if="userAccounts.length > 0" class="table-scroll">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Pengguna</th>
                  <th>Status</th>
                  <th class="num-col">Klasifikasi</th>
                  <th>Login Terakhir</th>
                  <th class="action-col">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in userAccounts"
                  :key="user.id"
                  :class="{ 'is-selected': selectedUserId === user.id }"
                >
                  <td data-label="Pengguna">
                    <div class="user-cell">
                      <strong>{{ user.name }}</strong>
                      <span>{{ user.email }}</span>
                    </div>
                  </td>
                  <td data-label="Status">
                    <span
                      class="badge"
                      :class="user.status === 'active' ? 'badge-active' : 'badge-inactive'"
                    >
                      {{ user.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </td>
                  <td class="num-col tabular" data-label="Klasifikasi">{{ countChecks(user.id) }}</td>
                  <td class="tabular date-cell" data-label="Login Terakhir">{{ formatDateFull(user.lastLoginAt) }}</td>
                  <td class="action-col" data-label="Aksi">
                    <div class="table-actions">
                      <button
                        type="button"
                        class="btn btn-ceramic btn-sm"
                        @click="selectedUserId = user.id"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm"
                        :class="user.status === 'active' ? 'btn-clay' : 'btn-primary'"
                        @click="
                          confirmAction = {
                            type: user.status === 'active' ? 'deactivate' : 'activate',
                            user,
                          }
                        "
                      >
                        {{ user.status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
                      </button>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        aria-label="Hapus user"
                        @click="confirmAction = { type: 'delete', user }"
                      >
                        <HvIcon name="trash" :size="15" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="empty-table">
            <p>Tidak ada akun user yang cocok dengan pencarian Anda.</p>
          </div>
        </section>

        <!-- Detail inspection panel -->
        <aside v-if="selectedUser" class="ceramic-panel detail-card">
          <div class="detail-head">
            <h2>Detail Akun</h2>
            <button
              type="button"
              class="btn btn-ghost btn-sm"
              aria-label="Tutup detail akun"
              @click="selectedUserId = null"
            >
              <HvIcon name="x" :size="17" />
            </button>
          </div>

          <div class="detail-identity">
            <div class="detail-avatar" aria-hidden="true">
              {{ selectedUser.name.slice(0, 1).toUpperCase() }}
            </div>
            <div>
              <h3>{{ selectedUser.name }}</h3>
              <p>{{ selectedUser.email }}</p>
            </div>
          </div>

          <dl class="detail-dl">
            <div>
              <dt>Status</dt>
              <dd>
                <span
                  class="badge"
                  :class="selectedUser.status === 'active' ? 'badge-active' : 'badge-inactive'"
                >
                  {{ selectedUser.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </span>
              </dd>
            </div>
            <div>
              <dt>Terdaftar</dt>
              <dd class="tabular">{{ formatDateFull(selectedUser.createdAt) }}</dd>
            </div>
            <div>
              <dt>Login Terakhir</dt>
              <dd class="tabular">{{ formatDateFull(selectedUser.lastLoginAt) }}</dd>
            </div>
            <div>
              <dt>Riwayat Tersimpan</dt>
              <dd class="tabular">{{ countChecks(selectedUser.id) }} pemeriksaan</dd>
            </div>
          </dl>

          <div class="detail-actions">
            <button
              type="button"
              class="btn"
              :class="selectedUser.status === 'active' ? 'btn-clay' : 'btn-primary'"
              @click="
                confirmAction = {
                  type: selectedUser.status === 'active' ? 'deactivate' : 'activate',
                  user: selectedUser,
                }
              "
            >
              {{ selectedUser.status === 'active' ? 'Nonaktifkan Akun' : 'Aktifkan Kembali' }}
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confirmAction = { type: 'delete', user: selectedUser }"
            >
              <HvIcon name="trash" :size="16" />
              <span>Hapus Akun</span>
            </button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        :open="confirmAction !== null"
        :title="
          confirmAction?.type === 'delete'
            ? `Hapus akun ${confirmAction.user.name}?`
            : confirmAction?.type === 'deactivate'
              ? `Nonaktifkan akun ${confirmAction.user.name}?`
              : `Aktifkan kembali akun ${confirmAction?.user.name}?`
        "
        :message="
          confirmAction?.type === 'delete'
            ? 'Akun pengguna dan seluruh data riwayat klasifikasinya akan dihapus permanen.'
            : confirmAction?.type === 'deactivate'
              ? 'Pengguna tidak dapat masuk ke HydraVision sampai akun diaktifkan kembali oleh Admin.'
              : 'Pengguna akan kembali diizinkan masuk dan menggunakan layanan klasifikasi.'
        "
        :confirm-label="
          confirmAction?.type === 'delete'
            ? 'Ya, Hapus Akun'
            : confirmAction?.type === 'deactivate'
              ? 'Ya, Nonaktifkan'
              : 'Ya, Aktifkan'
        "
        :tone="
          confirmAction?.type === 'delete'
            ? 'danger'
            : confirmAction?.type === 'deactivate'
              ? 'clay'
              : 'primary'
        "
        @confirm="executeConfirmedAction"
        @cancel="confirmAction = null"
      />
    </div>
  </AppShell>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.filter-strip {
  padding: 18px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.7fr);
  gap: 14px;
}

.users-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.users-workspace.has-detail {
  grid-template-columns: minmax(0, 1.45fr) minmax(290px, 0.75fr);
}

.table-card {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}

.table-scroll {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-muted);
  background: var(--linen-soft);
  border-bottom: 1.5px solid var(--ceramic-border);
  white-space: nowrap;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid var(--ceramic-border);
  vertical-align: middle;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr.is-selected {
  background: var(--indigo-tint);
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-cell strong {
  color: var(--ink-espresso);
}

.user-cell span {
  font-size: 0.8125rem;
  color: var(--ink-muted);
}

.num-col {
  text-align: right;
}

.date-cell {
  white-space: nowrap;
  color: var(--ink-umber);
  font-size: 0.84rem;
}

.action-col {
  text-align: right;
}

.table-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.empty-table {
  padding: 36px 24px;
  text-align: center;
  color: var(--ink-umber);
}

.detail-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.detail-head h2 {
  font-size: 1.15rem;
}

.detail-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--indigo-primary);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.detail-identity h3 {
  font-size: 1.05rem;
}

.detail-identity p {
  font-size: 0.84rem;
  color: var(--ink-muted);
}

.detail-dl {
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid var(--ceramic-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 0.875rem;
}

.detail-dl > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.detail-dl dt {
  color: var(--ink-muted);
}

.detail-dl dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

@media (max-width: 1020px) {
  .users-workspace.has-detail {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 680px) {
  .filter-strip {
    grid-template-columns: minmax(0, 1fr);
    padding: 16px;
  }

  .data-table thead {
    display: none;
  }

  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100%;
  }

  .data-table tr {
    padding: 16px;
    border-bottom: 1.5px solid var(--ceramic-border);
  }

  .data-table tr:last-child {
    border-bottom: none;
  }

  .data-table td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    border-bottom: none;
    text-align: right;
  }

  .data-table td::before {
    content: attr(data-label);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ink-muted);
    text-align: left;
    flex-shrink: 0;
  }

  .data-table td[data-label='Pengguna'] {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding-top: 0;
    padding-bottom: 10px;
  }

  .data-table td[data-label='Pengguna']::before {
    display: none;
  }

  .data-table td.action-col {
    flex-direction: column;
    align-items: stretch;
    padding-top: 12px;
    margin-top: 6px;
    border-top: 1px solid var(--ceramic-border);
  }

  .data-table td.action-col::before {
    display: none;
  }

  .table-actions {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    gap: 8px;
  }

  .table-actions .btn {
    flex: 1 1 auto;
  }

  .date-cell {
    white-space: normal;
  }
}
</style>
