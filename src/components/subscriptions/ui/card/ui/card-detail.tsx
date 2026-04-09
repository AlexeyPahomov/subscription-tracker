'use client';

import type { CardDetailProps } from '../types';

export function CardDetail({ label, value }: CardDetailProps) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-1 text-base text-white">{value}</dd>
    </div>
  );
}
