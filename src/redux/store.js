import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import alertReducer from "@/redux/alertSlice";
import userReducer from "@/redux/userSlice";
import contentReducer from "@/redux/contentSlice";
import messageReducer from "@/redux/messageSlice";
import notificationReducer from "@/redux/notificationSlice";
import uiSlice from "@/redux/uiSlice";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};


const storage =  typeof window !== "undefined"
? createWebStorage("local")
: createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedContentReducer = persistReducer(persistConfig, contentReducer);
const persistedMessageReducer = persistReducer(persistConfig, messageReducer);
const persistedNotificationReducer = persistReducer(
  persistConfig,
  notificationReducer
);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    content: persistedContentReducer,
    alert: alertReducer,
    ui: uiSlice,
    message: persistedMessageReducer,
    notification: persistedNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
