export type PieChartMode = 'category' | 'subscription';

type PieModeToggleProps = {
  mode: PieChartMode;
  onModeChange: (next: PieChartMode) => void;
};

const btnBase =
  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors';

export function PieModeToggle({ mode, onModeChange }: PieModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100/90 p-0.5 dark:border-white/15 dark:bg-black/20"
      role="group"
      aria-label="Pie chart grouping"
    >
      <button
        type="button"
        className={`${btnBase} ${
          mode === 'category'
            ? 'bg-white text-neutral-900 shadow-sm dark:bg-white/10 dark:text-white dark:shadow-none'
            : 'text-neutral-600 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
        aria-pressed={mode === 'category'}
        onClick={() => onModeChange('category')}
      >
        Categories
      </button>
      <button
        type="button"
        className={`${btnBase} ${
          mode === 'subscription'
            ? 'bg-white text-neutral-900 shadow-sm dark:bg-white/10 dark:text-white dark:shadow-none'
            : 'text-neutral-600 hover:text-neutral-900 dark:text-gray-400 dark:hover:text-gray-200'
        }`}
        aria-pressed={mode === 'subscription'}
        onClick={() => onModeChange('subscription')}
      >
        Subscriptions
      </button>
    </div>
  );
}
