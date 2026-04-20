import { buildDashboardViewModel } from '@/helpers/buildDashboardViewModel';
import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { getDashboardSpendAnalytics } from '@/helpers/getDashboardSpendAnalytics';
import { getUpcomingPaymentsForUser } from '@/helpers/getUpcomingPaymentsForUser';
import { withDbRetry } from '@/utils/dbConnection';
import { prisma } from '@/utils/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) {
    const status = authResult.error === 'unauthorized' ? 401 : 500;
    return NextResponse.json({ error: authResult.error }, { status });
  }

  const { userId } = authResult;
  const subscriptionCount = await withDbRetry(() =>
    prisma.subscription.count({ where: { userId } }),
  );

  if (subscriptionCount === 0) {
    return NextResponse.json({ needsSubscriptionsSetup: true });
  }

  const spendAnalytics = await getDashboardSpendAnalytics(userId);
  const upcomingAll = await getUpcomingPaymentsForUser(userId);
  const viewModel = buildDashboardViewModel(spendAnalytics, upcomingAll);

  return NextResponse.json({
    needsSubscriptionsSetup: false,
    viewModel,
  });
}
