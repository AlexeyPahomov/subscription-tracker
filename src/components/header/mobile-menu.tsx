'use client';

import { AppLink, useNavigation } from '@/components/navigation/navigation-provider';
import { appConfig } from '@/config/app.config';
import { useBodyLockClass } from '@/hooks/useBodyLockClass';
import { useDismissibleLayer } from '@/hooks/useDismissibleLayer';
import { useModal } from '@/hooks/useModal';
import { Button, User } from '@gravity-ui/uikit';
import { Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

type MobileMenuProps = {
  isLanding: boolean;
  showAccount: boolean;
  name: string;
  email: string;
};

const toggleButtonClass =
  'inline-flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 bg-white/80 text-neutral-700 transition-colors hover:text-neutral-900 dark:border-white/15 dark:bg-black/30 dark:text-gray-300 dark:hover:text-white';

const closeButtonClass =
  'inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-white';

const navItemBaseClass = 'rounded-md px-2.5 py-1.5 text-sm transition-colors';
const navItemActiveClass = 'bg-indigo-100 text-indigo-700 dark:bg-white/10 dark:text-white';
const navItemIdleClass =
  'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white';

export function MobileMenu({
  isLanding,
  showAccount,
  name,
  email,
}: MobileMenuProps) {
  const { beginNavigation } = useNavigation();
  const pathname = usePathname();
  const { isOpen, open, close } = useModal();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useDismissibleLayer({
    isOpen,
    containerRef: panelRef,
    onDismiss: close,
  });

  useEffect(() => {
    close();
  }, [pathname, close]);

  useBodyLockClass({
    isActive: isOpen,
    className: 'mobile-menu-open',
  });

  function handleSignOutClick() {
    close();
    beginNavigation();
    void signOut({ callbackUrl: '/' });
  }

  function handleProfileClick() {
    close();
    beginNavigation();
  }

  const shouldRender = !isLanding || showAccount;

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={open}
        className={toggleButtonClass}
        aria-expanded={isOpen}
        aria-controls="mobile-header-menu"
        aria-label="Open menu"
      >
        <Menu size={18} aria-hidden />
      </button>

      <div
        className={`fixed top-0 left-0 z-50 h-dvh w-screen transition-opacity duration-200 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        inert={!isOpen}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />

        <div
          id="mobile-header-menu"
          ref={panelRef}
          className={`absolute top-0 right-0 flex h-dvh w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-neutral-200 bg-white p-4 shadow-2xl transition-transform duration-200 dark:border-gray-800 dark:bg-neutral-950 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={close}
              className={closeButtonClass}
              aria-label="Close menu"
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1">
            {!isLanding ? (
              <nav className="flex flex-col gap-1">
                {appConfig.navigation.map(({ title, href }) => (
                  <AppLink
                    href={href}
                    key={href}
                    prefetch={false}
                    onClick={close}
                    className={`${navItemBaseClass} ${pathname === href ? navItemActiveClass : navItemIdleClass}`}
                  >
                    {title}
                  </AppLink>
                ))}
              </nav>
            ) : null}

            {showAccount ? (
              <div className="mt-auto border-t border-neutral-200 pt-3 dark:border-gray-800">
                <User
                  className="pointer-events-none max-w-full px-2 py-1"
                  avatar={{ text: name, theme: 'brand' }}
                  name={name}
                  description={email}
                  size="m"
                />
                <div className="mt-2 flex flex-col gap-1">
                  <Button
                    href="/profile"
                    view="flat"
                    width="max"
                    onClick={handleProfileClick}
                    className="justify-start!"
                  >
                    Edit profile
                  </Button>
                  <Button
                    view="flat"
                    width="max"
                    onClick={handleSignOutClick}
                    className="justify-start!"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
