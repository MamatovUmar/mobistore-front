/**
 * Убирает HTML-теги и лишние пробелы — чтобы посчитать длину реального текста.
 * Rich-text редактор для пустого поля отдаёт «<p><br></p>», поэтому проверять
 * описание нужно по очищенному тексту, а не по сырой строке.
 */
export function stripHtml(value: string): string {
  return (value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
