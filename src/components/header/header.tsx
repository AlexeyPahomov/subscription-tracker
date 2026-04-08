'use client';

import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { appConfig } from '@/config/app.config';
import { layoutConfig } from '@/config/layout.config';
import { Button, Link } from '@heroui/react';
import NextLink from 'next/link';

export default function Header() {
  const { openLogin, openRegister } = useAuthModals();

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

        {/* Вход/регистрация */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="secondary" className="text-gray-800" onPress={openLogin}>
            Login
          </Button>
          <Button onPress={openRegister}>Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
