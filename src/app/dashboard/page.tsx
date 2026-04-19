import { requireSessionUserInDb } from '@/helpers/getAuthenticatedUserId';
import { DASHBOARD_PAGE_SHELL_CLASSNAME } from '@/constants/dashboard-layout';
import {
  DashboardSummary,
  MonthlySpendLineChart,
  SubscriptionSpendPieChart,
  UpcomingPayments,
} from '@/components/dashboard';
import { buildDashboardViewModel } from '@/helpers/buildDashboardViewModel';
import { getDashboardSpendAnalytics } from '@/helpers/getDashboardSpendAnalytics';
import { getUpcomingPaymentsForUser } from '@/helpers/getUpcomingPaymentsForUser';
import { prisma } from '@/utils/prisma';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const userId = await requireSessionUserInDb();

  const subscriptionCount = await prisma.subscription.count({
    where: { userId },
  });
  if (subscriptionCount === 0) {
    redirect('/subscriptions');
  }

  const spendAnalytics = await getDashboardSpendAnalytics(userId);
  const upcomingAll = await getUpcomingPaymentsForUser(userId);

  const {
    analytics,
    upcomingPreview,
    nextPayment,
    showViewAllUpcoming,
  } = buildDashboardViewModel(spendAnalytics, upcomingAll);

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
