import type {
  Category as DbCategory,
  Subscription as DbSubscription,
} from '@/generated/prisma/client';
import type { IntervalValue } from '@/types/subscription';
import type { Subscription } from '@/types/subscription';
import { defaultSubscriptionCurrency } from '@/constants';
import { isIntervalValue } from '@/helpers/isIntervalValue';
import { resolveNextBillingDate } from '@/helpers/resolveNextBillingDate';

function normalizeInterval(value: string): IntervalValue {
  return isIntervalValue(value) ? value : 'monthly';
}

function formatDisplayDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatCurrencyLeadingSymbol(price: number, currencyCode: string): string {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
  });
  const parts = formatter.formatToParts(price);
  const currencyParts = parts.filter((p) => p.type === 'currency');
  const numberParts = parts.filter((p) => p.type !== 'currency');
  return [...currencyParts, ...numberParts].map((p) => p.value).join('');
}

export function formatPriceForDisplay(price: number, currency: string): string {
  const code =
    currency.length === 3 ? currency : defaultSubscriptionCurrency;
  try {
    return formatCurrencyLeadingSymbol(price, code);
  } catch {
    return `${code} ${price}`;
  }
}

type SubscriptionRow = DbSubscription & { category?: DbCategory | null };

export function formatSubscriptionForClient(row: SubscriptionRow): Subscription {
  const cat = row.category;
  const interval = normalizeInterval(row.interval);
  const nextBilling = resolveNextBillingDate(new Date(row.nextBilling), interval);

  return {
    id: row.id,
    name: row.name,
    price: formatPriceForDisplay(row.price, row.currency),
    interval,
    nextPaymentDate: formatDisplayDate(nextBilling),
    category: cat
      ? {
          id: cat.id,
          name: cat.name,
          color: cat.color,
          icon: cat.icon,
        }
      : null,
  };
}
