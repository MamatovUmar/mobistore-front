<script setup lang="ts">
import { Phone, Message, Location } from "@element-plus/icons-vue";
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- Brand & Socials -->
        <div class="footer-column brand-column">
          <h3 class="footer-logo">SmartMarket</h3>
          <p class="footer-description">
            Крупнейшая экосистема для покупки и продажи гаджетов в Узбекистане.
            Безопасность, скорость и комфорт в каждой сделке.
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

        <!-- Help Links -->
        <div class="footer-column">
          <h4>Помощь</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/rules">Правила безопасности</NuxtLink></li>
            <li><NuxtLink to="/faq">Частые вопросы</NuxtLink></li>
            <li><NuxtLink to="/support">Служба поддержки</NuxtLink></li>
          </ul>
        </div>

        <!-- Contacts -->
        <div class="footer-column">
          <h4>Контакты</h4>
          <ul class="contact-list">
            <li>
              <el-icon><Phone /></el-icon>
              <span>+998 71 123 45 67</span>
            </li>
            <li>
              <el-icon><Message /></el-icon>
              <span>info@smartmarket.uz</span>
            </li>
            <li>
              <el-icon><Location /></el-icon>
              <span>Ташкент, Узбекистан</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-divider"></div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p>&copy; 2025 SmartMarket. Все права защищены.</p>
        <div class="legal-links">
          <a href="#">Пользовательское соглашение</a>
          <a href="#">Политика конфиденциальности</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: #020617; /* Deep Slate */
  color: #94a3b8;
  padding: 80px 0 0;
  position: relative;
  overflow: hidden;
}

.footer-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 400px;
  background: radial-gradient(circle at bottom, rgba(56, 189, 248, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1.2fr;
  gap: 60px;
  margin-bottom: 60px;
}

.footer-column {
  h4 {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 24px;
  }
}

.brand-column {
  max-width: 400px;
}

.footer-logo {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.footer-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-icon {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    background: #3b82f6;
    border-color: #3b82f6;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
  }
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 16px;
  }

  a {
    color: #94a3b8;
    text-decoration: none;
    transition: all 0.3s ease;
    display: inline-block;

    &:hover {
      color: #3b82f6;
      transform: translateX(4px);
    }
  }
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #94a3b8;
    margin-bottom: 16px;

    .el-icon {
      color: #3b82f6;
      font-size: 18px;
    }
  }
}

.footer-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0;
}

.footer-bottom {
  padding: 32px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.legal-links {
  display: flex;
  gap: 24px;

  a {
    color: #64748b;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #fff;
    }
  }
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }

  .brand-column {
    grid-column: span 2;
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 60px 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .brand-column {
    grid-column: 1;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .legal-links {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
