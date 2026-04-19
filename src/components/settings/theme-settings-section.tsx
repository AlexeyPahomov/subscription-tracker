'use client';

import { SettingsSection } from '@/components/settings/settings-section';
import { ThemeToggle } from '@/components/settings/theme-toggle';

export function ThemeSettingsSection() {
  return (
    <SettingsSection
      headingId="settings-appearance-heading"
      title="Appearance"
      description="Choose light, dark, or match your system theme. The setting is saved in this browser."
    >
      <ThemeToggle />
    </SettingsSection>
  );
}
