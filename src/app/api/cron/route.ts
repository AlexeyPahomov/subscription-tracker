import { Resend } from 'resend';
import { buildReminderEmail } from '@/helpers/buildReminderEmail';
import type { DueSubscription, Recipient } from '@/types/reminder';
import { prisma } from '@/utils/prisma';
import { withDbRetry, withMutationPoolRecovery } from '@/utils/dbConnection';
import {
  DEFAULT_TIMEZONE,
  DELIVERY_HOURS,
  fromEmail,
  MS_PER_DAY,
  resend,
} from './constants';
import type {
  BuildRecipientsResult,
  CandidateSubscription,
  CronStats,
} from './types';

function getDayKeyInTimezone(date: Date, timezone: string): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }
}

function isSameDayInTimezone(left: Date, right: Date, timezone: string): boolean {
  return getDayKeyInTimezone(left, timezone) === getDayKeyInTimezone(right, timezone);
}

function resolveHourInTimezone(timezone: string, now: Date): number | null {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      hour12: false,
    }).formatToParts(now);

    const hour = Number(parts.find((part) => part.type === 'hour')?.value);
    return Number.isFinite(hour) ? hour : null;
  } catch {
    return null;
  }
}

function isWithinDeliveryWindow(timezone: string, now: Date): boolean {
  const hour = resolveHourInTimezone(timezone, now);
  if (hour === null) return DELIVERY_HOURS.has(now.getUTCHours());
  return DELIVERY_HOURS.has(hour);
}

function isWithinReminderWindow(nextBilling: Date, remindBefore: number, now: Date): boolean {
  const reminderWindowEnd = new Date(now.getTime() + remindBefore * MS_PER_DAY);
  return nextBilling >= now && nextBilling <= reminderWindowEnd;
}

async function getCandidateSubscriptions(now: Date): Promise<CandidateSubscription[]> {
  return withDbRetry(() =>
    prisma.subscription.findMany({
      where: {
        nextBilling: {
          gte: now,
        },
        user: {
          settings: {
            is: {
              emailNotifications: true,
              remindBefore: {
                gt: 0,
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        interval: true,
        nextBilling: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            settings: {
              select: {
                emailNotifications: true,
                remindBefore: true,
                timezone: true,
                lastNotified: true,
              },
            },
          },
        },
      },
      orderBy: {
        nextBilling: 'asc',
      },
    }),
  );
}

function buildRecipients(
  subscriptions: CandidateSubscription[],
  now: Date,
): BuildRecipientsResult {
  const recipientsMap = new Map<string, Recipient>();
  const alreadyNotifiedUsers = new Set<string>();
  let skippedAlreadyNotified = 0;
  let skippedNoDueSubscriptions = 0;
  let skippedOutsideDeliveryWindow = 0;

  for (const subscription of subscriptions) {
    if (alreadyNotifiedUsers.has(subscription.user.id)) continue;

    const normalizedEmail = subscription.user.email.trim().toLowerCase();
    const userSettings = subscription.user.settings;
    if (!normalizedEmail || !userSettings || !userSettings.emailNotifications) continue;
    const timezone = userSettings.timezone || DEFAULT_TIMEZONE;

    if (!isWithinDeliveryWindow(timezone, now)) {
      skippedOutsideDeliveryWindow += 1;
      continue;
    }

    const remindBefore = userSettings.remindBefore;
    if (!remindBefore || remindBefore <= 0) continue;

    if (userSettings.lastNotified && isSameDayInTimezone(userSettings.lastNotified, now, timezone)) {
      alreadyNotifiedUsers.add(subscription.user.id);
      skippedAlreadyNotified += 1;
      continue;
    }

    if (!isWithinReminderWindow(subscription.nextBilling, remindBefore, now)) {
      skippedNoDueSubscriptions += 1;
      continue;
    }

    const subscriptionForEmail: DueSubscription = {
      name: subscription.name,
      price: subscription.price,
      currency: subscription.currency,
      interval: subscription.interval,
      nextBilling: subscription.nextBilling,
    };

    const existing = recipientsMap.get(subscription.user.id);
    if (!existing) {
      recipientsMap.set(subscription.user.id, {
        userId: subscription.user.id,
        name: subscription.user.name,
        email: normalizedEmail,
        remindBefore,
        dueSubscriptions: [subscriptionForEmail],
        subscriptionIds: [subscription.id],
      });
      continue;
    }

    existing.remindBefore = Math.max(existing.remindBefore, remindBefore);
    existing.dueSubscriptions.push(subscriptionForEmail);
    existing.subscriptionIds.push(subscription.id);
  }

  return {
    recipients: [...recipientsMap.values()],
    skippedAlreadyNotified,
    skippedNoDueSubscriptions,
    skippedOutsideDeliveryWindow,
  };
}

async function sendReminderToRecipient(
  recipient: Recipient,
  now: Date,
  resendClient: Resend,
): Promise<{
  recipient: string;
  emailId: string | null;
  processedSubscriptionsCount: number;
}> {
  const email = buildReminderEmail({
    name: recipient.name,
    remindBefore: recipient.remindBefore,
    dueSubscriptions: recipient.dueSubscriptions,
  });
  const { data, error } = await resendClient.emails.send({
    from: fromEmail,
    to: recipient.email,
    subject: email.subject,
    html: email.html,
  });

  if (error) {
    throw new Error(error.message || `Failed to send to ${recipient.email}`);
  }

  await withMutationPoolRecovery(() =>
    prisma.userSettings.update({
      where: {
        userId: recipient.userId,
      },
      data: {
        lastNotified: now,
      },
    }),
  );

  return {
    recipient: recipient.email,
    emailId: data?.id ?? null,
    processedSubscriptionsCount: recipient.subscriptionIds.length,
  };
}

function buildCronStats(stats: CronStats) {
  return {
    ok: true,
    ...stats,
  };
}

export async function GET(req: Request) {
  const auth = req.headers.get('authorization');

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const resendClient = resend;
  if (!resendClient) {
    return Response.json(
      { ok: false, error: 'RESEND_API_KEY is not set' },
      { status: 500 }
    );
  }

  const now = new Date();
  const subscriptions = await getCandidateSubscriptions(now);
  const {
    recipients,
    skippedAlreadyNotified,
    skippedNoDueSubscriptions,
    skippedOutsideDeliveryWindow,
  } = buildRecipients(subscriptions, now);

  if (recipients.length === 0) {
    return Response.json(buildCronStats({
      sentCount: 0,
      failedCount: 0,
      recipientsCount: 0,
      processedSubscriptionsCount: 0,
      skippedAlreadyNotified,
      skippedNoDueSubscriptions,
      skippedOutsideDeliveryWindow,
    }));
  }

  try {
    const sendResults = await Promise.allSettled(
      recipients.map((recipient) => sendReminderToRecipient(recipient, now, resendClient)),
    );

    const successful = sendResults.filter((result) => result.status === 'fulfilled');
    const failed = sendResults.filter((result) => result.status === 'rejected');
    const processedSubscriptionsCount = successful.reduce(
      (sum, result) => sum + result.value.processedSubscriptionsCount,
      0,
    );

    if (successful.length === 0) {
      return Response.json(
        { ok: false, error: 'Failed to send emails to all recipients' },
        { status: 500 },
      );
    }

    return Response.json(buildCronStats({
      sentCount: successful.length,
      failedCount: failed.length,
      recipientsCount: recipients.length,
      processedSubscriptionsCount,
      skippedAlreadyNotified,
      skippedNoDueSubscriptions,
      skippedOutsideDeliveryWindow,
    }));
  } catch {
    return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
  }
}
