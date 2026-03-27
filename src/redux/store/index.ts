import { configureStore, type Reducer } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import permissionReducer from "../slices/permissionSlice";
import notificationReducer from "../slices/notificationSlice";
import previewReducer from "../slices/previewSlice";
import storageEngine from "../../utils/Storage";

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

// Define persist configurations for each slice using our new Custom Storage engine
const authPersistConfig = {
  key: "auth",
  storage: storageEngine,
};
const permissionPersistConfig = {
  key: "permission",
  storage: storageEngine,
};

const previewPersistConfig = {
  key: "previewToken",
  storage: storageEngine,
};

const notificationPersistConfig = {
  key: "notification",
  storage: storageEngine,
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