import { auth } from '@/auth';
import { Subscriptions } from '@/components/subscriptions/subscriptions';
import { getCategoriesByUserId } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';
import { redirect } from 'next/navigation';

export default async function SubscriptionsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/');
  }

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
