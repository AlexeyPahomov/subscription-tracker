import type { DashboardSpendAnalytics } from '@/helpers/getDashboardSpendAnalytics';
import type {
  UpcomingPaymentItem,
  UpcomingPaymentUrgency,
} from '@/helpers/getUpcomingPaymentsForUser';

export const DASHBOARD_UPCOMING_PREVIEW_COUNT = 3;

export type DashboardNextPaymentCard = {
  name: string;
  dateLabel: string;
  relativeLabel: string;
  urgency: UpcomingPaymentUrgency;
};

export type DashboardViewModel = {
  analytics: DashboardSpendAnalytics;
  upcomingPreview: UpcomingPaymentItem[];
  nextPayment: DashboardNextPaymentCard | null;
  showViewAllUpcoming: boolean;
};

export function buildDashboardViewModel(
  analytics: DashboardSpendAnalytics,
  upcomingAll: UpcomingPaymentItem[],
): DashboardViewModel {
  const upcomingPreview = upcomingAll.slice(0, DASHBOARD_UPCOMING_PREVIEW_COUNT);
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
    nextPayment,
    showViewAllUpcoming: upcomingAll.length > DASHBOARD_UPCOMING_PREVIEW_COUNT,
  };
}
