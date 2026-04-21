import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { getCategoriesByUserId } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authResult = await getAuthenticatedUserId();
    if (!authResult.ok) {
      const status = authResult.error === 'unauthorized' ? 401 : 500;
      return NextResponse.json({ error: authResult.error }, { status });
    }

    const { userId } = authResult;
    const [subscriptions, categories] = await Promise.all([
      getSubscriptionsByUserId(userId),
      getCategoriesByUserId(userId),
    ]);

    return NextResponse.json({ subscriptions, categories });
  } catch (error) {
    console.error('[api/subscriptions GET]', error);
    return NextResponse.json({ error: 'unknown' }, { status: 500 });
  }
}
