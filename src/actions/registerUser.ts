'use server';

import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@/generated/prisma/client';

export type RegisterResult =
  | { ok: true }
  | { ok: false; error: 'exists' | 'unknown' };

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResult> {
  try {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();

    const existing = await prisma.user.findUnique({
      where: { email },
    });
    if (existing) {
      return { ok: false, error: 'exists' };
    }
    const passwordHash = await hash(input.password, 12);
    await prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        email,
        password: passwordHash,
      },
    });
    return { ok: true };
  } catch (error) {
    console.error('registerUser failed', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { ok: false, error: 'exists' };
    }

    return { ok: false, error: 'unknown' };
  }
}
