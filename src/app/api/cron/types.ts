import type { Recipient } from '@/types/reminder';

export type CandidateSubscription = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  nextBilling: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    settings: {
      emailNotifications: boolean;
      remindBefore: number;
      timezone: string;
      lastNotified: Date | null;
    } | null;
  };
};

export type BuildRecipientsResult = {
  recipients: Recipient[];
  skippedAlreadyNotified: number;
  skippedNoDueSubscriptions: number;
  skippedOutsideDeliveryWindow: number;
};

export type CronStats = {
  sentCount: number;
  failedCount: number;
  recipientsCount: number;
  processedSubscriptionsCount: number;
  skippedAlreadyNotified: number;
  skippedNoDueSubscriptions: number;
  skippedOutsideDeliveryWindow: number;
};
