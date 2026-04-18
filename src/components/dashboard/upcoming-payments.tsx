import type { UpcomingPaymentItem } from '@/helpers/getUpcomingPaymentsForUser';
import Link from 'next/link';
import { UpcomingItem } from './upcoming-item';

type UpcomingPaymentsProps = {
  items: UpcomingPaymentItem[];
  /** Показать ссылку, если есть ещё платежи за пределами списка */
  showViewAll?: boolean;
};

export function UpcomingPayments({
  items,
  showViewAll = false,
}: UpcomingPaymentsProps) {
  return (
    <section aria-labelledby="upcoming-heading" className="mb-4 mt-2">
      <h2
        id="upcoming-heading"
        className="mb-3 flex items-center gap-2 text-lg font-semibold text-white"
      >
        <span aria-hidden>⏰</span>
        Upcoming payments
      </h2>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-indigo-500/20 bg-linear-to-br from-indigo-950/30 to-black/40 px-6 py-12 text-center text-sm text-gray-400">
          No upcoming payments 🎉
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {items.map((item, index) => (
              <UpcomingItem key={item.id} item={item} index={index} />
            ))}
          </ul>
          {showViewAll ? (
            <div className="mt-3 flex justify-end">
              <Link
                href="/subscriptions"
                className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                aria-label="View all upcoming payments"
              >
                View all →
              </Link>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
