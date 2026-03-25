import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { NotificationState, Notification } from "../../types/notification";
// import { Notification, NotificationState } from "../../types/notification";

const initialState: Notification = {
  readNotification: [],
  unReadNotification: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setReadNotifications: (
      state,
      action: PayloadAction<NotificationState[]>
    ) => {
      state.readNotification = action.payload;
    },

    setUnreadNotifications: (
      state,
      action: PayloadAction<NotificationState[]>
    ) => {
      state.unReadNotification = action.payload;
    },
    addNotificationOnTop: (state, action: PayloadAction<NotificationState>) => {
      const newNotification = action.payload;
      const exists =
        state.unReadNotification.some((n) => n.id === newNotification.id) ||
        state.readNotification.some((n) => n.id === newNotification.id);

      if (!exists) {
        if (newNotification?.is_read) {
          state.readNotification.unshift({
            ...newNotification,
          });
        } else {
          state.unReadNotification.unshift({
            ...newNotification,
          });
        }
      }
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.unReadNotification.findIndex((n) => n.id === id);
      if (index !== -1) {
        const notification = {
          ...state.unReadNotification[index],
          is_read: true,
        };
        state.unReadNotification.splice(index, 1);
        state.readNotification.unshift(notification);
      }
    },

    markAsUnread: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.readNotification.findIndex((n) => n.id === id);

      if (index !== -1) {
        const notification = {
          ...state.readNotification[index],
          is_read: false,
        };
        state.readNotification.splice(index, 1);
        state.unReadNotification.unshift(notification);
      }
    },

    clearSystemNotifications: (state) => {
      state.readNotification = state.readNotification.filter(
        (n) => n.notification_type !== "system"
      );
      state.unReadNotification = state.unReadNotification.filter(
        (n) => n.notification_type !== "system"
      );
    },

    clearMessageNotifications: (state) => {
      state.readNotification = state.readNotification.filter(
        (n) => n.notification_type !== "message"
      );
      state.unReadNotification = state.unReadNotification.filter(
        (n) => n.notification_type !== "message"
      );
    },

    markAllSystemAsRead: (state) => {
      const toMove = state.unReadNotification.filter(
        (n) => n.notification_type === "system"
      );

      const updated = toMove.map((n) => ({ ...n, is_read: true }));

      state.unReadNotification = state.unReadNotification.filter(
        (n) => n.notification_type !== "system"
      );

      state.readNotification.unshift(...updated);
    },
  },
});

export const {
  setReadNotifications,
  setUnreadNotifications,
  markAsRead,
  addNotificationOnTop,
  markAsUnread,
  clearSystemNotifications,
  clearMessageNotifications,
  markAllSystemAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
