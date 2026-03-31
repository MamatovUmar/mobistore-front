<script setup lang="ts">
import { useRootStore } from '~/store/root';


const root = useRootStore()

const currencies = ref(['USD', 'UZS']);
const selectedCurrency = useCookie('currency', {
  default: () => 'USD',
});

function handleCurrencyChange(code: 'USD' | 'UZS') {
  selectedCurrency.value = code;
  if (code === 'UZS') {
    root.resetCurrency();
  } else {
    const rate = root.rates.find(r => r.ccy === code);
    if (rate) root.setRates(rate);
  }
}

</script>

<template>
  <el-dropdown trigger="click" @command="handleCurrencyChange">
    <button class="lang-btn">
      <span class="lang-code">{{ selectedCurrency }}</span>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="currency in currencies"
          :key="currency"
          :command="currency"
          :class="{ 'is-active': currency === selectedCurrency }"
        >
          <span class="locale-name">{{ currency }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.lang-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  height: 40px;
  width: 40px;
  min-width: 40px;
  background: transparent;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;

  &:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background: #eff6ff;
  }
}

.lang-code {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

:deep(.el-dropdown-menu__item) {
  padding: 10px 16px;

  &.is-active {
    color: #3b82f6;
    background: #eff6ff;
    font-weight: 600;
  }
}

.locale-name {
  font-size: 14px;
}
</style>
