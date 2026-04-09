'use client';

import { Icon } from '@gravity-ui/uikit';
import type { CardDetailProps } from '../types';

export function CardDetail({ label, value, icon }: CardDetailProps) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="mt-1 flex items-center gap-1 text-base text-white">
        {icon ? (
          <Icon
            data={icon}
            size={16}
            className="shrink-0 text-gray-500 mb-1"
            aria-hidden
          />
        ) : null}
        {value}
      </dd>
    </div>
  );
}
