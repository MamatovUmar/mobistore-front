<script setup lang="ts">
import { Edit } from "@element-plus/icons-vue";
import { useRootStore } from "~/store/root";
import type { FormInstance, FormRules } from "element-plus";
import type { IUpdateProfilePayload } from "~/types/user";
import PhoneNumber from "~/components/form/PhoneNumber.vue";
import TelegramLink from "~/components/form/TelegramLink.vue";

const isEditingProfile = ref(false);
const profileFormRef = ref<FormInstance>();
const loading = ref(false);

const root = useRootStore();

const user = computed(() => root.user);

// Форма профиля
const profileForm = ref<IUpdateProfilePayload>({
  first_name: "",
  last_name: "",
  phone_number: "",
  telegram: "",
  show_contacts: true,
  language_code: "ru",
  region_id: undefined,
  city_id: undefined,
});

// Правила валидации
const profileRules = reactive<FormRules<IUpdateProfilePayload>>({
  first_name: [
    { required: true, message: "Введите имя", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "Длина должна быть от 2 до 50 символов",
      trigger: "blur",
    },
  ],
  last_name: [
    { required: true, message: "Введите фамилию", trigger: "blur" },
    {
      min: 2,
      max: 50,
      message: "Длина должна быть от 2 до 50 символов",
      trigger: "blur",
    },
  ],
  language_code: [
    { required: true, message: "Выберите язык", trigger: "change" },
  ],
});

// Инициализация формы данными пользователя
const initProfileForm = () => {
  if (user.value) {
    profileForm.value = {
      first_name: user.value.first_name || "",
      last_name: user.value.last_name || "",
      phone_number: user.value.phone_number || undefined,
      telegram: user.value.telegram || undefined,
      show_contacts: user.value.show_contacts ?? true,
      language_code: user.value.language_code || "ru",
      region_id: user.value.region_id || undefined,
      city_id: user.value.city_id || undefined,
    };
  }
};

// Открытие формы редактирования
const openEditMode = () => {
  initProfileForm();
  isEditingProfile.value = true;
};

// Отмена редактирования
const cancelEdit = () => {
  isEditingProfile.value = false;
  profileFormRef.value?.clearValidate();
};

// Сохранение профиля
const saveProfile = async () => {
  if (!profileFormRef.value) return;

  await profileFormRef.value.validate(async (valid) => {
    if (!valid) return;

    loading.value = true;
    await root.updateProfile(profileForm.value);
    loading.value = false;
    isEditingProfile.value = false;
  });
};

// Обработчик выбора региона
const handleRegionSelect = () => {
  // Сброс города при изменении региона
  profileForm.value.city_id = undefined;
};
</script>

<template>
  <main class="page-account">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Мой аккаунт</h1>
      </div>

      <div class="account-layout">
        <!-- Сайдбар с навигацией -->
        <AccountSidebar />

        <!-- Основной контент -->
        <div class="account-content">
          <!-- Личные данные -->
          <div class="profile-section">
            <div class="section-header">
              <h2 class="section-title">Личные данные</h2>
              <el-button
                v-if="!isEditingProfile"
                type="primary"
                :icon="Edit"
                @click="openEditMode"
              >
                Редактировать
              </el-button>
            </div>

            <div v-if="!isEditingProfile && user" class="profile-info">
              <div class="info-row">
                <span class="info-label">Имя:</span>
                <span class="info-value"
                  >{{ user.first_name }} {{ user.last_name }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Телефон:</span>
                <span class="info-value">{{
                  user.phone_number || "Не указан"
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Telegram:</span>
                <span class="info-value">
                  <TelegramAppear :value="user.telegram" />
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Регион:</span>
                <span class="info-value">{{
                  user.region?.name_ru || "Не указан"
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Город:</span>
                <span class="info-value">{{
                  user.city?.name_ru || "Не указан"
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Показывать контакты:</span>
                <span class="info-value">{{
                  user.show_contacts ? "Да" : "Нет"
                }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Язык:</span>
                <span class="info-value">{{
                  user.language_code === "ru" ? "Русский" : "O'zbekcha"
                }}</span>
              </div>
            </div>

            <el-form
              v-else
              ref="profileFormRef"
              :model="profileForm"
              :rules="profileRules"
              label-position="top"
              size="large"
            >
              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Имя" prop="first_name">
                    <el-input
                      v-model="profileForm.first_name"
                      placeholder="Введите имя"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Фамилия" prop="last_name">
                    <el-input
                      v-model="profileForm.last_name"
                      placeholder="Введите фамилию"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Email">
                    <el-input
                      :model-value="user?.email"
                      disabled
                      placeholder="Email"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Телефон" prop="phone_number">
                    <PhoneNumber
                      v-model="profileForm.phone_number"
                      placeholder="+998 90 123 45 67"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Telegram" prop="telegram">
                    <TelegramLink
                      v-model="profileForm.telegram"
                      placeholder="@username"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Язык" prop="language_code">
                    <el-select
                      v-model="profileForm.language_code"
                      placeholder="Выберите язык"
                    >
                      <el-option label="Русский" value="ru" />
                      <el-option label="O'zbekcha" value="uz" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Регион" prop="region_id">
                    <AutocompletesRegionAutocomplete
                      v-model="profileForm.region_id"
                      placeholder="Выберите регион"
                      @select="handleRegionSelect"
                    />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Город" prop="city_id">
                    <AutocompletesCityAutocomplete
                      v-model="profileForm.city_id"
                      :region-id="profileForm.region_id"
                      placeholder="Выберите город"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="Показывать контакты">
                <el-switch
                  v-model="profileForm.show_contacts"
                  active-text="Да"
                  inactive-text="Нет"
                />
              </el-form-item>

              <div class="form-actions">
                <el-button :disabled="loading" @click="cancelEdit">
                  Отмена
                </el-button>
                <el-button
                  type="primary"
                  :loading="loading"
                  @click="saveProfile"
                >
                  Сохранить
                </el-button>
              </div>
            </el-form>
          </div>

          <!-- Смена пароля -->
          <AccountChangePassword />
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-account {
  min-height: 60vh;
  padding: 40px 0;

  @media (max-width: 768px) {
    padding: 20px 0;
  }

  .page-header {
    margin-bottom: 32px;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  .account-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 24px;
    align-items: start;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  /* === КОНТЕНТ === */
  .account-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* === СЕКЦИИ === */
  .profile-section {
    background: var(--color-bg-primary);
    border-radius: 12px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
      padding: 20px;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    @media (max-width: 640px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text-primary);
  }

  /* === ИНФОРМАЦИЯ О ПРОФИЛЕ === */
  .profile-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info-row {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--color-border-light);

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 640px) {
      flex-direction: column;
      gap: 4px;
    }
  }

  .info-label {
    font-weight: 600;
    color: var(--color-text-secondary);
    min-width: 140px;

    @media (max-width: 640px) {
      min-width: auto;
    }
  }

  .info-value {
    color: var(--color-text-primary);
    flex: 1;
  }

  /* === ФОРМА === */
  .form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;

    @media (max-width: 640px) {
      flex-direction: column;

      .el-button {
        width: 100%;
      }
    }
  }
}
</style>
