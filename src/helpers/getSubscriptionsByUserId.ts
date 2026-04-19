import { formatSubscriptionForClient } from '@/helpers/formatSubscriptionForClient';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';

export async function getSubscriptionsByUserId(userId: string) {
  const rows = await withDbRetry(() =>
    prisma.subscription.findMany({
      where: { userId },
      orderBy: { nextBilling: 'asc' },
      include: { category: true },
    }),
  );
  return rows.map(formatSubscriptionForClient);
}
