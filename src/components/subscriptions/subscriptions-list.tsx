'use client';

import type { DateTime } from '@gravity-ui/date-utils';
import { SquarePlus } from '@gravity-ui/icons';
import { Button, Dialog, Icon } from '@gravity-ui/uikit';
import { useMemo, useState, type ChangeEvent, type SubmitEvent } from 'react';
import {
  getIntervalLabel,
  initialSubscriptionFormValues,
  isIntervalValue,
  SubscriptionForm,
  type IntervalValue,
  type SubscriptionFormValues,
} from '@/components/subscriptions/subscription-form';
import { SubscriptionCard } from '@/components/subscriptions/subscription-card';

type Subscription = {
  id: string;
  name: string;
  price: string;
  interval: IntervalValue;
  nextPaymentDate: string;
};

export function SubscriptionsList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [values, setValues] = useState<SubscriptionFormValues>(
    initialSubscriptionFormValues,
  );

  const isEmpty = subscriptions.length === 0;

  const formattedDate = useMemo(() => {
    if (!values.nextPaymentDate) return '';
    return values.nextPaymentDate.format('DD.MM.YYYY');
  }, [values.nextPaymentDate]);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
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

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.interval || !values.nextPaymentDate) return;

    const nextItem: Subscription = {
      id: crypto.randomUUID(),
      name: values.name.trim(),
      price: values.price.trim(),
      interval: values.interval,
      nextPaymentDate: formattedDate,
    };

    setSubscriptions((prev) => [...prev, nextItem]);
    setValues(initialSubscriptionFormValues);
    closeModal();
  }

  function handleNextPaymentDateUpdate(value: DateTime | null) {
    setValues((prev) => ({ ...prev, nextPaymentDate: value }));
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        {!isEmpty ? (
          <Button view="action" onClick={openModal}>
            <Icon data={SquarePlus} size={18} />
            Add subscription
          </Button>
        ) : null}
      </div>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-gray-700 px-4 py-14 text-center">
          <p className="text-lg text-gray-300">You have no subscriptions yet</p>
          <Button view="action" size="l" onClick={openModal}>
            Add your first subscription
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              name={subscription.name}
              price={subscription.price}
              interval={getIntervalLabel(subscription.interval)}
              nextPaymentDate={subscription.nextPaymentDate}
            />
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} size="m" onClose={closeModal} hasCloseButton>
        <Dialog.Header caption="Add subscription" />
        <Dialog.Body className="pt-2">
          <SubscriptionForm
            values={values}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            onChange={handleChange}
            onIntervalUpdate={handleIntervalUpdate}
            onNextPaymentDateUpdate={handleNextPaymentDateUpdate}
          />
        </Dialog.Body>
      </Dialog>
    </section>
  );
}
