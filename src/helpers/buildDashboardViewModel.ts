import type { DashboardSpendAnalytics } from '@/types/dashboard-analytics';
import { formatPriceForDisplay } from '@/helpers/formatSubscriptionForClient';
import type {
  UpcomingPaymentItem,
  UpcomingPaymentUrgency,
} from '@/helpers/getUpcomingPaymentsForUser';

const UPCOMING_PREVIEW_COUNT = 3;
const UPCOMING_WEEK_WARNING_THRESHOLD = 50;
const UPCOMING_WEEK_DANGER_THRESHOLD = 100;

export type DashboardNextPaymentCard = {
  name: string;
  dateLabel: string;
  relativeLabel: string;
  urgency: UpcomingPaymentUrgency;
};

export type UpcomingWeekTotalSeverity = 'normal' | 'warning' | 'danger';

export type DashboardViewModel = {
  analytics: DashboardSpendAnalytics;
  upcomingPreview: UpcomingPaymentItem[];
  upcomingWeekTotalLabel: string | null;
  upcomingWeekTotalSeverity: UpcomingWeekTotalSeverity;
  nextPayment: DashboardNextPaymentCard | null;
  showViewAllUpcoming: boolean;
};

function resolveUpcomingWeekTotalSeverity(
  totalAmount: number,
): UpcomingWeekTotalSeverity {
  if (totalAmount > UPCOMING_WEEK_DANGER_THRESHOLD) return 'danger';
  if (totalAmount > UPCOMING_WEEK_WARNING_THRESHOLD) return 'warning';
  return 'normal';
}

function buildUpcomingWeekSummary(upcomingAll: UpcomingPaymentItem[]): {
  upcomingWeekTotalLabel: string | null;
  upcomingWeekTotalSeverity: UpcomingWeekTotalSeverity;
} {
  const upcomingWeekItems = upcomingAll.filter((item) => item.withinNext7Days);
  const weekCurrencies = new Set(
    upcomingWeekItems.map((item) => item.currency),
  );
  if (weekCurrencies.size !== 1) {
    return {
      upcomingWeekTotalLabel: null,
      upcomingWeekTotalSeverity: 'normal',
    };
  }

  const upcomingWeekTotalAmount = upcomingWeekItems.reduce(
    (sum, item) => sum + item.price,
    0,
  );

  return {
    upcomingWeekTotalLabel: formatPriceForDisplay(
      upcomingWeekTotalAmount,
      upcomingWeekItems[0].currency,
    ),
    upcomingWeekTotalSeverity: resolveUpcomingWeekTotalSeverity(
      upcomingWeekTotalAmount,
    ),
  };
}

export function buildDashboardViewModel(
  analytics: DashboardSpendAnalytics,
  upcomingAll: UpcomingPaymentItem[],
): DashboardViewModel {
  const upcomingPreview = upcomingAll.slice(0, UPCOMING_PREVIEW_COUNT);
  const { upcomingWeekTotalLabel, upcomingWeekTotalSeverity } =
    buildUpcomingWeekSummary(upcomingAll);
  const first = upcomingAll[0];
  const nextPayment: DashboardNextPaymentCard | null = first
    ? {
        name: first.name,
        dateLabel: first.dateLabel,
        relativeLabel: first.relativeLabel,
        urgency: first.urgency,
      }
    : null;

  return {
    analytics,
    upcomingPreview,
    upcomingWeekTotalLabel,
    upcomingWeekTotalSeverity,
    nextPayment,
    showViewAllUpcoming: upcomingAll.length > UPCOMING_PREVIEW_COUNT,
  };
}
