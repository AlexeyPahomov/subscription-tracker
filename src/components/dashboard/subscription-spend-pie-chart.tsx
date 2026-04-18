'use client';

import { dashboardPieChartCardClassName } from '@/components/dashboard/dashboard-card-styles';
import { DASHBOARD_CHART_COLORS } from '@/constants/dashboard-chart';
import type { SubscriptionSpendSlice } from '@/helpers/getDashboardSpendAnalytics';
import { formatMoneyAmount } from '@/helpers/formatMoneyAmount';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type SubscriptionSpendPieChartProps = {
  data: SubscriptionSpendSlice[];
  currencyCode: string;
};

type PieTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: SubscriptionSpendSlice }>;
  currencyCode: string;
};

function PieTooltipContent({ active, payload, currencyCode }: PieTooltipProps) {
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

function PieLegendList({ data }: { data: SubscriptionSpendSlice[] }) {
  return (
    <ul
      className="grid max-h-44 grid-cols-1 gap-x-4 gap-y-1 overflow-y-auto pr-1 text-[11px] leading-tight sm:grid-cols-2 sm:max-h-none sm:overflow-visible"
      aria-label="Subscription share legend"
    >
      {data.map((slice, i) => (
        <li
          key={slice.name}
          className="flex min-w-0 items-center gap-1.5"
          title={`${slice.name} — ${Math.round(slice.percent)}%`}
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-sm"
            style={{
              backgroundColor: DASHBOARD_CHART_COLORS[i % DASHBOARD_CHART_COLORS.length],
            }}
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-gray-400">
            {slice.name}
          </span>
          <span className="shrink-0 tabular-nums text-gray-500">
            {Math.round(slice.percent)}%
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionSpendPieChart({
  data,
  currencyCode,
}: SubscriptionSpendPieChartProps) {
  const hasData = data.length > 0;
  /** Per-slice colors via data fields (Recharts 3+; replaces deprecated <Cell />) */
  const pieData = data.map((slice, i) => ({
    ...slice,
    fill: DASHBOARD_CHART_COLORS[i % DASHBOARD_CHART_COLORS.length]!,
  }));

  return (
    <div className={dashboardPieChartCardClassName}>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-white">
            Spending by subscription
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Share of monthly equivalent per service
          </p>
        </div>
        <span className="text-lg" aria-hidden>
          🥧
        </span>
      </div>

      {!hasData ? (
        <p className="py-12 text-center text-sm text-gray-400">
          Add subscriptions to see how your spend is distributed.
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="mx-auto w-full max-w-55 shrink-0 sm:mx-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
                <Pie
                  data={pieData}
                  dataKey="monthlyAmount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth={1}
                  isAnimationActive={false}
                />
                <Tooltip
                  content={(props) => (
                    <PieTooltipContent
                      active={props.active}
                      payload={props.payload as PieTooltipProps['payload']}
                      currencyCode={currencyCode}
                    />
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="min-w-0 flex-1 sm:border-l sm:border-white/10 sm:pl-4">
            <PieLegendList data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
