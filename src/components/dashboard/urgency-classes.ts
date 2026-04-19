import type { UpcomingPaymentUrgency } from '@/helpers/getUpcomingPaymentsForUser';

/** Левый акцент строки Upcoming */
export function upcomingRowBorderClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'border-l-red-500';
    case 'soon':
      return 'border-l-yellow-500';
    default:
      return 'border-l-neutral-300 dark:border-l-white/20';
  }
}

/** Текст относительной даты в строке Upcoming */
export function upcomingRelativeTextClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'font-medium text-red-700 dark:text-red-300';
    case 'soon':
      return 'font-medium text-amber-700 dark:text-amber-300';
    default:
      return 'text-neutral-600 dark:text-gray-400';
  }
}

/** Фон карточки «Next payment» в Summary */
export function nextPaymentCardShellClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'border-red-300 bg-red-50 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.2)] dark:border-red-500/40 dark:bg-red-950/25 dark:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.15)]';
    case 'soon':
      return 'border-amber-300 bg-amber-50 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.25)] dark:border-amber-500/35 dark:bg-amber-950/20 dark:shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]';
    default:
      return 'border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5';
  }
}

/** Цвет относительной даты в карточке Next payment */
export function nextPaymentRelativeTextClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'text-red-700 dark:text-red-300';
    case 'soon':
      return 'text-amber-800 dark:text-amber-200/90';
    default:
      return 'text-neutral-600 dark:text-gray-400';
  }
}
