import type { ICurrency } from "~/types";

export function formatCurrency(
  value: number,
  currency: ICurrency = "UZS"
): string {
  const { t } = useI18n();

  if (!value || isNaN(value)) {
    return "0 " + t('formatters.currency.uzs');
  }

  // Округляем до целого числа
  const intValue = Math.round(value);

  // Форматируем число с пробелами как разделителями тысяч
  const formattedNumber = intValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Добавляем валюту
  const currencyMap: Record<ICurrency, string> = {
    UZS: t('formatters.currency.uzs'),
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
  const { t } = useI18n();
  
  if (!date) return t('formatters.activity.offline');

  const lastActivity = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return t('formatters.activity.online');
  if (diffMins < 60) return `${t('formatters.activity.was')} ${diffMins} ${t('formatters.activity.minutesAgo')}`;
  if (diffHours < 24) return `${t('formatters.activity.was')} ${diffHours} ${t('formatters.activity.hoursAgo')}`;
  if (diffDays === 1) return `${t('formatters.activity.was')} ${t('formatters.activity.yesterday')}`;
  if (diffDays < 7) return `${t('formatters.activity.was')} ${diffDays} ${t('formatters.activity.daysAgo')}`;

  return `${t('formatters.activity.was')} ${lastActivity.toLocaleDateString('ru-RU')}`;
}
