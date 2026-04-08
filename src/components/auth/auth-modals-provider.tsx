'use client';

import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

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
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextField name="email" type="text" isRequired>
                    <Label className="text-gray-800">Email</Label>
                    <Input placeholder="john@example.com" />
                  </TextField>
                  <TextField name="password" type="password" isRequired>
                    <Label className="text-gray-800">Password</Label>
                    <Input placeholder="Enter your password" />
                  </TextField>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-gray-800"
                      onPress={() => loginState.close()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Login</Button>
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
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <TextField name="name" type="text" isRequired>
                    <Label className="text-gray-800">Name</Label>
                    <Input placeholder="John Doe" />
                  </TextField>
                  <TextField name="email" type="email" isRequired>
                    <Label className="text-gray-800">Email</Label>
                    <Input placeholder="john@example.com" />
                  </TextField>
                  <TextField name="password" type="password" isRequired>
                    <Label className="text-gray-800">Password</Label>
                    <Input placeholder="Enter your password" />
                  </TextField>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-gray-800"
                      onPress={() => registerState.close()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Register</Button>
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
