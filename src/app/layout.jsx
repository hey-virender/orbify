"use client";
import { Provider } from "react-redux";
import "./globals.css";
import { store, persistor } from "@/redux/store";
import GlobalAlert from "./components/GlobalAlert";
import { PersistGate } from "redux-persist/integration/react";
import PusherProvider from "./Provider/PusherProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GlobalAlert />
            {children}
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
