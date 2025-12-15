<script setup lang="ts">
import { ArrowLeft, Close, ArrowRight, Flag } from "@element-plus/icons-vue";
import type { IListing } from "~/types/ads";

const { listing } = defineProps<{ listing: IListing }>();

const { $api } = useNuxtApp();

// Состояние модального окна
const visible = ref(false);
const currentLevel = ref(0);
const selectedCategory = ref<string | null>(null);
const selectedSubcategory = ref<string | null>(null);
const selectedReason = ref<string | null>(null);
const isLoading = ref(false);

// Дерево категорий жалоб
interface ComplaintOption {
  label: string;
  description?: string;
  children?: ComplaintOption[];
}

const complaintCategories: ComplaintOption[] = [
  {
    label: "Неверная информация о продавце",
    description: "Ложные контактные данные или профиль",
    children: [
      { label: "Неверные контактные данные" },
      { label: "Фейковый профиль" },
    ],
  },
  {
    label: "Проблема с товаром или услугой",
    description: "Запрещённый или контрафактный товар",
    children: [
      {
        label: "Запрещённый товар",
        description: "Оружие, наркотики, запрещённые устройства",
      },
      {
        label: "Контрафактный товар",
        description: "Поддельные устройства, подделки брендов",
      },
      { label: "Украденный товар", description: "Украденное устройство" },
    ],
  },
  {
    label: "Вводящее в заблуждение объявление",
    description: "Недостоверная или противоречивая информация",
    children: [
      { label: "Неверно указана категория" },
      { label: "Неверно указана цена" },
      {
        label: "Фотография и описание не совпадают",
        description: "Противоречивая информация в объявлении",
      },
      { label: "Неверно указано местоположение" },
      { label: "Товар уже продан" },
      {
        label: "Объявление дублируется",
        description: "Такое объявление уже существует",
      },
      { label: "Спам" },
      {
        label: "Ничего не продаётся",
        description: "Пользователь хочет приобрести, а не продать",
      },
    ],
  },
  {
    label: "Мошенничество",
    description: "Кто-то совершил или пытается совершить мошенничество",
    children: [
      { label: "Я стал(а) жертвой мошенников" },
      { label: "Я подозреваю мошенничество" },
    ],
  },
  {
    label: "Жестокость, дискриминация, оскорбления",
    description: "Вредоносное или порочащее содержание",
    children: [
      { label: "Оскорбительное содержание" },
      { label: "Дискриминация" },
      { label: "Призывы к насилию" },
    ],
  },
];

// Вычисляемые значения для текущего отображения
const currentTitle = computed(() => {
  if (currentLevel.value === 0) return "Жалоба";
  if (currentLevel.value === 1 && selectedCategory.value) {
    return selectedCategory.value;
  }
  if (currentLevel.value === 2 && selectedSubcategory.value) {
    return selectedSubcategory.value;
  }
  return "Жалоба";
});

const currentOptions = computed(() => {
  if (currentLevel.value === 0) return complaintCategories;
  if (currentLevel.value === 1 && selectedCategory.value) {
    const category = complaintCategories.find(
      (c) => c.label === selectedCategory.value
    );
    return category?.children || [];
  }
  return [];
});

// Методы навигации
const openModal = () => {
  visible.value = true;
  resetSelection();
};

const closeModal = () => {
  visible.value = false;
  resetSelection();
};

const resetSelection = () => {
  currentLevel.value = 0;
  selectedCategory.value = null;
  selectedSubcategory.value = null;
  selectedReason.value = null;
};

const goBack = () => {
  if (currentLevel.value > 0) {
    currentLevel.value--;
    if (currentLevel.value === 0) {
      selectedCategory.value = null;
    } else if (currentLevel.value === 1) {
      selectedSubcategory.value = null;
    }
  }
};

const selectOption = (option: ComplaintOption) => {
  if (currentLevel.value === 0) {
    selectedCategory.value = option.label;
    if (option.children && option.children.length > 0) {
      currentLevel.value = 1;
    } else {
      submitComplaint(option.label);
    }
  } else if (currentLevel.value === 1) {
    selectedSubcategory.value = option.label;
    submitComplaint(option.label);
  }
};

