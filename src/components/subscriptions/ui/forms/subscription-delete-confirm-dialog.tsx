'use client';

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
  return (
    <Dialog open={open} size="s" onClose={onCancel} hasCloseButton>
      <Dialog.Header caption="Delete subscription" />
      <Dialog.Body className="flex flex-col gap-4 pt-2">
        <p className="text-sm text-gray-300">
          {`Are you sure you want to delete “${subscriptionName}”?`}
          <br />
          This action cannot be undone.
        </p>
        {errorMessage ? (
          <p className="text-sm text-red-400" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="flex justify-end gap-3 pt-1">
          <Button
            view="outlined"
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            view="outlined-danger"
            type="button"
            loading={isDeleting}
            disabled={isDeleting}
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
