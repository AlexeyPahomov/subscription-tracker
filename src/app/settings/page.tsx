'use client';

import { ThemeSettingsSection } from '@/components/settings/theme-settings-section';
import { useMeQuery } from '@/hooks/useMeQuery';
import { useRedirectOnUnauthorized } from '@/hooks/useRedirectOnUnauthorized';
import { useUserSettingsQuery } from '@/hooks/useUserSettingsQuery';
import { UserSettingsSection } from '@/components/settings/user-settings-section';
import { Loader } from '@gravity-ui/uikit';

export default function SettingsPage() {
  const meQuery = useMeQuery();
  const userSettingsQuery = useUserSettingsQuery();
  useRedirectOnUnauthorized(meQuery.error);
  useRedirectOnUnauthorized(userSettingsQuery.error);

  if (meQuery.isPending || userSettingsQuery.isPending || !meQuery.data || !userSettingsQuery.data) {
    return (
      <section className="mx-auto flex w-full max-w-2xl flex-1 items-center justify-center px-4 py-10">
        <Loader size="l" />
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
        Settings
      </h1>
      <p className="mt-2 text-sm text-neutral-600 dark:text-gray-400">
        Account preferences and app appearance.
      </p>
      <div className="mt-8 space-y-6">
        <UserSettingsSection initialSettings={userSettingsQuery.data.settings} />
        <ThemeSettingsSection />
      </div>
    </section>
  );
}
