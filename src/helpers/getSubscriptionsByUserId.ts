import { formatSubscriptionForClient } from '@/helpers/formatSubscriptionForClient';
import { prisma } from '@/utils/prisma';

export async function getSubscriptionsByUserId(userId: string) {
  const rows = await prisma.subscription.findMany({
    where: { userId },
    orderBy: { nextBilling: 'asc' },
  });
  return rows.map(formatSubscriptionForClient);
}
