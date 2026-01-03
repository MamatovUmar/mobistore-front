<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { IModelCreatePayload } from "@/types/model";
import { useAdminBrands } from "@/composables/useAdminBrands";

const props = defineProps<{
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", data: IModelCreatePayload): void;
  (e: "cancel"): void;
}>();

const formRef = ref<FormInstance>();

// Brands for select
const brandSelect = useAdminBrands();
brandSelect.limit.value = 50;

onMounted(() => {
  brandSelect.fetchBrands();
});

const remoteMethod = (query: string) => {
  brandSelect.filters.value.search = query;
  brandSelect.fetchBrands();
};

// Form data
const formData = ref({
  name: "",
  brand_id: undefined as number | undefined,
  alias: "",
  image_url: "",
  colors: [] as string[],
  battery: "{}",
  platform: "{}",
  network: "{}",
  display: "{}",
  memory: "{}",
  cameras: "{}",
  body: "{}",
  sound: "{}",
  comms: "{}",
  features: "{}",
  launch: "{}",
});

// Validation rules
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "Введите название модели", trigger: "blur" },
  ],
  brand_id: [{ required: true, message: "Выберите бренд", trigger: "change" }],
});

// JSON validation
const validateJSON = (field: string, value: string): boolean => {
  if (!value || value.trim() === "") {
    (formData.value[field as keyof typeof formData.value] as any) = "{}";
    return true;
  }
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    ElMessage.error(`Ошибка в поле ${field}: неверный JSON формат`);
    return false;
  }
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid) => {
    if (!valid) {
      ElMessage.error("Проверьте правильность заполнения полей");
      return;
    }

    // Validate all JSON fields
    const jsonFields = [
      "battery",
      "platform",
      "network",
      "display",
      "memory",
      "cameras",
      "body",
      "sound",
      "comms",
      "features",
      "launch",
    ];
    for (const field of jsonFields) {
      const value = formData.value[
        field as keyof typeof formData.value
      ] as string;
      if (!validateJSON(field, value)) {
        return;
      }
    }

    // Parse JSON fields and create payload
    try {
      const payload: IModelCreatePayload = {
        name: formData.value.name,
        brand_id: formData.value.brand_id!,
        alias: formData.value.alias || undefined,
        image_url: formData.value.image_url || undefined,
        colors: formData.value.colors,
        battery: formData.value.battery
          ? JSON.parse(formData.value.battery)
          : undefined,
        platform: formData.value.platform
          ? JSON.parse(formData.value.platform)
          : undefined,
        network: formData.value.network
          ? JSON.parse(formData.value.network)
          : undefined,
        display: formData.value.display
          ? JSON.parse(formData.value.display)
          : undefined,
        memory: formData.value.memory
          ? JSON.parse(formData.value.memory)
          : undefined,
        cameras: formData.value.cameras
          ? JSON.parse(formData.value.cameras)
          : undefined,
        body: formData.value.body ? JSON.parse(formData.value.body) : undefined,
        sound: formData.value.sound
          ? JSON.parse(formData.value.sound)
          : undefined,
        comms: formData.value.comms
          ? JSON.parse(formData.value.comms)
          : undefined,
        features: formData.value.features
          ? JSON.parse(formData.value.features)
          : undefined,
        launch: formData.value.launch
          ? JSON.parse(formData.value.launch)
          : undefined,
      };

      emit("submit", payload);
    } catch (e: any) {
      ElMessage.error("Ошибка парсинга JSON: " + e.message);
    }
  });
};

// Format JSON on blur
const formatJSON = (field: keyof typeof formData.value) => {
  const value = formData.value[field] as string;
  if (!value || value.trim() === "") return;

  try {
    const parsed = JSON.parse(value);
    (formData.value[field] as any) = JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Invalid JSON, leave as is
  }
};
</script>

