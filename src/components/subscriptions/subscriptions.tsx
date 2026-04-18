'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import {
  SubscriptionActions,
  SubscriptionDeleteConfirmDialog,
  SubscriptionForm,
  SubscriptionsEmpty,
  SubscriptionsList,
} from '@/components/subscriptions/ui';
import type { Subscription } from '@/types/subscription';
import { useEffect } from 'react';

type SubscriptionsProps = {
  initialSubscriptions: Subscription[];
};

export function Subscriptions({ initialSubscriptions }: SubscriptionsProps) {
  const {
    subscriptions,
    isEmpty,
    openAddModal,
    openEditModal,
    requestDelete,
    formDialog,
    deleteDialog,
  } = useSubscriptions(initialSubscriptions);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw.startsWith('subscription-')) return;

    const run = () => {
      const el = document.getElementById(raw);
      if (!el) return false;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add(
        'ring-2',
        'ring-indigo-500/60',
        'transition-shadow',
      );
      window.setTimeout(() => {
        el.classList.remove('ring-2', 'ring-indigo-500/60');
      }, 2200);
      return true;
    };

    requestAnimationFrame(() => {
      if (!run()) {
        window.setTimeout(run, 120);
      }
    });
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
      {isEmpty ? (
        <SubscriptionsEmpty onAdd={openAddModal} />
      ) : (
        <>
          <SubscriptionActions onAdd={openAddModal} />
          <SubscriptionsList
            subscriptions={subscriptions}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        </>
      )}

      <SubscriptionForm {...formDialog} />

      {deleteDialog ? (
        <SubscriptionDeleteConfirmDialog {...deleteDialog} />
      ) : null}
    </section>
  );
}
