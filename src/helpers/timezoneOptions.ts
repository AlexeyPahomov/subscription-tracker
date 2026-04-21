import type { SelectOption } from '@gravity-ui/uikit';

function supportedTimezones(): string[] {
  return typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('timeZone')
    : ['UTC'];
}

function readTimezoneName(timezone: string, now: Date): string {
  const variants: Array<'shortOffset' | 'short'> = ['shortOffset', 'short'];

  for (const timeZoneName of variants) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(now);
      const value = parts.find((part) => part.type === 'timeZoneName')?.value;
      if (value) return value;
    } catch {
      // Try the next format variant.
    }
  }

  return 'UTC';
}

export function detectInitialTimezone(
  hasPersistedSettings: boolean,
  currentTimezone: string,
): string {
  if (hasPersistedSettings) return currentTimezone;
  const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!detectedTimezone) return currentTimezone;
  return supportedTimezones().includes(detectedTimezone)
    ? detectedTimezone
    : currentTimezone;
}

export function getTimezoneOptions(): SelectOption<string>[] {
  const now = new Date();

  return supportedTimezones().map((timezone) => {
    const timezoneName = readTimezoneName(timezone, now);
    const normalizedOffset = timezoneName.replace('GMT', 'UTC');

    return {
      value: timezone,
      content: `(${normalizedOffset}) ${timezone}`,
    };
  });
}
