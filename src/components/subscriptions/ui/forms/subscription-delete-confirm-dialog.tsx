'use client';

import {
  responsiveDialogActionsClass,
  responsiveDialogBaseProps,
  responsiveDialogBodyClass,
} from '@/components/dialog/dialog-responsive';
import { useDialogScrollLock } from '@/hooks/useDialogScrollLock';
import { Button, Dialog } from '@gravity-ui/uikit';

type SubscriptionDeleteConfirmDialogProps = {
  open: boolean;
  subscriptionName: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
  errorMessage?: string | null;
};

export function SubscriptionDeleteConfirmDialog({
  open,
  subscriptionName,
  onCancel,
  onConfirm,
  isDeleting = false,
  errorMessage,
}: SubscriptionDeleteConfirmDialogProps) {
  useDialogScrollLock(open);

  return (
    <Dialog
      open={open}
      size="s"
      onClose={onCancel}
      hasCloseButton
      {...responsiveDialogBaseProps}
    >
      <Dialog.Header caption="Delete subscription" />
      <Dialog.Body className={`flex flex-col gap-4 ${responsiveDialogBodyClass}`}>
        <p className="text-sm text-neutral-700 dark:text-gray-300">
          {`Are you sure you want to delete “${subscriptionName}”?`}
          <br />
          This action cannot be undone.
        </p>
        {errorMessage ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className={responsiveDialogActionsClass}>
          <Button
            view="outlined"
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            view="outlined-danger"
            type="button"
            loading={isDeleting}
            disabled={isDeleting}
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
