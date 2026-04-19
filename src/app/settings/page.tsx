import { ThemeSettingsSection } from '@/components/settings/theme-settings-section';
import { requireSessionUserInDb } from '@/helpers/getAuthenticatedUserId';

export default async function SettingsPage() {
  await requireSessionUserInDb();

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
