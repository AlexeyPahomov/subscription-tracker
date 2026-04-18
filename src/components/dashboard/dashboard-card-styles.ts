/** Общая оболочка карточек графиков на дашборде + лёгкий glow при hover */
export const dashboardChartCardClassName =
  'rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-white/18 hover:bg-white/7';

export const dashboardLineChartCardClassName = `${dashboardChartCardClassName} min-h-80 hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.18)]`;

export const dashboardPieChartCardClassName = `${dashboardChartCardClassName} hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.15)]`;
