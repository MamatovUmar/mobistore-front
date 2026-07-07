export const getErrorMessage = (error: any, customMessage?: string) => {
  // 1. Полевые ошибки валидации от бэка (details[].errors)
  const details = error?.response?._data?.details;
  if (Array.isArray(details) && details.length) {
    const fieldMessage = details
      .map((detail: any) =>
        detail?.errors?.join(". ") ??
        (detail?.constraints ? Object.values(detail.constraints).join(". ") : "")
      )
      .filter(Boolean)
      .join(". ");
    if (fieldMessage) return fieldMessage;
  }

  // 2. Явное сообщение от бэка
  const backendMessage = error?.response?._data?.message;
  if (backendMessage) return backendMessage;

  // 3. Ответ есть, но без message — ориентируемся по HTTP-статусу
  const status = error?.response?.status ?? error?.statusCode;
  if (status === 413) return "Файл слишком большой";
  if (status === 429) return "Слишком много запросов, попробуйте позже";

  // 4. Ответа нет вовсе — сетевая ошибка
  if (!error?.response) {
    return customMessage || "Проблема с соединением. Попробуйте ещё раз";
  }

  // 5. Иначе — переданный контекст или общий текст
  return customMessage || "Что-то пошло не так";
};
