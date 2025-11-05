<script setup lang="ts">
import { ref } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

const rootStore = useRootStore();
const router = useRouter();

const searchQuery = ref("");

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <header class="header">
    <div class="header-top">
      🎉 Специальное предложение: бесплатное размещение объявлений весь месяц!
    </div>
    <div class="header-main">
      <div class="header-content">
        <a href="#" class="logo">
          <div class="logo-text">
            <span class="logo-title">SmartMarket</span>
            <span class="logo-subtitle">МАРКЕТПЛЕЙС СМАРТФОНОВ</span>
          </div>
        </a>

        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="Поиск"
            clearable
            size="large"
            :prefix-icon="Search"
          />
        </div>

        <div class="header-actions">
          <el-button type="primary" size="large" :icon="Plus">
            <span>Подать объявление</span>
          </el-button>

          <el-button v-if="!rootStore.user" type="default" size="large" @click="goToLogin">
            Войти
          </el-button>

          <el-avatar
            v-else-if="rootStore.user?.image_url"
            :src="rootStore.user.image_url"
          />

          <el-avatar v-else>
            {{ rootStore.user.first_name?.charAt(0) }}{{ rootStore.user.last_name?.charAt(0) }}
          </el-avatar>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background: var(--color-bg-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid var(--color-border-light);
}

.header-top {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  padding: 8px 0;
  color: var(--color-bg-primary);
  font-size: 13px;
  text-align: center;
}

.header-main {
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  flex-shrink: 0;
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #5b8ff9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.logo-subtitle {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.search-box {
  flex: 1;
  max-width: 600px;
  position: relative;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
</style>
