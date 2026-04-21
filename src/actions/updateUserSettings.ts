'use server';

import { auth } from '@/auth';
import {
  normalizeUserSettingsInput,
  USER_SETTINGS_SELECT,
} from '@/helpers/userSettings';
import type { UserSettings } from '@/types/user-settings';
import { prisma } from '@/utils/prisma';
import { withMutationPoolRecovery } from '@/utils/dbConnection';

type UpdateUserSettingsInput = UserSettings;

type UpdateUserSettingsResult =
  | { ok: true; settings: UserSettings }
  | { ok: false; error: 'unauthorized' | 'validation' | 'unknown' };

export async function updateUserSettings(
  input: UpdateUserSettingsInput,
): Promise<UpdateUserSettingsResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }

  const normalized = normalizeUserSettingsInput(input);
  if (!normalized) {
    return { ok: false, error: 'validation' };
  }

  try {
    const settings = await withMutationPoolRecovery(() =>
      prisma.userSettings.upsert({
        where: { userId },
        update: normalized,
        create: {
          userId,
          ...normalized,
        },
        select: USER_SETTINGS_SELECT,
      }),
    );

    return { ok: true, settings };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
