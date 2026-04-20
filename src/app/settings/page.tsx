'use client';

import { ThemeSettingsSection } from '@/components/settings/theme-settings-section';
import { useMeQuery } from '@/hooks/useMeQuery';
import { useRedirectOnUnauthorized } from '@/hooks/useRedirectOnUnauthorized';

export default function SettingsPage() {
  const meQuery = useMeQuery();
  useRedirectOnUnauthorized(meQuery.error);

  if (meQuery.isPending || !meQuery.data) {
    return <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-10" />;
  }

  return (
    <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        Settings
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-gray-400">
        Account preferences and app appearance.
      </p>
      <div className="mt-8">
        <ThemeSettingsSection />
      </div>
    </section>
  );
}
