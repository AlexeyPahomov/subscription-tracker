'use client';
import { Button, Link } from '@heroui/react';
import NextLink from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Логотип */}
        <NextLink href="/" className="text-xl font-bold text-white">
          Subscription Tracker
        </NextLink>

        {/* Десктопная навигация */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/subscriptions"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Subscriptions
          </Link>
          <Link
            href="/settings"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Settings
          </Link>
        </nav>

        {/* Кнопки входа/регистрации (десктоп) */}
        <div className="hidden md:flex items-center gap-2">
          <NextLink href="/login">
            <Button>Login</Button>
          </NextLink>
          <NextLink href="/register">
            <Button>Sign Up</Button>
          </NextLink>
        </div>

        {/* Кнопка мобильного меню */}
        <button
          className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Мобильное меню */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-lg">
          <div className="flex flex-col p-4 space-y-3">
            <Link
              href="/dashboard"
              className="py-2 text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/subscriptions"
              className="py-2 text-gray-300 hover:text-white transition-colors"
            >
              Subscriptions
            </Link>
            <Link
              href="/settings"
              className="py-2 text-gray-300 hover:text-white transition-colors"
            >
              Settings
            </Link>
            <div className="pt-2 flex flex-col gap-2">
              <NextLink href="/login">
                <Button>Login</Button>
              </NextLink>
              <NextLink href="/register">
                <Button>Sign Up</Button>
              </NextLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
