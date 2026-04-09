import type { IconData } from '@gravity-ui/uikit';
import type { ReactNode } from 'react';

export type SubscriptionCardProps = {
  name: string;
  price: string;
  interval: string;
  nextPaymentDate: string;
  onEdit: () => void;
  onDelete: () => void;
};

export type CardIconActionProps = {
  icon: IconData;
  label: string;
  onClick: () => void;
};

export type CardDetailProps = {
  label: ReactNode;
  value: ReactNode;
  icon?: IconData;
};

export type SubscriptionCardDetailRow = {
  key: string;
  label: ReactNode;
  value: string;
  icon?: IconData;
};
