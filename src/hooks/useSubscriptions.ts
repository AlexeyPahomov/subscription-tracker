'use client';

import { dateTimeParse, type DateTime } from '@gravity-ui/date-utils';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import {
  displayDateFormat,
  initialSubscriptionFormValues,
  subscriptionIntervals,
  type IntervalValue,
  type SubscriptionFormValues,
} from '@/components/subscriptions/ui/forms';
import { useModal } from '@/hooks/useModal';

export type Subscription = {
  id: string;
  name: string;
  price: string;
  interval: IntervalValue;
  nextPaymentDate: string;
};

function isIntervalValue(value: string): value is IntervalValue {
  return subscriptionIntervals.some((interval) => interval.value === value);
}

/** Заполняет форму из сохранённой подписки (дата в формате DD.MM.YYYY). */
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
    nextPaymentDate,
  };
}

export function useSubscriptions() {
  const addEditModal = useModal();
  const deleteConfirmModal = useModal();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [values, setValues] = useState<SubscriptionFormValues>(
    initialSubscriptionFormValues,
  );

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
  }

  function openAddModal() {
    resetFormModal();
    addEditModal.open();
  }

  function openEditModal(subscription: Subscription) {
    setEditingId(subscription.id);
    setValues(subscriptionRecordToFormValues(subscription));
    addEditModal.open();
  }

  function closeFormModal() {
    resetFormModal();
    addEditModal.close();
  }

  function requestDelete(id: string) {
    setPendingDeleteId(id);
    deleteConfirmModal.open();
  }

  function cancelDelete() {
    setPendingDeleteId(null);
    deleteConfirmModal.close();
  }

  function confirmDelete() {
    if (pendingDeleteId) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== pendingDeleteId));
    }
    setPendingDeleteId(null);
    deleteConfirmModal.close();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleIntervalUpdate(newValue: string[]) {
    const nextValue = newValue[0];
    setValues((prev) => ({
      ...prev,
      interval: nextValue && isIntervalValue(nextValue) ? nextValue : null,
    }));
  }

  function handleNextPaymentDateUpdate(value: DateTime | null) {
    setValues((prev) => ({ ...prev, nextPaymentDate: value }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const interval = values.interval;
    const nextPaymentDateDt = values.nextPaymentDate;
    if (!interval || !nextPaymentDateDt) return;

    const nextPaymentDateStr = nextPaymentDateDt.format(displayDateFormat);
    const name = values.name.trim();
    const price = values.price.trim();

    if (editingId !== null) {
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name,
                price,
                interval,
                nextPaymentDate: nextPaymentDateStr,
              }
            : s,
        ),
      );
    } else {
      const nextItem: Subscription = {
        id: crypto.randomUUID(),
        name,
        price,
        interval,
        nextPaymentDate: nextPaymentDateStr,
      };
      setSubscriptions((prev) => [...prev, nextItem]);
    }

    resetFormModal();
    addEditModal.close();
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
      onSubmit: handleSubmit,
      onChange: handleChange,
      onIntervalUpdate: handleIntervalUpdate,
      onNextPaymentDateUpdate: handleNextPaymentDateUpdate,
    },
    deleteDialog: subscriptionPendingDelete
      ? {
          open: deleteConfirmModal.isOpen,
          subscriptionName: subscriptionPendingDelete.name,
          onCancel: cancelDelete,
          onConfirm: confirmDelete,
        }
      : null,
  };
}
