'use client';

import { createUser } from '@/actions/createUser';
import { useForm } from '@/hooks/useForm';
import { useModal } from '@/hooks/useModal';
import { Button, Dialog, PasswordInput, TextInput } from '@gravity-ui/uikit';
import { useNavigation } from '@/components/navigation/navigation-provider';
import { signIn } from 'next-auth/react';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
  type SubmitEvent,
} from 'react';

type AuthModalsContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
};

const AuthModalsContext = createContext<AuthModalsContextValue | null>(null);

export function AuthModalsProvider({ children }: { children: ReactNode }) {
  const { navigate } = useNavigation();
  const loginModal = useModal();
  const registerModal = useModal();

  const {
    values: loginValues,
    handleChange: handleLoginChange,
    setValues: setLoginValues,
  } = useForm({ email: '', password: '' });

  const {
    values: registerValues,
    handleChange: handleRegisterChange,
    setValues: setRegisterValues,
  } = useForm({ name: '', email: '', password: '' });

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  const [regError, setRegError] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  const value = useMemo(
    () => ({
      openLogin: loginModal.open,
      closeLogin: loginModal.close,
      openRegister: registerModal.open,
      closeRegister: registerModal.close,
    }),
    [
      loginModal.open,
      loginModal.close,
      registerModal.open,
      registerModal.close,
    ],
  );

  async function handleLoginSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    setLoginPending(true);
    try {
      const res = await signIn('credentials', {
        email: loginValues.email,
        password: loginValues.password,
        redirect: false,
      });
      if (res?.error) {
        setLoginError('Неверный email или пароль');
        return;
      }
      loginModal.close();
      setLoginValues({ email: '', password: '' });
      navigate('/dashboard');
    } finally {
      setLoginPending(false);
    }
  }

  async function handleRegisterSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegError(null);
    setRegPending(true);
    try {
      const created = await createUser({
        name: registerValues.name,
        email: registerValues.email,
        password: registerValues.password,
      });
      if (!created.ok) {
        if (created.error === 'exists') {
          setRegError('Пользователь с таким email уже есть');
        } else {
          setRegError('Не удалось зарегистрироваться');
        }
        return;
      }
      const res = await signIn('credentials', {
        email: registerValues.email,
        password: registerValues.password,
        redirect: false,
      });
      if (res?.error) {
        setRegError('Аккаунт создан, но вход не удался');
        return;
      }
      registerModal.close();
      setRegisterValues({ name: '', email: '', password: '' });
      navigate('/dashboard');
    } finally {
      setRegPending(false);
    }
  }

  return (
    <AuthModalsContext.Provider value={value}>
      {children}
      <Dialog
        open={loginModal.isOpen}
        size="s"
        onClose={loginModal.close}
        hasCloseButton
      >
        <Dialog.Header caption="Авторизация" />
        <Dialog.Body className="pt-2">
          <form className="flex flex-col gap-5" onSubmit={handleLoginSubmit}>
            <TextInput
              name="email"
              type="text"
              placeholder="john@example.com"
              value={loginValues.email}
              onChange={handleLoginChange}
              controlProps={{ required: true, autoComplete: 'email' }}
            />
            <PasswordInput
              name="password"
              placeholder="Enter your password"
              value={loginValues.password}
              onChange={handleLoginChange}
              controlProps={{
                required: true,
                autoComplete: 'current-password',
              }}
            />
            {loginError ? (
              <p className="text-sm text-(--g-color-text-danger)" role="alert">
                {loginError}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 pt-2">
              <Button view="outlined" type="button" onClick={loginModal.close}>
                Cancel
              </Button>
              <Button
                view="action"
                type="submit"
                loading={loginPending}
                disabled={loginPending}
              >
                Sign in
              </Button>
            </div>
          </form>
        </Dialog.Body>
      </Dialog>

      <Dialog
        open={registerModal.isOpen}
        size="s"
        onClose={registerModal.close}
        hasCloseButton
      >
        <Dialog.Header caption="Регистрация" />
        <Dialog.Body className="pt-2">
          <form className="flex flex-col gap-5" onSubmit={handleRegisterSubmit}>
            <TextInput
              name="name"
              type="text"
              placeholder="John Doe"
              value={registerValues.name}
              onChange={handleRegisterChange}
              controlProps={{ required: true, autoComplete: 'name' }}
            />
            <TextInput
              name="email"
              type="email"
              placeholder="john@example.com"
              value={registerValues.email}
              onChange={handleRegisterChange}
              controlProps={{ required: true, autoComplete: 'email' }}
            />
            <PasswordInput
              name="password"
              placeholder="Enter your password"
              value={registerValues.password}
              onChange={handleRegisterChange}
              controlProps={{ required: true, autoComplete: 'new-password' }}
            />
            {regError ? (
              <p className="text-sm text-(--g-color-text-danger)" role="alert">
                {regError}
              </p>
            ) : null}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                view="outlined"
                type="button"
                onClick={registerModal.close}
              >
                Cancel
              </Button>
              <Button
                view="action"
                type="submit"
                loading={regPending}
                disabled={regPending}
              >
                Register
              </Button>
            </div>
          </form>
        </Dialog.Body>
      </Dialog>
    </AuthModalsContext.Provider>
  );
}

export function useAuthModals() {
  const ctx = useContext(AuthModalsContext);
  if (!ctx) {
    throw new Error('useAuthModals must be used within AuthModalsProvider');
  }
  return ctx;
}
