import type { SelectOption } from '@gravity-ui/uikit';
import type { IntervalValue } from '@/types/subscription';
import type { IntervalOption, SubscriptionFormValues } from './types';

export const subscriptionIntervals: IntervalOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'quarterly', label: 'Every 3 months' },
];

export const displayDateFormat = 'DD.MM.YYYY' as const;

export const initialSubscriptionFormValues: SubscriptionFormValues = {
  name: '',
  price: '',
  interval: subscriptionIntervals[0]!.value,
  categoryId: '',
  nextPaymentDate: null,
};

export const intervalSelectOptions: SelectOption<IntervalValue>[] =
  subscriptionIntervals.map((interval) => ({
    value: interval.value,
    content: interval.label,
  }));
