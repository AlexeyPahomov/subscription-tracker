/// <reference types="vitest/globals" />
import { buildReminderEmail } from '../../src/helpers/buildReminderEmail';

describe('buildReminderEmail', () => {
  it('builds subject and html with escaped user data', () => {
    const result = buildReminderEmail({
      name: 'Анна <script>',
      remindBefore: 3,
      dueSubscriptions: [
        {
          name: 'Netflix & Chill',
          price: 12.5,
          currency: 'USD',
          interval: 'monthly',
          nextBilling: new Date('2026-04-25T00:00:00.000Z'),
        },
      ],
    });

    expect(result.subject).toBe('Напоминание о предстоящем списании');
    expect(result.html).toContain('Здравствуйте, Анна &lt;script&gt;!');
    expect(result.html).toContain('Netflix &amp; Chill');
    expect(result.html).toContain('ежемесячно');
    expect(result.html).toContain('В ближайшие 3 дн.');
    expect(result.html).toContain('Списание:');
  });

  it('uses plural subject for multiple subscriptions', () => {
    const result = buildReminderEmail({
      name: null,
      remindBefore: 7,
      dueSubscriptions: [
        {
          name: 'Notion',
          price: 10,
          currency: 'USD',
          interval: 'monthly',
          nextBilling: new Date('2026-04-25T00:00:00.000Z'),
        },
        {
          name: 'Figma',
          price: 20,
          currency: 'USD',
          interval: 'yearly',
          nextBilling: new Date('2026-04-30T00:00:00.000Z'),
        },
      ],
    });

    expect(result.subject).toBe('Напоминание: 2 предстоящих списания');
    expect(result.html).toContain('Здравствуйте!');
    expect(result.html).not.toContain('Здравствуйте,');
    expect(result.html).toContain('ежегодно');
  });
});
