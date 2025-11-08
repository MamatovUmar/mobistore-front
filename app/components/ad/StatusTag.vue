<script setup lang="ts">
import type { IState } from "~/types/ads";

const props = defineProps<{
  state: IState;
}>();

const state: Record<IState, string> = {
  new: "Новый",
  restored: "Восстановленный",
  used: "Б/У",
};

const stateText = computed(() => state[props.state]);
</script>

<template>
  <span :class="['listing-condition', props.state]">{{ stateText }}</span>
</template>

<style lang="scss" scoped>
.listing-condition {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  background: var(--color-success);
  color: var(--color-bg-primary);
  text-transform: uppercase;
  letter-spacing: 0.3px;

  &.used {
    background: var(--color-warning);
  }
  &.restored {
    background: var(--color-danger);
  }
}
</style>
