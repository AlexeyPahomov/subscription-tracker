'use client';
import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { appConfig } from '@/config/app.config';
import { layoutConfig } from '@/config/layout.config';
import { Button, Link } from '@heroui/react';
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
            <Link
              href={href}
              key={href}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {title}
            </Link>
          ))}
        </nav>

        {/* Вход / профиль */}
        <div className="hidden md:flex items-center gap-3">
          {status === 'authenticated' ? (
            <>
              <span className="max-w-[200px] truncate text-sm text-gray-300">
                {session.user?.name ?? session.user?.email}
              </span>
              <Button
                variant="secondary"
                className="text-gray-800"
                onPress={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                className="text-gray-800"
                onPress={openLogin}
              >
                Login
              </Button>
              <Button onPress={openRegister}>Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
