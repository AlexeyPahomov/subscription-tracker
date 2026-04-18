/** Префикс `id` карточки и фрагмента URL: `subscription-{uuid}`. */
export const SUBSCRIPTION_DEEP_LINK_HASH_PREFIX = 'subscription-' as const;

const SUBSCRIPTIONS_ROUTE = '/subscriptions';

export function subscriptionDomId(subscriptionId: string): string {
  return `${SUBSCRIPTION_DEEP_LINK_HASH_PREFIX}${subscriptionId}`;
}

export function subscriptionDeepLinkHref(subscriptionId: string): string {
  return `${SUBSCRIPTIONS_ROUTE}#${subscriptionDomId(subscriptionId)}`;
}

/** Разбор `#subscription-…` без обращения к `window` (удобно для тестов). */
export function parseSubscriptionDeepLinkHashFragment(
  hash: string,
): string | null {
  const raw = hash.replace(/^#/, '');
  return raw.startsWith(SUBSCRIPTION_DEEP_LINK_HASH_PREFIX) ? raw : null;
}
