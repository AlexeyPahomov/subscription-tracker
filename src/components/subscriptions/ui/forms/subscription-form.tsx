'use client';

import { DatePicker } from '@gravity-ui/date-components';
import type { DateTime } from '@gravity-ui/date-utils';
import {
  responsiveDialogActionsClass,
  responsiveDialogBaseProps,
  responsiveDialogBodyClass,
} from '@/components/dialog/dialog-responsive';
import { useDialogScrollLock } from '@/hooks/useDialogScrollLock';
import {
  Button,
  Dialog,
  Select,
  TextInput,
} from '@gravity-ui/uikit';
import type { ChangeEvent, SubmitEvent } from 'react';
import { CategoryPicker } from './category-picker';
import { intervalSelectOptions } from './constants';
import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';
import type { SubscriptionFormValues } from './types';

type SubscriptionFormProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  values: SubscriptionFormValues;
  categories: UserCategoryOption[];
  onSubmit: (event: SubmitEvent<HTMLFormElement>) => void | Promise<void>;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onIntervalUpdate: (newValue: string[]) => void;
  onCategorySelect: (categoryId: string) => void;
  onNextPaymentDateUpdate: (value: DateTime | null) => void;
  errorMessage?: string | null;
  isSubmitting?: boolean;
};

export function SubscriptionForm({
  open,
  title,
  onClose,
  values,
  categories,
  onSubmit,
  onChange,
  onIntervalUpdate,
  onCategorySelect,
  onNextPaymentDateUpdate,
  errorMessage,
  isSubmitting = false,
}: SubscriptionFormProps) {
  useDialogScrollLock(open);

  return (
    <Dialog
      open={open}
      size="m"
      onClose={onClose}
      hasCloseButton
      {...responsiveDialogBaseProps}
    >
      <Dialog.Header caption={title} />
      <Dialog.Body className={responsiveDialogBodyClass}>
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
            value={[values.interval]}
            onUpdate={onIntervalUpdate}
          />
          <DatePicker
            placeholder="Select next payment date"
            value={values.nextPaymentDate}
            onUpdate={onNextPaymentDateUpdate}
          />
          <CategoryPicker
            categories={categories}
            value={values.categoryId}
            onChange={onCategorySelect}
            disabled={isSubmitting}
          />

          {errorMessage ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className={responsiveDialogActionsClass}>
            <Button
              view="outlined"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              view="action"
              type="submit"
              loading={isSubmitting}
              disabled={!values.nextPaymentDate || isSubmitting}
              className="w-full sm:w-auto"
            >
              Save
            </Button>
          </div>
        </form>
      </Dialog.Body>
    </Dialog>
  );
}
