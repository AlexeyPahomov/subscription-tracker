import { auth } from '@/auth';
import { ProfileForm } from '@/components/profile/profile-form';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect('/');
  }

  return (
    <section className="w-full px-4 py-10">
      <ProfileForm
        initialName={session.user.name ?? ''}
        email={session.user.email}
      />
    </section>
  );
}
