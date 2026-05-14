<script setup lang="ts">
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";

const isCollapsed = ref(false);
const mobileSidebarOpen = ref(false);
const { isTabletOrSmaller } = useBreakpoints();

const toggleSidebar = () => {
  if (isTabletOrSmaller.value) {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
  } else {
    isCollapsed.value = !isCollapsed.value;
  }
};

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false;
};

watch(isTabletOrSmaller, (mobile) => {
  if (!mobile) mobileSidebarOpen.value = false;
});
</script>

<template>
  <client-only>
    <div class="admin-layout">
      <AdminSidebar
        :collapsed="isCollapsed"
        :mobile-open="mobileSidebarOpen"
        @close="closeMobileSidebar"
      />

      <div
        v-if="mobileSidebarOpen"
        class="admin-backdrop"
        @click="closeMobileSidebar"
      />

      <div class="admin-main" :class="{ 'admin-main--collapsed': isCollapsed }">
        <AdminHeader
          :collapsed="isCollapsed"
          :mobile-open="mobileSidebarOpen"
          @toggle-sidebar="toggleSidebar"
        />

        <main class="admin-content">
          <NuxtPage />
        </main>
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.admin-main {
  flex: 1;
  margin-left: 240px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;

  &--collapsed {
    margin-left: 64px;
  }
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.admin-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 99;
  animation: backdrop-fade 0.2s ease;
}

@keyframes backdrop-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 1023px) {
  .admin-main {
    margin-left: 0;

    &--collapsed {
      margin-left: 0;
    }
  }

  .admin-content {
    padding: 16px;
  }
}

@media (max-width: 767px) {
  .admin-content {
    padding: 12px;
  }
}
</style>
