<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import type { IModel, IModelCreatePayload, IModelImage } from "@/types/model";
import { useAdminBrands } from "@/composables/useAdminBrands";
import ModelImages from "./ModelImages.vue";

const props = defineProps<{
  modelValue: IModelCreatePayload;
  modelId?: number;
  loading?: boolean;
  galleryImages?: IModelImage[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: IModelCreatePayload): void;
  (e: "submit"): void;
  (e: "cancel"): void;
  (e: "upload-images", files: File[]): void;
  (e: "delete-image", id: number): void;
}>();

const formRef = ref<FormInstance>();
const activeTab = ref("general");

// Brands for select
const { brands, fetchBrands, loading: brandsLoading } = useAdminBrands();

// Fetch brands for dropdown (initially fetch some, support remote search ideally)
// For simplicity, we fetch once with higher limit or rely on remote method if list is huge using standard search
const fetchBrandOptions = async (query: string) => {
  // We can reuse the composable's state but we need to avoid conflicting with the main page if it uses the same composable instance?
  // `useAdminBrands` creates NEW state each call (it's a factory function), so it is safe.
  // Set limit high for dropdown or use pagination?
  // Let's just fetch first 50.
  // Actually, standard `fetchBrands` uses the refs inside the composable.
  // We need to set them.
};

// We need a local instance of useAdminBrands just for the dropdown
const brandSelect = useAdminBrands();
brandSelect.limit.value = 50;

onMounted(() => {
  brandSelect.fetchBrands();
});

const remoteMethod = (query: string) => {
  brandSelect.filters.value.search = query;
  brandSelect.fetchBrands();
};

// Validation Rules
const rules = reactive<FormRules>({
  name: [{ required: true, message: "Введите название", trigger: "blur" }],
  brand_id: [{ required: true, message: "Выберите бренд", trigger: "change" }],
});

// Helper to ensure nested objects exist
// When modelValue updates or on mount, we should ensure structure?
// The parent likely passes a reactive object.
// If `props.modelValue.battery` is undefined, v-model will fail?
// No, Vue 3 proxies handle deep reactivity but the property must exist on the object to be verified?
// Actually, `v-model="form.battery!.type"` might work if we initialize it.
// We'll trust the parent initializes the structure OR we use computed with `get/set` or `watch`.
// Better: We copy to a local reactive state or assume parent handles it.
// Standard pattern: The parent provides the state.
// BUT, if parent provides partial state, we might need to initialize nested objects.
// Let's add a watcher to ensure nested objects exist.

const form = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Init nested objects if missing
const ensureStructure = () => {
  if (!form.value.battery) form.value.battery = {};
  if (!form.value.platform) form.value.platform = {};
  if (!form.value.network) form.value.network = {};
  if (!form.value.display) form.value.display = {};
  if (!form.value.launch) form.value.launch = {};
  if (!form.value.body) form.value.body = {};
  if (!form.value.memory) form.value.memory = {};
  if (!form.value.sound) form.value.sound = {};
  if (!form.value.comms) form.value.comms = {};
  if (!form.value.features) form.value.features = {};
  if (!form.value.cameras) form.value.cameras = {};

  // Initialize camera structures if they exist
  if (form.value.cameras.mainCamera) {
    if (!form.value.cameras.mainCamera.cameraSpecs) form.value.cameras.mainCamera.cameraSpecs = [];
    if (!form.value.cameras.mainCamera.features) form.value.cameras.mainCamera.features = [];
    if (!form.value.cameras.mainCamera.video) form.value.cameras.mainCamera.video = [];
  }
  if (form.value.cameras.selfieCamera) {
    if (!form.value.cameras.selfieCamera.cameraSpecs) form.value.cameras.selfieCamera.cameraSpecs = [];
    if (!form.value.cameras.selfieCamera.features) form.value.cameras.selfieCamera.features = [];
    if (!form.value.cameras.selfieCamera.video) form.value.cameras.selfieCamera.video = [];
  }

  // Arrays
  if (!form.value.colors) form.value.colors = [];
};

watch(() => props.modelValue, ensureStructure, { immediate: true });

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit("submit");
    } else {
      console.log("error submit!", fields);
      ElMessage.error("Проверьте правильность заполнения полей");
    }
  });
};

// Image managing handled by parent component
</script>

