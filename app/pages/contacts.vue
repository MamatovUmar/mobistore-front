<script setup lang="ts">
import { Phone, Message } from "@element-plus/icons-vue";

definePageMeta({
  layout: false,
});

// Форма обратной связи
const feedbackForm = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <main class="page-contacts">
        <div class="container">
          <!-- Заголовок -->
          <div class="page-header">
            <h1 class="page-title">Контакты</h1>
            <p class="page-subtitle">
              Свяжитесь с нами любым удобным способом или заполните форму обратной связи
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

                <div class="info-list">
                  <!-- Телефон -->
                  <div class="info-item">
                    <div class="info-icon phone">
                      <el-icon><Phone /></el-icon>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">Телефоны</h3>
                      <div class="contact-links">
                        <div class="contact-link-item">
                          <span class="link-label">Горячая линия:</span>
                          <a href="tel:+998901234567" class="contact-link">+998 90 123 45 67</a>
                        </div>
                        <div class="contact-link-item">
                          <span class="link-label">Поддержка:</span>
                          <a href="tel:+998901234568" class="contact-link">+998 90 123 45 68</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="info-item">
                    <div class="info-icon email">
                      <el-icon><Message /></el-icon>
                    </div>
                    <div class="info-content">
                      <h3 class="info-label">Email</h3>
                      <div class="contact-links">
                        <div class="contact-link-item">
                          <span class="link-label">Общие вопросы:</span>
                          <a href="mailto:info@smartmarket.uz" class="contact-link">info@smartmarket.uz</a>
                        </div>
                        <div class="contact-link-item">
                          <span class="link-label">Поддержка:</span>
                          <a href="mailto:support@smartmarket.uz" class="contact-link">support@smartmarket.uz</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Социальные сети -->
                <div class="social-section">
                  <h3 class="social-title">Присоединяйтесь к нам</h3>
                  <div class="social-links">
                    <a href="#" class="social-link telegram" title="Telegram">
                      <span class="social-name">Telegram</span>
                    </a>
                    <a href="#" class="social-link instagram" title="Instagram">
                      <span class="social-name">Instagram</span>
                    </a>
                    <a href="#" class="social-link facebook" title="Facebook">
                      <span class="social-name">Facebook</span>
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

                <el-form :model="feedbackForm" label-position="top" size="large">
                  <el-form-item label="Ваше имя">
                    <el-input v-model="feedbackForm.name" placeholder="Введите ваше имя" />
                  </el-form-item>

                  <el-form-item label="Email">
                    <el-input
                      v-model="feedbackForm.email"
                      type="email"
                      placeholder="example@mail.com"
                    />
                  </el-form-item>

                  <el-form-item label="Тема обращения">
                    <el-select
                      v-model="feedbackForm.subject"
                      placeholder="Выберите тему"
                    >
                      <el-option label="Общий вопрос" value="general" />
                      <el-option label="Техническая поддержка" value="support" />
                      <el-option label="Вопрос по объявлению" value="listing" />
                      <el-option label="Предложение о сотрудничестве" value="partnership" />
                      <el-option label="Жалоба" value="complaint" />
                      <el-option label="Другое" value="other" />
                    </el-select>
                  </el-form-item>

                  <el-form-item label="Сообщение">
                    <el-input
                      v-model="feedbackForm.message"
                      type="textarea"
                      :rows="6"
                      placeholder="Опишите вашу проблему или вопрос"
                    />
                  </el-form-item>

                  <el-button type="primary" size="large" style="width: 100%">
                    Отправить сообщение
                  </el-button>
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

  .info-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 24px;
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

  .info-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
    }

    .el-icon {
      font-size: 22px;
      color: white;
      position: relative;
      z-index: 1;
    }

    &.phone {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    &.email {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
  }

  .info-content {
    flex: 1;
  }

  .info-label {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 10px;
  }

  .contact-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-link-item {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .link-label {
    font-size: 13px;
    color: var(--color-text-secondary);
    min-width: 120px;
  }

  .contact-link {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    background: rgba(59, 130, 246, 0.1);
    transition: all 0.2s;

    &:hover {
      background: var(--color-primary);
      color: white;
      transform: translateX(4px);
    }
  }

  /* === СОЦИАЛЬНЫЕ СЕТИ === */
  .social-section {
    padding-top: 24px;
    margin-top: 24px;
    border-top: 2px solid var(--color-bg-secondary);
  }

  .social-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 16px;
  }

  .social-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover::before {
      opacity: 1;
    }

    .social-name {
      font-size: 13px;
      font-weight: 600;
    }

    &.telegram {
      background: #0088cc;
      color: white;

      &:hover {
        background: #006699;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 136, 204, 0.4);
      }
    }

    &.instagram {
      background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(220, 39, 67, 0.4);
      }
    }

    &.facebook {
      background: #1877f2;
      color: white;

      &:hover {
        background: #145dbf;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(24, 119, 242, 0.4);
      }
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
