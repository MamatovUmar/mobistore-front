<script setup lang="ts">
import { Delete, Edit } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";

const root = useRootStore();
const fileInputRef = ref<HTMLInputElement>();
const isHovering = ref(false);
const isLoading = ref(false);

const user = computed(() => root.user);

const hasAvatar = computed(() => !!user.value?.avatar);

const profileImageUrl = computed(() => {
  if (user.value?.avatar) {
    return user.value.avatar;
  }
  return "";
});

const userInitials = computed(() => {
  if (!user.value) return "";
  const firstName = user.value.first_name?.[0]?.toUpperCase() || "";
  const lastName = user.value.last_name?.[0]?.toUpperCase() || "";
  return `${firstName}${lastName}`;
});

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Проверка типа файла
  if (!file.type.startsWith("image/")) {
    ElMessage.error("Пожалуйста, выберите изображение");
    return;
  }

  // Проверка размера (макс 5MB)
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error("Размер изображения не должен превышать 5MB");
    return;
  }

  isLoading.value = true;

  try {
    // Если уже есть изображение, удаляем его
    if (user.value?.avatar) {
      await deleteProfileImage();
    }

    // Загружаем новое изображение
    await uploadProfileImage(file);
  } finally {
    isLoading.value = false;
    // Очищаем input
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

const uploadProfileImage = async (file: File) => {
  const { $api } = useNuxtApp();

  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "user");
    formData.append("entityType", "user");
    formData.append("entityId", String(user.value?.id || ""));

    await $api("/image/upload", {
      method: "POST",
      body: formData,
    });

    // Обновляем данные пользователя
    await root.fetchUser();
    ElMessage.success("Изображение профиля обновлено");
  } catch (error: any) {
    console.error("Upload error:", error);
    ElMessage.error("Ошибка при загрузке изображения");
    throw error;
  }
};

const deleteProfileImage = async () => {
  const { $api } = useNuxtApp();

  try {
    await $api(`/image/entity/user/${user.value?.id}?folder=user`, {
      method: "DELETE",
    });

    // Обновляем данные пользователя
    await root.fetchUser();
    ElMessage.success("Изображение профиля удалено");
  } catch (error: any) {
    console.error("Delete error:", error);
    ElMessage.error("Ошибка при удалении изображения");
    throw error;
  }
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};
</script>

<template>
  <div class="profile-image-container">
    <div
      class="avatar-wrapper"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
    >
      <img
        v-if="hasAvatar"
        :src="profileImageUrl"
        :alt="user?.first_name || 'Profile'"
        class="avatar-image"
        :class="{ 'avatar-image--loading': isLoading }"
      >
      <div v-else class="avatar-initials">
        {{ userInitials }}
      </div>

      <transition name="fade">
        <div v-if="isHovering && !isLoading" class="avatar-overlay">
          <div class="avatar-actions">
            <button
              title="Изменить фото"
              class="action-btn action-btn--edit"
              @click="triggerFileInput"
            >
              <el-icon>
                <Edit />
              </el-icon>
            </button>
            <button
              v-if="user?.avatar"
              title="Удалить фото"
              class="action-btn action-btn--delete"
              @click="deleteProfileImage"
            >
              <el-icon>
                <Delete />
              </el-icon>
            </button>
          </div>
        </div>
      </transition>

      <div v-if="isLoading" class="avatar-loading">
        <el-icon class="is-loading">
          <svg
            class="circular"
            viewBox="25 25 50 50"
          >
            <circle
              class="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke-width="2"
              stroke-miterlimit="10"
            />
          </svg>
        </el-icon>
      </div>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileSelect"
    >

    <div v-if="user" class="profile-info">
      <h3 class="profile-name">
        {{ user.first_name }} {{ user.last_name }}
      </h3>
      <p class="profile-email">{{ user.email }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.2s;

  &--loading {
    opacity: 0.5;
  }
}

.avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary), #3b82f6);
  color: white;
  font-size: 48px;
  font-weight: 600;
  user-select: none;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.avatar-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  &--edit {
    &:hover {
      background: rgba(59, 130, 246, 0.5);
    }
  }

  &--delete {
    &:hover {
      background: rgba(239, 68, 68, 0.5);
    }
  }
}

.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 20;

  .is-loading {
    font-size: 40px;
    color: var(--color-primary);
  }

  .circular {
    height: 40px;
    width: 40px;
    animation: rotating 2s linear infinite;
  }

  .path {
    stroke: var(--color-primary);
    animation: dash 1.5s ease-in-out infinite;
    stroke-linecap: round;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.file-input {
  display: none;
}

.profile-info {
  text-align: center;
  width: 100%;
}

.profile-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.profile-email {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>