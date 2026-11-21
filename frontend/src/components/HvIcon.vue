<script setup lang="ts">
defineProps<{
  name:
    | 'droplet'
    | 'upload'
    | 'check-circle'
    | 'sun'
    | 'focus'
    | 'ban'
    | 'history'
    | 'user'
    | 'users'
    | 'book-care'
    | 'shield'
    | 'logout'
    | 'trash'
    | 'edit'
    | 'plus'
    | 'arrow-right'
    | 'arrow-left'
    | 'alert'
    | 'info'
    | 'refresh'
    | 'sliders'
    | 'menu'
    | 'x'
    | 'eye'
    | 'eye-off'
    | 'lock'
    | 'mail'
    | 'home'
    | 'scan'
  size?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 18"
    :height="size ?? 18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.85"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'droplet'">
      <path d="M12 2.75C12 2.75 6 9.2 6 13.75a6 6 0 0 0 12 0C18 9.2 12 2.75 12 2.75Z" />
      <path d="M9.5 14.2a2.6 2.6 0 0 0 2.5 2.6" />
    </template>
    <template v-else-if="name === 'upload'">
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </template>
    <template v-else-if="name === 'check-circle'">
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8.6 12.2 2.3 2.3 4.6-4.8" />
    </template>
    <template v-else-if="name === 'sun'">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </template>
    <template v-else-if="name === 'focus'">
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <circle cx="12" cy="12" r="3" />
    </template>
    <template v-else-if="name === 'ban'">
      <circle cx="12" cy="12" r="9.25" />
      <path d="m5.5 5.5 13 13" />
    </template>
    <template v-else-if="name === 'history'">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l3.5 2" />
    </template>
    <template v-else-if="name === 'user'">
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </template>
    <template v-else-if="name === 'users'">
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.75" />
      <path d="M16.5 13.5a5 5 0 0 1 4.5 5.5" />
    </template>
    <template v-else-if="name === 'book-care'">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 0 4 22.5v-17Z" />
      <path d="M8.5 7.5h7M8.5 11.5h5" />
    </template>
    <template v-else-if="name === 'shield'">
      <path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" />
      <path d="m9.5 12 1.8 1.8 3.5-3.6" />
    </template>
    <template v-else-if="name === 'logout'">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </template>
    <template v-else-if="name === 'trash'">
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
    </template>
    <template v-else-if="name === 'edit'">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </template>
    <template v-else-if="name === 'plus'">
      <path d="M12 5v14M5 12h14" />
    </template>
    <template v-else-if="name === 'arrow-right'">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </template>
    <template v-else-if="name === 'arrow-left'">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </template>
    <template v-else-if="name === 'alert'">
      <path d="M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4.5M12 17h.01" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 16v-4.2M12 8h.01" />
    </template>
    <template v-else-if="name === 'refresh'">
      <path d="M21 12a9 9 0 0 0-15.4-6.4L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 15.4 6.4L21 16" />
      <path d="M21 21v-5h-5" />
    </template>
    <template v-else-if="name === 'sliders'">
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="2" fill="currentColor" />
      <circle cx="15" cy="12" r="2" fill="currentColor" />
      <circle cx="11" cy="18" r="2" fill="currentColor" />
    </template>
    <template v-else-if="name === 'menu'">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </template>
    <template v-else-if="name === 'x'">
      <path d="M18 6 6 18M6 6l12 12" />
    </template>
    <template v-else-if="name === 'eye'">
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </template>
    <template v-else-if="name === 'eye-off'">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2.75 2.75 0 0 0 3.8 3.8" />
      <path d="M9.4 6.8A9.8 9.8 0 0 1 12 6.5c6 0 9.5 5.5 9.5 5.5a16.8 16.8 0 0 1-3.3 3.7M6.3 7.9A16.5 16.5 0 0 0 2.5 12s3.5 5.5 9.5 5.5c1.2 0 2.4-.2 3.4-.6" />
    </template>
    <template v-else-if="name === 'lock'">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </template>
    <template v-else-if="name === 'mail'">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </template>
    <template v-else-if="name === 'home'">
      <path d="m3 10.5 9-7.5 9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </template>
    <template v-else-if="name === 'scan'">
      <path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" />
      <path d="M7 12h10" />
    </template>
  </svg>
</template>
