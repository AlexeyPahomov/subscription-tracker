import { auth } from '@/auth';
import { Subscriptions } from '@/components/subscriptions/subscriptions';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return <Subscriptions />;
}
