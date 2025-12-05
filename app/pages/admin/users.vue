<script setup lang="ts">
import { Search, Plus, Edit, Delete, View } from "@element-plus/icons-vue";

definePageMeta({
  layout: "admin",
});

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

const users = ref([
  {
    id: 1,
    name: "Иван Петров",
    email: "ivan@example.com",
    phone: "+998 90 123 45 67",
    role: "user",
    status: "active",
    createdAt: "2024-01-15",
    listingsCount: 5,
  },
  {
    id: 2,
    name: "Мария Сидорова",
    email: "maria@example.com",
    phone: "+998 91 234 56 78",
    role: "user",
    status: "active",
    createdAt: "2024-02-20",
    listingsCount: 12,
  },
  {
    id: 3,
    name: "Алексей Козлов",
    email: "alex@example.com",
    phone: "+998 93 345 67 89",
    role: "admin",
    status: "active",
    createdAt: "2024-01-05",
    listingsCount: 0,
  },
  {
    id: 4,
    name: "Елена Новикова",
    email: "elena@example.com",
    phone: "+998 94 456 78 90",
    role: "user",
    status: "blocked",
    createdAt: "2024-03-10",
    listingsCount: 3,
  },
  {
    id: 5,
    name: "Дмитрий Волков",
    email: "dmitry@example.com",
    phone: "+998 95 567 89 01",
    role: "user",
    status: "inactive",
    createdAt: "2024-02-28",
    listingsCount: 8,
  },
]);

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    active: "success",
    blocked: "danger",
    inactive: "info",
  };
  return types[status] || "info";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: "Активен",
    blocked: "Заблокирован",
    inactive: "Неактивен",
  };
  return labels[status] || status;
};

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: "Админ",
    user: "Пользователь",
  };
  return labels[role] || role;
};

const handleEdit = (row: any) => {
  console.log("Edit user:", row);
};

const handleDelete = (row: any) => {
  console.log("Delete user:", row);
};

const handleView = (row: any) => {
  console.log("View user:", row);
};
</script>

<template>
  <div class="admin-users">
    <div class="page-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="Поиск пользователей..."
        :prefix-icon="Search"
        class="search-input"
        clearable
      />
      <el-button type="primary" :icon="Plus">
        Добавить пользователя
      </el-button>
    </div>

    <el-card class="users-table-card">
      <el-table :data="users" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="Имя" min-width="150">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" class="user-avatar">
                {{ row.name.charAt(0) }}
              </el-avatar>
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="Email" min-width="180" />
        <el-table-column prop="phone" label="Телефон" min-width="150" />
        <el-table-column prop="role" label="Роль" width="120">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'warning' : 'info'" size="small">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Статус" width="130">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="listingsCount" label="Объявления" width="110" align="center" />
        <el-table-column prop="createdAt" label="Регистрация" width="120" />
        <el-table-column label="Действия" width="150" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-tooltip content="Просмотр" placement="top">
                <el-button :icon="View" text @click="handleView(row)" />
              </el-tooltip>
              <el-tooltip content="Редактировать" placement="top">
                <el-button :icon="Edit" text @click="handleEdit(row)" />
              </el-tooltip>
              <el-tooltip content="Удалить" placement="top">
                <el-button :icon="Delete" text type="danger" @click="handleDelete(row)" />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="100"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.admin-users {
  max-width: 1400px;
}

.page-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
}

.search-input {
  width: 320px;

  @media (max-width: 600px) {
    width: 100%;
  }
}

.users-table-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  background: var(--color-primary);
  color: white;
  flex-shrink: 0;
}

.table-pagination {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
}
</style>
