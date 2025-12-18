<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";

const { locale, locales, setLocale } = useI18n();

const handleLocaleChange = (code: 'uz' | 'ru') => {
  setLocale(code);
};
</script>

<template>
  <el-dropdown trigger="click" @command="handleLocaleChange">
    <button class="lang-btn" size="large">
      <span class="lang-code">{{ locale.toUpperCase() }}</span>
      <el-icon class="lang-arrow"><ArrowDown /></el-icon>
    </button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="loc in locales"
          :key="loc.code"
          :command="loc.code"
          :class="{ 'is-active': loc.code === locale }"
        >
          <span class="locale-name">{{ loc.name }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.lang-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
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

.lang-arrow {
  font-size: 12px;
  transition: transform 0.2s ease;
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