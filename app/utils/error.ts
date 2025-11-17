
export const getErrorMessage = (error: any, customMessage?: string) => {
  const details = error?.response?._data?.details ?? []
  
  const summary = error?.response?._data?.message || "Ошибка при загрузке объявлений";
  const message = details.map((detail: any) => detail?.errors?.join(". ") ?? Object.values(detail?.constraints)).join(". ");
  return message || summary || customMessage || "Не известная ошибка";
}
  