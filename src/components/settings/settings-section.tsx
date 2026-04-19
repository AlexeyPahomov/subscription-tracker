import type { ReactNode } from 'react';

type SettingsSectionProps = {
  /** `id` у `<h2>` и значение `aria-labelledby` у `<section>`. */
  headingId: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SettingsSection({
  headingId,
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section
      className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 dark:border-white/10 dark:bg-white/5"
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="text-lg font-semibold text-neutral-900 dark:text-white"
      >
        {title}
      </h2>
      <p className="mt-2 max-w-xl text-sm text-neutral-600 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
