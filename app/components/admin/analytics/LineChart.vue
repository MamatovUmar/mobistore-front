<script setup lang="ts">
/**
 * Линейный график на чистом SVG — чтобы не тащить в проект библиотеку графиков.
 * Используется в админке для динамики просмотров по дням.
 */
interface Series {
  name: string;
  color: string;
  values: number[];
  /** Заливка под линией */
  fill?: boolean;
}

const props = withDefaults(
  defineProps<{
    labels: string[];
    series: Series[];
    height?: number;
    /** Подпись под осью Y */
    unit?: string;
  }>(),
  { height: 240, unit: "" }
);

const WIDTH = 720;
const PADDING = { top: 16, right: 12, bottom: 26, left: 40 };

const maxValue = computed(() => {
  const values = props.series.flatMap((item) => item.values);
  const max = values.length ? Math.max(...values) : 0;
  return max > 0 ? max : 1;
});

const plotWidth = computed(() => WIDTH - PADDING.left - PADDING.right);
const plotHeight = computed(() => props.height - PADDING.top - PADDING.bottom);

const pointCount = computed(() => props.labels.length);

const xAt = (index: number): number => {
  if (pointCount.value <= 1) return PADDING.left + plotWidth.value / 2;
  return PADDING.left + (index / (pointCount.value - 1)) * plotWidth.value;
};

const yAt = (value: number): number =>
  PADDING.top + plotHeight.value - (value / maxValue.value) * plotHeight.value;

const linePath = (values: number[]): string =>
  values
    .map((value, index) => `${index === 0 ? "M" : "L"}${xAt(index)},${yAt(value)}`)
    .join(" ");

const areaPath = (values: number[]): string => {
  if (!values.length) return "";
  const baseline = PADDING.top + plotHeight.value;
  return `${linePath(values)} L${xAt(values.length - 1)},${baseline} L${xAt(0)},${baseline} Z`;
};

/**
 * Горизонтальные линии сетки. При маленьких значениях шкала идёт по единицам,
 * иначе подписи вроде «2, 2, 1, 1, 0» дублируются.
 */
const gridLines = computed(() => {
  const max = maxValue.value;
  const steps = max <= 4 ? Math.max(1, Math.round(max)) : 4;

  return Array.from({ length: steps + 1 }, (_, index) => {
    const ratio = index / steps;
    return {
      y: PADDING.top + plotHeight.value * (1 - ratio),
      value: Math.round(max * ratio),
    };
  });
});

/** Показываем не больше 8 подписей по оси X, чтобы не слипались */
const visibleLabels = computed(() => {
  const step = Math.max(1, Math.ceil(pointCount.value / 8));
  return props.labels
    .map((label, index) => ({ label, index }))
    .filter((item) => item.index % step === 0 || item.index === pointCount.value - 1);
});

const formatLabel = (value: string): string => {
  const parts = value.split("-");
  return parts.length === 3 ? `${parts[2]}.${parts[1]}` : value;
};

const isEmpty = computed(() =>
  props.series.every((item) => item.values.every((value) => value === 0))
);
</script>

<template>
  <div class="admin-chart">
    <div v-if="!pointCount || isEmpty" class="admin-chart__empty">
      Нет данных за выбранный период
    </div>

    <template v-else>
      <svg
        class="admin-chart__svg"
        :viewBox="`0 0 ${WIDTH} ${height}`"
        preserveAspectRatio="none"
        role="img"
      >
        <g>
          <line
            v-for="line in gridLines"
            :key="`grid-${line.y}`"
            :x1="PADDING.left"
            :x2="WIDTH - PADDING.right"
            :y1="line.y"
            :y2="line.y"
            class="admin-chart__grid"
          />
          <text
            v-for="line in gridLines"
            :key="`label-${line.y}`"
            :x="PADDING.left - 8"
            :y="line.y + 4"
            class="admin-chart__axis-label"
            text-anchor="end"
          >
            {{ line.value }}
          </text>
        </g>

        <g v-for="item in series" :key="item.name">
          <path
            v-if="item.fill"
            :d="areaPath(item.values)"
            :fill="item.color"
            fill-opacity="0.12"
          />
          <path
            :d="linePath(item.values)"
            fill="none"
            :stroke="item.color"
            stroke-width="2"
            stroke-linejoin="round"
            stroke-linecap="round"
          />
          <circle
            v-for="(value, index) in item.values"
            :key="`${item.name}-${index}`"
            :cx="xAt(index)"
            :cy="yAt(value)"
            r="2.5"
            :fill="item.color"
          >
            <title>{{ labels[index] }} — {{ value }} {{ unit }}</title>
          </circle>
        </g>

        <text
          v-for="item in visibleLabels"
          :key="`x-${item.index}`"
          :x="xAt(item.index)"
          :y="height - 8"
          class="admin-chart__axis-label"
          text-anchor="middle"
        >
          {{ formatLabel(item.label) }}
        </text>
      </svg>

      <div class="admin-chart__legend">
        <span
          v-for="item in series"
          :key="`legend-${item.name}`"
          class="admin-chart__legend-item"
        >
          <i class="admin-chart__dot" :style="{ background: item.color }" />
          {{ item.name }}
        </span>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.admin-chart {
  width: 100%;

  &__svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  &__grid {
    stroke: #e5e7eb;
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }

  &__axis-label {
    font-size: 11px;
    fill: #94a3b8;
  }

  &__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 12px;
    font-size: 13px;
    color: #64748b;
  }

  &__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
  }

  &__empty {
    padding: 48px 0;
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
  }
}
</style>
