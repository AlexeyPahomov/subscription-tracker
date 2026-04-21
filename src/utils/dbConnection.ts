import { recyclePrismaClient } from '@/utils/prisma';

const READ_RETRY =
  /connection|terminated|not queryable|ECONNRESET|ETIMEDOUT|timeout|exceeded|Connection closed|ECONNREFUSED|max clients|pool_size/i;

const MUTATION_POOL_DEAD =
  /not queryable|Connection terminated|timeout exceeded|ECONNRESET|Transaction already closed|rollback cannot be executed|Transaction API error|P2028/i;

function isRetryableReadError(e: unknown): boolean {
  if (e && typeof e === 'object' && 'code' in e) {
    const code = (e as { code?: string }).code;
    if (code === 'P2028' || code === 'P2002' || code === 'P2034') return false;
  }
  const msg = String(e instanceof Error ? e.message : e);
  if (
    /Transaction already closed|rollback cannot be executed|Transaction API error/i.test(
      msg,
    )
  ) {
    return false;
  }
  return READ_RETRY.test(msg);
}

/** Повтор для чтений при обрыве pooler / сети. Мутации не оборачивать — риск P2028 / дубля. */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      if (!isRetryableReadError(e) || i === attempts - 1) throw e;
      await recyclePrismaClient().catch(() => {});
      await new Promise((r) => setTimeout(r, 350 * (i + 1)));
    }
  }
  throw new Error('withDbRetry: exhausted attempts');
}

/**
 * Одна повторная попытка мутации после recycle пула (битый клиент pg «not queryable»).
 * Не использовать там, где первая попытка могла закоммитить строку.
 */
export async function withMutationPoolRecovery<T>(
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (!MUTATION_POOL_DEAD.test(String(e instanceof Error ? e.message : e))) {
      throw e;
    }
    await recyclePrismaClient();
    return await fn();
  }
}
