import { auth } from '@/auth';
import { prisma } from '@/utils/prisma';
import type { SubscriptionActionFail } from '@/types/subscription';
import { redirect } from 'next/navigation';

type AuthenticatedUserId =
  | { ok: true; userId: string }
  | SubscriptionActionFail;

export async function getAuthenticatedUserId(): Promise<AuthenticatedUserId> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }
  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!exists) {
    return { ok: false, error: 'unauthorized' };
  }
  return { ok: true, userId };
}

/**
 * Для страниц: JWT может содержать id после смены/очистки БД — без строки в User ломаются FK.
 * Редирект на выход и на главную.
 */
export async function requireSessionUserInDb(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/');
  const exists = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!exists) {
    redirect('/api/auth/signout?callbackUrl=/');
  }
  return userId;
}
