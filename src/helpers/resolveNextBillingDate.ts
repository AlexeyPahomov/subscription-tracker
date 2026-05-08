import { addMonths, addWeeks, addYears, isBefore, startOfDay } from 'date-fns';

const MAX_BILLING_SHIFTS = 1200;
type BillingRow = { nextBilling: Date; interval: string };

function shiftBillingDate(date: Date, interval: string): Date {
  if (interval === 'yearly') return addYears(date, 1);
  if (interval === 'weekly') return addWeeks(date, 1);
  if (interval === 'quarterly') return addMonths(date, 3);
  return addMonths(date, 1);
}

/**
 * Возвращает ближайшую дату списания не в прошлом на основе исходной даты и интервала.
 */
export function resolveNextBillingDate(
  baseNextBilling: Date,
  interval: string,
  now: Date = new Date(),
): Date {
  let nextBilling = new Date(baseNextBilling);
  const today = startOfDay(now);

  for (let i = 0; i < MAX_BILLING_SHIFTS; i += 1) {
    const billingDay = startOfDay(nextBilling);
    if (!isBefore(billingDay, today)) return nextBilling;
    nextBilling = shiftBillingDate(nextBilling, interval);
  }

  return nextBilling;
}

export function resolveNextBillingDates<T extends BillingRow>(
  rows: T[],
  now: Date = new Date(),
): T[] {
  return rows.map((row) => ({
    ...row,
    nextBilling: resolveNextBillingDate(row.nextBilling, row.interval, now),
  }));
}
