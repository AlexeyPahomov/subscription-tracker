'use client';
import { updateUserSettings } from '@/actions/updateUserSettings';
import { queryKeys } from '@/constants/query-keys';
import { SETTINGS_MESSAGES } from '@/constants/messages/settings';
import { SettingsSection } from '@/components/settings/settings-section';
import {
  detectInitialTimezone,
  getTimezoneOptions,
} from '@/helpers/timezoneOptions';
import type {
  UserSettings,
  UserSettingsQueryData,
} from '@/types/user-settings';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Select, TextInput } from '@gravity-ui/uikit';
import { useMemo, useState, type ChangeEvent, type FormEventHandler } from 'react';

type UserSettingsSectionProps = {
  initialSettings: UserSettings;
  hasPersistedSettings: boolean;
};

export function UserSettingsSection({
  initialSettings,
  hasPersistedSettings,
}: UserSettingsSectionProps) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<UserSettings>(() => ({
    ...initialSettings,
    timezone: detectInitialTimezone(
      hasPersistedSettings,
      initialSettings.timezone,
    ),
  }));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
  });

  const timezoneOptions = useMemo(() => getTimezoneOptions(), []);

  const hasChanges = useMemo(
    () =>
      values.emailNotifications !== initialSettings.emailNotifications ||
      values.remindBefore !== initialSettings.remindBefore ||
      values.timezone.trim() !== initialSettings.timezone.trim() ||
      values.currency.trim().toUpperCase() !==
        initialSettings.currency.trim().toUpperCase(),
    [initialSettings, values],
  );

  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === 'currency') {
      setValues((prev) => ({ ...prev, currency: value.toUpperCase() }));
      return;
    }

    if (name === 'remindBefore') {
      const parsed = Number(value);
      setValues((prev) => ({
        ...prev,
        remindBefore: Number.isFinite(parsed) ? parsed : prev.remindBefore,
      }));
    }
  }

  function handleNotificationsChange(event: ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({
      ...prev,
      emailNotifications: event.target.checked,
    }));
  }

  function handleTimezoneUpdate(nextTimezone: string[]) {
    const value = nextTimezone[0];
    if (!value) return;
    setValues((prev) => ({ ...prev, timezone: value }));
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!hasChanges || updateSettingsMutation.isPending) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await updateSettingsMutation.mutateAsync(values);
      if (!result.ok) {
        if (result.error === 'validation') {
          setError(SETTINGS_MESSAGES.validationError);
        } else if (result.error === 'unauthorized') {
          setError(SETTINGS_MESSAGES.unauthorizedError);
        } else {
          setError(SETTINGS_MESSAGES.saveError);
        }
        return;
      }

      const nextData: UserSettingsQueryData = {
        settings: result.settings,
        hasPersistedSettings: true,
      };
      queryClient.setQueryData(queryKeys.settings, nextData);
      await queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      setValues(result.settings);
      setSuccess(SETTINGS_MESSAGES.saveSuccess);
    } catch {
      setError(SETTINGS_MESSAGES.saveError);
    }
  };

  return (
    <SettingsSection
      headingId="settings-preferences-heading"
      title="Preferences"
      description="Set your reminder window and delivery preferences."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex items-center gap-3 text-sm text-neutral-700 dark:text-gray-200">
          <input
            type="checkbox"
            name="emailNotifications"
            checked={values.emailNotifications}
            onChange={handleNotificationsChange}
          />
          Email notifications enabled
        </label>

        <TextInput
          name="remindBefore"
          type="number"
          label="Remind before (days)"
          value={String(values.remindBefore)}
          onChange={handleTextChange}
          controlProps={{ min: 0, max: 30, step: 1 }}
        />

        <Select
          label="Timezone (IANA)"
          options={timezoneOptions}
          value={[values.timezone]}
          onUpdate={handleTimezoneUpdate}
          placeholder="Select timezone"
        />

        <TextInput
          name="currency"
          type="text"
          label="Currency"
          value={values.currency}
          onChange={handleTextChange}
          controlProps={{ required: true, maxLength: 3, readOnly: true }}
        />

        {error ? (
          <p className="text-sm text-(--g-color-text-danger)" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-(--g-color-text-positive)" role="status">
            {success}
          </p>
        ) : null}

        <div className="flex justify-end">
          <Button
            view="action"
            type="submit"
            loading={updateSettingsMutation.isPending}
            disabled={!hasChanges || updateSettingsMutation.isPending}
          >
            Save preferences
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
