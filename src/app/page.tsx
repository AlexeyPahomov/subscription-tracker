'use client';

import { useAuthModals } from '@/components/auth/auth-modals-provider';
import { Button } from '@heroui/react';

export default function HomePage() {
  const { openRegister } = useAuthModals();

  return (
    <section className="flex flex-col items-center justify-center gap-8 py-20">
      <h1 className="text-4xl font-bold text-center">
        Track Your Subscriptions <br /> and Save Money
      </h1>
      <p className="text-lg text-center text-gray-400 max-w-2xl">
        Manage all your recurring payments in one place. <br />
        Get insights, alerts, and never miss a due date.
      </p>
      <Button size="lg" className="bg-purple-500 hover:bg-purple-600" onPress={openRegister}>
        Get Started
      </Button>
    </section>
  );
}
