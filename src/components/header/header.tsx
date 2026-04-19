'use client';

import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { ProfileMenu } from '@/components/header/profile-menu';
import { appConfig } from '@/config/app.config';
import { layoutConfig } from '@/config/layout.config';
import { Button } from '@gravity-ui/uikit';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

/** Иначе на проде бывает status=authenticated при пустом/битом JWT (старый cookie, другой секрет). */
function hasUsableSession(
  status: ReturnType<typeof useSession>['status'],
  session: ReturnType<typeof useSession>['data'],
): boolean {
  if (status !== 'authenticated' || !session?.user) return false;
  const { id, email, name } = session.user;
  return Boolean(id && (email || name));
}

export default function Header() {
  const { openLogin, openRegister } = useAuthModals();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const showAccount = hasUsableSession(status, session);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-lg"
      style={{ height: layoutConfig.headerHeight }}
    >
      <div className="container mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4">
        <NextLink
          href={showAccount ? '/dashboard' : '/'}
          prefetch={false}
          className="justify-self-start text-xl font-bold text-white"
        >
          {appConfig.title}
        </NextLink>

        {/* Навигация — prefetch off: иначе в dev сыплются фоновые RSC-запросы к каждому маршруту */}
        <nav className="hidden items-center gap-6 justify-self-center md:flex">
          {appConfig.navigation.map(({ title, href }) => (
            <NextLink
              href={href}
              prefetch={false}
              key={href}
              className={`text-lg transition-colors ${
                pathname === href
                  ? 'text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {title}
            </NextLink>
          ))}
        </nav>

        {/* Вход / профиль */}
        <div className="hidden items-center gap-3 justify-self-end md:flex">
          {status === 'loading' ? (
            <div className="h-9 w-32" aria-hidden="true" />
          ) : showAccount ? (
            <ProfileMenu
              name={session?.user?.name ?? session?.user?.email ?? ''}
              email={session?.user?.email ?? ''}
            />
          ) : (
            <>
              <Button view="outlined" onClick={openLogin}>
                Sign in
              </Button>
              <Button view="action" onClick={openRegister}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
