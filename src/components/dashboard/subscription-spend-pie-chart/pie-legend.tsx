import type { SubscriptionSpendSlice } from '@/types/dashboard-analytics';
import { pieSliceFillColor } from './pie-slice-fill';

type PieLegendListProps = {
  data: SubscriptionSpendSlice[];
  legendLabel: string;
};

export function PieLegendList({ data, legendLabel }: PieLegendListProps) {
  return (
    <ul
      className="grid max-h-52 grid-cols-1 gap-y-1.5 overflow-y-auto pr-1 text-[11px] leading-tight sm:max-h-none sm:overflow-visible"
      aria-label={legendLabel}
    >
      {data.map((slice, i) => (
        <li
          key={`${slice.name}-${i}`}
          className="flex min-w-0 items-center gap-1.5"
          title={`${slice.name} — ${Math.round(slice.percent)}%`}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-sm"
            style={{ backgroundColor: pieSliceFillColor(slice, i) }}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-neutral-600 dark:text-gray-400">
            {slice.name}
          </span>
          <span className="shrink-0 tabular-nums text-neutral-700 dark:text-gray-500">
            {Math.round(slice.percent)}%
          </span>
        </li>
      ))}
    </ul>
  );
}
