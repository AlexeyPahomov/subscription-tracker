import { Subscriptions } from '@/components/subscriptions/subscriptions';
import { requireSessionUserInDb } from '@/helpers/getAuthenticatedUserId';
import { getCategoriesByUserId } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';

export default async function SubscriptionsPage() {
  const userId = await requireSessionUserInDb();

  // Пул к Supabase с max:1 — параллельно два findMany конкурируют за одно соединение и дают timeout.
  const initialSubscriptions = await getSubscriptionsByUserId(userId);
  const categories = await getCategoriesByUserId(userId);

  return (
    <Subscriptions
      initialSubscriptions={initialSubscriptions}
      categories={categories}
    />
  );
}
