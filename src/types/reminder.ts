export type DueSubscription = {
  name: string;
  price: number;
  currency: string;
  interval: string;
  nextBilling: Date;
};

export type Recipient = {
  userId: string;
  name: string | null;
  email: string;
  remindBefore: number;
  dueSubscriptions: DueSubscription[];
  subscriptionIds: string[];
};
