<script setup lang="ts">
/**
 * Горизонтальный рейтинг с полосами (источники переходов, боты, рефереры).
 */
interface BarItem {
  label: string;
  value: number;
  /** Дополнительная подпись справа, например доля в процентах */
  hint?: string;
}

const props = withDefaults(
  defineProps<{
    items: BarItem[];
    color?: string;
    emptyText?: string;
  }>(),
  {
    color: "#3b82f6",
    emptyText: "Нет данных за выбранный период",
  }
);

const maxValue = computed(() =>
  props.items.reduce((max, item) => Math.max(max, item.value), 0)
);

const widthOf = (value: number): string =>
  maxValue.value ? `${Math.max(2, (value / maxValue.value) * 100)}%` : "0%";
</script>

<template>
  <div class="admin-bars">
    <p v-if="!items.length" class="admin-bars__empty">{{ emptyText }}</p>

    <div v-for="item in items" :key="item.label" class="admin-bars__row">
      <div class="admin-bars__head">
        <span class="admin-bars__label" :title="item.label">{{ item.label }}</span>
        <span class="admin-bars__value">
          {{ item.value.toLocaleString("ru-RU") }}
          <em v-if="item.hint" class="admin-bars__hint">{{ item.hint }}</em>
        </span>
      </div>
      <div class="admin-bars__track">
        <div
          class="admin-bars__fill"
          :style="{ width: widthOf(item.value), background: color }"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;

  &__empty {
    margin: 0;
    padding: 32px 0;
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
  }

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 6px;
  }

  &__label {
    font-size: 13px;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__value {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    white-space: nowrap;
  }

  &__hint {
    margin-left: 6px;
    font-style: normal;
    font-weight: 400;
    color: #94a3b8;
  }

  &__track {
    height: 8px;
    border-radius: 4px;
    background: #f1f5f9;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
}
</style>
