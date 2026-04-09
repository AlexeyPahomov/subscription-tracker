'use client';

import { DatePicker } from '@gravity-ui/date-components';
import type { DateTime } from '@gravity-ui/date-utils';
import {
  Button,
  Dialog,
  Select,
  TextInput,
} from '@gravity-ui/uikit';
import type { ChangeEvent, SubmitEvent } from 'react';
import { intervalSelectOptions } from './constants';
import type { SubscriptionFormValues } from './types';

type SubscriptionFormProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  values: SubscriptionFormValues;
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onIntervalUpdate: (newValue: string[]) => void;
  onNextPaymentDateUpdate: (value: DateTime | null) => void;
};

export function SubscriptionForm({
  open,
  title,
  onClose,
  values,
  onSubmit,
  onChange,
  onIntervalUpdate,
  onNextPaymentDateUpdate,
}: SubscriptionFormProps) {
  return (
    <Dialog open={open} size="m" onClose={onClose} hasCloseButton>
      <Dialog.Header caption={title} />
      <Dialog.Body className="pt-2">
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
            <Button view="outlined" type="button" onClick={onClose}>
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
      </Dialog.Body>
    </Dialog>
  );
}
