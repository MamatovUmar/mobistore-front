import type { Composer } from 'vue-i18n';

/**
 * Форматирует дату в относительный формат времени
 * @param dateString - строка даты для форматирования
 * @param t - функция перевода из vue-i18n
 * @param locale - текущая локаль
 * @returns отформатированная строка времени
 */
export const formatRelativeTime = (
  dateString: string | null | undefined,
  t: Composer['t'],
  locale: string
): string => {
  if (!dateString) return '';

  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return t('time.justNow');
  } else if (diffInMinutes < 60) {
    return t('time.minutesAgo', { count: diffInMinutes });
  } else if (diffInHours < 24) {
    return t('time.hoursAgo', { count: diffInHours });
  } else if (diffInDays < 7) {
    return t('time.daysAgo', { count: diffInDays });
  } else {
    // Для узбекского языка используем ручное форматирование
    if (locale === 'uz') {
      const uzMonths = [
        'yan', 'fev', 'mar', 'apr', 'may', 'iyun',
        'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'
      ];
      return `${date.getDate()} ${uzMonths[date.getMonth()]}`;
    }
    
    // Для русского и других языков
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }
};
