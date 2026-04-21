import type { UserSettings } from '@/types/user-settings';

export const USER_SETTINGS_DEFAULTS: UserSettings = {
  emailNotifications: true,
  remindBefore: 1,
  timezone: 'UTC',
  currency: 'USD',
};

export const USER_SETTINGS_SELECT = {
  emailNotifications: true,
  remindBefore: true,
  timezone: true,
  currency: true,
} as const;

export function normalizeUserSettingsInput(input: UserSettings): UserSettings | null {
  const remindBefore = Number(input.remindBefore);
  const timezone = input.timezone.trim();
  const currency = input.currency.trim().toUpperCase();

  if (
    !Number.isInteger(remindBefore) ||
    remindBefore < 0 ||
    remindBefore > 30 ||
    !timezone ||
    currency.length !== 3
  ) {
    return null;
  }

  return {
    emailNotifications: Boolean(input.emailNotifications),
    remindBefore,
    timezone,
    currency,
  };
}
