<script setup lang="ts">
import { Edit, Lock } from "@element-plus/icons-vue";

definePageMeta({
  layout: false,
});

const isEditingProfile = ref(false);
const isChangingPassword = ref(false);
</script>

<template>
  <div>
    <NuxtLayout name="default">
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
                    @click="isEditingProfile = true"
                  >
                    Редактировать
                  </el-button>
                </div>

                <div v-if="!isEditingProfile" class="profile-info">
                  <div class="info-row">
                    <span class="info-label">Имя:</span>
                    <span class="info-value">Иван Иванов</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">ivan@example.com</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Телефон:</span>
                    <span class="info-value">+998 90 123 45 67</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Telegram:</span>
                    <span class="info-value">@ivan_ivanov</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Регион:</span>
                    <span class="info-value">Toshkent</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Город:</span>
                    <span class="info-value">Toshkent</span>
                  </div>
                </div>

                <el-form v-else label-position="top" size="large">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="Имя">
                        <el-input placeholder="Введите имя" value="Иван Иванов" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Email">
                        <el-input placeholder="Введите email" value="ivan@example.com" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="Телефон">
                        <el-input placeholder="Введите телефон" value="+998 90 123 45 67" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Telegram">
                        <el-input placeholder="Введите Telegram" value="@ivan_ivanov" />
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="Регион">
                        <el-select placeholder="Выберите регион" model-value="toshkent">
                          <el-option label="Toshkent" value="toshkent" />
                          <el-option label="Samarqand" value="samarqand" />
                          <el-option label="Bukhara" value="bukhara" />
                          <el-option label="Fergana" value="fergana" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="Город">
                        <el-select placeholder="Выберите город" model-value="toshkent">
                          <el-option label="Toshkent" value="toshkent" />
                          <el-option label="Samarqand" value="samarqand" />
                          <el-option label="Bukhara" value="bukhara" />
                          <el-option label="Fergana" value="fergana" />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <div class="form-actions">
                    <el-button @click="isEditingProfile = false">Отмена</el-button>
                    <el-button type="primary" @click="isEditingProfile = false">
                      Сохранить
                    </el-button>
                  </div>
                </el-form>
              </div>

              <!-- Смена пароля -->
              <div class="profile-section">
                <div class="section-header">
                  <h2 class="section-title">Безопасность</h2>
                  <el-button
                    v-if="!isChangingPassword"
                    type="default"
                    :icon="Lock"
                    @click="isChangingPassword = true"
                  >
                    Изменить пароль
                  </el-button>
                </div>

                <div v-if="!isChangingPassword" class="password-placeholder">
                  <p class="placeholder-text">
                    Для изменения пароля нажмите кнопку "Изменить пароль"
                  </p>
                </div>

                <el-form v-else label-position="top" size="large">
                  <el-form-item label="Текущий пароль">
                    <el-input
                      type="password"
                      placeholder="Введите текущий пароль"
                      show-password
                    />
                  </el-form-item>

                  <el-form-item label="Новый пароль">
                    <el-input
                      type="password"
                      placeholder="Введите новый пароль"
                      show-password
                    />
                  </el-form-item>

                  <el-form-item label="Подтвердите новый пароль">
                    <el-input
                      type="password"
                      placeholder="Повторите новый пароль"
                      show-password
                    />
                  </el-form-item>

                  <div class="form-actions">
                    <el-button @click="isChangingPassword = false">Отмена</el-button>
                    <el-button type="primary" @click="isChangingPassword = false">
                      Сохранить пароль
                    </el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>
.page-account {
  min-height: 60vh;
  padding: 40px 0;

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

  /* === PLACEHOLDER ПАРОЛЯ === */
  .password-placeholder {
    padding: 32px;
    text-align: center;
    background: var(--color-bg-secondary);
    border-radius: 8px;
  }

  .placeholder-text {
    color: var(--color-text-secondary);
    font-size: 15px;
  }
}
</style>
