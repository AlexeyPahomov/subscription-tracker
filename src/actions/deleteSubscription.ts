'use server';

import type { SubscriptionActionFail } from '@/types/subscription';
import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { ensureDatabaseConnection, prisma } from '@/utils/prisma';
import { withMutationPoolRecovery } from '@/utils/dbConnection';

export async function deleteSubscription(
  id: string,
): Promise<{ ok: true } | SubscriptionActionFail> {
  await ensureDatabaseConnection();

  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) return authResult;

  try {
    const result = await withMutationPoolRecovery(() =>
      prisma.subscription.deleteMany({
        where: { id, userId: authResult.userId },
      }),
    );

    if (result.count === 0) {
      return { ok: false, error: 'not_found' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[deleteSubscription]', err);
    return { ok: false, error: 'unknown' };
  }
}
