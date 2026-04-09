import { auth } from '@/auth';
import type { SubscriptionActionFail } from '@/types/subscription';

type AuthenticatedUserId =
  | { ok: true; userId: string }
  | SubscriptionActionFail;

export async function getAuthenticatedUserId(): Promise<AuthenticatedUserId> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }
  return { ok: true, userId };
}
