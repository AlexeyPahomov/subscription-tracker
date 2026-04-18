import { defaultSubscriptionCurrency } from '@/constants';
import {
  buildPieSlicesFromCategories,
  buildPieSlicesFromRankedSubscriptions,
  groupSpendByCategory,
  type SubscriptionRowForPie,
} from '@/helpers/buildDashboardPieSlices';
import { formatPriceForDisplay } from '@/helpers/formatSubscriptionForClient';
import { subscriptionPricePerMonth } from '@/helpers/subscriptionPricePerMonth';
import type {
  DashboardSpendAnalytics,
  MonthlySpendPoint,
  TopSubscriptionSummary,
} from '@/types/dashboard-analytics';
import { prisma } from '@/utils/prisma';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export type {
  DashboardSpendAnalytics,
  MonthlySpendPoint,
  SubscriptionSpendSlice,
  TopSubscriptionSummary,
} from '@/types/dashboard-analytics';

const PROJECTED_MONTHS = 12;

/** Лёгкая детерминированная вариация (~±1–2%) для линии прогноза */
const PROJECTED_SPEND_MULTIPLIERS = [
  1, 1, 1.015, 1, 0.99, 1, 1.01, 1, 1, 0.995, 1, 1.008,
] as const;

type SubscriptionRow = SubscriptionRowForPie & {
  id: string;
  name: string;
  createdAt: Date;
  currency: string;
};

type RankedSlice = {
  id: string;
  name: string;
  monthlyAmount: number;
};

function endOfMonth(year: number, monthIndex0: number): Date {
  return new Date(year, monthIndex0 + 1, 0, 23, 59, 59, 999);
}

function pickDisplayCurrency(rows: { currency: string }[]): string {
  if (rows.length === 0) return defaultSubscriptionCurrency;
  const counts = new Map<string, number>();
  for (const r of rows) {
    const code =
      r.currency.length === 3 ? r.currency : defaultSubscriptionCurrency;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]![0];
}

function rankByMonthlyAmount(rows: SubscriptionRow[]): RankedSlice[] {
  return rows
    .map((row) => ({
      id: row.id,
      name: row.name,
      monthlyAmount: subscriptionPricePerMonth(row.price, row.interval),
    }))
    .filter((s) => s.monthlyAmount > 0)
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);
}

function toTopSubscription(
  ranked: RankedSlice[],
  displayCurrency: string,
): TopSubscriptionSummary | null {
  const top = ranked[0];
  if (!top) return null;
  return {
    id: top.id,
    name: top.name,
    priceLabel: formatPriceForDisplay(top.monthlyAmount, displayCurrency),
  };
}

function buildMonthlyProjectionSeries(
  now: Date,
  currentMonthlyTotal: number,
): MonthlySpendPoint[] {
  const series: MonthlySpendPoint[] = [];
  for (let i = 0; i < PROJECTED_MONTHS; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const label = format(d, 'MMM yyyy', { locale: enUS });
    const mult = PROJECTED_SPEND_MULTIPLIERS[i] ?? 1;
    const amount = Math.round(currentMonthlyTotal * mult * 100) / 100;
    series.push({ monthKey, label, amount });
  }
  return series;
}

export async function getDashboardSpendAnalytics(
  userId: string,
): Promise<DashboardSpendAnalytics> {
  const rows = await prisma.subscription.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      price: true,
      interval: true,
      createdAt: true,
      currency: true,
      category: {
        select: { id: true, name: true, color: true },
      },
    },
  });

  const displayCurrency = pickDisplayCurrency(rows);
  const subscriptionCount = rows.length;

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const subscriptionsAddedThisMonth = rows.filter(
    (r) => r.createdAt >= startOfCurrentMonth,
  ).length;

  const currentMonthlyTotal = rows.reduce((sum, row) => {
    return sum + subscriptionPricePerMonth(row.price, row.interval);
  }, 0);

  const rankedForTop = rankByMonthlyAmount(rows);
  const categoryBuckets = groupSpendByCategory(rows);

  const topSubscription = toTopSubscription(rankedForTop, displayCurrency);
  const pieByCategory = buildPieSlicesFromCategories(categoryBuckets);
  const pieBySubscription = buildPieSlicesFromRankedSubscriptions(rankedForTop);

  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
  const endPrevMonth = endOfMonth(
    prevMonth.getFullYear(),
    prevMonth.getMonth(),
  );

  let previousMonthlyTotal = 0;
  for (const row of rows) {
    if (row.createdAt <= endPrevMonth) {
      previousMonthlyTotal += subscriptionPricePerMonth(row.price, row.interval);
    }
  }

  let spendTrendPercent: number | null = null;
  if (previousMonthlyTotal > 0) {
    spendTrendPercent =
      ((currentMonthlyTotal - previousMonthlyTotal) / previousMonthlyTotal) *
      100;
  }

  const monthlySpendSeries = buildMonthlyProjectionSeries(
    now,
    currentMonthlyTotal,
  );

  return {
    monthlySpendSeries,
    currentMonthlyTotal,
    subscriptionCount,
    displayCurrency,
    pieByCategory,
    pieBySubscription,
    spendTrendPercent,
    topSubscription,
    subscriptionsAddedThisMonth,
  };
}
