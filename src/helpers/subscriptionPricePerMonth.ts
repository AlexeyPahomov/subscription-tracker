/** Приводит цену подписки к эквиваленту «в месяц» для графиков и сводки. */
export function subscriptionPricePerMonth(
  price: number,
  interval: string,
): number {
  switch (interval) {
    case 'yearly':
      return price / 12;
    case 'weekly':
      return (price * 52) / 12;
    case 'quarterly':
      return price / 3;
    case 'monthly':
    default:
      return price;
  }
}
