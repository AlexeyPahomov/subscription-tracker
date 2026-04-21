import { formatPriceForDisplay } from '@/helpers/formatSubscriptionForClient';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';
import {
  differenceInCalendarDays,
  format,
  isBefore,
  startOfDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

export type UpcomingPaymentUrgency = 'urgent' | 'soon' | 'normal';

export type UpcomingPaymentItem = {
  id: string;
  name: string;
  priceLabel: string;
  /** Напр. Apr 20 */
  dateLabel: string;
  relativeLabel: string;
  urgency: UpcomingPaymentUrgency;
};

function relativePaymentLabel(nextBilling: Date): string {
  const today = startOfDay(new Date());
  const paymentDay = startOfDay(nextBilling);
  const diffDays = differenceInCalendarDays(paymentDay, today);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `in ${diffDays} days`;
}

function urgencyFromDiffDays(diffDays: number): UpcomingPaymentUrgency {
  if (diffDays <= 2) return 'urgent';
  if (diffDays <= 5) return 'soon';
  return 'normal';
}

/** Ближайшие платежи (сегодня и будущее), производные от подписок пользователя. */
export async function getUpcomingPaymentsForUser(
  userId: string,
  /** Если не задан — все будущие платежи (в разумном порядке) */
  limit?: number,
): Promise<UpcomingPaymentItem[]> {
  const rows = await withDbRetry(() =>
    prisma.subscription.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        nextBilling: true,
      },
    }),
  );

  const todayStart = startOfDay(new Date());

  const sorted = rows
    .filter((row) => {
      const d = startOfDay(new Date(row.nextBilling));
      return !isBefore(d, todayStart);
    })
    .sort(
      (a, b) =>
        new Date(a.nextBilling).getTime() - new Date(b.nextBilling).getTime(),
    );

  const upcoming =
    limit === undefined ? sorted : sorted.slice(0, limit);

  return upcoming.map((row) => {
    const nextBilling = new Date(row.nextBilling);
    const paymentDay = startOfDay(nextBilling);
    const diffDays = differenceInCalendarDays(paymentDay, todayStart);

    return {
      id: row.id,
      name: row.name,
      priceLabel: formatPriceForDisplay(row.price, row.currency),
      dateLabel: format(nextBilling, 'MMM d', { locale: enUS }),
      relativeLabel: relativePaymentLabel(nextBilling),
      urgency: urgencyFromDiffDays(diffDays),
    };
  });
}
