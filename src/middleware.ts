import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/** Редирект гостей с `/` не нужен; залогиненных — на /dashboard без импорта auth.ts (там Prisma → не Edge). */
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
