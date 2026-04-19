import { Subscriptions } from '@/components/subscriptions/subscriptions';
import { requireSessionUserInDb } from '@/helpers/getAuthenticatedUserId';
import { getCategoriesByUserId } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';

export default async function SubscriptionsPage() {
  const userId = await requireSessionUserInDb();

  const [initialSubscriptions, categories] = await Promise.all([
    getSubscriptionsByUserId(userId),
    getCategoriesByUserId(userId),
  ]);

  return (
    <Subscriptions
      initialSubscriptions={initialSubscriptions}
      categories={categories}
    />
  );
}
