export interface NotificationState {
  id: string;
  is_read: boolean;
  notification_type: 'system' | 'message' | string;
  title?: string;
  message?: string;
  created_at?: string;
  [key: string]: any;
}

export interface Notification {
  readNotification: NotificationState[];
  unReadNotification: NotificationState[];
}
