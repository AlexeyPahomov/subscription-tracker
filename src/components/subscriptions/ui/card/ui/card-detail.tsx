'use client';

import type { CardDetailProps } from '../types';

export function CardDetail({ label, value }: CardDetailProps) {
  return (
    <div>
      <dt className="text-neutral-600 dark:text-gray-500">{label}</dt>
      <dd className="mt-1 text-base text-neutral-900 dark:text-white">{value}</dd>
    </div>
  );
}
