<script setup lang="ts">
import { ref, watch } from 'vue'
import HvIcon from './HvIcon.vue'

const props = defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'clay' | 'primary'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    const el = dialogRef.value
    if (!el) return
    if (isOpen && !el.open) {
      el.showModal()
    } else if (!isOpen && el.open) {
      el.close()
    }
  },
  { flush: 'post' },
)

function onBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    emit('cancel')
  }
}
</script>

<template>
  <dialog
    ref="dialogRef"
    class="hv-dialog"
    @cancel.prevent="emit('cancel')"
    @click="onBackdropClick"
  >
    <div class="hv-dialog-card">
      <div class="hv-dialog-head">
        <span class="hv-dialog-icon" :class="tone === 'danger' ? 'is-danger' : 'is-clay'">
          <HvIcon name="alert" :size="20" />
        </span>
        <div class="hv-dialog-copy">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>
      </div>
      <div class="hv-dialog-actions">
        <button type="button" class="btn btn-ceramic" @click="emit('cancel')">
          {{ cancelLabel ?? 'Batal' }}
        </button>
        <button
          type="button"
          class="btn"
          :class="
            tone === 'danger'
              ? 'btn-danger-solid'
              : tone === 'primary'
                ? 'btn-primary'
                : 'btn-clay'
          "
          @click="emit('confirm')"
        >
          {{ confirmLabel ?? 'Ya, Lanjutkan' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.hv-dialog {
  padding: 0;
  border: none;
  background: transparent;
  max-width: 440px;
  width: calc(100% - 32px);
  overflow: visible;
}

.hv-dialog::backdrop {
  background: rgba(33, 27, 23, 0.52);
  backdrop-filter: blur(3px);
}

.hv-dialog-card {
  background: var(--ceramic-ivory);
  border: 1.5px solid var(--ceramic-border-strong);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-popover);
}

.hv-dialog-head {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.hv-dialog-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.hv-dialog-icon.is-danger {
  background: var(--state-danger-bg);
  color: var(--state-danger-fg);
  border: 1px solid var(--state-danger-border);
}

.hv-dialog-icon.is-clay {
  background: var(--state-dry-bg);
  color: var(--state-dry-fg);
  border: 1px solid var(--state-dry-border);
}

.hv-dialog-copy h3 {
  font-size: 1.125rem;
  margin-bottom: 6px;
}

.hv-dialog-copy p {
  font-size: 0.9375rem;
  color: var(--ink-umber);
  line-height: 1.5;
}

.hv-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}
</style>
