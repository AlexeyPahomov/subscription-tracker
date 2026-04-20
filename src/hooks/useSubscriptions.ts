'use client';

import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { createSubscription } from '@/actions/createSubscription';
import { queryKeys } from '@/constants/query-keys';
import { deleteSubscription } from '@/actions/deleteSubscription';
import { updateSubscription } from '@/actions/updateSubscription';
import {
  displayDateFormat,
  initialSubscriptionFormValues,
  type SubscriptionFormValues,
} from '@/components/subscriptions/ui/forms';
import { useModal } from '@/hooks/useModal';
import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';
import { getDefaultSubscriptionCategoryId } from '@/helpers/getDefaultSubscriptionCategoryId';
import { getSubscriptionActionErrorMessage } from '@/helpers/getSubscriptionActionErrorMessage';
import { isIntervalValue } from '@/helpers/isIntervalValue';
import {
  useSubscriptionsQuery,
  type SubscriptionsHttpError,
  type SubscriptionsQueryData,
} from '@/hooks/useSubscriptionsQuery';
import type { Subscription } from '@/types/subscription';

export type { SubscriptionsHttpError } from '@/hooks/useSubscriptionsQuery';

function subscriptionRecordToFormValues(
  subscription: Subscription,
): SubscriptionFormValues {
  const nextPaymentDate =
    dateTimeParse(subscription.nextPaymentDate.trim(), {
      format: displayDateFormat,
    }) ?? null;

  return {
    name: subscription.name,
    price: subscription.price,
    interval: subscription.interval,
    categoryId: subscription.category?.id ?? '',
    nextPaymentDate,
  };
}

