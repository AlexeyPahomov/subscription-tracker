'use client';

import {
  DashboardSkeleton,
  DashboardSummary,
  MonthlySpendLineChart,
  SubscriptionSpendPieChart,
  UpcomingPayments,
} from '@/components/dashboard';
import { DASHBOARD_PAGE_SHELL_CLASSNAME } from '@/constants/dashboard-layout';
import { useDashboardQuery } from '@/hooks/useDashboardQuery';
import { useRedirectOnUnauthorized } from '@/hooks/useRedirectOnUnauthorized';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const query = useDashboardQuery();
  useRedirectOnUnauthorized(query.error);

  useEffect(() => {
    if (query.data?.needsSubscriptionsSetup) {
      router.replace('/subscriptions');
    }
  }, [query.data, router]);

  if (query.isPending) {
    return <DashboardSkeleton />;
  }

  if (
    query.isError ||
    !query.data ||
    query.data.needsSubscriptionsSetup ||
    !query.data.viewModel
  ) {
    return <DashboardSkeleton />;
  }

  const { analytics, upcomingPreview, nextPayment, showViewAllUpcoming } =
    query.data.viewModel;

  return (
    <section className={DASHBOARD_PAGE_SHELL_CLASSNAME}>
      <DashboardSummary
        currentMonthlyTotal={analytics.currentMonthlyTotal}
        subscriptionCount={analytics.subscriptionCount}
        currencyCode={analytics.displayCurrency}
        spendTrendPercent={analytics.spendTrendPercent}
        subscriptionsAddedThisMonth={analytics.subscriptionsAddedThisMonth}
        topSubscription={analytics.topSubscription}
        nextPayment={nextPayment}
      />

      <UpcomingPayments
        items={upcomingPreview}
        showViewAll={showViewAllUpcoming}
      />

      <section aria-labelledby="charts-heading" className="mt-0">
        <h2
          id="charts-heading"
          className="mb-3 text-lg font-semibold text-neutral-900 dark:text-white"
        >
          Charts
        </h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <MonthlySpendLineChart
            data={analytics.monthlySpendSeries}
            currencyCode={analytics.displayCurrency}
          />
          <SubscriptionSpendPieChart
            pieByCategory={analytics.pieByCategory}
            pieBySubscription={analytics.pieBySubscription}
            currencyCode={analytics.displayCurrency}
          />
        </div>
      </section>
    </section>
  );
}
