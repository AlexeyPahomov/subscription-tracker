'use client';

import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from 'react';
import { createSubscription } from '@/actions/createSubscription';
import { deleteSubscription } from '@/actions/deleteSubscription';
import { updateSubscription } from '@/actions/updateSubscription';
import {
  displayDateFormat,
  initialSubscriptionFormValues,
  type SubscriptionFormValues,
} from '@/components/subscriptions/ui/forms';
import { useModal } from '@/hooks/useModal';
import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';
import { getSubscriptionActionErrorMessage } from '@/helpers/getSubscriptionActionErrorMessage';
import { isIntervalValue } from '@/helpers/isIntervalValue';
import type { Subscription } from '@/types/subscription';

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

export function useSubscriptions(
  initialSubscriptions: Subscription[],
  categoryOptions: UserCategoryOption[],
) {
  const addEditModal = useModal();
  const deleteConfirmModal = useModal();

  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [values, setValues] = useState<SubscriptionFormValues>(
    initialSubscriptionFormValues,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setSubscriptions(initialSubscriptions);
  }, [initialSubscriptions]);

  const isEmpty = subscriptions.length === 0;

  const dialogTitle =
    editingId === null ? 'Add subscription' : 'Edit subscription';

  const subscriptionPendingDelete =
    pendingDeleteId === null
      ? undefined
      : subscriptions.find((s) => s.id === pendingDeleteId);

  function resetFormModal() {
    setEditingId(null);
    setValues(initialSubscriptionFormValues);
    setFormError(null);
  }

  function openAddModal() {
    resetFormModal();
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
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const result = await deleteSubscription(id);
      if (!result.ok) {
        setDeleteError(getSubscriptionActionErrorMessage(result.error));
        return;
      }
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      setPendingDeleteId(null);
      deleteConfirmModal.close();
    } finally {
      setIsDeleting(false);
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

  function handleCategoryUpdate(newValue: string[]) {
    const nextValue = newValue[0];
    setValues((prev) => ({
      ...prev,
      categoryId: nextValue ?? '',
    }));
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

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (editingId !== null) {
        const result = await updateSubscription({
          id: editingId,
          name,
          price,
          interval: values.interval,
          nextPaymentDate: nextPaymentDateStr,
          categoryId: values.categoryId || null,
        });
        if (!result.ok) {
          setFormError(getSubscriptionActionErrorMessage(result.error));
          return;
        }
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === editingId ? result.subscription : s)),
        );
      } else {
        const result = await createSubscription({
          name,
          price,
          interval: values.interval,
          nextPaymentDate: nextPaymentDateStr,
          categoryId: values.categoryId || null,
        });
        if (!result.ok) {
          setFormError(getSubscriptionActionErrorMessage(result.error));
          return;
        }
        setSubscriptions((prev) => [...prev, result.subscription]);
      }

      resetFormModal();
      addEditModal.close();
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    subscriptions,
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
      onCategoryUpdate: handleCategoryUpdate,
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
