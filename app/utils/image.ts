import imageCompression from "browser-image-compression";

// Разрешённые форматы изображений. HEIC/HEIF и прочее — запрещены:
// браузеры их не рендерят, а сжатие через canvas их не декодирует.
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Проверяет, что файл — изображение допустимого формата.
 * Если браузер не отдал mime (бывает для HEIC), проверяем по расширению.
 */
export function isAllowedImage(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  if (type) {
    return ALLOWED_IMAGE_TYPES.includes(type);
  }
  const name = (file.name || "").toLowerCase();
  return ALLOWED_IMAGE_EXT.some((ext) => name.endsWith(ext));
}

/**
 * Сжимает изображение на клиенте (ресайз до 1920px, цель ~1 МБ, q0.82).
 * При ошибке возвращает оригинал — бэкенд дожмёт/проверит.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxWidthOrHeight: 1920,
      maxSizeMB: 1,
      initialQuality: 0.82,
      useWebWorker: true,
    });
  } catch {
    return file;
  }
}
