import { configureStore, type Reducer } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import permissionReducer from "../slices/permissionSlice";
import notificationReducer from "../slices/notificationSlice";
import previewReducer from "../slices/previewSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Define persist configurations for each slice using AsyncStorage for React Native
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
};
const permissionPersistConfig = {
  key: "permission",
  storage: AsyncStorage,
};

const previewPersistConfig = {
  key: "previewToken",
  storage: AsyncStorage,
};

const notificationPersistConfig = {
  key: "notification",
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer) as Reducer,
    permission: persistReducer(
      permissionPersistConfig,
      permissionReducer
    ) as Reducer,
    notification: persistReducer(
      notificationPersistConfig,
      notificationReducer
    ) as Reducer,
    previewToken: persistReducer(
      previewPersistConfig,
      previewReducer
    ) as Reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;