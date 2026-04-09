'use client';

import { DatePicker } from '@gravity-ui/date-components';
import type { DateTime } from '@gravity-ui/date-utils';
import {
  Button,
  Select,
  TextInput,
  type SelectOption,
} from '@gravity-ui/uikit';
import { type ChangeEvent, type SubmitEvent } from 'react';

export type IntervalValue = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

type IntervalOption = {
  value: IntervalValue;
  label: string;
};

const intervals: IntervalOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Every 3 months' },
];

const intervalSelectOptions: SelectOption<IntervalValue>[] = intervals.map(
  (interval) => ({
    value: interval.value,
    content: interval.label,
  }),
);

export type SubscriptionFormValues = {
  name: string;
  price: string;
  interval: IntervalValue | null;
  nextPaymentDate: DateTime | null;
};

export const initialSubscriptionFormValues: SubscriptionFormValues = {
  name: '',
  price: '',
  interval: null,
  nextPaymentDate: null,
};

export function isIntervalValue(value: string): value is IntervalValue {
  return intervals.some((interval) => interval.value === value);
}

export function getIntervalLabel(value: IntervalValue): string {
  return intervals.find((interval) => interval.value === value)?.label ?? value;
}

type SubscriptionFormProps = {
  values: SubscriptionFormValues;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onIntervalUpdate: (newValue: string[]) => void;
  onNextPaymentDateUpdate: (value: DateTime | null) => void;
};

export function SubscriptionForm({
  values,
  onSubmit,
  onCancel,
  onChange,
  onIntervalUpdate,
  onNextPaymentDateUpdate,
}: SubscriptionFormProps) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <TextInput
        name="name"
        type="text"
        placeholder="Netflix"
        value={values.name}
        onChange={onChange}
        controlProps={{ required: true }}
      />
      <TextInput
        name="price"
        type="text"
        placeholder="$9.99"
        value={values.price}
        onChange={onChange}
        controlProps={{ required: true }}
      />
      <Select
        placeholder="Select interval"
        options={intervalSelectOptions}
        value={values.interval ? [values.interval] : []}
        onUpdate={onIntervalUpdate}
      />
      <DatePicker
        placeholder="Select next payment date"
        value={values.nextPaymentDate}
        onUpdate={onNextPaymentDateUpdate}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button view="outlined" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          view="action"
          type="submit"
          disabled={!values.interval || !values.nextPaymentDate}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
