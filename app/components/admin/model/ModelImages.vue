<script setup lang="ts">
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import type { UploadUserFile, UploadFile } from "element-plus";
import type { IModelImage } from "@/types/model";

const props = defineProps<{
  modelId: number;
  images: IModelImage[];
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: "upload", files: File[]): void;
  (e: "delete", imageId: number): void;
}>();

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<UploadUserFile[]>([]);

// Sync fileList with props.images
watch(
  () => props.images,
  (newImages) => {
    fileList.value = newImages.map((img) => ({
      name: `Image ${img.id}`,
      url: img.url,
      id: img.id, // Custom property to track ID
    }));
  },
  { immediate: true, deep: true }
);

const handleRemove = (file: UploadFile) => {
  if (file.status === "success" && (file as any).id) {
    emit("delete", (file as any).id);
  }
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleUploadChange = (file: UploadFile, files: UploadFile[]) => {
  // We don't auto-upload here, we wait for a manual trigger or separate approach
  // But Element Plus Upload with `auto-upload="false"` is tricky for multiple files
  // Let's us `http-request` or just capture the files.
  // Actually, for this requirement "POST .../images" takes "images: file[]".
  // So we can support batch upload.
};

const customUpload = (options: any) => {
  // We will collect files and emit them?
  // Or better: Use a separate button to trigger upload of *new* files.
  // But standard UX is upload immediately or on save.
  // Given the API is separate, let's upload immediately when user selects files?
  // Or "Select files" -> "Upload".
  // Let's try automatic upload for simplicity if logical.
  // Since `uploadModelImages` takes `File[]`, we can batch them?
  // Element Upload executes `http-request` for EACH file by default.
  // We might want to group them.
  // For now, let's just emit 'upload' with the single file,
  // but the API supports array.
  // If we want to support array, we might need a manual "Upload" button
  // or a debounce.
  // Simpler approach: Wrapper around the API that takes one file is not efficient if API takes array.
  // Let's assume standard usage: User drops files -> we queue them -> we upload them.
  // For this component, let's just use a simple "Upload" button mechanism
  // OR modify the parent to handle single file uploads if it prefers,
  // but optimal is batch.
  // Let's stick to: Element Upload with `auto-upload="false"`
  // and a button "Upload New Images" if there are pending files.
};

const pendingFiles = ref<File[]>([]);

const onChange = (file: UploadFile, files: UploadFile[]) => {
  pendingFiles.value = files
    .filter((f) => f.status === "ready" && f.raw)
    .map((f) => f.raw as File);
};

const submitUpload = async () => {
  if (pendingFiles.value.length === 0) return;
  emit("upload", pendingFiles.value);
};

const uploadRef = ref();

// Watch for images update to clear pending files after successful upload
watch(
  () => props.images,
  (newImages, oldImages) => {
    // If images increased, clear pending files
    if (newImages.length > oldImages.length) {
      pendingFiles.value = [];
      // Remove ready files from the upload component
      if (uploadRef.value) {
        const successFiles = newImages.map((img) => ({
          name: `Image ${img.id}`,
          url: img.url,
          id: img.id,
          status: 'success' as const,
        }));
        fileList.value = successFiles;
      }
    }
  },
  { deep: true }
);

defineExpose({ clearPending: () => { pendingFiles.value = []; } });
</script>

<template>
  <div class="model-images">
    <div class="header">
      <h3>Изображения галереи</h3>
      <el-button
        v-if="pendingFiles.length > 0"
        type="primary"
        size="small"
        :loading="loading"
        @click="submitUpload"
      >
        Загрузить выбраные ({{ pendingFiles.length }})
      </el-button>
    </div>

    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      multiple
      :limit="10"
      accept="image/*"
      :disabled="loading"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
      <img
        w-full
        :src="dialogImageUrl"
        alt="Preview Image"
        class="preview-img"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.model-images {
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
}

.preview-img {
  width: 100%;
}
</style>
