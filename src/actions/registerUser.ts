'use server';

import { hash } from 'bcryptjs';
import { prisma } from '@/utils/prisma';

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: 'exists' | 'unknown' };

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });
    if (existing) {
      return { ok: false, error: 'exists' };
    }
    const passwordHash = await hash(input.password, 12);
    await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
