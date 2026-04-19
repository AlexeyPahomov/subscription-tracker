import { auth } from '@/auth';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';
import type { SubscriptionActionFail } from '@/types/subscription';
import { redirect } from 'next/navigation';

type AuthenticatedUserId =
  | { ok: true; userId: string }
  | SubscriptionActionFail;

async function userRowExists(userId: string) {
  return withDbRetry(() =>
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
  );
}

export async function getAuthenticatedUserId(): Promise<AuthenticatedUserId> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }
  try {
    const exists = await userRowExists(userId);
    if (!exists) {
      return { ok: false, error: 'unauthorized' };
    }
    return { ok: true, userId };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}

/** Страницы: JWT без строки в User → FK; выход и редирект на главную. */
export async function requireSessionUserInDb(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/');
  let exists;
  try {
    exists = await userRowExists(userId);
  } catch {
    redirect('/');
  }
  if (!exists) {
    redirect('/api/auth/signout?callbackUrl=/');
  }
  return userId;
}
