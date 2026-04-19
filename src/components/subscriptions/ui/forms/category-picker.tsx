'use client';

import type { UserCategoryOption } from '@/helpers/getCategoriesByUserId';
import { getCategoryLucideIcon } from '@/helpers/categoryLucideIcon';
import { createElement } from 'react';

type CategoryPickerProps = {
  categories: UserCategoryOption[];
  value: string;
  onChange: (categoryId: string) => void;
  disabled?: boolean;
};

export function CategoryPicker({
  categories,
  value,
  onChange,
  disabled = false,
}: CategoryPickerProps) {
  if (categories.length === 0) {
    return (
      <p className="text-xs text-neutral-600 dark:text-gray-500">
        No categories yet. Open this page again to create defaults.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-neutral-600 dark:text-gray-400">
        Category
      </span>
      <div
        className="grid grid-cols-2 gap-1.5 sm:grid-cols-3"
        role="radiogroup"
        aria-label="Subscription category"
      >
        {categories.map((cat) => {
          const selected = value === cat.id;
          const accent = cat.color ?? '#818cf8';

          return (
            <button
              key={cat.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange(cat.id)}
              className={`flex min-h-0 cursor-pointer items-center gap-1.5 rounded-lg border-2 px-2 py-1.5 text-left text-xs transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${
                selected
                  ? 'scale-[1.02] bg-neutral-50 dark:bg-white/[0.07]'
                  : 'border-neutral-200 bg-white hover:scale-[1.02] hover:bg-neutral-50 dark:border-white/10 dark:bg-white/2 dark:hover:bg-white/5'
              }`}
              style={{
                borderColor: selected ? accent : undefined,
                boxShadow: selected
                  ? `0 0 18px -6px ${accent}99, inset 0 0 0 1px ${accent}44`
                  : undefined,
              }}
            >
              {createElement(getCategoryLucideIcon(cat.icon, cat.name), {
                className: 'h-3.5 w-3.5 shrink-0',
                strokeWidth: 2,
                style: { color: accent },
                'aria-hidden': true,
              })}
              <span className="min-w-0 flex-1 truncate font-medium leading-tight text-neutral-900 dark:text-white">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
