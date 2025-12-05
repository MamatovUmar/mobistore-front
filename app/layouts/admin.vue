<script setup lang="ts">
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";

const isCollapsed = ref(false);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <client-only>
    <div class="admin-layout">
      <AdminSidebar :collapsed="isCollapsed" />

      <div class="admin-main" :class="{ 'admin-main--collapsed': isCollapsed }">
        <AdminHeader :collapsed="isCollapsed" @toggle-sidebar="toggleSidebar" />

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

  &--collapsed {
    margin-left: 64px;
  }
}

.admin-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;

    &--collapsed {
      margin-left: 0;
    }
  }
}
</style>
