'use client';

import { useThemePreference } from '@/components/theme/theme-preference-provider';
import {
  THEME_PREFERENCE_OPTIONS,
  type ThemePreference,
} from '@/config/theme-preference';
import { Button } from '@gravity-ui/uikit';
import type { LucideIcon } from 'lucide-react';
import { Monitor, Moon, Sun } from 'lucide-react';

/** Overrides Gravity `Button` surface styles for the segmented control. */
const segmentedActiveClass =
  'bg-white! text-neutral-900! shadow-sm dark:bg-white/15! dark:text-white! dark:shadow-none';

const segmentedInactiveClass =
  'text-neutral-600! hover:text-neutral-900! dark:text-gray-400! dark:hover:text-gray-200!';
const segmentedLayoutClass = 'items-center!';

const THEME_ICONS: Record<ThemePreference, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

type ThemePreferenceOptionProps = {
  value: ThemePreference;
  label: string;
  description: string;
  active: boolean;
  onSelect: (value: ThemePreference) => void;
};

function ThemePreferenceOption({
  value,
  label,
  description,
  active,
  onSelect,
}: ThemePreferenceOptionProps) {
  const Icon = THEME_ICONS[value];

  return (
    <Button
      view="flat"
      size="m"
      type="button"
      title={label}
      aria-pressed={active}
      aria-label={`${label}: ${description}`}
      onClick={() => onSelect(value)}
      className={`${segmentedLayoutClass} ${active ? segmentedActiveClass : segmentedInactiveClass}`}
    >
      <span className="flex items-center gap-2 px-1">
        <Icon size={18} strokeWidth={2} className="block" aria-hidden />
        <span className="hidden sm:inline">{label}</span>
      </span>
    </Button>
  );
}

export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();

  return (
    <div
      className="inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-neutral-300 bg-neutral-100/90 p-0.5 dark:border-white/15 dark:bg-black/25"
      role="group"
      aria-label="Theme"
    >
      {THEME_PREFERENCE_OPTIONS.map(({ value, label, description }) => (
        <ThemePreferenceOption
          key={value}
          value={value}
          label={label}
          description={description}
          active={preference === value}
          onSelect={setPreference}
        />
      ))}
    </div>
  );
}
