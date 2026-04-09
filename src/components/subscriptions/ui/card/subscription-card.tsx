'use client';

import { CircleDollar, PencilToSquare, TrashBin } from '@gravity-ui/icons';
import type { SubscriptionCardDetailRow, SubscriptionCardProps } from './types';
import { CardDetail, CardIconAction } from './ui';

export function SubscriptionCard({
  name,
  price,
  interval,
  nextPaymentDate,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const detailRows: SubscriptionCardDetailRow[] = [
    { key: 'price', label: 'Price', value: price, icon: CircleDollar },
    { key: 'interval', label: 'Interval', value: interval },
    {
      key: 'nextPayment',
      label: 'Next payment date',
      value: nextPaymentDate,
    },
  ];

  return (
    <article className="rounded-xl border border-gray-800 bg-gray-950/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <div className="flex shrink-0 items-center gap-1">
          <CardIconAction
            icon={PencilToSquare}
            label="Edit subscription"
            onClick={onEdit}
          />
          <CardIconAction
            icon={TrashBin}
            label="Delete subscription"
            onClick={onDelete}
          />
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-300 sm:grid-cols-3">
        {detailRows.map(({ key, label, value, icon }) => (
          <CardDetail
            key={key}
            label={label}
            value={value}
            icon={icon}
          />
        ))}
      </dl>
    </article>
  );
}
