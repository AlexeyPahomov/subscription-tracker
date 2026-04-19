'use server';

import { formatSubscriptionForClient } from '@/helpers/formatSubscriptionForClient';
import { parseSubscriptionPayload } from '@/helpers/parseSubscriptionPayload';
import type {
  CreateSubscriptionInput,
  SubscriptionWriteResult,
} from '@/types/subscription';
import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { resolveCategoryIdForUser } from '@/helpers/resolveCategoryIdForUser';
import { defaultSubscriptionCurrency } from '@/constants';
import { ensureDatabaseConnection, prisma } from '@/utils/prisma';
import { withDbRetry, withMutationPoolRecovery } from '@/utils/dbConnection';

type UpdateSubscriptionInput = CreateSubscriptionInput & {
  id: string;
};

export async function updateSubscription(
  input: UpdateSubscriptionInput,
): Promise<SubscriptionWriteResult> {
  await ensureDatabaseConnection();

  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) return authResult;

  const parsed = parseSubscriptionPayload(input);
  if (!parsed.ok) {
    return { ok: false, error: 'validation' };
  }

  const { name, price, interval, nextBilling } = parsed;
  const { userId } = authResult;

  try {
    const categoryResolved = await resolveCategoryIdForUser(userId, input.categoryId);
    if (!categoryResolved.ok) {
      return { ok: false, error: 'validation' };
    }

    const updated = await withMutationPoolRecovery(() =>
      prisma.subscription.updateMany({
        where: { id: input.id, userId },
        data: {
          name,
          price,
          currency: defaultSubscriptionCurrency,
          interval,
          nextBilling,
          categoryId: categoryResolved.categoryId,
        },
      }),
    );

    if (updated.count === 0) {
      return { ok: false, error: 'not_found' };
    }

    const row = await withDbRetry(() =>
      prisma.subscription.findUniqueOrThrow({
        where: { id: input.id },
        include: { category: true },
      }),
    );

    return { ok: true, subscription: formatSubscriptionForClient(row) };
  } catch (err) {
    console.error('[updateSubscription]', err);
    return { ok: false, error: 'unknown' };
  }
}
