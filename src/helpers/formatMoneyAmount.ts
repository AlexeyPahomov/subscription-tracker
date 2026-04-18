/** Форматирование числовой суммы в валюте (графики, сводки). */
export function formatMoneyAmount(amount: number, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
}

/** Ось Y / компактные подписи для больших значений */
export function formatMoneyCompactTick(
  amount: number,
  currencyCode: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      notation: amount >= 1000 ? 'compact' : 'standard',
      maximumFractionDigits: amount >= 1000 ? 1 : 0,
    }).format(amount);
  } catch {
    return amount.toFixed(0);
  }
}
