'use client';

import { updateProfile } from '@/actions/updateProfile';
import { useForm } from '@/hooks/useForm';
import { Button, PasswordInput, TextInput } from '@gravity-ui/uikit';
import { useSession } from 'next-auth/react';
import { useMemo, useState, type FormEvent } from 'react';

type ProfileFormProps = {
  initialName: string;
  email: string;
};

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const { update } = useSession();
  const { values, handleChange, setValues } = useForm({
    name: initialName,
    email,
    password: '',
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasChanges = useMemo(() => {
    return values.name.trim() !== initialName.trim() || values.password.trim() !== '';
  }, [initialName, values.name, values.password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanges || pending) return;

    setError(null);
    setSuccess(null);
    setPending(true);

    try {
      const result = await updateProfile({
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

      await update({ name: result.name });
      setValues({ name: result.name, email, password: '' });
      setSuccess('Профиль успешно обновлён');
    } finally {
      setPending(false);
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
        <p className="text-sm text-[var(--g-color-text-danger)]" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm text-[var(--g-color-text-positive)]" role="status">
          {success}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          view="action"
          type="submit"
          loading={pending}
          disabled={!hasChanges || pending}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