// Отправка жалобы
const submitComplaint = async (reason: string) => {
  isLoading.value = true;

  const complaintTitle = `Жалоба на объявление #MS-${listing.id}: ${listing.title}`;
  const pageUrl = window.location.href;

  const complaintMessage = `
Категория: ${selectedCategory.value || reason}
${selectedSubcategory.value ? `Подкатегория: ${selectedSubcategory.value}` : ""}

--- Информация об объявлении ---
ID: #MS-${listing.id}
Заголовок: ${listing.title}
Цена: ${listing.price} ${listing.currency}
Продавец: ${listing.user?.first_name || ""} ${
    listing.user?.last_name || ""
  } (ID: ${listing.user_id})
Ссылка: ${pageUrl}

--- Дополнительная информация ---
Модель: ${listing.brand?.name || ""} ${listing.model?.name || ""}
Местоположение: ${listing.city?.name_ru || ""}, ${listing.region?.name_ru || ""}
Дата публикации: ${listing.published_at || "Не опубликовано"}
`.trim();

  try {
    await $api("/applications", {
      method: "POST",
      body: {
        type: "complaint",
        name: complaintTitle,
        email: "",
        phone: "",
        message: complaintMessage,
      },
    });

    ElMessage.success(
      "Жалоба успешно отправлена! Мы рассмотрим её в ближайшее время."
    );
    closeModal();
  } catch {
    ElMessage.error("Ошибка при отправке жалобы. Попробуйте позже.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="complaint-button-wrapper">
    <el-button text type="danger" size="small" :icon="Flag" @click="openModal">
      Пожаловаться
    </el-button>

    <!-- Модальное окно жалобы -->
    <Teleport to="body">
      <Transition name="complaint-overlay">
        <div v-if="visible" class="complaint-overlay" @click.self="closeModal">
          <Transition name="complaint-modal" mode="out-in">
            <div :key="currentLevel" class="complaint-modal">
              <!-- Заголовок -->
              <div class="complaint-header">
                <button
                  v-if="currentLevel > 0"
                  class="btn-back"
                  @click="goBack"
                >
                  <el-icon><ArrowLeft /></el-icon>
                </button>
                <h3 class="complaint-title">{{ currentTitle }}</h3>
                <button class="btn-close" @click="closeModal">
                  <el-icon><Close /></el-icon>
                </button>
              </div>

              <!-- Список опций -->
              <div class="complaint-options">
                <div v-if="isLoading" class="complaint-loading">
                  <el-icon class="is-loading"><ArrowRight /></el-icon>
                  <span>Отправка жалобы...</span>
                </div>

                <template v-else>
                  <button
                    v-for="option in currentOptions"
                    :key="option.label"
                    class="complaint-option"
                    @click="selectOption(option)"
                  >
                    <div class="option-content">
                      <span class="option-label">{{ option.label }}</span>
                      <span
                        v-if="option.description"
                        class="option-description"
                      >
                        {{ option.description }}
                      </span>
                    </div>
                    <el-icon class="option-arrow"><ArrowRight /></el-icon>
                  </button>
                </template>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.complaint-button-wrapper {
  display: inline-block;
}

// Оверлей
.complaint-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

// Модальное окно
.complaint-modal {
  background: var(--color-bg-primary);
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

// Заголовок
.complaint-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border-light);

  .btn-back,
  .btn-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: var(--color-bg-secondary);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--color-text-primary);

    .el-icon {
      font-size: 18px;
    }

    &:hover {
      background: var(--color-border-light);
    }
  }

  .btn-close {
    margin-left: auto;
  }
}

.complaint-title {
  flex: 1;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Список опций
.complaint-options {
  padding: 8px 0;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

.complaint-option {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  color: var(--color-text-primary);

  &:hover {
    background: var(--color-bg-secondary);
  }

  &:active {
    background: var(--color-border-light);
  }
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.option-description {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.option-arrow {
  font-size: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

// Загрузка
.complaint-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--color-text-secondary);

  .el-icon {
    font-size: 24px;
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
}

// Анимации
.complaint-overlay-enter-active,
.complaint-overlay-leave-active {
  transition: opacity 0.3s ease;
}

.complaint-overlay-enter-from,
.complaint-overlay-leave-to {
  opacity: 0;
}

.complaint-modal-enter-active,
.complaint-modal-leave-active {
  transition: all 0.25s ease;
}

.complaint-modal-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.complaint-modal-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
