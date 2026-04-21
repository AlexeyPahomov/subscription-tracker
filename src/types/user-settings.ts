export type UserSettings = {
  emailNotifications: boolean;
  remindBefore: number;
  timezone: string;
  currency: string;
};

export type UserSettingsQueryData = {
  settings: UserSettings;
};
