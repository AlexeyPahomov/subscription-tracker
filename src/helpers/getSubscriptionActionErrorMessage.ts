import type { SubscriptionActionError } from '@/types/subscription';

const MESSAGES: Record<SubscriptionActionError, string> = {
  unauthorized: 'Session expired. Sign in again.',
  validation: 'Check the fields and try again.',
  not_found: 'Subscription not found or already removed.',
  unknown: 'Something went wrong. Try again.',
};

export function getSubscriptionActionErrorMessage(
  error: SubscriptionActionError,
): string {
  return MESSAGES[error];
}
