<script setup lang="ts">
import { toastList, dismissToast } from '@/services/mockStore'
import HvIcon from './HvIcon.vue'
</script>

<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="true">
    <TransitionGroup name="toast">
      <div
        v-for="item in toastList"
        :key="item.id"
        class="toast-item"
        :class="`toast-${item.tone}`"
        role="status"
      >
        <HvIcon
          :name="item.tone === 'success' ? 'check-circle' : item.tone === 'error' ? 'alert' : 'info'"
          :size="18"
        />
        <span class="toast-text">{{ item.message }}</span>
        <button
          type="button"
          class="toast-close"
          aria-label="Tutup notifikasi"
          @click="dismissToast(item.id)"
        >
          <HvIcon name="x" :size="15" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: min(380px, calc(100vw - 32px));
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--ceramic-border-strong);
  background: var(--ceramic-ivory);
  color: var(--ink-espresso);
  box-shadow: var(--shadow-popover);
  font-size: 0.875rem;
  font-weight: 500;
}

.toast-success {
  background: var(--state-success-bg);
  border-color: var(--state-success-border);
  color: var(--state-success-fg);
}

.toast-error {
  background: var(--state-danger-bg);
  border-color: var(--state-danger-border);
  color: var(--state-danger-fg);
}

.toast-text {
  flex: 1;
}

.toast-close {
  border: none;
  background: transparent;
  padding: 4px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  color: inherit;
  opacity: 0.75;
}

.toast-close:hover {
  opacity: 1;
  background: rgba(33, 27, 23, 0.08);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity var(--dur-mid) var(--ease-out),
    transform var(--dur-mid) var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
