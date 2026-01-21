<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";

const { t } = useI18n();
const { $api } = useNuxtApp();

useSeoMeta({
  title: () => t("contacts.seo.title"),
  description: () => t("contacts.seo.description"),
  ogTitle: () => t("contacts.seo.ogTitle"),
  ogDescription: () => t("contacts.seo.ogDescription"),
});

const formRef = ref<FormInstance>();

const feedbackForm = ref({
  name: "",
  email: "",
  phone: "",
  type: "",
  message: "",
});

const rules = computed<FormRules>(() => ({
  name: [{ required: true, message: t("contacts.validation.name"), trigger: "blur" }],
  type: [{ required: true, message: t("contacts.validation.topic"), trigger: "change" }],
  message: [
    { required: true, message: t("contacts.validation.message"), trigger: "blur" },
    { min: 10, message: t("contacts.validation.messageMin"), trigger: "blur" },
  ],
}));

const isLoading = ref(false);

function reset() {
  formRef.value?.resetFields();
  feedbackForm.value.email = "";
  feedbackForm.value.phone = "";
}

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

      ElMessage.success(t("contacts.messages.success"));
      reset();
    } catch {
      ElMessage.error(t("contacts.messages.error"));
    } finally {
      isLoading.value = false;
    }
  });
};
</script>

<template>
  <main class="page-contacts">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ t("contacts.title") }}</h1>
        <p class="page-subtitle">{{ t("contacts.subtitle") }}</p>
      </div>

      <div class="contacts-layout">
        <div class="feedback-form">
          <div class="form-card">
            <h2 class="form-title">{{ t("contacts.form.title") }}</h2>
            <p class="form-description">{{ t("contacts.form.description") }}</p>

            <el-form
              ref="formRef"
              :model="feedbackForm"
              :rules="rules"
              label-position="top"
              size="large"
              @submit.prevent="submitForm"
            >
              <el-form-item :label="t('contacts.form.name')" prop="name">
                <el-input
                  v-model="feedbackForm.name"
                  :placeholder="t('contacts.form.namePlaceholder')"
                />
              </el-form-item>

              <el-form-item :label="t('contacts.form.email')">
                <el-input
                  v-model="feedbackForm.email"
                  type="email"
                  :placeholder="t('contacts.form.emailPlaceholder')"
                />
              </el-form-item>

              <el-form-item :label="t('contacts.form.phone')">
                <el-input
                  v-model="feedbackForm.phone"
                  :placeholder="t('contacts.form.phonePlaceholder')"
                />
              </el-form-item>

              <el-form-item :label="t('contacts.form.topic')" prop="type">
                <el-select
                  v-model="feedbackForm.type"
                  :placeholder="t('contacts.form.topicPlaceholder')"
                >
                  <el-option :label="t('contacts.form.topics.question')" value="question" />
                  <el-option :label="t('contacts.form.topics.technical')" value="technical" />
                  <el-option :label="t('contacts.form.topics.partnership')" value="partnership" />
                  <el-option :label="t('contacts.form.topics.complaint')" value="complaint" />
                  <el-option :label="t('contacts.form.topics.other')" value="other" />
                </el-select>
              </el-form-item>

              <el-form-item :label="t('contacts.form.message')" prop="message">
                <el-input
                  v-model="feedbackForm.message"
                  type="textarea"
                  :rows="6"
                  :minlength="10"
                  :placeholder="t('contacts.form.messagePlaceholder')"
                />
              </el-form-item>

              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :loading="isLoading"
                @click="submitForm"
              >
                {{ t("contacts.form.submit") }}
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

  @media (max-width: 768px) {
    padding: 24px 0 60px;
  }

  @media (max-width: 480px) {
    padding: 16px 0 40px;
  }

  .page-header {
    text-align: center;
    margin-bottom: 48px;

    @media (max-width: 768px) {
      margin-bottom: 32px;
    }

    @media (max-width: 480px) {
      margin-bottom: 24px;
    }
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 12px;

    @media (max-width: 768px) {
      font-size: 28px;
    }

    @media (max-width: 480px) {
      font-size: 24px;
      margin-bottom: 8px;
    }
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--color-text-secondary);
    max-width: 600px;
    margin: 0 auto;

    @media (max-width: 480px) {
      font-size: 14px;
      padding: 0 16px;
    }
  }

  /* === LAYOUT === */
  .contacts-layout {
    display: flex;
    justify-content: center;
    margin-bottom: 48px;

    @media (max-width: 968px) {
      margin-bottom: 32px;
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

      @media (max-width: 768px) {
        padding: 24px;
        border-radius: 12px;
      }

      @media (max-width: 480px) {
        padding: 20px 16px;
      }
    }
  }

  .form-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 22px;
    }

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }

  .form-description {
    font-size: 15px;
    color: var(--color-text-secondary);
    margin-bottom: 24px;

    @media (max-width: 480px) {
      font-size: 14px;
      margin-bottom: 20px;
    }
  }
}
</style>
