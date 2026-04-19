import { DASHBOARD_PAGE_SHELL_CLASSNAME } from '@/constants/dashboard-layout';

function Bar({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-linear-to-r from-neutral-200/90 to-neutral-300/70 dark:from-white/7 dark:to-white/12 ${className ?? ''}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <section
      className={DASHBOARD_PAGE_SHELL_CLASSNAME}
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="mb-10">
        <Bar className="mb-4 h-7 w-28" />
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-neutral-200/90 bg-neutral-100/50 p-6 dark:border-white/10 dark:bg-white/3"
            >
              <Bar className="h-4 w-32" />
              <Bar className="mt-5 h-12 w-40" />
              <Bar className="mt-4 h-4 w-28" />
              <Bar className="mt-6 h-3 w-full max-w-45" />
            </div>
          ))}
        </div>
      </div>

      <section className="mb-4 mt-2">
        <Bar className="mb-3 h-7 w-56" />
        <ul className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <div className="flex items-center gap-4 rounded-xl border border-neutral-200/90 bg-neutral-100/50 px-4 py-4 dark:border-white/10 dark:bg-white/3">
                <Bar className="h-9 w-9 shrink-0 rounded-full" />
                <Bar className="h-5 min-w-0 max-w-50 flex-1" />
                <Bar className="hidden h-4 w-16 sm:block" />
                <Bar className="hidden h-4 w-14 sm:block" />
                <Bar className="hidden h-4 w-20 md:block" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-0">
        <Bar className="mb-3 h-7 w-24" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="min-h-70 rounded-xl border border-neutral-200/90 bg-neutral-100/50 p-4 dark:border-white/10 dark:bg-white/3">
            <Bar className="h-5 w-40" />
            <Bar className="mt-2 h-3 w-64" />
            <Bar className="mt-8 h-50 w-full rounded-lg" />
          </div>
          <div className="min-h-70 rounded-xl border border-neutral-200/90 bg-neutral-100/50 p-4 dark:border-white/10 dark:bg-white/3">
            <Bar className="h-5 w-48" />
            <Bar className="mt-2 h-3 w-56" />
            <div className="mt-6 flex gap-4">
              <Bar className="h-36 w-36 shrink-0 rounded-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 pt-2">
                {[0, 1, 2, 3, 4].map((j) => (
                  <Bar key={j} className="h-3 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
