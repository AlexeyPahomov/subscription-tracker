/** Типы аналитики дашборда (графики, сводки). */

export type MonthlySpendPoint = {
  monthKey: string;
  label: string;
  amount: number;
};

export type SubscriptionSpendSlice = {
  name: string;
  monthlyAmount: number;
  percent: number;
  /** Цвет категории для pie; для «Others» — нейтральный */
  color?: string | null;
};

export type TopSubscriptionSummary = {
  id: string;
  name: string;
  priceLabel: string;
};

export type DashboardSpendAnalytics = {
  monthlySpendSeries: MonthlySpendPoint[];
  currentMonthlyTotal: number;
  subscriptionCount: number;
  displayCurrency: string;
  pieByCategory: SubscriptionSpendSlice[];
  pieBySubscription: SubscriptionSpendSlice[];
  spendTrendPercent: number | null;
  topSubscription: TopSubscriptionSummary | null;
  subscriptionsAddedThisMonth: number;
};
