import type { ReactNode } from 'react';
import type { IconData } from '@gravity-ui/uikit';
import type { SubscriptionCategory } from '@/types/subscription';

export type SubscriptionCardProps = {
  subscriptionId: string;
  name: string;
  price: string;
  interval: string;
  nextPaymentDate: string;
  category: SubscriptionCategory | null;
  /** Индекс для цвета fallback-аватара, если нет лого бренда */
  brandIndex?: number;
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
};

export type SubscriptionCardDetailRow = {
  key: string;
  label: ReactNode;
  value: string;
};
