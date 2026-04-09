import { auth } from '@/auth';
import { Subscriptions } from '@/components/subscriptions/subscriptions';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect('/');
  }

  const initialSubscriptions = await getSubscriptionsByUserId(userId);

  return <Subscriptions initialSubscriptions={initialSubscriptions} />;
}
