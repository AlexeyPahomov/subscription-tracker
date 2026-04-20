import { getAuthenticatedUserId } from '@/helpers/getAuthenticatedUserId';
import { prisma } from '@/utils/prisma';
import { withDbRetry } from '@/utils/dbConnection';
import { NextResponse } from 'next/server';

export async function GET() {
  const authResult = await getAuthenticatedUserId();
  if (!authResult.ok) {
    const status = authResult.error === 'unauthorized' ? 401 : 500;
    return NextResponse.json({ error: authResult.error }, { status });
  }

  const user = await withDbRetry(() =>
    prisma.user.findUnique({
      where: { id: authResult.userId },
      select: { id: true, name: true, email: true },
    }),
  );

  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ user });
}
