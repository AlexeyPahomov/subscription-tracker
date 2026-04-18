import { DASHBOARD_CHART_COLORS } from '@/constants/dashboard-chart';
import type { SubscriptionSpendSlice } from '@/types/dashboard-analytics';

export function pieSliceFillColor(
  slice: SubscriptionSpendSlice,
  index: number,
): string {
  return (
    slice.color ??
    DASHBOARD_CHART_COLORS[index % DASHBOARD_CHART_COLORS.length]!
  );
}
