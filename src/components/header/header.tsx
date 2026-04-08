'use client';import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { appConfig } from '@/config/app.config';
import { layoutConfig } from '@/config/layout.config';
import { Person } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';
import NextLink from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { openLogin, openRegister } = useAuthModals();
  const { data: session, status } = useSession();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-lg"
      style={{ height: layoutConfig.headerHeight }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NextLink href="/" className="text-xl font-bold text-white">
          {appConfig.title}
        </NextLink>

        {/* Навигация */}
        <nav className="hidden md:flex items-center gap-6">
          {appConfig.navigation.map(({ title, href }) => (
            <NextLink
              href={href}
              key={href}
              className="text-gray-300 text-[18px] transition-colors hover:text-white"
            >
              {title}
            </NextLink>
          ))}
        </nav>

        {/* Вход / профиль */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'authenticated' ? (
            <>
              <span className="flex max-w-[200px] items-center gap-1 truncate text-sm text-gray-300">
                <Icon
                  data={Person}
                  size={16}
                  className="shrink-0 text-gray-400"
                />
                <span className="truncate">
                  {session.user?.name ?? session.user?.email}
                </span>
              </span>
              <Button view="outlined" onClick={() => signOut()}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button view="outlined" onClick={openLogin}>
                Login
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