<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="140px"
    label-position="top"
    status-icon
    v-loading="loading"
    class="model-form"
  >
    <el-tabs v-model="activeTab" class="model-tabs">
      <!-- General Tab -->
      <el-tab-pane label="Основное" name="general">
        <div class="form-section">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="Название" prop="name">
                <el-input v-model="form.name" placeholder="iPhone 15 Pro Max" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Бренд" prop="brand_id">
                <el-select
                  v-model="form.brand_id"
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
                <el-input
                  v-model="form.alias"
                  placeholder="iphone-15-pro-max"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="URL главного изображения" prop="image_url">
                <el-input v-model="form.image_url" placeholder="/uploads/..." />
                <div class="help-text">Ссылка на основное фото (превью)</div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- Colors as simple tags or text? Requirement says "array of strings" -->
          <el-form-item label="Цвета" prop="colors">
            <el-select
              v-model="form.colors"
              multiple
              filterable
              allow-create
              default-first-option
              :reserve-keyword="false"
              placeholder="Введите цвета"
              style="width: 100%"
            >
              <!-- Users can type and enter to create options -->
            </el-select>
          </el-form-item>
        </div>
      </el-tab-pane>

      <!-- Battery -->
      <el-tab-pane label="Батарея" name="battery">
        <div class="form-section" v-if="form.battery">
          <el-form-item label="Тип (Li-Ion, Li-Po)">
            <el-input v-model="form.battery.type" />
          </el-form-item>
          <el-form-item label="Емкость (mAh)">
            <el-input v-model="form.battery.capacity" />
          </el-form-item>
          <el-form-item label="Зарядка (Charging)">
            <!-- Charging is array in type, but usually a comma string makes sense for input, 
                 or a collection. Let's assume user types strings. -->
            <el-select
              v-model="form.battery.charging"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="15W wireless, Reverse charging..."
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </el-tab-pane>

      <!-- Platform -->
      <el-tab-pane label="Платформа" name="platform">
        <div class="form-section" v-if="form.platform">
          <el-row :gutter="24">
            <el-col :span="12"
              ><el-form-item label="OS"
                ><el-input v-model="form.platform.os" /></el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Chipset"
                ><el-input v-model="form.platform.chipset" /></el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12"
              ><el-form-item label="CPU"
                ><el-input v-model="form.platform.cpu" /></el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="GPU"
                ><el-input v-model="form.platform.gpu" /></el-form-item
            ></el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- Network -->
      <el-tab-pane label="Сеть" name="network">
        <div class="form-section" v-if="form.network">
          <el-form-item label="Technology"
            ><el-input v-model="form.network.technology"
          /></el-form-item>
          <el-row :gutter="24">
            <el-col :span="6"
              ><el-form-item label="2G"
                ><el-input v-model="form.network['2g']" /></el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item label="3G"
                ><el-input v-model="form.network['3g']" /></el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item label="4G"
                ><el-input v-model="form.network['4g']" /></el-form-item
            ></el-col>
            <el-col :span="6"
              ><el-form-item label="5G"
                ><el-input v-model="form.network['5g']" /></el-form-item
            ></el-col>
          </el-row>
          <el-form-item label="Speed"
            ><el-input v-model="form.network.speed"
          /></el-form-item>
        </div>
      </el-tab-pane>

      <!-- Display -->
      <el-tab-pane label="Экран" name="display">
        <div class="form-section" v-if="form.display">
          <el-row :gutter="24">
            <el-col :span="12"
              ><el-form-item label="Тип"
                ><el-input v-model="form.display.type" /></el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Размер"
                ><el-input v-model="form.display.size" /></el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12"
              ><el-form-item label="Разрешение"
                ><el-input v-model="form.display.resolution" /></el-form-item
            ></el-col>
            <el-col :span="12"
              ><el-form-item label="Защита"
                ><el-input v-model="form.display.protection" /></el-form-item
            ></el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- Memory -->
      <el-tab-pane label="Память" name="memory">
        <div class="form-section" v-if="form.memory">
          <el-row :gutter="24">
            <el-col :span="8"
              ><el-form-item label="Слот карты"
                ><el-input v-model="form.memory.cardSlot" /></el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="Внутренняя"
                ><el-input v-model="form.memory.internal" /></el-form-item
            ></el-col>
            <el-col :span="8"
              ><el-form-item label="RAM"
                ><el-input v-model="form.memory.ram" /></el-form-item
            ></el-col>
          </el-row>
          <el-form-item label="Варианты памяти (Storage)">
            <el-select
              v-model="form.memory.storage"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="128GB, 256GB..."
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </el-tab-pane>

      <!-- Cameras -->
      <el-tab-pane label="Камеры" name="cameras">
        <div class="form-section" v-if="form.cameras">
          <!-- Main Camera -->
          <h4 class="subsection-title">Основная камера</h4>
          <div v-if="form.cameras.mainCamera">
            <el-form-item label="Тип">
              <el-input v-model="form.cameras.mainCamera.type" placeholder="single, dual, triple..." />
            </el-form-item>
            <el-form-item label="Характеристики камер">
              <el-select
                v-model="form.cameras.mainCamera.cameraSpecs"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="48 MP, f/1.6, 26mm (wide)..."
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="Функции">
              <el-select
                v-model="form.cameras.mainCamera.features"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="HDR, Dual-LED flash..."
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="Видео">
              <el-select
                v-model="form.cameras.mainCamera.video"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="4K@60fps, 1080p@240fps..."
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div v-else>
            <!-- Simple structure fallback -->
            <el-form-item label="Main">
              <el-input v-model="form.cameras.main" placeholder="48 MP" />
            </el-form-item>
            <el-form-item label="Ultrawide">
              <el-input v-model="form.cameras.ultrawide" placeholder="12 MP" />
            </el-form-item>
            <el-form-item label="Telephoto">
              <el-input v-model="form.cameras.telephoto" placeholder="12 MP" />
            </el-form-item>
          </div>

          <!-- Selfie Camera -->
          <h4 class="subsection-title">Фронтальная камера</h4>
          <div v-if="form.cameras.selfieCamera">
            <el-form-item label="Тип">
              <el-input v-model="form.cameras.selfieCamera.type" placeholder="single, dual..." />
            </el-form-item>
            <el-form-item label="Характеристики камер">
              <el-select
                v-model="form.cameras.selfieCamera.cameraSpecs"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="18 MP, f/1.9, (wide)..."
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="Функции">
              <el-select
                v-model="form.cameras.selfieCamera.features"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="HDR, Dolby Vision..."
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="Видео">
              <el-select
                v-model="form.cameras.selfieCamera.video"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="4K@60fps, 1080p@120fps..."
                style="width: 100%"
              />
            </el-form-item>
          </div>
        </div>
      </el-tab-pane>

      <!-- Body, Sound, Comms, Launch, Features -->
      <el-tab-pane label="Корпус" name="body">
        <div class="form-section" v-if="form.body">
          <el-form-item label="Dimensions"
            ><el-input v-model="form.body.dimensions"
          /></el-form-item>
          <el-form-item label="Weight"
            ><el-input v-model="form.body.weight"
          /></el-form-item>
          <el-form-item label="Build"
            ><el-input v-model="form.body.build"
          /></el-form-item>
          <el-form-item label="SIM"
            ><el-input v-model="form.body.sim"
          /></el-form-item>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Разное" name="misc">
        <div class="form-section">
          <h4>Звук</h4>
          <el-form-item label="Loudspeaker" v-if="form.sound"
            ><el-input v-model="form.sound.loudspeaker"
          /></el-form-item>
          <el-form-item label="Audio Jack" v-if="form.sound"
            ><el-input v-model="form.sound.audioJack"
          /></el-form-item>

          <h4>Comms</h4>
          <div v-if="form.comms">
            <el-form-item label="WLAN"
              ><el-input v-model="form.comms.wlan"
            /></el-form-item>
            <el-form-item label="Bluetooth"
              ><el-input v-model="form.comms.bluetooth"
            /></el-form-item>
            <el-form-item label="NFC"
              ><el-input v-model="form.comms.nfc"
            /></el-form-item>
            <el-form-item label="USB"
              ><el-input v-model="form.comms.usb"
            /></el-form-item>
          </div>

          <h4>Features</h4>
          <div v-if="form.features">
            <el-form-item label="Sensors"
              ><el-input
                v-model="form.features.sensors"
                type="textarea"
                autosize
            /></el-form-item>
          </div>
        </div>
      </el-tab-pane>

      <!-- Gallery -->
      <el-tab-pane label="Галерея" name="gallery" :disabled="!modelId">
        <div class="form-section">
          <el-alert
            v-if="!modelId"
            title="Сохраните модель, чтобы загружать изображения"
            type="info"
            show-icon
            :closable="false"
          />
          <ModelImages
            v-else
            :model-id="modelId"
            :images="galleryImages || []"
            @upload="emit('upload-images', $event)"
            @delete="emit('delete-image', $event)"
          />
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="form-actions">
      <el-button @click="$emit('cancel')">Отмена</el-button>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading"
        @click="onSubmit(formRef)"
      >
        {{ modelId ? "Сохранить изменения" : "Создать модель" }}
      </el-button>
    </div>
  </el-form>
</template>

<style scoped lang="scss">
.model-form {
  padding: 0;
}

.model-tabs {
  margin-bottom: 24px;
}

.form-section {
  padding: 10px 0;
}

.help-text {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.subsection-title {
  margin: 16px 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
