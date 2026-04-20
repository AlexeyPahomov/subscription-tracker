import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { getCategoriesByUserId } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionsByUserId } from '@/helpers/getSubscriptionsByUserId';
import { NextResponse } from 'next/server';

export async function GET() {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) {
    const status = authResult.error === 'unauthorized' ? 401 : 500;
    return NextResponse.json({ error: authResult.error }, { status });
  }

  const { userId } = authResult;
  const subscriptions = await getSubscriptionsByUserId(userId);
  const categories = await getCategoriesByUserId(userId);

  return NextResponse.json({ subscriptions, categories });
}
