import type { SubscriptionSpendSlice } from '@/types/dashboard-analytics';
import { formatMoneyAmount } from '@/helpers/formatMoneyAmount';

export type PieTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: SubscriptionSpendSlice }>;
  currencyCode: string;
};

export function PieTooltipContent({
  active,
  payload,
  currencyCode,
}: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-lg dark:border-white/15 dark:bg-neutral-950/95">
      <p className="font-medium text-neutral-900 dark:text-white">{p.name}</p>
      <p className="mt-1 text-sm tabular-nums text-indigo-700 dark:text-indigo-300">
        {formatMoneyAmount(p.monthlyAmount, currencyCode)}
      </p>
      <p className="mt-0.5 text-sm tabular-nums text-neutral-600 dark:text-gray-400">
        {p.percent.toFixed(1)}% of total
      </p>
    </div>
  );
}
