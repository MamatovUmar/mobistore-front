<script setup lang="ts">
import { Delete, Refresh, Loading } from "@element-plus/icons-vue";

definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Кэш — Админ MobiStore",
  robots: "noindex, nofollow",
});

const { loading, cacheKeys, cacheStats, refresh, clearByKey, clearAll, formatTTL } = useCache();

const clearingKey = ref<string | null>(null);
const clearingAll = ref(false);

onMounted(() => {
  refresh();
});

const getKeyCount = (keyName: string): number => {
  if (!cacheStats.value?.keys) return 0;
  const stat = cacheStats.value.keys.find((k) => k.name === keyName);
  return stat?.count ?? 0;
};

const handleClearCache = async (key: string, label: string) => {
  try {
    await ElMessageBox.confirm(
      `Вы уверены, что хотите очистить кеш "${label}"?`,
      "Подтверждение",
      {
        confirmButtonText: "Очистить",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    clearingKey.value = key;
    await clearByKey(key);
  } catch {
    // User cancelled or error handled in composable
  } finally {
    clearingKey.value = null;
  }
};

const handleClearAll = async () => {
  try {
    await ElMessageBox.confirm(
      "Вы уверены, что хотите очистить весь кеш? Это может временно замедлить работу системы.",
      "Подтверждение",
      {
        confirmButtonText: "Очистить всё",
        cancelButtonText: "Отмена",
        type: "warning",
      }
    );

    clearingAll.value = true;
    await clearAll();
  } catch {
    // User cancelled or error handled in composable
  } finally {
    clearingAll.value = false;
  }
};

const handleRefresh = async () => {
  await refresh();
  ElMessage.success("Данные обновлены");
};
</script>

<template>
  <div class="admin-cache">
    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Всего ключей</span>
        <span class="stat-value">{{ cacheStats?.totalKeys ?? 0 }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Типов кеша</span>
        <span class="stat-value">{{ cacheKeys.length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Паттернов</span>
        <span class="stat-value">{{ cacheKeys.filter(k => k.isPattern).length }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Статичных</span>
        <span class="stat-value">{{ cacheKeys.filter(k => !k.isPattern).length }}</span>
      </div>
    </div>

    <div class="page-toolbar">
      <h3 class="section-title">Ключи кеша</h3>
      <div class="toolbar-actions">
        <el-button :icon="Refresh" :loading="loading" @click="handleRefresh">
          Обновить
        </el-button>
        <el-button
          type="danger"
          :icon="Delete"
          :loading="clearingAll"
          @click="handleClearAll"
        >
          Очистить всё
        </el-button>
      </div>
    </div>

    <div v-if="loading && !cacheKeys.length" class="loading-state">
      <el-icon class="loading-icon" :size="32"><Loading /></el-icon>
      <span>Загрузка данных...</span>
    </div>

    <div v-else-if="!cacheKeys.length" class="empty-state">
      <el-empty description="Нет данных о кеше" />
    </div>

    <div v-else class="cache-grid">
      <el-card v-for="key in cacheKeys" :key="key.name" class="cache-card">
        <div class="cache-header">
          <div class="cache-title">
            <h4>{{ key.label }}</h4>
            <el-tag v-if="key.isPattern" size="small" type="info">
              pattern
            </el-tag>
          </div>
        </div>

        <div class="cache-key">
          <code>{{ key.name }}</code>
        </div>

        <div class="cache-meta">
          <div class="cache-meta-item">
            <span class="meta-value">{{ getKeyCount(key.name) }}</span>
            <span class="meta-label">записей</span>
          </div>
          <div class="cache-meta-divider" />
          <div class="cache-meta-item">
            <span class="meta-value">{{ formatTTL(key.ttl) }}</span>
            <span class="meta-label">TTL</span>
          </div>
        </div>

        <div class="cache-footer">
          <el-button
            type="danger"
            :icon="Delete"
            size="small"
            plain
            :loading="clearingKey === key.name"
            @click="handleClearCache(key.name, key.label)"
          >
            Очистить кеш
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-cache {
  max-width: 1400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
  color: var(--color-text-secondary);
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cache-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.cache-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.cache-header {
  margin-bottom: 12px;
}

.cache-title {
  display: flex;
  align-items: center;
  gap: 8px;

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text-primary);
  }
}

.cache-key {
  margin-bottom: 16px;

  code {
    display: block;
    font-family: "SF Mono", Monaco, Consolas, monospace;
    font-size: 12px;
    color: var(--color-primary);
    background: rgba(59, 130, 246, 0.08);
    padding: 8px 12px;
    border-radius: 6px;
    word-break: break-all;
  }
}

.cache-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 16px;
}

.cache-meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.cache-meta-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border-light);
}

.meta-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.meta-label {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.cache-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
