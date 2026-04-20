'use client';

import { updateUser } from '@/actions/updateUser';
import { queryKeys } from '@/constants/query-keys';
import { useForm } from '@/hooks/useForm';
import type { MeQueryData } from '@/hooks/useMeQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, PasswordInput, TextInput } from '@gravity-ui/uikit';
import { useSession } from 'next-auth/react';
import { useMemo, useState, type FormEvent } from 'react';

type ProfileProps = {
  initialName: string;
  email: string;
};

export function Profile({ initialName, email }: ProfileProps) {
  const { update } = useSession();
  const queryClient = useQueryClient();
  const { values, handleChange, setValues } = useForm({
    name: initialName,
    email,
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const updateUserMutation = useMutation({
    mutationFn: updateUser,
  });

  const hasChanges = useMemo(() => {
    return (
      values.name.trim() !== initialName.trim() || values.password.trim() !== ''
    );
  }, [initialName, values.name, values.password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanges || updateUserMutation.isPending) return;

    setError(null);
    setSuccess(null);

    try {
      const result = await updateUserMutation.mutateAsync({
        name: values.name,
        password: values.password,
      });

      if (!result.ok) {
        if (result.error === 'validation') {
          setError('Имя не может быть пустым');
        } else if (result.error === 'unauthorized') {
          setError('Сессия истекла, войдите снова');
        } else {
          setError('Не удалось сохранить профиль');
        }
        return;
      }

      queryClient.setQueryData<MeQueryData>(queryKeys.me, (prev) =>
        prev
          ? {
              ...prev,
              user: { ...prev.user, name: result.name },
            }
          : prev,
      );
      await queryClient.invalidateQueries({ queryKey: queryKeys.me });
      await update({ name: result.name });
      setValues({ name: result.name, email, password: '' });
      setSuccess('Профиль успешно обновлён');
    } catch {
      setError('Не удалось сохранить профиль');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-2xl border border-gray-800 bg-black/30 p-6"
    >
      <h1 className="text-2xl font-semibold text-white">Профиль</h1>

      <TextInput
        name="name"
        type="text"
        label="Имя"
        value={values.name}
        onChange={handleChange}
        controlProps={{ required: true, autoComplete: 'name' }}
      />

      <TextInput
        name="email"
        type="email"
        label="Email"
        value={values.email}
        onChange={handleChange}
        disabled
        controlProps={{ readOnly: true, autoComplete: 'email' }}
      />

      <PasswordInput
        name="password"
        label="Новый пароль"
        placeholder="Оставьте пустым, если не меняете пароль"
        value={values.password}
        onChange={handleChange}
        controlProps={{ autoComplete: 'new-password' }}
      />

      {error ? (
        <p className="text-sm text-(--g-color-text-danger)" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-(--g-color-text-positive)" role="status">
          {success}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          view="action"
          type="submit"
          loading={updateUserMutation.isPending}
          disabled={!hasChanges || updateUserMutation.isPending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
