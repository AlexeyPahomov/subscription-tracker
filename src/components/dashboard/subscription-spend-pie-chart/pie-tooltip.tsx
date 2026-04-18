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
    <div className="rounded-lg border border-white/15 bg-neutral-950/95 px-3 py-2.5 shadow-lg">
      <p className="font-medium text-white">{p.name}</p>
      <p className="mt-1 text-sm text-indigo-300 tabular-nums">
        {formatMoneyAmount(p.monthlyAmount, currencyCode)}
      </p>
      <p className="mt-0.5 text-sm text-gray-400 tabular-nums">
        {p.percent.toFixed(1)}% of total
      </p>
    </div>
  );
}
