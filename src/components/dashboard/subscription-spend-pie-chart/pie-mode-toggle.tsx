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
      className="inline-flex rounded-lg border border-white/15 bg-black/20 p-0.5"
      role="group"
      aria-label="Pie chart grouping"
    >
      <button
        type="button"
        className={`${btnBase} ${
          mode === 'category'
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:text-gray-200'
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
            ? 'bg-white/10 text-white'
            : 'text-gray-400 hover:text-gray-200'
        }`}
        aria-pressed={mode === 'subscription'}
        onClick={() => onModeChange('subscription')}
      >
        Subscriptions
      </button>
    </div>
  );
}
