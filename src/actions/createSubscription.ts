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
import { withMutationPoolRecovery } from '@/utils/dbConnection';

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<SubscriptionWriteResult> {
  try {
    await ensureDatabaseConnection();

    const authResult = await getAuthenticatedUserId();
    if (!authResult.ok) return authResult;

    const parsed = parseSubscriptionPayload(input);
    if (!parsed.ok) {
      return { ok: false, error: 'validation' };
    }

    const { name, price, interval, nextBilling } = parsed;

    const categoryResolved = await resolveCategoryIdForUser(
      authResult.userId,
      input.categoryId,
    );
    if (!categoryResolved.ok) {
      return { ok: false, error: 'validation' };
    }

    const row = await withMutationPoolRecovery(() =>
      prisma.subscription.create({
        data: {
          name,
          price,
          currency: defaultSubscriptionCurrency,
          interval,
          nextBilling,
          userId: authResult.userId,
          categoryId: categoryResolved.categoryId,
        },
        include: { category: true },
      }),
    );

    return { ok: true, subscription: formatSubscriptionForClient(row) };
  } catch (err) {
    console.error('[createSubscription]', err);
    return { ok: false, error: 'unknown' };
  }
}
