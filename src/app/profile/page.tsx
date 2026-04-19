import { auth } from '@/auth';
import { Profile } from '@/components/profile/profile';
import { requireSessionUserInDb } from '@/helpers/getAuthenticatedUserId';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  await requireSessionUserInDb();
  const session = await auth();

  if (!session?.user?.email) {
    redirect('/');
  }

  return (
    <section className="w-full px-4 py-10">
      <Profile
        initialName={session.user.name ?? ''}
        email={session.user.email}
      />
    </section>
  );
}
