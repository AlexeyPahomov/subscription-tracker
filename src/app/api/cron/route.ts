import { Resend } from 'resend';
import { buildReminderEmail } from '@/helpers/buildReminderEmail';
import type { DueSubscription, Recipient } from '@/types/reminder';
import { prisma } from '@/utils/prisma';
import { withDbRetry, withMutationPoolRecovery } from '@/utils/dbConnection';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = process.env.CRON_EMAIL_FROM ?? 'onboarding@resend.dev';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type CandidateSubscription = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  nextBilling: Date;
  remindBefore: number | null;
  lastNotified: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type BuildRecipientsResult = {
  recipients: Recipient[];
  skippedAlreadyNotified: number;
  skippedNoDueSubscriptions: number;
};

function isSameUtcDay(left: Date, right: Date): boolean {
  return (
    left.getUTCFullYear() === right.getUTCFullYear() &&
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

function isWithinReminderWindow(nextBilling: Date, remindBefore: number, now: Date): boolean {
  const reminderWindowEnd = new Date(now.getTime() + remindBefore * MS_PER_DAY);
  return nextBilling >= now && nextBilling <= reminderWindowEnd;
}

async function getCandidateSubscriptions(now: Date): Promise<CandidateSubscription[]> {
  return withDbRetry(() =>
    prisma.subscription.findMany({
      where: {
        remindBefore: {
          gt: 0,
        },
        nextBilling: {
          gte: now,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        currency: true,
        interval: true,
        nextBilling: true,
        remindBefore: true,
        lastNotified: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
  let skippedAlreadyNotified = 0;
  let skippedNoDueSubscriptions = 0;

  for (const subscription of subscriptions) {
    const normalizedEmail = subscription.user.email.trim().toLowerCase();
    if (!normalizedEmail || !subscription.remindBefore) continue;

    if (subscription.lastNotified && isSameUtcDay(subscription.lastNotified, now)) {
      skippedAlreadyNotified += 1;
      continue;
    }

    if (!isWithinReminderWindow(subscription.nextBilling, subscription.remindBefore, now)) {
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
        remindBefore: subscription.remindBefore,
        dueSubscriptions: [subscriptionForEmail],
        subscriptionIds: [subscription.id],
      });
      continue;
    }

    existing.remindBefore = Math.max(existing.remindBefore, subscription.remindBefore);
    existing.dueSubscriptions.push(subscriptionForEmail);
    existing.subscriptionIds.push(subscription.id);
  }

  return {
    recipients: [...recipientsMap.values()],
    skippedAlreadyNotified,
    skippedNoDueSubscriptions,
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
    prisma.subscription.updateMany({
      where: {
        id: {
          in: recipient.subscriptionIds,
        },
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
  const { recipients, skippedAlreadyNotified, skippedNoDueSubscriptions } = buildRecipients(
    subscriptions,
    now,
  );

  if (recipients.length === 0) {
    return Response.json({
      ok: true,
      sentCount: 0,
      failedCount: 0,
      recipientsCount: 0,
      processedSubscriptionsCount: 0,
      skippedAlreadyNotified,
      skippedNoDueSubscriptions,
    });
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

    return Response.json({
      ok: true,
      sentCount: successful.length,
      failedCount: failed.length,
      recipientsCount: recipients.length,
      processedSubscriptionsCount,
      skippedAlreadyNotified,
      skippedNoDueSubscriptions,
    });
  } catch {
    return Response.json({ ok: false, error: 'Failed to send email' }, { status: 500 });
  }
}
