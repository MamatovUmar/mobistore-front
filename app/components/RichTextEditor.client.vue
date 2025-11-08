<script setup lang="ts">
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

defineProps<{
  content?: string;
  placeholder?: string;
}>();

defineEmits<{
  "update:content": [value: string];
}>();

const toolbar = [
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];
</script>

<template>
  <div style="width: 100%;">
    <QuillEditor
      :content="content"
      contentType="html"
      theme="snow"
      :placeholder="placeholder"
      :toolbar="toolbar"
      @update:content="$emit('update:content', $event)"
    />
  </div>
</template>
