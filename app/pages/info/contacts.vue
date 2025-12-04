<script setup lang="ts">
import { Phone } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";

const { $api } = useNuxtApp();

const formRef = ref<FormInstance>();

const feedbackForm = ref({
  name: "",
  email: "",
  phone: "",
  type: "",
  message: "",
});

const rules: FormRules = {
  name: [{ required: true, message: "Введите ваше имя", trigger: "blur" }],
  type: [
    { required: true, message: "Выберите тему обращения", trigger: "change" },
  ],
  message: [{ required: true, message: "Введите сообщение", trigger: "blur" }],
};

const isLoading = ref(false);

const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    isLoading.value = true;
    try {
      await $api("/applications", {
        method: "POST",
        body: {
          type: feedbackForm.value.type,
          name: feedbackForm.value.name,
          email: feedbackForm.value.email,
          phone: feedbackForm.value.phone,
          message: feedbackForm.value.message,
        },
      });

      ElMessage.success("Сообщение успешно отправлено!");
      formRef.value?.resetFields();
    } catch {
      ElMessage.error("Ошибка при отправке сообщения");
    } finally {
      isLoading.value = false;
    }
  });
};
</script>

<template>
  <main class="page-contacts">
    <div class="container">
      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">Контакты</h1>
        <p class="page-subtitle">
          Свяжитесь с нами любым удобным способом или заполните форму обратной
          связи
        </p>
      </div>

      <!-- Основной контент -->
      <div class="contacts-layout">
        <!-- Контактная информация -->
        <div class="contact-info">
          <div class="info-card">
            <div class="card-header">
              <h2 class="info-title">Наши контакты</h2>
              <p class="info-description">
                Мы всегда рады помочь вам. Свяжитесь с нами удобным способом
              </p>
            </div>

            <div class="support-highlight">
              <div class="support-status">
                <span class="status-dot" />
                Служба поддержки онлайн
              </div>
              <div class="support-main">
                <el-icon><Phone /></el-icon>
                <a href="tel:+998901234567" class="support-phone">
                  +998 90 123 45 67
                </a>
              </div>
              <p class="support-note">
                Работаем ежедневно с 09:00 до 23:00 (GMT+5). В среднем отвечаем
                за 5 минут.
              </p>
              <div class="support-actions">
                <a href="tel:+998901234567" class="support-action phone">
                  Позвонить сейчас
                </a>
                <a
                  href="mailto:support@smartmarket.uz"
                  class="support-action email"
                >
                  Написать на почту
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Форма обратной связи -->
        <div class="feedback-form">
          <div class="form-card">
            <h2 class="form-title">Форма обратной связи</h2>
            <p class="form-description">
              Заполните форму ниже, и мы свяжемся с вами в ближайшее время
            </p>

            <el-form
              ref="formRef"
              :model="feedbackForm"
              :rules="rules"
              label-position="top"
              size="large"
              @submit.prevent="submitForm"
            >
              <el-form-item label="Ваше имя" prop="name">
                <el-input
                  v-model="feedbackForm.name"
                  placeholder="Введите ваше имя"
                />
              </el-form-item>

              <el-form-item label="Email">
                <el-input
                  v-model="feedbackForm.email"
                  type="email"
                  placeholder="example@mail.com"
                />
              </el-form-item>

              <el-form-item label="Телефон">
                <el-input
                  v-model="feedbackForm.phone"
                  placeholder="+998 90 123 45 67"
                />
              </el-form-item>

              <el-form-item label="Тема обращения" prop="type">
                <el-select
                  v-model="feedbackForm.type"
                  placeholder="Выберите тему"
                >
                  <el-option label="Общий вопрос" value="question" />
                  <el-option label="Техническая поддержка" value="technical" />
                  <el-option
                    label="Предложение о сотрудничестве"
                    value="partnership"
                  />
                  <el-option label="Жалоба" value="complaint" />
                  <el-option label="Другое" value="other" />
                </el-select>
              </el-form-item>

              <el-form-item label="Сообщение" prop="message">
                <el-input
                  v-model="feedbackForm.message"
                  type="textarea"
                  :rows="6"
                  placeholder="Опишите вашу проблему или вопрос"
                />
              </el-form-item>

              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="isLoading"
                @click="submitForm"
              >
                Отправить сообщение
              </el-button>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.page-contacts {
  min-height: 60vh;
  padding: 40px 0 80px;
  background: var(--color-bg-secondary);

  .page-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 12px;
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }

  /* === LAYOUT === */
  .contacts-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-bottom: 48px;

    @media (max-width: 968px) {
      grid-template-columns: 1fr;
      gap: 24px;
    }
  }

  /* === КОНТАКТНАЯ ИНФОРМАЦИЯ === */
  .contact-info {
    .info-card {
      background: var(--color-bg-primary);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

      @media (max-width: 768px) {
        padding: 20px;
      }
    }
  }

  .card-header {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--color-bg-secondary);
  }

  .info-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  .info-description {
    font-size: 14px;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .support-highlight {
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.08) 0%,
      rgba(5, 105, 77, 0.08) 100%
    );
    border-radius: 16px;
    padding: 24px;
    border: 1px solid rgba(16, 185, 129, 0.2);
    margin-bottom: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .support-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #047857;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.2);
        display: inline-block;
      }
    }

    .support-main {
      display: flex;
      align-items: center;
      gap: 16px;

      .el-icon {
        font-size: 32px;
        color: #047857;
      }

      .support-phone {
        font-size: 32px;
        font-weight: 700;
        color: var(--color-text-primary);
        text-decoration: none;
      }
    }

    .support-note {
      margin: 0;
      font-size: 14px;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    .support-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;

      .support-action {
        flex: 1;
        min-width: 160px;
        text-align: center;
        padding: 12px 16px;
        border-radius: 10px;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.2s, box-shadow 0.2s;

        &.phone {
          background: #047857;
          color: white;
          box-shadow: 0 10px 20px rgba(4, 120, 87, 0.25);
        }

        &.email {
          background: white;
          color: #047857;
          border: 1px solid rgba(4, 120, 87, 0.2);
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(4, 120, 87, 0.2);
        }
      }
    }
  }

  .info-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: var(--color-bg-secondary);
    border-radius: 12px;
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
  }

  /* === ФОРМА ОБРАТНОЙ СВЯЗИ === */
  .feedback-form {
    .form-card {
      background: var(--color-bg-primary);
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      position: sticky;
      top: 80px;

      @media (max-width: 968px) {
        position: static;
      }
    }
  }

  .form-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  .form-description {
    font-size: 15px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }
}
</style>
