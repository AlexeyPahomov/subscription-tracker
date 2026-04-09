'use client';

import { Button, Dialog } from '@gravity-ui/uikit';

type SubscriptionDeleteConfirmDialogProps = {
  open: boolean;
  subscriptionName: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function SubscriptionDeleteConfirmDialog({
  open,
  subscriptionName,
  onCancel,
  onConfirm,
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
        <div className="flex justify-end gap-3 pt-1">
          <Button view="outlined" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button view="outlined-danger" type="button" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
