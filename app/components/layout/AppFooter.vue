<script setup lang="ts">
import { Phone, Message, Location } from "@element-plus/icons-vue";
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- О компании -->
        <div class="footer-section footer-section--about">
          <h3 class="footer-logo">SmartMarket</h3>
          <p class="footer-description">
            Крупнейший маркетплейс смартфонов в Узбекистане. Покупайте и продавайте 
            новые и б/у телефоны безопасно и удобно.
          </p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Помощь -->
        <div class="footer-section">
          <h3>Помощь</h3>
          <ul class="footer-links">
            <li><a href="#">Как разместить объявление</a></li>
            <li><a href="#">Правила безопасности</a></li>
            <li><a href="#">Частые вопросы</a></li>
            <li><a href="#">Служба поддержки</a></li>
          </ul>
        </div>

        <!-- О сервисе -->
        <div class="footer-section">
          <h3>О сервисе</h3>
          <ul class="footer-links">
            <li><a href="#">О компании</a></li>
            <li><a href="#">Карьера</a></li>
            <li><a href="#">Блог</a></li>
            <li><a href="#">Партнерство</a></li>
          </ul>
        </div>

        <!-- Контакты -->
        <div class="footer-section">
          <h3>Контакты</h3>
          <ul class="footer-links contact-list">
            <li class="contact-item">
              <el-icon class="contact-icon"><Phone /></el-icon>
              <span>+998 71 123 45 67</span>
            </li>
            <li class="contact-item">
              <el-icon class="contact-icon"><Message /></el-icon>
              <span>info@smartmarket.uz</span>
            </li>
            <li class="contact-item">
              <el-icon class="contact-icon"><Location /></el-icon>
              <span>Ташкент, Узбекистан</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2025 SmartMarket. Все права защищены.</p>
        <div class="footer-links-inline">
          <a href="#">Пользовательское соглашение</a>
          <span class="divider">•</span>
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: var(--color-bg-dark);
  color: rgba(255, 255, 255, 0.7);
  padding: 64px 0 0;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section {
  h3 {
    color: var(--color-bg-primary);
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
    letter-spacing: 0.3px;
  }
}

.footer-section--about {
  .footer-logo {
    color: var(--color-bg-primary);
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  .footer-description {
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 24px;
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 12px;
  }

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      color: var(--color-bg-primary);
      transform: translateX(4px);
    }
  }
}

.contact-list {
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    margin-bottom: 16px;

    .contact-icon {
      font-size: 18px;
      color: var(--color-primary);
    }
  }
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  text-decoration: none;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: var(--color-primary);
    color: var(--color-bg-primary);
    transform: translateY(-3px);
  }
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);

  p {
    margin: 0;
  }
}

.footer-links-inline {
  display: flex;
  align-items: center;
  gap: 16px;

  a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--color-bg-primary);
    }
  }

  .divider {
    color: rgba(255, 255, 255, 0.3);
  }
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .footer-section--about {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 48px 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-bottom: 32px;
  }

  .footer-section--about {
    grid-column: 1;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-links-inline {
    flex-direction: column;
    gap: 8px;

    .divider {
      display: none;
    }
  }
}
</style>
