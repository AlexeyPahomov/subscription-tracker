'use client';

import { dashboardLineChartCardClassName } from '@/components/dashboard/dashboard-card-styles';
import { DASHBOARD_LINE_STROKE } from '@/constants/dashboard-chart';
import { usePrefersColorSchemeDark } from '@/hooks/usePrefersColorSchemeDark';
import type { MonthlySpendPoint } from '@/types/dashboard-analytics';
import {
  formatMoneyAmount,
  formatMoneyCompactTick,
} from '@/helpers/formatMoneyAmount';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type MonthlySpendLineChartProps = {
  data: MonthlySpendPoint[];
  currencyCode: string;
};

export function MonthlySpendLineChart({
  data,
  currencyCode,
}: MonthlySpendLineChartProps) {
  const prefersDark = usePrefersColorSchemeDark();

  const gridStroke = prefersDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(0,0,0,0.07)';
  const tickFill = prefersDark ? '#9ca3af' : '#57534e';
  const axisLineStroke = prefersDark
    ? 'rgba(255,255,255,0.15)'
    : 'rgba(0,0,0,0.12)';
  const tooltipStyle = prefersDark
    ? {
        backgroundColor: 'rgba(17,17,17,0.95)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
      }
    : {
        backgroundColor: 'rgba(255,255,255,0.98)',
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 8,
        boxShadow: '0 4px 24px -8px rgba(0,0,0,0.12)',
      };
  const tooltipLabelColor = prefersDark ? '#e5e7eb' : '#171717';
  const activeDotFill = prefersDark ? '#a5b4fc' : '#6366f1';

  return (
    <div className={dashboardLineChartCardClassName}>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
            Monthly spending
          </h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-gray-400">
            Projected recurring spend (next 12 months, slight variation)
          </p>
        </div>
        <span className="text-xl" aria-hidden>
          📊
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 4, bottom: 8 }}
        >
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: tickFill, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: axisLineStroke }}
          />
          <YAxis
            tick={{ fill: tickFill, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatMoneyCompactTick(v, currencyCode)}
            width={56}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: tooltipLabelColor }}
            formatter={(value) => {
              const n = typeof value === 'number' ? value : Number(value);
              if (Number.isNaN(n)) return ['—', 'Spend'];
              return [formatMoneyAmount(n, currencyCode), 'Spend'];
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            name="Monthly spend"
            stroke={DASHBOARD_LINE_STROKE}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: activeDotFill }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
