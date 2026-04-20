'use client';

import { ProfileMenu } from '@/components/header/profile-menu';
import { MobileMenu } from '@/components/header/mobile-menu';
import { appConfig } from '@/config/app.config';
import { layoutConfig } from '@/config/layout.config';
import { AppLink } from '@/components/navigation/navigation-provider';
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
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const showAccount = hasUsableSession(status, session);
  const isLanding = pathname === '/';
  const userName = session?.user?.name ?? session?.user?.email ?? '';
  const userEmail = session?.user?.email ?? '';
  const isSessionLoading = status === 'loading';

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-lg dark:border-gray-800 dark:bg-black/80"
      style={{ height: layoutConfig.headerHeight }}
    >
      <div
        className={`container mx-auto grid h-16 items-center px-3 sm:px-4 ${
          isLanding
            ? 'grid-cols-[1fr_auto]'
            : 'grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr]'
        }`}
      >
        <AppLink
          href={showAccount ? '/dashboard' : '/'}
          prefetch={false}
          className="justify-self-start text-xl font-bold text-neutral-900 dark:text-white"
        >
          {appConfig.title}
        </AppLink>

        {/* На лендинге меню скрыто; prefetch off — меньше фоновых RSC в dev */}
        {!isLanding ? (
          <nav className="hidden items-center gap-6 justify-self-center lg:flex">
            {appConfig.navigation.map(({ title, href }) => (
              <AppLink
                href={href}
                prefetch={false}
                key={href}
                className={`text-lg transition-colors duration-200 ${
                  pathname === href
                    ? 'text-indigo-700 dark:text-white'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                {title}
              </AppLink>
            ))}
          </nav>
        ) : null}

        {/* Профиль; гостям — пусто */}
        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          <div className="hidden lg:block">
            {isSessionLoading ? (
              <div className="h-9 w-32" aria-hidden="true" />
            ) : showAccount ? (
              <ProfileMenu name={userName} email={userEmail} />
            ) : null}
          </div>
          {isSessionLoading ? (
            <div className="h-10 w-10 lg:hidden" aria-hidden="true" />
          ) : (
            <MobileMenu
              isLanding={isLanding}
              showAccount={showAccount}
              name={userName}
              email={userEmail}
            />
          )}
        </div>
      </div>
    </header>
  );
}
