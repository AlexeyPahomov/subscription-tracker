'use client';

import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { Button } from '@gravity-ui/uikit';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const DEFAULT_AUTH_REDIRECT_PATH = '/dashboard';

function resolveReturnTo(rawReturnTo: string | null): string {
  if (!rawReturnTo) return DEFAULT_AUTH_REDIRECT_PATH;
  if (!rawReturnTo.startsWith('/') || rawReturnTo.startsWith('//')) {
    return DEFAULT_AUTH_REDIRECT_PATH;
  }
  return rawReturnTo;
}

export function LandingPage() {
  const { openGetStarted } = useAuthModals();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const returnTo = resolveReturnTo(searchParams.get('returnTo'));

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(returnTo);
    }
  }, [returnTo, router, status]);

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-20">
      <h1 className="text-4xl font-bold text-center">
        Track Your Subscriptions <br /> and Save Money
      </h1>
      <p className="text-lg text-center text-gray-400 max-w-2xl">
        Manage all your recurring payments in one place. <br />
        Get insights, alerts, and never miss a due date.
      </p>
      <Button view="action" size="xl" onClick={openGetStarted}>
        Get Started
      </Button>
    </section>
  );
}
