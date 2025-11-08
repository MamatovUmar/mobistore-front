import type { ICurrency } from "~/types";

export function formatCurrency(value: number, currency: ICurrency = 'UZS'): string {
  if (!value || isNaN(value)) {
    return '0 сум';
  }

  // Округляем до целого числа
  const intValue = Math.round(value);

  // Форматируем число с пробелами как разделителями тысяч
  const formattedNumber = intValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  // Добавляем валюту
  const currencyMap: Record<ICurrency, string> = {
    'UZS': 'сум',
    'USD': '$'
  };

  const currencyLabel = currencyMap[currency] || currency;

  // Для доллара символ ставим перед числом, для сума - после
  if (currency === 'USD') {
    return `${currencyLabel}${formattedNumber}`;
  }
  
  return `${formattedNumber} ${currencyLabel}`;
}
