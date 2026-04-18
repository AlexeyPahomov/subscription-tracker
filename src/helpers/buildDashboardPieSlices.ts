import type { SubscriptionSpendSlice } from '@/types/dashboard-analytics';
import { subscriptionPricePerMonth } from '@/helpers/subscriptionPricePerMonth';

export const DASHBOARD_PIE_TOP_N = 5;
export const DASHBOARD_PIE_OTHERS_NAME = 'Others';
const UNCATEGORIZED_KEY = '__uncategorized__';
const UNCATEGORIZED_LABEL = 'Uncategorized';
export const DASHBOARD_PIE_NEUTRAL_COLOR = '#6b7280';

export type SubscriptionRowForPie = {
  price: number;
  interval: string;
  category: { id: string; name: string; color: string | null } | null;
};

type RankedBySubscription = {
  id: string;
  name: string;
  monthlyAmount: number;
};

type CategoryBucket = {
  name: string;
  monthlyAmount: number;
  color: string;
};

function addPercentages<T extends { monthlyAmount: number }>(
  rows: T[],
): (T & { percent: number })[] {
  const total = rows.reduce((s, x) => s + x.monthlyAmount, 0);
  return rows.map((row) => ({
    ...row,
    percent: total > 0 ? (row.monthlyAmount / total) * 100 : 0,
  }));
}

function topNPlusOthersSlice<T extends { monthlyAmount: number; percent: number }>(
  withPercent: T[],
  options: {
    topN: number;
    othersName: string;
    mapRow: (row: T) => SubscriptionSpendSlice;
    othersColor?: string | null;
  },
): SubscriptionSpendSlice[] {
  const { topN, othersName, mapRow, othersColor } = options;
  if (withPercent.length <= topN) {
    return withPercent.map(mapRow);
  }
  const top = withPercent.slice(0, topN);
  const rest = withPercent.slice(topN);
  const othersAmount = rest.reduce((s, x) => s + x.monthlyAmount, 0);
  const totalAmount = withPercent.reduce((s, x) => s + x.monthlyAmount, 0);
  const othersPercent =
    totalAmount > 0 ? (othersAmount / totalAmount) * 100 : 0;

  const othersSlice: SubscriptionSpendSlice = {
    name: othersName,
    monthlyAmount: othersAmount,
    percent: othersPercent,
    ...(othersColor != null ? { color: othersColor } : {}),
  };

  return [...top.map(mapRow), othersSlice];
}

export function groupSpendByCategory(
  rows: SubscriptionRowForPie[],
): CategoryBucket[] {
  const buckets = new Map<string, CategoryBucket>();
  for (const row of rows) {
    const monthly = subscriptionPricePerMonth(row.price, row.interval);
    if (monthly <= 0) continue;
    const key = row.category?.id ?? UNCATEGORIZED_KEY;
    const name = row.category?.name ?? UNCATEGORIZED_LABEL;
    const color = row.category?.color ?? DASHBOARD_PIE_NEUTRAL_COLOR;
    const prev = buckets.get(key);
    if (prev) {
      prev.monthlyAmount += monthly;
    } else {
      buckets.set(key, { name, monthlyAmount: monthly, color });
    }
  }
  return [...buckets.values()].sort((a, b) => b.monthlyAmount - a.monthlyAmount);
}

export function buildPieSlicesFromCategories(
  buckets: CategoryBucket[],
): SubscriptionSpendSlice[] {
  const withPercent = addPercentages(buckets);
  return topNPlusOthersSlice(withPercent, {
    topN: DASHBOARD_PIE_TOP_N,
    othersName: DASHBOARD_PIE_OTHERS_NAME,
    othersColor: DASHBOARD_PIE_NEUTRAL_COLOR,
    mapRow: ({ name, monthlyAmount, percent, color }) => ({
      name,
      monthlyAmount,
      percent,
      color,
    }),
  });
}

export function buildPieSlicesFromRankedSubscriptions(
  ranked: RankedBySubscription[],
): SubscriptionSpendSlice[] {
  const withPercent = addPercentages(ranked);
  return topNPlusOthersSlice(withPercent, {
    topN: DASHBOARD_PIE_TOP_N,
    othersName: DASHBOARD_PIE_OTHERS_NAME,
    othersColor: DASHBOARD_PIE_NEUTRAL_COLOR,
    mapRow: ({ name, monthlyAmount, percent }) => ({
      name,
      monthlyAmount,
      percent,
    }),
  });
}
