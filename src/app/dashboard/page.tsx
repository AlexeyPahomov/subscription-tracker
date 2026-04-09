import { auth } from '@/auth';
import { SubscriptionsList } from '@/components/subscriptions/subscriptions-list';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return <SubscriptionsList />;
}
