'use server';

import { formatSubscriptionForClient } from '@/helpers/formatSubscriptionForClient';
import { parseSubscriptionPayload } from '@/helpers/parseSubscriptionPayload';
import type {
  CreateSubscriptionInput,
  SubscriptionWriteResult,
} from '@/types/subscription';
import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { defaultSubscriptionCurrency } from '@/constants';
import { prisma } from '@/utils/prisma';

type UpdateSubscriptionInput = CreateSubscriptionInput & {
  id: string;
};

export async function updateSubscription(
  input: UpdateSubscriptionInput,
): Promise<SubscriptionWriteResult> {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) return authResult;

  const parsed = parseSubscriptionPayload(input);
  if (!parsed.ok) {
    return { ok: false, error: 'validation' };
  }

  const { name, price, interval, nextBilling } = parsed;
  const { userId } = authResult;

  try {
    const updated = await prisma.subscription.updateMany({
      where: { id: input.id, userId },
      data: {
        name,
        price,
        currency: defaultSubscriptionCurrency,
        interval,
        nextBilling,
      },
    });

    if (updated.count === 0) {
      return { ok: false, error: 'not_found' };
    }

    const row = await prisma.subscription.findUniqueOrThrow({
      where: { id: input.id },
    });

    return { ok: true, subscription: formatSubscriptionForClient(row) };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
