import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PROTECTED_PATH_PREFIXES = ['/dashboard', '/subscriptions', '/profile', '/settings'];
const SESSION_COOKIE_NAME_PREFIXES = [
  '__Secure-authjs.session-token',
  'authjs.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.session-token',
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function resolveSafeReturnTo(rawReturnTo: string | null): string | null {
  if (!rawReturnTo) return null;
  if (!rawReturnTo.startsWith('/') || rawReturnTo.startsWith('//')) return null;
  return rawReturnTo;
}

function isSessionCookieName(cookieName: string): boolean {
  return SESSION_COOKIE_NAME_PREFIXES.some((prefix) => {
    if (cookieName === prefix) return true;
    if (!cookieName.startsWith(`${prefix}.`)) return false;

    const chunkSuffix = cookieName.slice(prefix.length + 1);
    return /^\d+$/.test(chunkSuffix);
  });
}

function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.getAll().some((cookie) => {
    if (!isSessionCookieName(cookie.name)) return false;
    return Boolean(cookie.value);
  });
}

/** Проверяем JWT в Edge и редиректим гостей с приватных роутов до рендера клиента. */
export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const isRootPath = pathname === '/';
  const isPrivatePath = isProtectedPath(pathname);

  if (!isRootPath && !isPrivatePath) return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });
  const isAuthenticated = Boolean(token) || hasSessionCookie(request);

  if (isRootPath && isAuthenticated) {
    const returnTo = resolveSafeReturnTo(searchParams.get('returnTo'));
    if (returnTo) {
      return NextResponse.redirect(new URL(returnTo, request.nextUrl));
    }
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  if (isPrivatePath && !isAuthenticated) {
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
