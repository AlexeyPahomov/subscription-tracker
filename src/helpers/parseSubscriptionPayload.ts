import type { IntervalValue } from '@/types/subscription';
import type { CreateSubscriptionInput } from '@/types/subscription';
import { isIntervalValue } from '@/helpers/isIntervalValue';

function parsePriceInput(raw: string): number | null {
  const normalized = raw.replace(/,/g, '.').replace(/[^\d.]/g, '');
  const n = Number.parseFloat(normalized);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

function parseDisplayDate(str: string): Date | null {
  const parts = str.trim().split('.');
  if (parts.length !== 3) return null;
  const d = Number(parts[0]);
  const m = Number(parts[1]);
  const y = Number(parts[2]);
  if (!Number.isInteger(y) || m < 1 || m > 12 || d < 1 || d > 31) {
    return null;
  }
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

type ParsedSubscriptionPayload =
  | {
      ok: true;
      name: string;
      price: number;
      interval: IntervalValue;
      nextBilling: Date;
    }
  | { ok: false };

export function parseSubscriptionPayload(
  input: CreateSubscriptionInput,
): ParsedSubscriptionPayload {
  const name = input.name.trim();
  const price = parsePriceInput(input.price);
  const nextBilling = parseDisplayDate(input.nextPaymentDate);

  if (
    !name ||
    price === null ||
    !isIntervalValue(input.interval) ||
    !nextBilling
  ) {
    return { ok: false };
  }

  return {
    ok: true,
    name,
    price,
    interval: input.interval,
    nextBilling,
  };
}
