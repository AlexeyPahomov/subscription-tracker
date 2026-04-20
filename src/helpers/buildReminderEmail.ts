import type { DueSubscription } from '@/types/reminder';

type BuildReminderEmailInput = {
  name: string | null;
  remindBefore: number;
  dueSubscriptions: DueSubscription[];
};

const EMAIL_LOCALE = 'ru-RU';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatBillingDate(date: Date): string {
  return new Intl.DateTimeFormat(EMAIL_LOCALE, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat(EMAIL_LOCALE, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}

function formatInterval(interval: string): string {
  if (interval === 'monthly') return 'ежемесячно';
  if (interval === 'yearly') return 'ежегодно';
  return interval;
}

export function buildReminderEmail(input: BuildReminderEmailInput): {
  subject: string;
  html: string;
} {
  const subscriptionsHtml = input.dueSubscriptions
    .map(
      (subscription) =>
        `<li style="margin-bottom:8px;">
          <strong>${escapeHtml(subscription.name)}</strong><br/>
          ${formatPrice(subscription.price, subscription.currency)} • ${formatInterval(subscription.interval)}<br/>
          Списание: ${formatBillingDate(subscription.nextBilling)}
        </li>`,
    )
    .join('');

  const greetingName = input.name ? `, ${escapeHtml(input.name)}` : '';
  const subject =
    input.dueSubscriptions.length > 1
      ? `Напоминание: ${input.dueSubscriptions.length} предстоящих списания`
      : 'Напоминание о предстоящем списании';

  return {
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <p>Здравствуйте${greetingName}!</p>
        <p>
          В ближайшие ${input.remindBefore} дн. у вас запланированы списания по подпискам:
        </p>
        <ul style="padding-left:18px; margin: 12px 0;">${subscriptionsHtml}</ul>
        <p style="margin-top:16px;">
          Проверьте активные подписки в приложении, чтобы избежать лишних трат.
        </p>
      </div>
    `,
  };
}
