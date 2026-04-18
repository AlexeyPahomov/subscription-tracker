export type IntervalValue = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

export type SubscriptionCategory = {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
};

export type Subscription = {
  id: string;
  name: string;
  price: string;
  interval: IntervalValue;
  nextPaymentDate: string;
  category: SubscriptionCategory | null;
};

export type SubscriptionActionError =
  | 'unauthorized'
  | 'validation'
  | 'not_found'
  | 'unknown';

export type SubscriptionActionFail = {
  ok: false;
  error: SubscriptionActionError;
};

export type SubscriptionActionOk = {
  ok: true;
  subscription: Subscription;
};

export type SubscriptionWriteResult =
  | SubscriptionActionOk
  | SubscriptionActionFail;

export type CreateSubscriptionInput = {
  name: string;
  price: string;
  interval: string;
  nextPaymentDate: string;
  /** Пустая строка / null — без категории */
  categoryId?: string | null;
};
