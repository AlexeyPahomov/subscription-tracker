'use server';

import { auth } from '@/auth';
import { prisma } from '@/utils/prisma';
import { hash } from 'bcryptjs';

type UpdateUserInput = {
  name: string;
  password: string;
};

type UpdateUserResult =
  | { ok: true; name: string }
  | { ok: false; error: 'unauthorized' | 'validation' | 'unknown' };

export async function updateUser(
  input: UpdateUserInput,
): Promise<UpdateUserResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, error: 'unauthorized' };
  }

  const name = input.name.trim();
  const password = input.password.trim();

  if (!name) {
    return { ok: false, error: 'validation' };
  }

  try {
    const data: { name: string; password?: string } = { name };

    if (password) {
      data.password = await hash(password, 12);
    }

    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return { ok: true, name };
  } catch {
    return { ok: false, error: 'unknown' };
  }
}
