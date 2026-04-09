'use server';

import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { prisma } from '@/utils/prisma';
import { Prisma } from '@/generated/prisma/client';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserResult =
  | { ok: true }
  | { ok: false; error: 'exists' | 'unknown' };

export async function createUser(
  input: CreateUserInput,
): Promise<CreateUserResult> {
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
    console.error('createUser failed', error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { ok: false, error: 'exists' };
    }

    return { ok: false, error: 'unknown' };
  }
}
