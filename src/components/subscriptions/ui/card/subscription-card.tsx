'use client';

import { PencilToSquare, TrashBin } from '@gravity-ui/icons';
import { SubscriptionBrandAvatar } from '@/components/dashboard/subscription-brand-avatar';
import { subscriptionDomId } from '@/constants/subscriptionDeepLink';
import { getCategoryLucideIcon } from '@/helpers/categoryLucideIcon';
import { createElement } from 'react';
import type { SubscriptionCardDetailRow, SubscriptionCardProps } from './types';
import { CardDetail, CardIconAction } from './ui';

export function SubscriptionCard({
  subscriptionId,
  name,
  price,
  interval,
  nextPaymentDate,
  category,
  brandIndex = 0,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const detailRows: SubscriptionCardDetailRow[] = [
    { key: 'price', label: 'Price', value: price },
    { key: 'interval', label: 'Interval', value: interval },
    {
      key: 'nextPayment',
      label: 'Next payment date',
      value: nextPaymentDate,
    },
  ];

  return (
    <article
      id={subscriptionDomId(subscriptionId)}
      className="scroll-mt-24 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-950/50 dark:shadow-none"
    >
      <div className="flex gap-4">
        <SubscriptionBrandAvatar
          name={name}
          index={brandIndex}
          className="h-11 w-11 text-sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {name}
              </h3>
              {category ? (
                <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-neutral-800 dark:text-gray-400">
                  {createElement(getCategoryLucideIcon(category.icon, category.name), {
                    className: 'h-4 w-4 shrink-0',
                    strokeWidth: 2,
                    style: { color: category.color ?? '#4b5563' },
                    'aria-hidden': true,
                  })}
                  <span>{category.name}</span>
                </p>
              ) : null}
            </div>
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
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            {detailRows.map(({ key, label, value }) => (
              <CardDetail key={key} label={label} value={value} />
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