<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="140px"
    label-position="top"
    v-loading="loading"
    class="model-create-form"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="Название" prop="name">
          <el-input v-model="formData.name" placeholder="iPhone 15 Pro Max" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="Бренд" prop="brand_id">
          <el-select
            v-model="formData.brand_id"
            filterable
            remote
            placeholder="Выберите бренд"
            :remote-method="remoteMethod"
            :loading="brandSelect.loading.value"
            style="width: 100%"
          >
            <el-option
              v-for="item in brandSelect.brands.value"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="Alias (slug)" prop="alias">
          <el-input v-model="formData.alias" placeholder="iphone-15-pro-max" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="URL главного изображения" prop="image_url">
          <el-input
            v-model="formData.image_url"
            placeholder="/uploads/model/image.png"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="Цвета" prop="colors">
      <el-select
        v-model="formData.colors"
        multiple
        filterable
        allow-create
        default-first-option
        :reserve-keyword="false"
        placeholder="Введите цвета и нажмите Enter"
        style="width: 100%"
      />
      <div class="help-text">
        Введите название цвета и нажмите Enter для добавления
      </div>
    </el-form-item>

    <el-divider content-position="left">Спецификации (JSON)</el-divider>
    <div class="help-text" style="margin-bottom: 16px">
      Введите данные в формате JSON. При потере фокуса JSON автоматически
      отформатируется.
    </div>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="🔋 Структура батареи (нажмите для примера)"
        name="battery-example"
      >
        <pre class="json-example">
{
  "type": "Li-Ion 4832 mAh - Nano SIM model",
  "charging": [
    "Wired, PD2.0, 50% in 20 min",
    "25W wireless MagSafe/Qi2, 50% in 30 min",
    "4.5W reverse wired"
  ]
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Батарея">
      <el-input
        v-model="formData.battery"
        type="textarea"
        :rows="4"
        placeholder='{"type": "Li-Ion 4832 mAh - Nano SIM modelLi-Ion 5088 mAh - eSIM only model", "charging": ["Wired, PD2.0, 50% in 20 min", "25W wireless MagSafe/Qi2, 50% in 30 min (15W - China)", "4.5W reverse wired"]}'
        @blur="formatJSON('battery')"
      />
      <div class="help-text">
        <strong>Поля:</strong> type, charging (массив)
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="⚙️ Структура платформы (нажмите для примера)"
        name="platform-example"
      >
        <pre class="json-example">
{
  "os": "iOS 26",
  "chipset": "Apple A19 Pro (3 nm)",
  "cpu": "Hexa-core (2x4.26 GHz + 4xX.X GHz)",
  "gpu": "Apple GPU (6-core graphics)"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Платформа">
      <el-input
        v-model="formData.platform"
        type="textarea"
        :rows="4"
        placeholder='{"os": "iOS 26", "chipset": "Apple A19 Pro (3 nm)", "cpu": "Hexa-core (2x4.26 GHz + 4xX.X GHz)", "gpu": "Apple GPU (6-core graphics)"}'
        @blur="formatJSON('platform')"
      />
      <div class="help-text"><strong>Поля:</strong> os, chipset, cpu, gpu</div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📡 Структура сети (нажмите для примера)"
        name="network-example"
      >
        <pre class="json-example">
{
  "technology": "GSM / CDMA / HSPA / EVDO / LTE / 5G",
  "2g": "GSM 850 / 900 / 1800 / 1900",
  "3g": "HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100",
  "4g": "1, 2, 3, 4, 5, 7, 8, 12, 13, 17, 18, 19, 20, 25, 26, 28, 30, 32, 34, 38, 39, 40, 41, 42, 48, 53, 66",
  "5g": "1, 2, 3, 5, 7, 8, 12, 20, 25, 26, 28, 30, 38, 40, 41, 48, 53, 66, 70, 75, 77, 78, 79 SA/NSA/Sub6",
  "speed": "HSPA, LTE, 5G, EV-DO Rev.A 3.1 Mbps"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Сеть">
      <el-input
        v-model="formData.network"
        type="textarea"
        :rows="4"
        placeholder='{"technology": "GSM / CDMA / HSPA / EVDO / LTE / 5G", "2g": "GSM 850 / 900 / 1800 / 1900", "3g": "HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100", "4g": "1, 2, 3, 4, 5, 7, 8, 12, 13, 17, 18, 19, 20, 25, 26, 28, 30, 32, 34, 38, 39, 40, 41, 42, 48, 53, 66", "5g": "1, 2, 3, 5, 7, 8, 12, 20, 25, 26, 28, 30, 38, 40, 41, 48, 53, 66, 70, 75, 77, 78, 79 SA/NSA/Sub6", "speed": "HSPA, LTE, 5G, EV-DO Rev.A 3.1 Mbps"}'
        @blur="formatJSON('network')"
      />
      <div class="help-text">
        <strong>Поля:</strong> technology, 2g, 3g, 4g, 5g, speed
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📱 Структура экрана (нажмите для примера)"
        name="display-example"
      >
        <pre class="json-example">
{
  "type": "LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 1600 nits (HBM), 3000 nits (peak)",
  "size": "6.9 inches, 115.6 cm2 (~90.7% screen-to-body ratio)",
  "resolution": "1320 x 2868 pixels, 19.5:9 ratio (~460 ppi density)",
  "protection": "Ceramic Shield 2, Mohs level 5"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Экран">
      <el-input
        v-model="formData.display"
        type="textarea"
        :rows="4"
        placeholder='{"type": "LTPO Super Retina XDR OLED, 120Hz, HDR10, Dolby Vision, 1000 nits (typ), 1600 nits (HBM), 3000 nits (peak)", "size": "6.9 inches, 115.6 cm2 (~90.7% screen-to-body ratio)", "resolution": "1320 x 2868 pixels, 19.5:9 ratio (~460 ppi density)", "protection": "Ceramic Shield 2, Mohs level 5"}'
        @blur="formatJSON('display')"
      />
      <div class="help-text">
        <strong>Поля:</strong> type, size, resolution, protection
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="💾 Структура памяти (нажмите для примера)"
        name="memory-example"
      >
        <pre class="json-example">
{
  "internal": "256GB 12GB RAM, 512GB 12GB RAM, 1TB 12GB RAM, 2TB 12GB RAM",
  "cardSlot": "No"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Память">
      <el-input
        v-model="formData.memory"
        type="textarea"
        :rows="3"
        placeholder='{"internal": "256GB 12GB RAM, 512GB 12GB RAM, 1TB 12GB RAM, 2TB 12GB RAM", "cardSlot": "No"}'
        @blur="formatJSON('memory')"
      />
      <div class="help-text"><strong>Поля:</strong> internal, cardSlot</div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📸 Структура камер (нажмите для примера)"
        name="camera-example"
      >
        <pre class="json-example">
{
  "mainCamera": {
    "type": "triple",
    "cameraSpecs": [
      "48 MP, f/1.6, 24mm (wide), PDAF, OIS",
      "48 MP, f/2.8, 100mm (periscope telephoto), 4x optical zoom",
      "48 MP, f/2.2, 13mm, 120˚ (ultrawide)"
    ],
    "features": ["Dual-LED flash", "HDR (photo/panorama)"],
    "video": ["4K@60fps", "1080p@240fps", "Dolby Vision HDR"]
  },
  "selfieCamera": {
    "type": "single",
    "cameraSpecs": ["18 MP, f/1.9, (wide), PDAF, OIS"],
    "features": ["HDR", "Dolby Vision HDR"],
    "video": ["4K@60fps", "1080p@120fps"]
  }
}</pre
        >
        <div class="help-text" style="margin-top: 8px">
          Или упрощенный вариант: {"main": "48 MP", "ultrawide": "12 MP",
          "telephoto": "12 MP"}
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Камеры">
      <el-input
        v-model="formData.cameras"
        type="textarea"
        :rows="6"
        placeholder='{"mainCamera": {"type": "triple", "cameraSpecs": ["48 MP, f/1.6"], "features": ["LED flash"], "video": ["4K@60fps"]}}'
        @blur="formatJSON('cameras')"
      />
      <div class="help-text">
        <strong>Простой формат:</strong> {"main": "48 MP", "ultrawide": "12
        MP"}<br />
        <strong>Полный формат:</strong> mainCamera и selfieCamera с полями type,
        cameraSpecs, features, video
      </div>
    </el-form-item>

    <el-divider content-position="left">
      Дополнительные характеристики (опционально)
    </el-divider>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📐 Структура корпуса (нажмите для примера)"
        name="body-example"
      >
        <pre class="json-example">
{
  "dimensions": "163.4 x 78 x 8.8 mm (6.43 x 3.07 x 0.35 in)",
  "weight": "233 g (8.22 oz)",
  "build": "Glass front (Ceramic Shield 2), aluminum alloy frame",
  "sim": "Nano-SIM + eSIM + eSIM (max 2 at a time)"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Корпус">
      <el-input
        v-model="formData.body"
        type="textarea"
        :rows="3"
        placeholder='{"dimensions": "163.4 x 78 x 8.8 mm (6.43 x 3.07 x 0.35 in)", "weight": "233 g (8.22 oz)", "build": "Glass front (Ceramic Shield 2), aluminum alloy frame, aluminum alloy back", "sim": "Nano-SIM + eSIM + eSIM (max 2 at a time)"}'
        @blur="formatJSON('body')"
      />
      <div class="help-text">
        <strong>Поля:</strong> dimensions, weight, build, sim
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="🔊 Структура звука (нажмите для примера)"
        name="sound-example"
      >
        <pre class="json-example">
{
  "loudspeaker": "Yes, with stereo speakers",
  "audioJack": "No"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Звук">
      <el-input
        v-model="formData.sound"
        type="textarea"
        :rows="2"
        placeholder='{"loudspeaker": "Yes, with stereo speakers"}'
        @blur="formatJSON('sound')"
      />
      <div class="help-text">
        <strong>Поля:</strong> loudspeaker, audioJack (опционально)
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📶 Структура связи (нажмите для примера)"
        name="comms-example"
      >
        <pre class="json-example">
{
  "wlan": "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, hotspot",
  "bluetooth": "6.0, A2DP, LE",
  "nfc": "Yes",
  "usb": "USB Type-C 3.2 Gen 2, DisplayPort",
  "positioning": "GPS (L1+L5), GLONASS, GALILEO, BDS, QZSS, NavIC",
  "radio": "No"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Связь">
      <el-input
        v-model="formData.comms"
        type="textarea"
        :rows="4"
        placeholder='{"wlan": "Wi-Fi 802.11 a/b/g/n/ac/6e/7, tri-band, hotspot", "bluetooth": "6.0, A2DP, LE", "nfc": "Yes", "usb": "USB Type-C 3.2 Gen 2, DisplayPort", "positioning": "GPS (L1+L5), GLONASS, GALILEO, BDS, QZSS, NavIC", "radio": "No"}'
        @blur="formatJSON('comms')"
      />
      <div class="help-text">
        <strong>Поля:</strong> wlan, bluetooth, nfc, usb, positioning, radio
      </div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="✨ Структура функций (нажмите для примера)"
        name="features-example"
      >
        <pre class="json-example">
{
  "sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer",
  "browser": "Safari"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Функции">
      <el-input
        v-model="formData.features"
        type="textarea"
        :rows="4"
        placeholder='{"sensors": "Face ID, accelerometer, gyro, proximity, compass, barometer"}'
        @blur="formatJSON('features')"
      />
      <div class="help-text"><strong>Поля:</strong> sensors, browser</div>
    </el-form-item>

    <el-collapse style="margin-bottom: 20px">
      <el-collapse-item
        title="📅 Структура выпуска (нажмите для примера)"
        name="launch-example"
      >
        <pre class="json-example">
{
  "announced": "2025, September 09",
  "status": "Coming",
  "released": "2025, September 20"
}</pre
        >
      </el-collapse-item>
    </el-collapse>

    <el-form-item label="Выпуск">
      <el-input
        v-model="formData.launch"
        type="textarea"
        :rows="2"
        placeholder='{"announced": "2025, September 09", "status": "Coming", "released": "2025, September 20"}'
        @blur="formatJSON('launch')"
      />
      <div class="help-text">
        <strong>Поля:</strong> announced, status, released
      </div>
    </el-form-item>

    <div class="form-actions">
      <el-button @click="$emit('cancel')">Отмена</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit(formRef)">
        Создать модель
      </el-button>
    </div>
    <br />
  </el-form>
</template>

<style scoped lang="scss">
.model-create-form {
  max-height: 70vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;

  :deep(.el-input__wrapper) {
    width: 100%;
  }

  :deep(textarea) {
    width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}

.help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  margin-top: 4px;
}

.json-example {
  background: var(--el-fill-color-light);
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.6;
  overflow-x: auto;
  margin: 0;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", "Consolas", monospace;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color);
}
</style>
