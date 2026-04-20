'use client';

import {
  useSubscriptions,
} from '@/hooks/useSubscriptions';
import {
  SubscriptionActions,
  SubscriptionDeleteConfirmDialog,
  SubscriptionForm,
  SubscriptionsEmpty,
  SubscriptionsList,
} from '@/components/subscriptions/ui';
import { useRedirectOnUnauthorized } from '@/hooks/useRedirectOnUnauthorized';
import { useScrollToSubscriptionFromHash } from '@/hooks/useScrollToSubscriptionFromHash';
import { Loader } from '@gravity-ui/uikit';

export function Subscriptions() {
  const {
    subscriptions,
    isLoading,
    isError,
    error,
    reload,
    isEmpty,
    openAddModal,
    openEditModal,
    requestDelete,
    formDialog,
    deleteDialog,
  } = useSubscriptions();

  useScrollToSubscriptionFromHash(subscriptions);
  useRedirectOnUnauthorized(error);

  if (isLoading) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-10">
        <Loader size="l" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load subscriptions.
        </p>
        <button
          type="button"
          className="mt-3 w-fit rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white"
          onClick={() => void reload()}
        >
          Retry
        </button>
      </section>
    );
  }

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
