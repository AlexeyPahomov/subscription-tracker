import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATH_PREFIXES = ['/dashboard', '/subscriptions', '/profile', '/settings'];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** Проверяем JWT в Edge и редиректим гостей с приватных роутов до рендера клиента. */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isRootPath = pathname === '/';
  const isPrivatePath = isProtectedPath(pathname);

  if (!isRootPath && !isPrivatePath) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (isRootPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (isPrivatePath && !token) {
    const redirectUrl = new URL('/', request.nextUrl);
    redirectUrl.searchParams.set('returnTo', `${pathname}${search}`);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/subscriptions/:path*',
    '/profile/:path*',
    '/settings/:path*',
  ],
};
