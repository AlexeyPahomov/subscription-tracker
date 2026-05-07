import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;
export const fromEmail = process.env.CRON_EMAIL_FROM ?? 'onboarding@resend.dev';
export const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_TIMEZONE = 'UTC';
// Free-tier cron runs once daily at 07:00 UTC (10:00 Europe/Moscow), so reminders are delivered during this local window.
export const DELIVERY_HOURS = new Set([9, 10]);
