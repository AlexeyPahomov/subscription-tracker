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
      return 'border-l-white/20';
  }
}

/** Текст относительной даты в строке Upcoming */
export function upcomingRelativeTextClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'font-medium text-red-300';
    case 'soon':
      return 'font-medium text-amber-300';
    default:
      return 'text-gray-400';
  }
}

/** Фон карточки «Next payment» в Summary */
export function nextPaymentCardShellClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'border-red-500/40 bg-red-950/25 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.15)]';
    case 'soon':
      return 'border-amber-500/35 bg-amber-950/20 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.12)]';
    default:
      return 'border-white/10 bg-white/5';
  }
}

/** Цвет относительной даты в карточке Next payment */
export function nextPaymentRelativeTextClass(
  urgency: UpcomingPaymentUrgency,
): string {
  switch (urgency) {
    case 'urgent':
      return 'text-red-300';
    case 'soon':
      return 'text-amber-200/90';
    default:
      return 'text-gray-400';
  }
}