export function useSubscriptions() {
  const queryClient = useQueryClient();
  const addEditModal = useModal();
  const deleteConfirmModal = useModal();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [values, setValues] = useState<SubscriptionFormValues>(
    initialSubscriptionFormValues,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const query = useSubscriptionsQuery();

  const subscriptions = query.data?.subscriptions ?? [];
  const categoryOptions = query.data?.categories ?? [];

  /** Пока открыто «Добавить»: если категории уже есть, а выбор пуст — ставим «Other». */
  useEffect(() => {
    if (!addEditModal.isOpen || editingId !== null) return;
    const defaultId = getDefaultSubscriptionCategoryId(categoryOptions);
    if (!defaultId) return;
    setValues((prev) => {
      if (prev.categoryId) return prev;
      return { ...prev, categoryId: defaultId };
    });
  }, [addEditModal.isOpen, editingId, categoryOptions]);

  const isEmpty = subscriptions.length === 0;

  const dialogTitle =
    editingId === null ? 'Add subscription' : 'Edit subscription';

  const subscriptionPendingDelete =
    pendingDeleteId === null
      ? undefined
      : subscriptions.find((s) => s.id === pendingDeleteId);

  const createMutation = useMutation({
    mutationFn: createSubscription,
  });

  const updateMutation = useMutation({
    mutationFn: updateSubscription,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubscription,
  });

  function resetFormModal() {
    setEditingId(null);
    setValues(initialSubscriptionFormValues);
    setFormError(null);
  }

  function openAddModal() {
    setEditingId(null);
    setFormError(null);
    setValues({
      ...initialSubscriptionFormValues,
      categoryId: getDefaultSubscriptionCategoryId(categoryOptions),
    });
    addEditModal.open();
  }

  function openEditModal(subscription: Subscription) {
    setEditingId(subscription.id);
    setFormError(null);
    setValues(subscriptionRecordToFormValues(subscription));
    addEditModal.open();
  }

  function closeFormModal() {
    resetFormModal();
    addEditModal.close();
  }

  function requestDelete(id: string) {
    setDeleteError(null);
    setPendingDeleteId(id);
    deleteConfirmModal.open();
  }

  function cancelDelete() {
    setPendingDeleteId(null);
    setDeleteError(null);
    deleteConfirmModal.close();
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;
    const id = pendingDeleteId;
    setDeleteError(null);
    try {
      const result = await deleteMutation.mutateAsync(id);
      if (!result.ok) {
        setDeleteError(getSubscriptionActionErrorMessage(result.error));
        return;
      }
      queryClient.setQueryData<SubscriptionsQueryData>(
        queryKeys.subscriptions,
        (prev) =>
          prev
            ? {
                ...prev,
                subscriptions: prev.subscriptions.filter((s) => s.id !== id),
              }
            : prev,
      );
      setPendingDeleteId(null);
      deleteConfirmModal.close();
    } finally {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleIntervalUpdate(newValue: string[]) {
    const nextValue = newValue[0];
    setValues((prev) => ({
      ...prev,
      interval:
        nextValue && isIntervalValue(nextValue) ? nextValue : prev.interval,
    }));
  }

  function handleCategorySelect(categoryId: string) {
    setValues((prev) => ({ ...prev, categoryId }));
  }

  function handleNextPaymentDateUpdate(value: DateTime | null) {
    setValues((prev) => ({ ...prev, nextPaymentDate: value }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPaymentDateDt = values.nextPaymentDate;
    if (!nextPaymentDateDt) return;

    const nextPaymentDateStr = nextPaymentDateDt.format(displayDateFormat);
    const name = values.name.trim();
    const price = values.price.trim();
    const categoryId =
      values.categoryId.trim() ||
      getDefaultSubscriptionCategoryId(categoryOptions);

    setFormError(null);

    try {
      if (editingId !== null) {
        const result = await updateMutation.mutateAsync({
          id: editingId,
          name,
          price,
          interval: values.interval,
          nextPaymentDate: nextPaymentDateStr,
          categoryId,
        });
        if (!result.ok) {
          setFormError(getSubscriptionActionErrorMessage(result.error));
          return;
        }
        queryClient.setQueryData<SubscriptionsQueryData>(
          queryKeys.subscriptions,
          (prev) =>
            prev
              ? {
                  ...prev,
                  subscriptions: prev.subscriptions.map((s) =>
                    s.id === editingId ? result.subscription : s,
                  ),
                }
              : prev,
        );
      } else {
        const result = await createMutation.mutateAsync({
          name,
          price,
          interval: values.interval,
          nextPaymentDate: nextPaymentDateStr,
          categoryId,
        });
        if (!result.ok) {
          setFormError(getSubscriptionActionErrorMessage(result.error));
          return;
        }
        queryClient.setQueryData<SubscriptionsQueryData>(
          queryKeys.subscriptions,
          (prev) =>
            prev
              ? {
                  ...prev,
                  subscriptions: [...prev.subscriptions, result.subscription],
                }
              : prev,
        );
      }

      resetFormModal();
      addEditModal.close();
    } finally {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return {
    subscriptions,
    categoryOptions,
    isLoading: query.isPending,
    isError: query.isError,
    error: (query.error as SubscriptionsHttpError | null) ?? null,
    reload: query.refetch,
    isEmpty,
    subscriptionPendingDelete,
    openAddModal,
    openEditModal,
    requestDelete,
    formDialog: {
      open: addEditModal.isOpen,
      title: dialogTitle,
      onClose: closeFormModal,
      values,
      categories: categoryOptions,
      onSubmit: handleSubmit,
      onChange: handleChange,
      onIntervalUpdate: handleIntervalUpdate,
      onCategorySelect: handleCategorySelect,
      onNextPaymentDateUpdate: handleNextPaymentDateUpdate,
      errorMessage: formError,
      isSubmitting,
    },
    deleteDialog: subscriptionPendingDelete
      ? {
          open: deleteConfirmModal.isOpen,
          subscriptionName: subscriptionPendingDelete.name,
          onCancel: cancelDelete,
          onConfirm: confirmDelete,
          isDeleting,
          errorMessage: deleteError,
        }
      : null,
  };
}
