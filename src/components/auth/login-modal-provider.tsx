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

type LoginModalContextValue = {
  openLogin: () => void;
  closeLogin: () => void;
};

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const overlayState = useOverlayState({ defaultOpen: false });

  const value = useMemo(
    () => ({
      openLogin: overlayState.open,
      closeLogin: overlayState.close,
    }),
    [overlayState.open, overlayState.close],
  );

  return (
    <LoginModalContext.Provider value={value}>
      {children}
      <Modal state={overlayState}>
        <Button
          type="button"
          className="pointer-events-none absolute h-px w-px overflow-hidden p-0 opacity-0"
          aria-hidden
        >
          Вход
        </Button>
        <Modal.Backdrop>
          <Modal.Container placement="center" size="sm" scroll="inside">
            <Modal.Dialog className="bg-gray-100">
              <Modal.Header className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
                <Modal.Heading className="text-xl font-semibold  text-gray-800">
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
                  <Input placeholder="Логин" />
                  <Input placeholder="Пароль" />
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-gray-800"
                      onPress={() => overlayState.close()}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">Вход</Button>
                  </div>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error('useLoginModal must be used within LoginModalProvider');
  }
  return ctx;
}
