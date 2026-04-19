/** Общая оболочка карточек графиков на дашборде */
const dashboardChartCardBase =
  'rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-white/18 dark:hover:bg-white/7';

export const dashboardChartCardClassName = dashboardChartCardBase;

export const dashboardLineChartCardClassName = `${dashboardChartCardBase} min-h-80 hover:shadow-[0_8px_32px_-14px_rgba(99,102,241,0.14)] dark:hover:shadow-[0_8px_40px_-12px_rgba(99,102,241,0.18)]`;

export const dashboardPieChartCardClassName = `${dashboardChartCardBase} hover:shadow-[0_8px_32px_-14px_rgba(167,139,250,0.12)] dark:hover:shadow-[0_8px_40px_-12px_rgba(167,139,250,0.15)]`;
