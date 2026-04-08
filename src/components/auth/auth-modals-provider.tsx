'use client';

import { registerUser } from '@/actions/registerUser';
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { signIn } from 'next-auth/react';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type AuthModalsContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
  openRegister: () => void;
  closeRegister: () => void;
};

const AuthModalsContext = createContext<AuthModalsContextValue | null>(null);

function ModalHiddenTrigger({ label }: { label: string }) {
  return (
    <Button
      type="button"
      className="pointer-events-none absolute h-px w-px overflow-hidden p-0 opacity-0"
      aria-hidden
    >
      {label}
    </Button>
  );
}

export function AuthModalsProvider({ children }: { children: ReactNode }) {
  const loginState = useOverlayState({ defaultOpen: false });
  const registerState = useOverlayState({ defaultOpen: false });

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regPending, setRegPending] = useState(false);

  const value = useMemo(
    () => ({
      openLogin: loginState.open,
      closeLogin: loginState.close,
      openRegister: registerState.open,
      closeRegister: registerState.close,
    }),
    [
      loginState.open,
      loginState.close,
      registerState.open,
      registerState.close,
    ],
  );

  return (
    <AuthModalsContext.Provider value={value}>
      {children}
      <Modal state={loginState}>
        <ModalHiddenTrigger label="Вход" />
        <Modal.Backdrop>
          <Modal.Container placement="center" size="sm" scroll="inside">
            <Modal.Dialog className="bg-gray-100">
              <Modal.Header className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                <Modal.Heading className="text-xl font-semibold text-gray-800">
                  Авторизация
                </Modal.Heading>
                <Modal.CloseTrigger aria-label="Закрыть" />
              </Modal.Header>
              <Modal.Body className="pt-2">
                <Form
                  className="flex flex-col gap-6 px-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoginError(null);
                    setLoginPending(true);
                    try {
                      const res = await signIn('credentials', {
                        email: loginEmail,
                        password: loginPassword,
                        redirect: false,
                      });
                      if (res?.error) {
                        setLoginError('Неверный email или пароль');
                        return;
                      }
                      loginState.close();
                      setLoginEmail('');
                      setLoginPassword('');
                    } finally {
                      setLoginPending(false);
                    }
                  }}
                >
                  <TextField name="email" type="text" isRequired>
                    <Label className="text-gray-800">Email</Label>
                    <Input
                      placeholder="john@example.com"
                      value={loginEmail}
                      onChange={(ev) => setLoginEmail(ev.target.value)}
                    />
                  </TextField>
                  <TextField name="password" type="password" isRequired>
                    <Label className="text-gray-800">Password</Label>
                    <Input
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(ev) => setLoginPassword(ev.target.value)}
                    />
                  </TextField>
                  {loginError ? (
                    <p className="text-sm text-red-600" role="alert">
                      {loginError}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-gray-800"
                      onPress={() => loginState.close()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isDisabled={loginPending}>
                      {loginPending ? '…' : 'Login'}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal state={registerState}>
        <ModalHiddenTrigger label="Регистрация" />
        <Modal.Backdrop>
          <Modal.Container placement="center" size="sm" scroll="inside">
            <Modal.Dialog className="bg-gray-100">
              <Modal.Header className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                <Modal.Heading className="text-xl font-semibold text-gray-800">
                  Регистрация
                </Modal.Heading>
                <Modal.CloseTrigger aria-label="Закрыть" />
              </Modal.Header>
              <Modal.Body className="pt-2">
                <Form
                  className="flex flex-col gap-6 px-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setRegError(null);
                    setRegPending(true);
                    try {
                      const created = await registerUser({
                        name: regName,
                        email: regEmail,
                        password: regPassword,
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
                        email: regEmail,
                        password: regPassword,
                        redirect: false,
                      });
                      if (res?.error) {
                        setRegError('Аккаунт создан, но вход не удался');
                        return;
                      }
                      registerState.close();
                      setRegName('');
                      setRegEmail('');
                      setRegPassword('');
                    } finally {
                      setRegPending(false);
                    }
                  }}
                >
                  <TextField name="name" type="text" isRequired>
                    <Label className="text-gray-800">Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={regName}
                      onChange={(ev) => setRegName(ev.target.value)}
                    />
                  </TextField>
                  <TextField name="email" type="email" isRequired>
                    <Label className="text-gray-800">Email</Label>
                    <Input
                      placeholder="john@example.com"
                      value={regEmail}
                      onChange={(ev) => setRegEmail(ev.target.value)}
                    />
                  </TextField>
                  <TextField name="password" type="password" isRequired>
                    <Label className="text-gray-800">Password</Label>
                    <Input
                      placeholder="Enter your password"
                      value={regPassword}
                      onChange={(ev) => setRegPassword(ev.target.value)}
                    />
                  </TextField>
                  {regError ? (
                    <p className="text-sm text-red-600" role="alert">
                      {regError}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-gray-800"
                      onPress={() => registerState.close()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isDisabled={regPending}>
                      {regPending ? '…' : 'Register'}
                    </Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
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
