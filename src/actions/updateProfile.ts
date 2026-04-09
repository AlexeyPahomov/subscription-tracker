'use server';

import { auth } from '@/auth';
import { prisma } from '@/utils/prisma';
import { hash } from 'bcryptjs';

export type UpdateProfileInput = {
  name: string;
  password: string;
};

export type UpdateProfileResult =
  | { ok: true; name: string }
  | { ok: false; error: 'unauthorized' | 'validation' | 'unknown' };

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<UpdateProfileResult> {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!session?.user?.id || Number.isNaN(userId)) {
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
