import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  return (
    <section className="w-full px-4 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
    </section>
  );
}
