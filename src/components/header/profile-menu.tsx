'use client';

import { Button, User } from '@gravity-ui/uikit';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

type ProfileMenuProps = {
  name: string;
  email: string;
};

export function ProfileMenu({ name, email }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  function handleMenuToggle() {
    setOpen((prev) => !prev);
  }

  function handleEditProfileClick() {
    setOpen(false);
  }

  function handleSignOutClick() {
    setOpen(false);
    signOut();
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target || !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={handleMenuToggle}>
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
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
        role="menu"
        aria-hidden={!open}
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
