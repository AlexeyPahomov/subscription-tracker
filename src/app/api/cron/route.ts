import { Resend } from 'resend';
import { buildReminderEmail } from '@/helpers/buildReminderEmail';
import { resolveNextBillingDates } from '@/helpers/resolveNextBillingDate';
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

const CRON_LOG_PREFIX = '[cron/reminders]';

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
  const rows = await withDbRetry(() =>
    prisma.subscription.findMany({
      where: {
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
    }),
  );

  return resolveNextBillingDates(rows, now)
    .sort((a, b) => a.nextBilling.getTime() - b.nextBilling.getTime());
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
      id: subscription.id,
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
    console.warn(`${CRON_LOG_PREFIX} unauthorized request`);
    return new Response('Unauthorized', { status: 401 });
  }

  const resendClient = resend;
  if (!resendClient) {
    console.error(`${CRON_LOG_PREFIX} RESEND_API_KEY is not set`);
    return Response.json(
      { ok: false, error: 'RESEND_API_KEY is not set' },
      { status: 500 }
    );
  }

  const now = new Date();
  console.info(`${CRON_LOG_PREFIX} run started`, {
    nowIso: now.toISOString(),
  });

  let subscriptions: CandidateSubscription[];
  try {
    subscriptions = await getCandidateSubscriptions(now);
    console.info(`${CRON_LOG_PREFIX} candidate subscriptions fetched`, {
      count: subscriptions.length,
    });
  } catch (error) {
    console.error(`${CRON_LOG_PREFIX} failed to fetch candidate subscriptions`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json(
      { ok: false, error: 'Failed to fetch candidate subscriptions' },
      { status: 500 },
    );
  }

  const {
    recipients,
    skippedAlreadyNotified,
    skippedNoDueSubscriptions,
    skippedOutsideDeliveryWindow,
  } = buildRecipients(subscriptions, now);
  console.info(`${CRON_LOG_PREFIX} recipients prepared`, {
    recipientsCount: recipients.length,
    skippedAlreadyNotified,
    skippedNoDueSubscriptions,
    skippedOutsideDeliveryWindow,
  });

  if (recipients.length === 0) {
    console.info(`${CRON_LOG_PREFIX} no recipients to notify`);
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
    console.info(`${CRON_LOG_PREFIX} send started`, {
      recipients: recipients.map((recipient) => recipient.email),
    });
    const sendResults = await Promise.allSettled(
      recipients.map((recipient) => sendReminderToRecipient(recipient, now, resendClient)),
    );

    const successful = sendResults.filter((result) => result.status === 'fulfilled');
    const failed = sendResults.filter((result) => result.status === 'rejected');
    if (failed.length > 0) {
      console.error(`${CRON_LOG_PREFIX} send failures`, {
        failedRecipients: sendResults
          .map((result, index) =>
            result.status === 'rejected'
              ? {
                  email: recipients[index]?.email,
                  reason:
                    result.reason instanceof Error
                      ? result.reason.message
                      : String(result.reason),
                }
              : null,
          )
          .filter(Boolean),
      });
    }

    const processedSubscriptionsCount = successful.reduce(
      (sum, result) => sum + result.value.processedSubscriptionsCount,
      0,
    );

    if (successful.length === 0) {
      console.error(`${CRON_LOG_PREFIX} all sends failed`);
      return Response.json(
        { ok: false, error: 'Failed to send emails to all recipients' },
        { status: 500 },
      );
    }

    console.info(`${CRON_LOG_PREFIX} send completed`, {
      sentCount: successful.length,
      failedCount: failed.length,
      processedSubscriptionsCount,
    });
    return Response.json(buildCronStats({
      sentCount: successful.length,
      failedCount: failed.length,
      recipientsCount: recipients.length,
      processedSubscriptionsCount,
      skippedAlreadyNotified,
      skippedNoDueSubscriptions,
      skippedOutsideDeliveryWindow,
    }));
  } catch (error) {
    console.error(`${CRON_LOG_PREFIX} unexpected send pipeline error`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
  }
}
