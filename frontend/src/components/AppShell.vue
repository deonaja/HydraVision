<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { currentUser, isAdmin, logoutUser } from '@/services/mockStore'
import HvIcon from './HvIcon.vue'

const router = useRouter()
const route = useRoute()
const mobileOpen = ref(false)

const userNav = computed(() => [
  {
    to: isAdmin.value ? '/admin' : '/dashboard',
    label: isAdmin.value ? 'Ringkasan Admin' : 'Dashboard',
    icon: 'home' as const,
  },
  { to: '/classify', label: 'Cek Kulit', icon: 'scan' as const },
  { to: '/history', label: 'Riwayat', icon: 'history' as const },
  { to: '/profile', label: 'Profil', icon: 'user' as const },
])

const adminNav = [
  { to: '/admin/users', label: 'Kelola User', icon: 'users' as const },
  { to: '/admin/recommendations', label: 'Kelola Rekomendasi', icon: 'book-care' as const },
]

function isActive(path: string) {
  if (path === '/history') return route.path.startsWith('/history')
  return route.path === path
}

function handleLogout() {
  mobileOpen.value = false
  logoutUser()
  router.push('/login')
}
</script>

<template>
  <div class="shell">
    <aside class="shell-sidebar" :class="{ 'is-open': mobileOpen }">
      <div class="sidebar-top">
        <RouterLink to="/" class="brand-link" @click="mobileOpen = false">
          <span class="brand-mark" aria-hidden="true">
            <HvIcon name="droplet" :size="18" />
          </span>
          <span class="brand-name">HydraVision</span>
        </RouterLink>
        <button
          type="button"
          class="sidebar-close"
          aria-label="Tutup menu navigasi"
          @click="mobileOpen = false"
        >
          <HvIcon name="x" :size="20" />
        </button>
      </div>

      <nav class="sidebar-nav" aria-label="Menu utama aplikasi">
        <ul class="nav-list">
          <li v-for="item in userNav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="nav-item"
              :class="{ 'is-active': isActive(item.to) }"
              @click="mobileOpen = false"
            >
              <HvIcon :name="item.icon" :size="18" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>

        <template v-if="isAdmin">
          <div class="nav-divider" role="separator"></div>
          <p class="nav-group-title">Pengelolaan Sistem</p>
          <ul class="nav-list">
            <li v-for="item in adminNav" :key="item.to">
              <RouterLink
                :to="item.to"
                class="nav-item"
                :class="{ 'is-active': isActive(item.to) }"
                @click="mobileOpen = false"
              >
                <HvIcon :name="item.icon" :size="18" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </template>
      </nav>

      <div class="sidebar-footer">
        <div v-if="currentUser" class="account-chip">
          <div class="account-avatar" aria-hidden="true">
            {{ currentUser.name.slice(0, 1).toUpperCase() }}
          </div>
          <div class="account-meta">
            <strong class="account-name">{{ currentUser.name }}</strong>
            <span class="account-role">{{ isAdmin ? 'Admin' : 'Pengguna' }}</span>
          </div>
        </div>
        <button type="button" class="btn btn-ceramic btn-sm logout-btn" @click="handleLogout">
          <HvIcon name="logout" :size="16" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>

    <div v-if="mobileOpen" class="shell-backdrop" @click="mobileOpen = false"></div>

    <div class="shell-main">
      <header class="mobile-bar">
        <button
          type="button"
          class="menu-trigger"
          aria-label="Buka menu navigasi"
          @click="mobileOpen = true"
        >
          <HvIcon name="menu" :size="20" />
        </button>
        <RouterLink to="/" class="brand-link">
          <span class="brand-mark" aria-hidden="true">
            <HvIcon name="droplet" :size="16" />
          </span>
          <span class="brand-name">HydraVision</span>
        </RouterLink>
        <span class="badge badge-demo">Mode Simulasi</span>
      </header>

      <main class="shell-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
}

.shell-sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 22px 16px 18px;
  background: var(--linen-rail);
  border-right: 1.5px solid var(--ceramic-border);
  z-index: 40;
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 18px;
  border-bottom: 1px solid var(--ceramic-border);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--ink-espresso);
}

.brand-mark {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--clay-body);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
}

.brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}

.sidebar-close {
  display: none;
  border: none;
  background: transparent;
  padding: 6px;
  border-radius: 8px;
  color: var(--ink-espresso);
}

.sidebar-nav {
  flex: 1;
  padding: 18px 0;
  overflow-y: auto;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  min-height: 42px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--ink-umber);
  font-size: 0.9375rem;
  font-weight: 500;
  border: 1.5px solid transparent;
  transition:
    background-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}

.nav-item:hover {
  background: rgba(250, 246, 239, 0.7);
  color: var(--ink-espresso);
}

.nav-item.is-active {
  background: var(--ceramic-ivory);
  color: var(--indigo-primary);
  font-weight: 600;
  border-color: var(--ceramic-border-strong);
  box-shadow: 0 2px 6px rgba(33, 27, 23, 0.06);
}

.nav-divider {
  height: 1px;
  background: var(--ceramic-border);
  margin: 16px 8px;
}

.nav-group-title {
  padding: 0 12px 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ink-muted);
}

.sidebar-footer {
  padding-top: 14px;
  border-top: 1px solid var(--ceramic-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.account-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: var(--radius-sm);
  background: var(--ceramic-ivory);
  border: 1px solid var(--ceramic-border);
}

.account-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--indigo-primary);
  color: var(--ceramic-ivory);
  display: grid;
  place-items: center;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.account-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.account-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ink-espresso);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.account-role {
  font-size: 0.75rem;
  color: var(--ink-muted);
}

.logout-btn {
  width: 100%;
}

.shell-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.mobile-bar {
  display: none;
}

.shell-content {
  width: 100%;
  max-width: 1160px;
  min-width: 0;
  margin: 0 auto;
  padding: 34px 36px 56px;
}

.shell-backdrop {
  display: none;
}

@media (max-width: 960px) {
  .shell {
    grid-template-columns: minmax(0, 1fr);
  }

  .shell-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(280px, 84vw);
    transform: translateX(-100%);
    transition: transform var(--dur-mid) var(--ease-out);
  }

  .shell-sidebar.is-open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: grid;
    place-items: center;
  }

  .shell-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(33, 27, 23, 0.45);
    z-index: 35;
  }

  .mobile-bar {
    position: sticky;
    top: 0;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    padding-top: max(10px, env(safe-area-inset-top));
    background: var(--linen-rail);
    border-bottom: 1.5px solid var(--ceramic-border);
    min-width: 0;
  }

  .mobile-bar .brand-link {
    min-width: 0;
  }

  .mobile-bar .brand-name {
    font-size: 1.05rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mobile-bar .badge-demo {
    font-size: 0.72rem;
    padding: 4px 8px;
    flex-shrink: 0;
  }

  .menu-trigger {
    flex-shrink: 0;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-sm);
    border: 1.5px solid var(--ceramic-border-strong);
    background: var(--ceramic-ivory);
    display: grid;
    place-items: center;
    color: var(--ink-espresso);
  }

  .shell-content {
    padding: 20px 16px max(44px, env(safe-area-inset-bottom));
  }
}

@media (max-width: 360px) {
  .mobile-bar .badge-demo {
    display: none;
  }
}
</style>
