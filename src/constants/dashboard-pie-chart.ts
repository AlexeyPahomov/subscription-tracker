/** Pie «Spending by …» на дашборде: вёрстка и анимация Recharts */

export const DASHBOARD_PIE_LAYOUT = {
  containerHeight: 248,
  innerRadius: 64,
  outerRadius: 96,
  paddingAngle: 2,
  stroke: 'rgba(0,0,0,0.2)',
  chartMargin: { top: 4, right: 4, left: 4, bottom: 4 },
} as const;

export const DASHBOARD_PIE_ANIMATION = {
  durationMs: 520,
  easing: 'ease-out' as const,
};
