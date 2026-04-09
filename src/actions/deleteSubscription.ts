'use server';

import type { SubscriptionActionFail } from '@/types/subscription';
import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { prisma } from '@/utils/prisma';

export async function deleteSubscription(
  id: string,
): Promise<{ ok: true } | SubscriptionActionFail> {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) return authResult;

  try {
    const result = await prisma.subscription.deleteMany({
      where: { id, userId: authResult.userId },
    });

    if (result.count === 0) {
      return { ok: false, error: 'not_found' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
