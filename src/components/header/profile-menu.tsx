'use client';

import { useModal } from '@/hooks/useModal';
import { Button, User } from '@gravity-ui/uikit';
import { signOut } from 'next-auth/react';
import { useEffect, useRef } from 'react';

type ProfileMenuProps = {
  name: string;
  email: string;
};

export function ProfileMenu({ name, email }: ProfileMenuProps) {
  const { isOpen, toggle, close } = useModal();
  const menuRef = useRef<HTMLDivElement | null>(null);

  function handleEditProfileClick() {
    close();
  }

  function handleSignOutClick() {
    close();
    signOut();
  }

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target || !menuRef.current?.contains(target)) {
        close();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, close]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={toggle}>
        <User
          className="max-w-[240px] cursor-pointer px-2 py-1"
          avatar={{ text: name, theme: 'brand' }}
          name={name}
          description={email}
          size="m"
        />
      </div>

      <div
        className={`absolute right-0 top-[calc(100%+8px)] z-50 flex w-24 origin-top-right flex-col rounded-md border border-gray-800 bg-gray-900 p-1 shadow-xl transition-all duration-200 ease-out ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
        role="menu"
        aria-hidden={!isOpen}
      >
        <Button
          href="/profile"
          view="flat"
          width="auto"
          onClick={handleEditProfileClick}
          className="!justify-start"
        >
          Edit profile
        </Button>
        <div className="my-1 h-px w-full bg-gray-800" aria-hidden="true" />
        <Button
          view="flat"
          width="auto"
          onClick={handleSignOutClick}
          className="!justify-start"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
