'use client';

import { Profile } from '@/components/profile/profile';
import { useMeQuery } from '@/hooks/useMeQuery';
import { useRedirectOnUnauthorized } from '@/hooks/useRedirectOnUnauthorized';

export default function ProfilePage() {
  const meQuery = useMeQuery();
  useRedirectOnUnauthorized(meQuery.error);

  if (meQuery.isPending || !meQuery.data) {
    return <section className="w-full px-4 py-10" />;
  }

  return (
    <section className="w-full px-4 py-10">
      <Profile
        initialName={meQuery.data.user.name ?? ''}
        email={meQuery.data.user.email}
      />
    </section>
  );
}
