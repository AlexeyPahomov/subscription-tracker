'use client';

import { dashboardPieChartCardClassName } from '@/components/dashboard/dashboard-card-styles';
import {
  DASHBOARD_PIE_ANIMATION,
  DASHBOARD_PIE_LAYOUT,
} from '@/constants/dashboard-pie-chart';
import type { SubscriptionSpendSlice } from '@/types/dashboard-analytics';
import { useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { PieLegendList } from './pie-legend';
import { PieModeToggle, type PieChartMode } from './pie-mode-toggle';
import { PieTooltipContent, type PieTooltipProps } from './pie-tooltip';
import { pieSliceFillColor } from './pie-slice-fill';

type SubscriptionSpendPieChartProps = {
  pieByCategory: SubscriptionSpendSlice[];
  pieBySubscription: SubscriptionSpendSlice[];
  currencyCode: string;
};

function pieChartCopy(mode: PieChartMode) {
  if (mode === 'category') {
    return {
      title: 'Spending by category',
      subtitle: 'Share of monthly equivalent per category',
      legendLabel: 'Category spend legend',
    };
  }
  return {
    title: 'Spending by subscription',
    subtitle: 'Share of monthly equivalent per subscription',
    legendLabel: 'Subscription spend legend',
  };
}

export function SubscriptionSpendPieChart({
  pieByCategory,
  pieBySubscription,
  currencyCode,
}: SubscriptionSpendPieChartProps) {
  const [mode, setMode] = useState<PieChartMode>('category');
  const data = mode === 'category' ? pieByCategory : pieBySubscription;
  const hasData = data.length > 0;
  const copy = pieChartCopy(mode);

  const pieData = data.map((slice, i) => ({
    ...slice,
    fill: pieSliceFillColor(slice, i),
  }));

  return (
    <div className={dashboardPieChartCardClassName}>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            {copy.title}
          </h3>
          <p className="mt-0.5 text-xs text-neutral-600 dark:text-gray-400">
            {copy.subtitle}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <PieModeToggle mode={mode} onModeChange={setMode} />
          <span className="text-lg" aria-hidden>
            🥧
          </span>
        </div>
      </div>

      {!hasData ? (
        <p className="py-12 text-center text-sm text-neutral-600 dark:text-gray-400">
          Add subscriptions to see how your spend is distributed.
        </p>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="mx-auto w-full min-w-0 flex-1 sm:mx-0">
            <ResponsiveContainer
              width="100%"
              height={DASHBOARD_PIE_LAYOUT.containerHeight}
            >
              <PieChart margin={{ ...DASHBOARD_PIE_LAYOUT.chartMargin }}>
                <Pie
                  key={mode}
                  data={pieData}
                  dataKey="monthlyAmount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={DASHBOARD_PIE_LAYOUT.innerRadius}
                  outerRadius={DASHBOARD_PIE_LAYOUT.outerRadius}
                  paddingAngle={DASHBOARD_PIE_LAYOUT.paddingAngle}
                  stroke={DASHBOARD_PIE_LAYOUT.stroke}
                  strokeWidth={1}
                  isAnimationActive="auto"
                  animationDuration={DASHBOARD_PIE_ANIMATION.durationMs}
                  animationEasing={DASHBOARD_PIE_ANIMATION.easing}
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

          <div className="w-full shrink-0 sm:w-36 sm:border-l sm:border-white/10 sm:pl-4">
            <PieLegendList data={data} legendLabel={copy.legendLabel} />
          </div>
        </div>
      )}
    </div>
  );
}
