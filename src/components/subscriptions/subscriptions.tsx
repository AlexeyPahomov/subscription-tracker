'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import {
  SubscriptionActions,
  SubscriptionDeleteConfirmDialog,
  SubscriptionForm,
  SubscriptionsEmpty,
  SubscriptionsList,
} from '@/components/subscriptions/ui';

export function Subscriptions() {
  const {
    subscriptions,
    isEmpty,
    openAddModal,
    openEditModal,
    requestDelete,
    formDialog,
    deleteDialog,
  } = useSubscriptions();

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
