import { auth } from '@/auth';
import { prisma } from '@/utils/prisma';
import { withDbRetry, withMutationPoolRecovery } from '@/utils/dbConnection';
import { redirect } from 'next/navigation';

type AuthenticatedUserId =
  | { ok: true; userId: string }
  | { ok: false; error: 'unauthorized' | 'unknown' };

async function userRowExists(userId: string) {
  return withMutationPoolRecovery(() =>
    withDbRetry(() =>
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    ),
  );
}

export async function getAuthenticatedUserId(): Promise<AuthenticatedUserId> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }
  return { ok: true, userId };
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
