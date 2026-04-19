import {
  upcomingRelativeTextClass,
  upcomingRowBorderClass,
} from '@/components/dashboard/urgency-classes';
import { subscriptionDeepLinkHref } from '@/constants/subscriptionDeepLink';
import type { UpcomingPaymentItem } from '@/helpers/getUpcomingPaymentsForUser';
import { AppLink } from '@/components/navigation/navigation-provider';
import { SubscriptionBrandAvatar } from './subscription-brand-avatar';

type UpcomingItemProps = {
  item: UpcomingPaymentItem;
  index: number;
};

export function UpcomingItem({ item, index }: UpcomingItemProps) {
  const href = subscriptionDeepLinkHref(item.id);

  return (
    <li>
      <AppLink
        href={href}
        scroll={false}
        className={`block cursor-pointer rounded-xl border border-white/10 border-l-4 bg-black/30 transition-all duration-200 hover:border-white/25 hover:bg-white/10 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04),0_4px_24px_-8px_rgba(0,0,0,0.4)] ${upcomingRowBorderClass(item.urgency)}`}
      >
      <div className="md:hidden">
        <div className="flex items-center gap-3 px-4 pt-3.5">
          <SubscriptionBrandAvatar name={item.name} index={index} />
          <span className="min-w-0 flex-1 truncate font-semibold text-white">
            {item.name}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 px-4 pb-3.5 pt-2 text-xs tabular-nums sm:text-sm">
          <span className="text-gray-100">{item.priceLabel}</span>
          <span className="text-center text-gray-300">{item.dateLabel}</span>
          <span
            className={`text-right ${upcomingRelativeTextClass(item.urgency)}`}
          >
            {item.relativeLabel}
          </span>
        </div>
      </div>

      <div
        className="hidden items-center gap-x-5 px-4 py-3.5 text-[15px] md:grid"
        style={{
          gridTemplateColumns: '2.5rem minmax(10rem, 1fr) 5.5rem 5rem 7rem',
        }}
      >
        <SubscriptionBrandAvatar name={item.name} index={index} />

        <span className="min-w-0 truncate font-semibold text-white">
          {item.name}
        </span>

        <span className="justify-self-end tabular-nums text-gray-100">
          {item.priceLabel}
        </span>

        <span className="justify-self-end tabular-nums text-gray-300">
          {item.dateLabel}
        </span>

        <span
          className={`justify-self-end tabular-nums ${upcomingRelativeTextClass(item.urgency)}`}
        >
          {item.relativeLabel}
        </span>
      </div>
      </AppLink>
    </li>
  );
}
