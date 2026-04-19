import {
  nextPaymentCardShellClass,
  nextPaymentRelativeTextClass,
} from '@/components/dashboard/urgency-classes';
import { subscriptionDeepLinkHref } from '@/constants/subscriptionDeepLink';
import { formatMoneyAmount } from '@/helpers/formatMoneyAmount';
import type { UpcomingPaymentUrgency } from '@/helpers/getUpcomingPaymentsForUser';
import { AppLink } from '@/components/navigation/navigation-provider';

type DashboardSummaryProps = {
  currentMonthlyTotal: number;
  subscriptionCount: number;
  currencyCode: string;
  spendTrendPercent: number | null;
  subscriptionsAddedThisMonth: number;
  topSubscription: { id: string; name: string; priceLabel: string } | null;
  nextPayment: {
    name: string;
    dateLabel: string;
    relativeLabel: string;
    urgency: UpcomingPaymentUrgency;
  } | null;
};

function nextPaymentCardClass(urgency: UpcomingPaymentUrgency | null): string {
  const base =
    'rounded-2xl border px-6 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_40px_-16px_rgba(255,255,255,0.07)]';
  if (urgency === null) {
    return `${base} border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100/80 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/7`;
  }
  return `${base} ${nextPaymentCardShellClass(urgency)} hover:border-neutral-400/60 dark:hover:border-white/25`;
}

export function DashboardSummary({
  currentMonthlyTotal,
  subscriptionCount,
  currencyCode,
  spendTrendPercent,
  subscriptionsAddedThisMonth,
  topSubscription,
  nextPayment,
}: DashboardSummaryProps) {
  const mainAmount = formatMoneyAmount(currentMonthlyTotal, currencyCode);

  return (
    <section aria-labelledby="summary-heading" className="mb-10">
      <h2
        id="summary-heading"
        className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white"
      >
        Summary
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-indigo-500/35 bg-linear-to-br from-indigo-950/80 via-indigo-950/40 to-black/40 px-7 py-8 shadow-[0_0_40px_-12px_rgba(99,102,241,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/45 hover:shadow-[0_12px_48px_-12px_rgba(99,102,241,0.45)]">
          <p className="flex items-center gap-2 text-sm font-medium text-indigo-200/90">
            <span aria-hidden>💰</span>
            Monthly spend
          </p>

          <p className="mt-5 text-4xl font-semibold tracking-tight text-white tabular-nums">
            <span className="text-indigo-100">{mainAmount}</span>
            <span className="text-lg font-normal text-indigo-200/80">
              {' '}
              / month
            </span>
          </p>

          {spendTrendPercent !== null && (
            <p
              className={`mt-5 text-sm font-medium tabular-nums ${
                spendTrendPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {spendTrendPercent >= 0 ? '+' : ''}
              {spendTrendPercent.toFixed(0)}% vs last month
            </p>
          )}

          {topSubscription && (
            <AppLink
              href={subscriptionDeepLinkHref(topSubscription.id)}
              className="mt-8 block text-xs leading-relaxed text-neutral-600 transition-colors hover:text-indigo-700 dark:text-gray-500 dark:hover:text-indigo-300"
            >
              <span className="text-neutral-600 dark:text-gray-500">Top: </span>
              <span className="text-neutral-800 underline decoration-neutral-300 underline-offset-2 hover:decoration-indigo-500 dark:text-gray-300 dark:decoration-white/15 dark:hover:decoration-indigo-400/80">
                {topSubscription.name}
              </span>
              <span className="text-neutral-500 dark:text-gray-600">
                {' '}
                ({topSubscription.priceLabel})
              </span>
            </AppLink>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/90 px-6 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-neutral-100/90 hover:shadow-[0_8px_32px_-16px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/7 dark:hover:shadow-[0_8px_40px_-16px_rgba(255,255,255,0.08)]">
          <p className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-gray-400">
            <span aria-hidden>📦</span>
            Active subscriptions
          </p>
          <p className="mt-4 text-3xl font-semibold tabular-nums text-neutral-900 dark:text-white">
            {subscriptionCount === 1
              ? '1 subscription'
              : `${subscriptionCount} subscriptions`}
          </p>
          <p className="mt-3 text-sm text-neutral-600 dark:text-gray-400">
            {subscriptionsAddedThisMonth > 0 ? (
              <span className="font-medium text-emerald-700 dark:text-emerald-400/90">
                +{subscriptionsAddedThisMonth} this month
              </span>
            ) : (
              <span className="text-neutral-500 dark:text-gray-500">
                No new this month
              </span>
            )}
          </p>
        </div>

        <div className={nextPaymentCardClass(nextPayment?.urgency ?? null)}>
          <p className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-gray-400">
            <span aria-hidden>⏰</span>
            Next payment
          </p>
          {nextPayment ? (
            <>
              <p className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
                {nextPayment.name}
              </p>
              <p className="mt-2 text-sm">
                <span className="text-neutral-600 dark:text-gray-300">
                  {nextPayment.dateLabel}
                </span>
                <span className="text-neutral-400 dark:text-gray-600">
                  {' '}
                  •{' '}
                </span>
                <span
                  className={`font-medium ${nextPaymentRelativeTextClass(nextPayment.urgency)}`}
                >
                  {nextPayment.relativeLabel}
                </span>
              </p>
            </>
          ) : (
            <p className="mt-4 text-sm text-neutral-500 dark:text-gray-500">
              No scheduled payments
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
