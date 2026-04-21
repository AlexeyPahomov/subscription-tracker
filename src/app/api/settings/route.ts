import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import {
  USER_SETTINGS_DEFAULTS,
  USER_SETTINGS_SELECT,
} from '@/helpers/userSettings';
import type { UserSettingsQueryData } from '@/types/user-settings';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();
    if (!authResult.ok) {
      const status = authResult.error === 'unauthorized' ? 401 : 500;
      return NextResponse.json({ error: authResult.error }, { status });
    }

    const row = await withDbRetry(() =>
      prisma.userSettings.findUnique({
        where: { userId: authResult.userId },
        select: USER_SETTINGS_SELECT,
      }),
    );
    const settings = row ?? USER_SETTINGS_DEFAULTS;

    const payload: UserSettingsQueryData = {
      settings,
      hasPersistedSettings: Boolean(row),
    };
    return NextResponse.json(payload);
  } catch (error) {
    console.error('[api/settings GET]', error);
    return NextResponse.json({ error: 'unknown' }, { status: 500 });
  }
}
