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

export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<SubscriptionWriteResult> {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) return authResult;

  const parsed = parseSubscriptionPayload(input);
  if (!parsed.ok) {
    return { ok: false, error: 'validation' };
  }

  const { name, price, interval, nextBilling } = parsed;

  try {
    const row = await prisma.subscription.create({
      data: {
        name,
        price,
        currency: defaultSubscriptionCurrency,
        interval,
        nextBilling,
        userId: authResult.userId,
      },
    });
    return { ok: true, subscription: formatSubscriptionForClient(row) };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
