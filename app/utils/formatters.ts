import type { ICurrency } from "~/types";

export function formatCurrency(
  value: number,
  currency: ICurrency = "UZS"
): string {
  if (!value || isNaN(value)) {
    return "0 сум";
  }

  // Округляем до целого числа
  const intValue = Math.round(value);

  // Форматируем число с пробелами как разделителями тысяч
  const formattedNumber = intValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Добавляем валюту
  const currencyMap: Record<ICurrency, string> = {
    UZS: "сум",
    USD: "$",
  };

  const currencyLabel = currencyMap[currency] || currency;

  // Для доллара символ ставим перед числом, для сума - после
  if (currency === "USD") {
    return `${currencyLabel}${formattedNumber}`;
  }

  return `${formattedNumber} ${currencyLabel}`;
}

export function lastActivity(date: string | null | undefined) {
  if (!date) return "Не в сети";

  const lastActivity = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return "В сети";
  if (diffMins < 60) return `Был(а) ${diffMins} мин. назад`;
  if (diffHours < 24) return `Был(а) ${diffHours} ч. назад`;
  if (diffDays === 1) return "Был(а) вчера";
  if (diffDays < 7) return `Был(а) ${diffDays} дн. назад`;

  return `Был(а) ${lastActivity.toLocaleDateString("ru-RU")}`;
}
