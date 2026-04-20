'use client';

import { Button, User } from '@gravity-ui/uikit';

type MobileMenuAccountSectionProps = {
  name: string;
  email: string;
  onProfileClick: () => void;
  onSignOutClick: () => void;
};

export function MobileMenuAccountSection({
  name,
  email,
  onProfileClick,
  onSignOutClick,
}: MobileMenuAccountSectionProps) {
  return (
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
          onClick={onProfileClick}
          className="justify-start!"
        >
          Edit profile
        </Button>
        <Button
          view="flat"
          width="max"
          onClick={onSignOutClick}
          className="justify-start!"
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
